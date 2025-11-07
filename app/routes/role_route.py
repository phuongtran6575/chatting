from uuid import UUID
from fastapi import APIRouter, HTTPException
from core.utils.to_uuid import to_uuid
from databases.database import sessionDepends
from services import role_service
from models.role_schema import SystemRoleCreate, SystemRoleRead, SystemRoleUpdate


router = APIRouter(prefix="/roles", tags=["Roles"])


@router.post("/", response_model=SystemRoleRead)
async def create_role(schema: SystemRoleCreate, session: sessionDepends):
    """Tạo mới một vai trò (Role)."""
    # Đã thay đổi: Gọi service của Role
    return await role_service.create_system_role(session, schema)


@router.get("/", response_model=dict)
async def get_roles(session: sessionDepends, page: int = 1, page_size: int = 10, ):
    """Lấy danh sách tất cả vai trò."""
    # Đã thay đổi: Gọi service của Role
    return await role_service.get_all_system_roles(session, page, page_size)


@router.get("/{id}", response_model=SystemRoleRead)
async def get_role_by_id(role_id: UUID, session: sessionDepends):
    """Lấy thông tin một vai trò theo ID."""
    try:
        # Đã thay đổi: Tên biến
        role_uuid = to_uuid(role_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
    
    # Đã thay đổi: Tên biến và gọi service của Role
    obj = await role_service.get_system_role_by_id(session, role_uuid)
    if not obj:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="Role not found")
    return obj


@router.put("/{id}", response_model=SystemRoleRead)
async def update_role(role_id: UUID, schema: SystemRoleUpdate, session: sessionDepends):
    """Cập nhật thông tin vai trò."""
    try:
        # Đã thay đổi: Tên biến
        role_uuid = to_uuid(role_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    # Đã thay đổi: Tên biến và gọi service của Role
    obj = await role_service.update_system_role(session, role_uuid, schema)
    if not obj:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="Role not found")
    return obj


@router.delete("/{id}")
async def delete_role(role_id: UUID, session: sessionDepends):
    """Xóa một vai trò theo ID."""
    try:
        # Đã thay đổi: Tên biến
        role_uuid = to_uuid(role_id) 
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")
        
    # Đã thay đổi: Tên biến và gọi service của Role
    success = await role_service.delete_system_role(session, role_uuid)
    if not success:
        # Đã thay đổi: Message lỗi
        raise HTTPException(status_code=404, detail="Role not found")
    return {"ok": True}