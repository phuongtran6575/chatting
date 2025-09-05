from typing import List, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlmodel import Field, Relationship, SQLModel
from service import message_service
router = APIRouter(prefix="/message", tags=["Message"])


class TestUser(SQLModel):
    id: int
    name: str
    messages: List["Message"] = Relationship(back_populates="user")

class Message(SQLModel):
    id: int
    text: str
    user_id: int = Field(foreign_key="testuser.id")
    user: Optional[TestUser] = Relationship(back_populates="messages")

listTestUser = [
    TestUser(id = 1, name="Phuong"),
    TestUser(id = 2, name="Hong"),
    TestUser(id = 3, name="Nga"),
    TestUser(id = 4, name="Bao"),
    TestUser(id = 5, name="Ha"),
    TestUser(id = 6, name="Phat"),
]  


@router.websocket("/ws")
async def message_endpoint(websocket: WebSocket):
    await message_service.connect(websocket=websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await message_service.broadcast(f"{data}")
    except WebSocketDisconnect:
        message_service.disconnect(websocket=websocket)