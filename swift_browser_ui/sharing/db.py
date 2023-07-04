"""Sharing backend database implementation."""


import logging
import os
import typing

import asyncpg

from swift_browser_ui.common.common_util import sleep_random

MODULE_LOGGER = logging.getLogger("db")
MODULE_LOGGER.setLevel(os.environ.get("LOG_LEVEL", "INFO"))


class DBConn:
    """Class for the account sharing database functionality."""

    def __init__(self) -> None:
        """Initialize connection variable."""
        self.pool: asyncpg.Pool | None = None
        self.log = MODULE_LOGGER

    def erase(self) -> None:
        """Immediately erase the connection."""
        if self.pool is not None:
            self.pool.terminate()
            self.pool = None

    async def open(self) -> None:
        """Initialize the database connection."""
        while self.pool is None:
            try:
                self.pool = await asyncpg.create_pool(
                    password=os.environ.get("SHARING_DB_PASSWORD", None),
                    user=os.environ.get("SHARING_DB_USER", "sharing"),
                    host=os.environ.get("SHARING_DB_HOST", "localhost"),
                    port=int(os.environ.get("SHARING_DB_PORT", 5432)),
                    ssl=os.environ.get("SHARING_DB_SSL", "prefer"),
                    database=os.environ.get("SHARING_DB_NAME", "swiftbrowserdb"),
                    min_size=int(os.environ.get("SHARING_DB_MIN_CONNECTIONS", 0)),
                    max_size=int(os.environ.get("SHARING_DB_MAX_CONNECTIONS", 2)),
                    timeout=int(os.environ.get("SHARING_DB_TIMEOUT", 120)),
                    command_timeout=int(
                        os.environ.get("SHARING_DB_COMMAND_TIMEOUT", 180)
                    ),
                    max_inactive_connection_lifetime=int(
                        os.environ.get("SHARING_DB_MAX_INACTIVE_CONN_LIFETIME", 10)
                    ),
                )
            except (ConnectionError, OSError):
                self.log.error(
                    "Failed to establish connection. "
                    "Pool will retry connection automatically.",
                )
                await sleep_random()
            except asyncpg.exceptions.InvalidPasswordError:
                self.log.error("Invalid username or password for database.")
                await sleep_random()
            except asyncpg.exceptions.CannotConnectNowError:
                self.log.error("Database is not ready yet.")
                await sleep_random()

    async def close(self) -> None:
        """Safely close the database connection."""
        if self.pool is not None:
            await self.pool.close()

    async def add_share(
        self,
        owner: str,
        container: str,
        userlist: typing.List[str],
        access: typing.List[str],
        address: str,
    ) -> bool:
        """Add a share action to the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    for key in userlist:
                        await conn.execute(
                            """
                            INSERT INTO Shares (
                                container,
                                container_owner,
                                recipient,
                                r_read,
                                r_write,
                                sharingdate,
                                address
                            ) VALUES (
                                $1, $2, $3, $4, $5, NOW(), $6
                            );
                            """,
                            container,
                            owner,
                            key,
                            "r" in access,
                            "w" in access,
                            address,
                        )
                return True
        return False

    async def edit_share(
        self,
        owner: str,
        container: str,
        userlist: typing.List[str],
        access: typing.List[str],
    ) -> bool:
        """Edit a share action in the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    for key in userlist:
                        await conn.execute(
                            """
                            UPDATE Shares
                            SET
                                r_read = $1,
                                r_write = $2
                            WHERE
                                container = $3 AND
                                container_owner = $4 AND
                                recipient = $5
                            ;
                            """,
                            "r" in access,
                            "w" in access,
                            container,
                            owner,
                            key,
                        )
                return True
        return False

    async def delete_share(
        self, owner: str, container: str, userlist: typing.List[str]
    ) -> bool:
        """Delete a share action from the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    for key in userlist:
                        await conn.execute(
                            """
                            DELETE FROM Shares
                            WHERE
                                container = $1 AND
                                container_owner = $2 AND
                                recipient = $3
                            ;
                            """,
                            container,
                            owner,
                            key,
                        )
                return True
        return False

    async def delete_container_shares(self, owner: str, container: str) -> bool:
        """Delete all shares for a container in the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    await conn.execute(
                        """
                        DELETE FROM Shares
                        WHERE
                            container = $1 AND
                            container_owner = $2
                        ;
                        """,
                        container,
                        owner,
                    )
                return True
        return False

    async def get_access_list(
        self, user: str
    ) -> typing.List[typing.Dict[str, typing.Any]]:
        """Get the containers shared to the specified user."""
        if self.pool is not None:
            query = await self.pool.fetch(
                """
                SELECT container, container_owner, sharingdate
                FROM Shares
                WHERE recipient = $1
                ;
                """,
                user,
            )

            return [
                {
                    "container": i["container"],
                    "owner": i["container_owner"],
                    "sharingdate": i["sharingdate"].isoformat(),
                }
                for i in query
            ]
        return []

    async def get_shared_list(self, user: str) -> typing.List[str]:
        """Get the containers that the user has shared."""
        if self.pool is not None:
            query = await self.pool.fetch(
                """
                SELECT DISTINCT
                    container
                FROM Shares
                WHERE container_owner = $1
                """,
                user,
            )

            return [i["container"] for i in query]
        return []

    async def get_access_container_details(
        self, user: str, owner: str, container: str
    ) -> typing.Dict[str, typing.Any]:
        """Get shared container details for share receiver."""
        if self.pool is not None:
            query = await self.pool.fetchrow(
                """
                SELECT
                    container,
                    container_owner,
                    recipient,
                    address,
                    r_read,
                    r_write,
                    sharingdate
                FROM Shares
                WHERE
                    container_owner = $1 AND
                    container = $2 AND
                    recipient = $3
                ;
                """,
                owner,
                container,
                user,
            )

            access = []

            if query["r_read"]:
                access.append("r")
            if query["r_write"]:
                access.append("w")

            return {
                "container": query["container"],
                "owner": query["container_owner"],
                "sharedTo": query["recipient"],
                "address": query["address"],
                "access": access,
                "sharingDate": query["sharingdate"].isoformat(),
            }
        return {}

    async def get_shared_container_details(
        self, owner: str, container: str
    ) -> typing.List[typing.Dict[str, typing.Any]]:
        """Get shared container details for sharer."""
        if self.pool is not None:
            query = await self.pool.fetch(
                """
                SELECT
                    container,
                    container_owner,
                    recipient,
                    address,
                    r_read,
                    r_write
                FROM Shares
                WHERE
                    container_owner = $1 AND
                    container = $2
                ;
                """,
                owner,
                container,
            )

            ret = []
            for i in query:
                access = []
                if i["r_read"]:
                    access.append("r")
                if i["r_write"]:
                    access.append("w")

                ret.append(
                    {
                        "container": i["container"],
                        "owner": i["container_owner"],
                        "sharedTo": i["recipient"],
                        "address": i["address"],
                        "access": access,
                    }
                )
            return ret
        return []

    async def get_tokens(
        self, token_owner: str
    ) -> typing.List[typing.Dict[str, typing.Any]]:
        """Get tokens created for a project."""
        if self.pool is not None:
            query = await self.pool.fetch(
                """SELECT *
                FROM Tokens
                WHERE token_owner = $1
                ;
                """,
                token_owner,
            )
            return list(query)
        return []

    async def revoke_token(self, token_owner: str, token_identifier: str) -> None:
        """Remove a token from the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    await conn.execute(
                        """
                        DELETE FROM Tokens
                        WHERE
                            token_owner = $1 AND
                            identifier = $2
                        ;
                        """,
                        token_owner,
                        token_identifier,
                    )

    async def add_token(self, token_owner: str, token: str, identifier: str) -> None:
        """Add a token to the database."""
        if self.pool is not None:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    await conn.execute(
                        """
                        INSERT INTO Tokens(
                            token_owner,
                            token,
                            identifier
                        ) VALUES (
                            $1, $2, $3
                        )
                        ;
                        """,
                        token_owner,
                        token,
                        identifier,
                    )

    async def add_id(self, id: str, name: str) -> None:
        """Cache identifier information into database."""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                await conn.execute(
                    """
                    INSERT INTO ProjectIDs(
                        name,
                        id
                    ) VALUES (
                        $1, $2
                    )
                    ;
                    """,
                    name,
                    id,
                )

    async def match_id_name(self, id: str) -> list:
        """Match an id to the correct name."""
        query = await self.pool.fetch(
            """
            SELECT *
            FROM ProjectIDs
            WHERE id = $1
            ;
            """,
            id,
        )
        return list(query)

    async def match_name_id(self, name: str) -> list:
        """Match a name to the correct id."""
        query = await self.pool.fetch(
            """
            SELECT *
            FROM ProjectIDs
            WHERE name = $1
            ;
            """,
            name,
        )
        return list(query)
