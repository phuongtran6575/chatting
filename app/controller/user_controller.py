from uuid import UUID
from fastapi import APIRouter, HTTPException
from database.sqlite_database import sessionDepends
from service import user_service
from core.helper import to_uuid

router = APIRouter(prefix="/user", tags=["User"])


@router.delete("/delete_user/{user_id}")
async def delete_user(user_id: str | UUID, session: sessionDepends):
    try:
        user_uuid = to_uuid(user_id)  # ✅ chấp nhận cả str và UUID
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    user = await user_service.delete_user(user_id=user_uuid, session=session)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully", "user_id": str(user_uuid)}