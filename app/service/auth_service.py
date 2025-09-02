from datetime import datetime, timedelta, timezone
from typing import Annotated
from uuid import UUID
from fastapi import Depends
import jwt
from sqlmodel import Session
from models.chatting_model import User
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from schema.user_schema import UserCreate
from repository import user_repository
from core.constant import SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_schema = OAuth2PasswordBearer("/auth/token")


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def get_hashed_password(password: str):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def authentication_user(username: str, session:Session, password:str):
    user_db = await user_repository.get_user_by_username(username=username, session=session)
    if not user_db or not verify_password(plain_password=password,hashed_password= user_db.password_hash):
        return None
    return user_db

async def get_current_user(session: Session, token: str):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id = payload.get("sub")
    user = await user_repository.get_user_by_id(session=session, user_id=UUID(user_id))
    return user

async def registered(user: UserCreate, session: Session):
    hashed_password = get_hashed_password(user.password)
    user_create = User(
        username = user.username,
        email = user.email,
        password_hash = hashed_password,
        display_name = user.display_name
    )
    user_db = await user_repository.create_user(user_create, session)
    return user_db

