from uuid import UUID
from datetime import datetime
from typing import List, Optional

from sqlmodel import col, select
from sqlalchemy.ext.asyncio import AsyncSession
from models.notification_schema import NotificationCreate
from models.messenger_model import Notification


# 🟩 Tạo một notification mới
async def create_notification(session: AsyncSession, data: NotificationCreate) -> Notification:
    notification = Notification(
        user_id=data.user_id,
        type=data.type,
        title=data.title,
        body=data.body,
        payload=data.payload,
    )
    session.add(notification)
    await session.commit()
    await session.refresh(notification)
    return notification


# 🟩 Lấy danh sách notification (có thể filter)
async def get_list_notifications(
    session: AsyncSession,
    user_id: Optional[UUID] = None,
    is_read: Optional[bool] = None,
    limit: int = 20,
    offset: int = 0
) -> List[Notification]:
    query = select(Notification)
    if user_id:
        query = query.where(Notification.user_id == user_id)
    if is_read is not None:
        query = query.where(Notification.is_read == is_read)

    query = query.order_by(col(Notification.created_at).desc()).limit(limit).offset(offset)
    result = await session.execute(query)
    return list(result.scalars().all())


# 🟩 Lấy chi tiết 1 notification
async def get_notification_by_id(session: AsyncSession, notification_id: UUID) -> Optional[Notification]:
    return await session.get(Notification, notification_id)


# 🟩 Đánh dấu 1 notification là đã đọc
async def mark_as_read(session: AsyncSession, notification_id: UUID) -> bool:
    notification = await session.get(Notification, notification_id)
    if not notification:
        return False
    notification.is_read = True
    session.add(notification)
    await session.commit()
    return True


# 🟩 Đánh dấu tất cả thông báo của user là đã đọc
async def mark_all_as_read(session: AsyncSession, user_id: UUID) -> int:
    query = select(Notification).where(
        Notification.user_id == user_id, Notification.is_read == False
    )
    result = await session.execute(query)
    unread = result.scalars().all()

    for n in unread:
        n.is_read = True
        session.add(n)
    await session.commit()
    return len(unread)


# 🟩 Đếm số thông báo chưa đọc
async def count_unread_notifications(session: AsyncSession, user_id: UUID) -> int:
    query = select(Notification).where(
        Notification.user_id == user_id, Notification.is_read == False
    )
    result = await session.execute(query)
    return len(result.scalars().all())


# 🟩 Xóa 1 thông báo
async def delete_notification(session: AsyncSession, notification_id: UUID) -> bool:
    notification = await session.get(Notification, notification_id)
    if not notification:
        return False
    await session.delete(notification)
    await session.commit()
    return True


# 🟩 Xóa toàn bộ thông báo của user
async def clear_notifications(session: AsyncSession, user_id: UUID) -> int:
    query = select(Notification).where(Notification.user_id == user_id)
    result = await session.execute(query)
    notifications = result.scalars().all()

    count = len(notifications)
    for n in notifications:
        await session.delete(n)
    await session.commit()
    return count
