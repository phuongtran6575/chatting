from uuid import UUID
from fastapi import APIRouter, HTTPException
from chatting.app.models.notification_schema import NotificationCreate
from services import notification_service
from databases.database import sessionDepends

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/")
async def create_notification(data: NotificationCreate, session: sessionDepends):
    notif = await notification_service.create_notification(session, data)
    return {"message": "Notification created", "data": notif}


@router.get("/")
async def get_list_notifications(user_id: UUID, session: sessionDepends):
    return await notification_service.get_list_notifications(session, user_id=user_id)

@router.get("/{notification_id}")
async def get_notification_by_id(notification_id: UUID, session: sessionDepends):
    notif = await notification_service.get_notification_by_id(session, notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.put("/{notification_id}/read")
async def mark_as_read(notification_id: UUID, session: sessionDepends):
    ok = await notification_service.mark_as_read(session, notification_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification marked as read"}

@router.get("/unread/count")
async def count_unread_notifications(user_id: UUID, session: sessionDepends):
    count = await notification_service.count_unread_notifications(session, user_id)
    return {"unread_count": count}

@router.put("/mark_all_read")
async def mark_all_as_read(user_id: UUID, session: sessionDepends): 
    count = await notification_service.mark_all_as_read(session, user_id)
    return {"message": f"Marked {count} notifications as read"}

@router.delete("/{notification_id}")
async def delete_notification(notification_id: UUID, session: sessionDepends):
    ok = await notification_service.delete_notification(session, notification_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}