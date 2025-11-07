from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional

from models.messenger_model import ConversationType

class ConversationBase(BaseModel):
    creator_id : UUID
    type: ConversationType

class ConversationCreate(ConversationBase):
    pass

class GroupConversationCreate(BaseModel):
    creator_id: UUID
    member_ids: List[UUID]
    group_name: Optional[str] = None