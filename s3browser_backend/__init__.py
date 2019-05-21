from .server import servinit, run_server_secure
import s3browser_backend.api
import s3browser_backend.login
import s3browser_backend.front

"""
Web application for browsing s3 compliant object storage, with openstack-\
keystone federated authentication integrated. Frontend with static files.
"""

__name__ = 's3browser_backend'
__version__ = VERSION = '0.0.1rc1'
__author__ = 'Sampsa Penna'
__license__ = 'MIT License'
