from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="message", tags=["Message"])

@router.websocket("")
async def message_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"{data}")
    except WebSocketDisconnect: 
        print("Websocket disconenect")