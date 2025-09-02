from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship, Column
from enum import Enum  # ✅ Dùng enum gốc của Python


# ---------------- ENUMS ----------------
class UserStatus(str, Enum):
    online = "online"
    offline = "offline"
    busy = "busy"
    away = "away"


class ConversationType(str, Enum):
    direct = "direct"
    group = "group"


class MemberRole(str, Enum):
    member = "member"
    admin = "admin"


class MessageType(str, Enum):
    text = "text"
    image = "image"
    video = "video"
    file = "file"
    audio = "audio"
    location = "location"


class ReceiptStatus(str, Enum):
    sent = "sent"
    delivered = "delivered"
    read = "read"


class FriendRequestStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class NotificationType(str, Enum):
    new_message = "new_message"
    friend_request = "friend_request"
    group_invite = "group_invite"
    system_alert = "system_alert"


class RelatedEntityType(str, Enum):
    message = "message"
    friend_request = "friend_request"
    conversation = "conversation"
    system = "system"