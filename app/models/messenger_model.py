from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy.orm import Mapped

import enum

# ============================
# ENUMS
# ============================
class UserStatus(str, enum.Enum):
    online = "online"
    offline = "offline"
    away = "away"
    
class FriendshipStatus(str, enum.Enum):
    pending = "pending"   # Đã gửi lời mời
    accepted = "accepted" # Đã trở thành bạn bè
    blocked = "blocked"   # Bị chặn
    declined = "declined" # Từ chối

class ConversationType(str, enum.Enum):
    SINGLE = "single"
    GROUP = "group"

class AttachmentType(str, enum.Enum):
    image = "image"
    video = "video"
    file = "file"
    audio = "audio"

class NotificationType(str, enum.Enum):
    message = "message"
    call = "call"
    invite = "invite"

class CallType(str, enum.Enum):
    voice = "voice"
    video = "video"

class CallStatus(str, enum.Enum):
    missed = "missed"
    answered = "answered"
    declined = "declined"

# ============================
# ROLES & PERMISSIONS
# ============================
class SystemRole(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=50, nullable=False, unique=True, index=True)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    users: List["User"] = Relationship(back_populates="system_role")
    


class ConversationRole(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=50, nullable=False, unique=True, index=True)
    description: Optional[str] = None
    permissions: Optional[str] = None  # JSON list of permissions
    created_at: datetime = Field(default_factory=datetime.utcnow)

    participants: List["ConversationParticipant"] = Relationship(back_populates="role")
    role_permissions: List["RolePermission"] = Relationship(back_populates="role", cascade_delete=True)


class Permission(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=100, nullable=False, unique=True, index=True)
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    role_permissions: List["RolePermission"] = Relationship(back_populates="permission")


class RolePermission(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    role_id: UUID = Field(foreign_key="conversationrole.id", nullable=False, index=True)
    permission_id: UUID = Field(foreign_key="permission.id", nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    role: ConversationRole = Relationship(back_populates="role_permissions")
    permission: Permission = Relationship(back_populates="role_permissions")

# ============================
# USER & AUTH
# ============================
class UserSocialAccount(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", nullable=False, index=True)
    provider: str = Field(max_length=50, nullable=False)
    provider_account_id: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="social_accounts")


class UserDeviceToken(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", nullable=False, index=True)
    device_id: Optional[str] = None
    platform: Optional[str] = None
    push_token: Optional[str] = None
    last_seen_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: "User" = Relationship(back_populates="device_tokens")


class User(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str
    phone_number: Optional[str] = Field(default=None, unique=True, index=True)
    email: Optional[str] = Field(default=None, unique=True, index=True)
    password_hash: str
    avatar_url: Optional[str] = None
    status: UserStatus = Field(default=UserStatus.offline)
    last_active_at: Optional[datetime] = None
    system_role_id: Optional[UUID] = Field(default=None, foreign_key="systemrole.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    system_role: Optional[SystemRole] = Relationship(back_populates="users")
    social_accounts: List[UserSocialAccount] = Relationship(back_populates="user" ,cascade_delete=True)
    device_tokens: List[UserDeviceToken] = Relationship(back_populates="user",cascade_delete=True)
    conversations_created: List["Conversation"] = Relationship(back_populates="creator",cascade_delete=True)
    participants: List["ConversationParticipant"] = Relationship(back_populates="user",cascade_delete=True)
    messages_sent: List["Message"] = Relationship(back_populates="sender",cascade_delete=True)
    message_reactions: List["MessageReaction"] = Relationship(back_populates="user",cascade_delete=True)
    message_reads: List["MessageRead"] = Relationship(back_populates="user",cascade_delete=True)
    notifications: List["Notification"] = Relationship(back_populates="user",cascade_delete=True)
    calls_made: List["Call"] = Relationship(back_populates="caller",cascade_delete=True)
    friendships_sent: List["Friendship"] = Relationship(
        back_populates="requester",
        sa_relationship_kwargs={"foreign_keys": "Friendship.requester_id"},cascade_delete=True
    )
    friendships_received: List["Friendship"] = Relationship(
        back_populates="addressee",
        sa_relationship_kwargs={"foreign_keys": "Friendship.addressee_id"},cascade_delete=True
    )
    
class Friendship(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    requester_id: UUID = Field(foreign_key="user.id", nullable=False, index=True)
    addressee_id: UUID = Field(foreign_key="user.id", nullable=False, index=True)
    status: FriendshipStatus = Field(default=FriendshipStatus.pending)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    requester: "User" = Relationship(
        back_populates="friendships_sent",
        sa_relationship_kwargs={"foreign_keys": "Friendship.requester_id"}
    )
    addressee: "User" = Relationship(
        back_populates="friendships_received",
        sa_relationship_kwargs={"foreign_keys": "Friendship.addressee_id"}
    )

# ============================
# CONVERSATIONS
# ============================
class Conversation(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    type: ConversationType
    name: Optional[str] = None
    creator_id: Optional[UUID] = Field(foreign_key="user.id", nullable=True)
    settings: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    creator: Mapped[Optional[User]] = Relationship(back_populates="conversations_created")
    participants: Mapped[List["ConversationParticipant"]] = Relationship(back_populates="conversation", cascade_delete=True)
    messages: List["Message"] = Relationship(back_populates="conversation", cascade_delete=True)
    calls: List["Call"] = Relationship(back_populates="conversation", cascade_delete=True)


class ConversationParticipant(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", nullable=False)
    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    role_id: Optional[UUID] = Field(default=None, foreign_key="conversationrole.id")
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    is_muted: bool = Field(default=False)
    is_archived: bool = Field(default=False)

    conversation: Conversation = Relationship(back_populates="participants")
    user: Mapped[User] = Relationship(back_populates="participants")
    role: Optional[ConversationRole] = Relationship(back_populates="participants")

# ============================
# MESSAGES & ATTACHMENTS
# ============================
class Attachment(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    url: str
    type: AttachmentType
    size: Optional[int] = None
    file_info: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

    messages: List["Message"] = Relationship(back_populates="attachment")


class Message(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", nullable=False)
    sender_id: UUID = Field(foreign_key="user.id", nullable=False)
    content: Optional[str] = None
    attachment_id: Optional[UUID] = Field(default=None, foreign_key="attachment.id")
    reply_to_id: Optional[UUID] = Field(default=None, foreign_key="message.id")
    sent_at: datetime = Field(default_factory=datetime.utcnow)
    is_edited: bool = Field(default=False)
    is_deleted: bool = Field(default=False)

    conversation: Conversation = Relationship(back_populates="messages")
    sender: User = Relationship(back_populates="messages_sent")
    attachment: Optional[Attachment] = Relationship(back_populates="messages")
    reactions: List["MessageReaction"] = Relationship(back_populates="message")
    reads: List["MessageRead"] = Relationship(back_populates="message")

class MessageReaction(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: UUID = Field(foreign_key="message.id", nullable=False)
    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    emoji: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    message: Message = Relationship(back_populates="reactions")
    user: User = Relationship(back_populates="message_reactions")


class MessageRead(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: UUID = Field(foreign_key="message.id", nullable=False)
    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    read_at: datetime = Field(default_factory=datetime.utcnow)

    message: Message = Relationship(back_populates="reads")
    user: User = Relationship(back_populates="message_reads")

# ============================
# NOTIFICATIONS & CALLS
# ============================
class Notification(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id", nullable=False)
    type: NotificationType
    title: Optional[str] = None
    body: Optional[str] = None
    payload: Optional[str] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="notifications")


class Call(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversation.id", nullable=False)
    caller_id: UUID = Field(foreign_key="user.id", nullable=False)
    call_type: CallType
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    status: CallStatus = Field(default=CallStatus.missed)

    conversation: Conversation = Relationship(back_populates="calls")
    caller: User = Relationship(back_populates="calls_made")
