from fastapi import FastAPI
from controller.auth_controller import router as auth_router
from controller.user_controller import router as user_router


app = FastAPI()

@app.get("/")
async def root():
    return{"message": "hello"}

app.include_router(auth_router)
app.include_router(user_router)