from typing import Annotated
from fastapi import Depends
from sqlmodel import SQLModel, Session, create_engine
from models.chatting_model import User

engine = create_engine("sqlite:///./chatting.db", echo=True)
SQLModel.metadata.create_all(engine)
def get_session():
    with Session(engine) as session:
        yield session

sessionDepends = Annotated[Session, Depends(get_session)]
