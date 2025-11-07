from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, HTTPException, status
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from core.helpers import auth_helper
from core.utils.to_uuid import to_uuid
from core.helpers.auth_helper import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from models.user_schema import UserCreate
from services import auth_service, role_service
from databases.database import sessionDepends


router = APIRouter(prefix="/auth", tags=["auth"])
token = auth_helper.oauth2_scheme

@router.get("/read_me")
async def read_me( token: Annotated[str, Depends(token)],session: sessionDepends):
    current_user = await auth_service.read_me(token, session)
    if not current_user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return current_user

@router.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: sessionDepends):
    user = await auth_service.authentication_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    role = await role_service.get_system_role_by_id(session, user.id)
    access_token = await create_access_token(
        data={"sub": str(user.id), "roles": role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
    

@router.post("/register")
async def registered(schema: UserCreate, session: sessionDepends):
    return await auth_service.registered(session,  schema)