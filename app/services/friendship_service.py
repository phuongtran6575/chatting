from sqlalchemy import func
from sqlmodel import  col, select
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from models.messenger_model import Friendship, FriendshipStatus, User


async def send_friend_request(session: AsyncSession, requester_id: UUID, addressee_id: UUID):
    if requester_id == addressee_id:
        raise ValueError("Không thể kết bạn với chính mình")
    #raise HTTPException(status_code=400, detail="Không thể kết bạn với chính mình")

    stmt = select(Friendship).where(
        ((Friendship.requester_id == requester_id) & (Friendship.addressee_id == addressee_id)) |
        ((Friendship.requester_id == addressee_id) & (Friendship.addressee_id == requester_id))
    )
    result = await session.execute(stmt)
    existing = result.scalars().first()

    if existing:
        if existing.status == FriendshipStatus.pending:
            raise ValueError("Đã gửi lời mời kết bạn rồi")
            #raise HTTPException(status_code=400, detail="Đã gửi lời mời kết bạn rồi")
        elif existing.status == FriendshipStatus.accepted:
            raise ValueError("Hai người đã là bạn bè")
            #raise HTTPException(status_code=400, detail="Hai người đã là bạn bè")
        elif existing.status == FriendshipStatus.rejected:
            # Cho phép gửi lại sau khi bị từ chối
            existing.status = FriendshipStatus.pending
            existing.created_at = datetime.utcnow()
            session.add(existing)
            await session.commit()
            return existing

    friendship = Friendship(
        requester_id=requester_id,
        addressee_id=addressee_id,
        status=FriendshipStatus.pending,
    )
    session.add(friendship)
    await session.commit()
    await session.refresh(friendship)
    return friendship


async def accept_friend_request(session: AsyncSession, requester_id: UUID, addressee_id: UUID):
    stmt = select(Friendship).where(
        (Friendship.requester_id == requester_id) &
        (Friendship.addressee_id == addressee_id) &
        (Friendship.status == FriendshipStatus.pending)
    )
    result = await session.execute(stmt)
    friendship = result.scalars().first()
    if not friendship:
        raise ValueError("Không tìm thấy lời mời kết bạn")
        #raise HTTPException(status_code=404, detail="Không tìm thấy lời mời kết bạn")

    friendship.status = FriendshipStatus.accepted
    session.add(friendship)
    await session.commit()
    await session.refresh(friendship)
    return friendship


async def reject_friend_request(session: AsyncSession, requester_id: UUID, addressee_id: UUID):
    stmt = select(Friendship).where(
        (Friendship.requester_id == requester_id) &
        (Friendship.addressee_id == addressee_id) &
        (Friendship.status == FriendshipStatus.pending)
    )
    result = await session.execute(stmt)
    friendship = result.scalars().first()
    if not friendship:
        raise ValueError("Không tìm thấy lời mời kết bạn")
        #raise HTTPException(status_code=404, detail="Không tìm thấy lời mời kết bạn")

    friendship.status = FriendshipStatus.rejected
    session.add(friendship)
    await session.commit()
    return friendship


async def remove_friend(session: AsyncSession, user_id: UUID, friend_id: UUID):
    stmt = select(Friendship).where(
        ((Friendship.requester_id == user_id) & (Friendship.addressee_id == friend_id)) |
        ((Friendship.requester_id == friend_id) & (Friendship.addressee_id == user_id))
    )
    result = await session.execute(stmt)
    friendship = result.scalars().first()
    if not friendship:
        raise ValueError("Không tồn tại mối quan hệ bạn bè")
        #raise HTTPException(status_code=404, detail="Không tồn tại mối quan hệ bạn bè")

    await session.delete(friendship)
    await session.commit()
    return {"detail": "Đã hủy kết bạn"}


async def list_friends(session: AsyncSession, user_id: UUID, page: int = 1, page_size: int = 10):
    total_stmt = select(func.count()).select_from(User).where(
        User.id == user_id
    )
    total_result = await session.execute(total_stmt)
    total = total_result.scalar_one()
    stmt = select(Friendship).where(
        ((Friendship.requester_id == user_id) | (Friendship.addressee_id == user_id)) &
        (Friendship.status == FriendshipStatus.accepted)
    )
    result = await session.execute(stmt)
    friendships = result.scalars().all()

    friend_ids = [
        f.addressee_id if f.requester_id == user_id else f.requester_id
        for f in friendships
    ]

    if not friend_ids:
        return []

    users_result = await session.execute(select(User).where(col(User.id).in_(friend_ids)))
    users = users_result.scalars().all()
    return {
        "items":users,
        "total":total,
        "page":page,
        "page_size":page_size,
        }


async def get_friendship_status(session: AsyncSession, user_id: UUID, other_id: UUID):
    stmt = select(Friendship).where(
        ((Friendship.requester_id == user_id) & (Friendship.addressee_id == other_id)) |
        ((Friendship.requester_id == other_id) & (Friendship.addressee_id == user_id))
    )
    result = await session.execute(stmt)
    friendship = result.scalars().first()
    if not friendship:
        return {"status": "none"}
    return {"status": friendship.status}
