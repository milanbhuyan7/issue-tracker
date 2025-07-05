import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Issue
from .serializers import IssueSerializer

class IssueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'issues'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        # Handle incoming WebSocket messages if needed
        pass
    
    async def issue_update(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'issue_update',
            'data': event['data']
        }))
