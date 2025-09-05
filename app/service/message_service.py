from typing import List
from fastapi import WebSocket

active_connections: List[WebSocket] = []

def disconnect(websocket: WebSocket):
    active_connections.remove(websocket)

async def connect(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

async def send_message(message: str, websocket: WebSocket):
    await websocket.send_text(message)

async def broadcast(message: str):
    for connection in active_connections:
        await send_message(message=message, websocket=connection)