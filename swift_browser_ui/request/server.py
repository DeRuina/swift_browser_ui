"""Share request backend module."""

import asyncio
import logging
import sys
import typing

import aiohttp.web
import uvloop

import swift_browser_ui.common.common_handlers
import swift_browser_ui.common.common_middleware
import swift_browser_ui.common.common_util
import swift_browser_ui.common.db
from swift_browser_ui.request.api import (
    handle_container_request_listing,
    handle_health_check,
    handle_share_request_post,
    handle_user_add_token,
    handle_user_delete_token,
    handle_user_list_tokens,
    handle_user_made_request_listing,
    handle_user_owned_request_listing,
    handle_user_share_request_delete,
)

logging.basicConfig(level=logging.DEBUG)

# temporarily ignore typecheck from mypy until
# this issue is fixed https://github.com/MagicStack/uvloop/issues/575
asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())  # type: ignore


async def init_server() -> aiohttp.web.Application:
    """Initialize the sharing request server."""
    app = aiohttp.web.Application(
        middlewares=[
            swift_browser_ui.common.common_middleware.add_cors,  # type: ignore
            swift_browser_ui.common.common_middleware.check_db_conn,  # type: ignore
            swift_browser_ui.common.common_middleware.handle_validate_authentication,  # type: ignore
            swift_browser_ui.common.common_middleware.catch_uniqueness_error,  # type: ignore
            swift_browser_ui.common.common_middleware.error_handler,  # type: ignore
        ]
    )

    # Cache db class
    app["db_class"] = swift_browser_ui.common.db.RequestDBConn

    async def on_prepare(
        _: aiohttp.web.Request, response: aiohttp.web.StreamResponse
    ) -> None:
        """Modify Server headers."""
        response.headers["Server"] = "Swift Browser Request"

    # add custom response headers
    app.on_response_prepare.append(on_prepare)

    app.add_routes(
        [
            aiohttp.web.get("/health", handle_health_check),
        ]
    )

    app.add_routes(
        [
            aiohttp.web.options(
                "/request/user/{user}/{container}",
                swift_browser_ui.common.common_handlers.handle_delete_preflight,
            ),
            aiohttp.web.post(
                "/request/user/{user}/{container}", handle_share_request_post
            ),
            aiohttp.web.delete(
                "/request/user/{user}/{container}", handle_user_share_request_delete
            ),
            aiohttp.web.get("/request/user/{user}", handle_user_made_request_listing),
            aiohttp.web.get("/request/owner/{user}", handle_user_owned_request_listing),
            aiohttp.web.get(
                "/request/container/{container}", handle_container_request_listing
            ),
        ]
    )

    app.add_routes(
        [
            aiohttp.web.options(
                "/token/{project}/{id}",
                swift_browser_ui.common.common_handlers.handle_delete_preflight,
            ),
            aiohttp.web.post("/token/{project}/{id}", handle_user_add_token),
            aiohttp.web.delete("/token/{project}/{id}", handle_user_delete_token),
            aiohttp.web.get("/token/{project}", handle_user_list_tokens),
        ]
    )

    app.on_startup.append(swift_browser_ui.common.db.db_graceful_start)
    app.on_startup.append(swift_browser_ui.common.common_util.read_in_keys)
    app.on_shutdown.append(swift_browser_ui.common.db.db_graceful_close)

    return app


def run_server_devel(
    app: typing.Coroutine[typing.Any, typing.Any, aiohttp.web.Application]
) -> None:
    """Run the server in development mode (without HTTPS)."""
    aiohttp.web.run_app(app, access_log=logging.getLogger("aiohttp.access"), port=9091)


def main() -> None:
    """Run the server with the default run function."""
    if sys.version_info < (3, 12):
        logging.error("swift-sharing-request requires >= python3.12")
        sys.exit(1)
    run_server_devel(init_server())


if __name__ == "__main__":
    run_server_devel(init_server())
