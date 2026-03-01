from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.services.account import Account
from appwrite.services.users import Users
from config import settings

client = Client()
client.set_endpoint(settings.APPWRITE_ENDPOINT)
client.set_project(settings.APPWRITE_PROJECT_ID)
client.set_key(settings.APPWRITE_API_KEY)

databases = Databases(client)
storage = Storage(client)
account = Account(client)
users = Users(client)

def get_appwrite_client():
    return client

def get_databases():
    return databases

def get_storage():
    return storage

def get_users():
    return users
