from uuid import UUID
from fastapi import APIRouter, HTTPException
from core.utils.to_uuid import to_uuid
from databases.database import sessionDepends
from services import user_service
from services import auth_service
from models.user_schema import UserCreate, UserRead, UserUpdate


# Đã thay đổi: Prefix và Tags
router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserRead)
async def create_user(schema: UserCreate, session: sessionDepends):
    """Tạo mới một người dùng (User)."""
    # Đã thay đổi: Gọi service của User
    return await auth_service.registered(session, schema)

@router.get("/search")
async def search_users(session: sessionDepends,q: str,current_user_id: UUID, page: int = 1, page_size: int = 10,):
    users = await user_service.search_users(session, q, current_user_id, page, page_size)
    return users

@router.get("/", response_model=dict)
async def get_users(session: sessionDepends, page: int = 1, page_size: int = 10, ):
    """Lấy danh sách tất cả người dùng."""
    # Đã thay đổi: Gọi service của User
    return await user_service.get_all_users(session, page, page_size)


@router.get("/{id}", response_model=UserRead)
async def get_user_by_id(user_id: UUID, session: sessionDepends):
    """Lấy thông tin một người dùng theo ID."""
    try:
        # Đã thay đổi: Tên biến
        user_uuid = to_uuid(user_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    
    # Đã thay đổi: Tên biến và gọi service của User
    obj = await user_service.get_user_by_id(session, user_uuid)
    if not obj:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="User not found")
    return obj


@router.put("/{id}", response_model=UserRead)
async def update_user(user_id: UUID, schema: UserUpdate, session: sessionDepends):
    """Cập nhật thông tin người dùng."""
    try:
        # Đã thay đổi: Tên biến
        user_uuid = to_uuid(user_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    # Đã thay đổi: Tên biến và gọi service của User
    obj = await user_service.update_user(session, user_uuid, schema)
    if not obj:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="User not found")
    return obj


@router.delete("/{id}")
async def delete_user(user_id: UUID, session: sessionDepends):
    """Xóa một người dùng theo ID."""
    try:
        # Đã thay đổi: Tên biến
        user_uuid = to_uuid(user_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    # Đã thay đổi: Tên biến và gọi service của User
    success = await user_service.delete_user(session, user_uuid)
    if not success:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="User not found")
    return {"ok": True}