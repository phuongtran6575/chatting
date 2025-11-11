from uuid import UUID
from databases.database import sessionDepends
from fastapi import APIRouter, Depends
from databases.database import sessionDepends
from services import friendship_service

router = APIRouter(prefix="/friends", tags=["Friendship"])

@router.post("/send/{user_id}")
async def send_request(user_id: UUID, current_user_id: UUID, session: sessionDepends):
    return await friendship_service.send_friend_request(session, current_user_id, user_id)

@router.post("/accept/{requester_id}")
async def accept_request(requester_id: UUID, current_user_id: UUID, session: sessionDepends):
    return await friendship_service.accept_friend_request(session, requester_id, current_user_id)

@router.post("/reject/{requester_id}")
async def reject_request(requester_id: UUID, current_user_id: UUID, session: sessionDepends):
    return await friendship_service.reject_friend_request(session, requester_id, current_user_id)

@router.delete("/remove/{friend_id}")
async def remove_friend(friend_id: UUID, current_user_id: UUID, session:sessionDepends):
    return await friendship_service.remove_friend(session, current_user_id, friend_id)

@router.get("/list")
async def list_friends(current_user_id: UUID, session: sessionDepends, page: int = 1, page_size: int = 10):
    return await friendship_service.list_friends(session, current_user_id, page,page_size)

@router.get("/status/{other_id}")
async def get_status(other_id: UUID, current_user_id: UUID, session: sessionDepends):
    return await friendship_service.get_friendship_status(session, current_user_id, other_id)