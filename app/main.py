from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from databases.database import init_db
from routes.auth_route import router as auth_router
from routes.role_route import router as role_router
from routes.user_route import router as user_router
from routes.conversation_route import router as conversation_router
from routes.message_route import router as message_router
from routes.websocket_message_route import router as websocket_router

app = FastAPI()

@app.get("/")
async def root():
    return{"message": "hello"}

@app.on_event("startup")
async def on_startup():
     await init_db()
     

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép FE test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
     
app.include_router(auth_router)
app.include_router(role_router)
app.include_router(user_router)
app.include_router(conversation_router)
app.include_router(message_router)
app.include_router(websocket_router)