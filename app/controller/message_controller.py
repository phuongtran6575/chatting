from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from service import message_service
router = APIRouter(prefix="/message", tags=["Message"])

@router.websocket("/ws")
async def message_endpoint(websocket: WebSocket):
    await message_service.connect(websocket=websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await message_service.broadcast(f"{data}")
    except WebSocketDisconnect:
        message_service.disconnect(websocket=websocket)