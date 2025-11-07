from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime


class SystemRoleBase(BaseModel):
    name: str
    description: Optional[str] = None


class SystemRoleCreate(SystemRoleBase):
    pass

class SystemRoleUpdate(SystemRoleBase):
    pass

class SystemRoleRead(SystemRoleBase):
    id: UUID
    created_at: datetime

    model_config = {
    "from_attributes": True
}


class ConversationRoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    permissions: Optional[str] = None


class ConversationRoleRead(ConversationRoleBase):
    id: UUID
    created_at: datetime

    model_config = {
    "from_attributes": True
}


class PermissionRead(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None

    model_config = {
    "from_attributes": True
}


class RolePermissionRead(BaseModel):
    id: UUID
    role_id: UUID
    permission_id: UUID

    model_config = {
    "from_attributes": True
}
