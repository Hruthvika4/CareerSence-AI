
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# Use Environment Variable for MongoDB Connection String
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017/career_sense")
DATABASE_NAME = "career_sense"

class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect_db(cls):
        # Increased timeout for cloud connections
        cls.client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
        cls.db = cls.client[DATABASE_NAME]
        print("Connected to MongoDB")

    @classmethod
    async def close_db(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")

    @classmethod
    def get_collection(cls, name: str):
        return cls.db[name]

db = Database
