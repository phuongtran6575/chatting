from pydantic import BaseModel
from uuid import UUID
from typing import List

from models.messenger_model import ConversationType

class ConversationBase(BaseModel):
    creator_id : UUID
    type: ConversationType

class ConversationCreate(ConversationBase):
    pass