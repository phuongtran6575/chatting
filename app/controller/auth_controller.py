from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from database.sqlite_database import sessionDepends
from schema.user_schema import UserCreate
from service import auth_service
from fastapi.security import  OAuth2PasswordRequestForm
from core.constant import ACCESS_TOKEN_EXPIRE_MINUTES
from models.chatting_model import User

router = APIRouter(prefix="/auth", tags=["Auth"])
token = auth_service.oauth2_schema


@router.get("/read_me")
async def read_me(token: Annotated[str, Depends(token)], session: sessionDepends ):
    user = auth_service.get_current_user(session=session, token=token)
    if user is None:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

@router.post("/token")
async def login(session: sessionDepends, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = await auth_service.authentication_user(username=form_data.username, session=session, password=form_data.password)
    if user is None:
        return HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer" }

@router.post("/register")
async def register(user: UserCreate, session: sessionDepends):
    user_db = await auth_service.registered(user, session)
    return {"id": user_db.id, "username": user_db.username, "email": user_db.email}
