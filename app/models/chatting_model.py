from datetime import datetime
from typing import List, Optional
from uuid import UUID, uuid4
from sqlmodel import Column, Enum, Field, Relationship, SQLModel
from core.enums import ConversationType, FriendRequestStatus, MemberRole, MessageType, NotificationType, ReceiptStatus, RelatedEntityType, UserStatus

class User(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False)
    email: str = Field(index=True, unique=True, nullable=False)
    password_hash: str
    avatar_url: Optional[str] = None
    display_name: str
    status: UserStatus = Field(default=UserStatus.offline)
    last_seen: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    #conversations_created: List["Conversation"] = Relationship(back_populates="creator")
    #memberships: List["ConversationMember"] = Relationship(back_populates="user")
    #messages: List["Message"] = Relationship(back_populates="sender")
    '''receipts: List["MessageReceipt"] = Relationship(back_populates="user")
    reactions: List["MessageReaction"] = Relationship(back_populates="user")
    friend_requests_sent: List["FriendRequest"] = Relationship(back_populates="sender", sa_relationship_kwargs={"foreign_keys": "[FriendRequest.sender_id]"})
    friend_requests_received: List["FriendRequest"] = Relationship(back_populates="receiver", sa_relationship_kwargs={"foreign_keys": "[FriendRequest.receiver_id]"})
    friends: List["Friend"] = Relationship(back_populates="user", sa_relationship_kwargs={"foreign_keys": "[Friend.user_id]"})
    friend_of: List["Friend"] = Relationship(back_populates="friend", sa_relationship_kwargs={"foreign_keys": "[Friend.friend_id]"})
    notifications: List["Notification"] = Relationship(back_populates="user")
    sessions: List["UserSession"] = Relationship(back_populates="user")'''


'''class Conversation(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    type: ConversationType = Field()
    name: Optional[str] = None
    creator_id: UUID = Field(foreign_key="users.id")
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    creator: Optional[User] = Relationship(back_populates="conversations_created")
    members: List["ConversationMember"] = Relationship(back_populates="conversation")
    messages: List["Message"] = Relationship(back_populates="conversation")


class ConversationMember(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id")
    user_id: UUID = Field(foreign_key="users.id")
    role: MemberRole = Field(default=MemberRole.member)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    left_at: Optional[datetime] = None

    # Relationships
    conversation: Optional[Conversation] = Relationship(back_populates="members")
    user: Optional[User] = Relationship(back_populates="memberships")


class Message(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id")
    sender_id: UUID = Field(foreign_key="users.id")
    content: Optional[str] = None
    message_type: MessageType = Field(default=MessageType.text)
    media_url: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    deleted_at: Optional[datetime] = None

    # Relationships
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
    sender: Optional[User] = Relationship(back_populates="messages")
    receipts: List["MessageReceipt"] = Relationship(back_populates="message")
    reactions: List["MessageReaction"] = Relationship(back_populates="message")'''


'''class MessageReceipt(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: UUID = Field(foreign_key="messages.id")
    user_id: UUID = Field(foreign_key="users.id")
    status: ReceiptStatus = Field(default=ReceiptStatus.sent)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    message: Optional[Message] = Relationship(back_populates="receipts")
    user: Optional[User] = Relationship(back_populates="receipts")


class MessageReaction(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: UUID = Field(foreign_key="messages.id")
    user_id: UUID = Field(foreign_key="users.id")
    emoji: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    message: Optional[Message] = Relationship(back_populates="reactions")
    user: Optional[User] = Relationship(back_populates="reactions")


class FriendRequest(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    sender_id: UUID = Field(foreign_key="users.id")
    receiver_id: UUID = Field(foreign_key="users.id")
    status: FriendRequestStatus = Field(default=FriendRequestStatus.pending)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    sender: Optional[User] = Relationship(back_populates="friend_requests_sent", sa_relationship_kwargs={"foreign_keys": "[FriendRequest.sender_id]"})
    receiver: Optional[User] = Relationship(back_populates="friend_requests_received", sa_relationship_kwargs={"foreign_keys": "[FriendRequest.receiver_id]"})


class Friend(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    friend_id: UUID = Field(foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional[User] = Relationship(back_populates="friends", sa_relationship_kwargs={"foreign_keys": "[Friend.user_id]"})
    friend: Optional[User] = Relationship(back_populates="friend_of", sa_relationship_kwargs={"foreign_keys": "[Friend.friend_id]"})


class Notification(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    type: NotificationType = Field()
    content: str
    related_entity_type: Optional[RelatedEntityType] = Field(default=None)
    related_entity_id: Optional[UUID] = None
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    user: Optional[User] = Relationship(back_populates="notifications")


class UserSession(SQLModel, table=True):

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id")
    session_token: str
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None

    # Relationships
    user: Optional[User] = Relationship(back_populates="sessions")'''