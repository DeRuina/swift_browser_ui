"""Common resources for swift-upload-runner."""


import typing
import logging
import os

import aiohttp.web

import swift_browser_ui.upload.cryptupload as cryptupload
from swift_browser_ui.upload import upload


LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(os.environ.get("LOG_LEVEL", "INFO"))


DATA_PREFIX = "data/"
SEGMENTS_PREFIX = ".segments/"


def generate_download_url(
    host: str,
    container: typing.Union[str, None] = None,
    object_name: typing.Union[str, None] = None,
) -> str:
    """Generate the download URL to use."""
    if not container and not object_name:
        return host
    elif not object_name:
        return f"{host}/{container}"
    # The object_name based URL works fine with prefixes as well
    return f"{host}/{container}/{object_name}"


def get_download_host(endpoint, project: str) -> str:
    """Get the actual download host with shared container support."""
    ret = endpoint
    if project not in ret:
        ret = ret.replace(ret.split("/")[-1], f"AUTH_{project}")
    return ret


def get_session_id(request: aiohttp.web.Request) -> str:
    """Return the session id from request."""
    try:
        return request.cookies["RUNNER_SESSION_ID"]
    except KeyError:
        try:
            return request.query["session"]
        except KeyError:
            raise aiohttp.web.HTTPUnauthorized(reason="Missing runner session ID")


async def parse_multipart_in(
    request: aiohttp.web.Request,
) -> typing.Tuple[typing.Dict[str, typing.Any], aiohttp.MultipartReader]:
    """Parse the form headers into a dictionary and chunk data as reader."""
    reader = await request.multipart()

    ret_d = {}

    while True:
        field = await reader.next()
        if field.name == "file":  # type: ignore
            ret_d["filename"] = field.filename  # type: ignore
            return ret_d, field  # type: ignore
        if field.name == "resumableChunkNumber":  # type: ignore
            ret_d["resumableChunkNumber"] = int(await field.text())  # type: ignore
        else:
            ret_d[
                str(field.name)  # type: ignore
            ] = await field.text()  # type: ignore


async def get_upload_instance(
    request: aiohttp.web.Request,
    pro: str,
    cont: str,
    p_query: typing.Optional[dict] = None,
) -> upload.ResumableFileUploadProxy:
    """Return the specific upload proxy for the resumable upload."""
    session = get_session_id(request)

    if p_query:
        query: dict = p_query
    else:
        query = request.query  # type: ignore

    # Check the existence of the dictionary structure
    try:
        request.app[session]["uploads"][pro]
    except KeyError:
        request.app[session]["uploads"][pro] = {}

    try:
        request.app[session]["uploads"][pro][cont]
    except KeyError:
        request.app[session]["uploads"][pro][cont] = {}

    try:
        ident = query["resumableIdentifier"]
    except KeyError:
        raise aiohttp.web.HTTPBadRequest(reason="Malformed query string")
    try:
        upload_session = request.app[session]["uploads"][pro][cont][ident]
    except KeyError:
        upload_session = upload.ResumableFileUploadProxy(
            request.app[session], query, request.match_info, request.app["client"]
        )
        await upload_session.a_check_container()
        request.app[session]["uploads"][pro][cont][ident] = upload_session

    return upload_session


async def get_encrypted_upload_instance(
    request: aiohttp.web.Request,
) -> cryptupload.EncryptedUploadProxy:
    """Return the specific encrypted upload proxy for the object."""
    session = get_session_id(request)

    project = request.match_info["project"]
    container = request.match_info["container"]
    object_name = request.match_info["object_name"]

    try:
        upload_session = request.app[session]["enuploads"][project][container][object_name]
        LOGGER.info("Returning an existing upload session.")
    except KeyError:
        LOGGER.info("Creating a new upload session.")
        # Check the existence of the dictionary structure
        if project not in request.app[session]["enuploads"]:
            request.app[session]["enuploads"][project] = {}
        if container not in request.app[session]["enuploads"][project]:
            request.app[session]["enuploads"][project][container] = {}
        if object_name not in request.app[session]["enuploads"][project][container]:
            upload_session = cryptupload.EncryptedUploadProxy(
                request.app[session],
                request.app["client"],
            )
            request.app[session]["enuploads"][project][container][object_name] = upload_session
    LOGGER.info(f"Session object id: {id(upload_session)}")
    return upload_session


def get_path_from_list(to_parse: typing.List[str], path_prefix: str) -> str:
    """Parse a path from a list of path parts."""
    ret = path_prefix

    for i in to_parse:
        ret += f"/{i}"

    return ret.lstrip("/").rstrip("/")
