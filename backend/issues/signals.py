from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Issue
from .serializers import IssueSerializer

@receiver(post_save, sender=Issue)
def issue_saved(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    serializer = IssueSerializer(instance)
    
    async_to_sync(channel_layer.group_send)(
        'issues',
        {
            'type': 'issue_update',
            'data': {
                'action': 'created' if created else 'updated',
                'issue': serializer.data
            }
        }
    )

@receiver(post_delete, sender=Issue)
def issue_deleted(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        'issues',
        {
            'type': 'issue_update',
            'data': {
                'action': 'deleted',
                'issue_id': instance.id
            }
        }
    )
