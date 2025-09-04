from fastapi import WebSocket

def disconnect(websocket: WebSocket):
    return

async def connect(websocket: WebSocket):
    return websocket.accept()

async def send_msessage(msessage: str, websocket: WebSocket):
    return websocket.send_text(msessage)

async def broadcast(message: str):
    return