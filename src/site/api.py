# -*- coding: utf-8 -*-


import aiohttp.web
import boto3
import datetime


# Hardcoded s3 access keys for testing purposes, will be redundant when
# authentication is implemented (hopefully at least)
***REMOVED******REMOVED***AWS_ENDPOINT_URL = "http://127.0.0.1:9000"


API_ENDPOINT = '/api'


async def listBuckets(request):
    """
    The internal API call for fetching a list of buckets available for user
    """
    # TODO: Perhaps think up a way to keep the s3 sessions persistent?
    s3 = boto3.client(
        's3',
***REMOVED******REMOVED******REMOVED***    )
    ret = s3.list_buckets()['Buckets']
    for i in ret:
        i['CreationDate'] = i['CreationDate'].ctime()

    return aiohttp.web.json_response(
        ret
    )


async def listObjects(request):
    """
    The internal API call for fetching a list of available objects inside
    a specified bucket
    """
    s3 = boto3.client(
        's3',
***REMOVED******REMOVED******REMOVED***    )
    ret = s3.list_objects(
        Bucket=request.query['bucket']
    )['Contents']
    for i in ret:
        i['LastModified'] = i['LastModified'].ctime()

    return aiohttp.web.json_response(
        ret
    )


async def downloadObject(request):
    """
    The internal API call for mapping an object to a websocket, to make enable
    object streaming.
    """
    s3 = boto3.client(
        's3',
***REMOVED******REMOVED******REMOVED***    )

    retws = aiohttp.web.WebSocketResponse()

    return retws


localroutes = [
    aiohttp.web.get(API_ENDPOINT + '/buckets', listBuckets),
    aiohttp.web.get(API_ENDPOINT + '/objects', listObjects)
]
