import os
from dotenv import load_dotenv
import warnings

if not os.path.exists(".env"):
    warnings.warn(".env file is missing. Please make sure to create it at the root of the project directory.")

    
# Load .env file
load_dotenv()

class Config:
    # Flask configurations
    SECRET_KEY = os.getenv("SECRET_KEY")
    DATABASE_URL = os.getenv("DATABASE_URL")