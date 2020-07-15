"""Health check endpoint."""


import typing
import time

import aiohttp.web

from .settings import setd
from .signature import sign


async def handle_health_check(
        request: aiohttp.web.Request
) -> aiohttp.web.Response:
    """Handle a service health check."""
    # Pull all health endpoint information
    web_client = request.app["api_client"]

    status: typing.Dict[str, typing.Union[
        str, typing.Dict
    ]] = {
        "status": "Ok",
    }

    services = {}
    performance = {}

    signature = await sign(60, "/health")
    api_params = {
        "signature": signature["signature"],
        "valid": signature["valid_until"]
    }
    # Poll swift-x-account-sharing API
    if setd["sharing_internal_endpoint"]:
        start = time.time()
        async with web_client.get(
                str(setd["sharing_internal_endpoint"]) + "/health",
                params=api_params
        ) as resp:
            request.app["Log"].debug(resp)
            if resp.status != 200:
                services["swift-x-account-sharing"] = {
                    "status": "Down",
                }
            else:
                sharing_status = await resp.json()
                services["swift-x-account-sharing"] = sharing_status
        performance["swift-x-account-sharing"] = {
            "time": time.time() - start
        }
    else:
        services["swift-x-account-sharing"] = {
            "status": "Nonexistent"
        }

    # Poll swift-sharing-request API
    if setd["request_internal_endpoint"]:
        start = time.time()
        async with web_client.get(
                str(setd["request_internal_endpoint"]) + "/health",
                params=api_params
        ) as resp:
            request.app["Log"].debug(resp)
            if resp.status != 200:
                services["swift-sharing-request"] = {
                    "status": "Down",
                }
            else:
                request_status = await resp.json()
                services["swift-sharing-request"] = request_status
        performance["swift-sharing-request"] = {
            "time": time.time() - start
        }
    else:
        services["swift-sharing-request"] = {
            "status": "Nonexistent"
        }

    # Poll swiftui-upload-runner API
    if setd["upload_internal_endpoint"]:
        start = time.time()
        async with web_client.get(
                str(setd["upload_internal_endpoint"]) + "/health",
                params=api_params
        ) as resp:
            request.app["Log"].debug(resp)
            if resp.status != 200:
                services["swiftui-upload-runner"] = {
                    "status": "Down",
                }
            else:
                upload_status = await resp.json()
                services["swiftui-upload-runner"] = upload_status
        performance["swiftui-upload-runner"] = {
            "time": time.time() - start
        }
    else:
        services["swiftui-upload-runner"] = {
            "status": "Nonexistent"
        }

    status["services"] = services
    status["performance"] = performance

    for service in services.values():
        if service["status"] == "Down":
            status["status"] = "Partially down"
            break
        if service["status"] == "Degraded":
            status["status"] = "Degraded"

    for perf in performance.values():
        if perf["time"] > 1000 and not status["status"] == "Down":
            status["status"] = "Degraded (high load)"

    return aiohttp.web.json_response(status)