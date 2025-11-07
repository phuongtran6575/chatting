from pydantic import BaseModel, EmailStr, ValidationInfo, field_validator
from uuid import UUID
from typing import Optional, List
from datetime import datetime
from models.messenger_model import UserStatus


class UserBase(BaseModel):
    full_name: str
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    status: Optional[UserStatus] = UserStatus.offline


class UserCreate(UserBase):
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo):
        password = info.data.get("password")
        if password and v != password:
            raise ValueError("Passwords do not match")
        return v


class UserRead(UserBase):
    id: UUID
    system_role_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
    "from_attributes": True
}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None
    status: Optional[UserStatus] = None


class UserDeviceTokenBase(BaseModel):
    device_id: Optional[str] = None
    platform: Optional[str] = None
    push_token: Optional[str] = None


class UserDeviceTokenRead(UserDeviceTokenBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    last_seen_at: datetime

    model_config = {
    "from_attributes": True
}


class UserSocialAccountRead(BaseModel):
    id: UUID
    provider: str
    provider_account_id: str

    model_config = {
    "from_attributes": True
}
