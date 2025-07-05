from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Issue
import logging

logger = logging.getLogger(__name__)

@shared_task
def send_issue_notification(issue_id, action):
    try:
        issue = Issue.objects.get(id=issue_id)
        
        if action == 'created':
            subject = f'New Issue Created: {issue.title}'
            message = f'A new issue has been created by {issue.reporter.email}'
        elif action == 'status_changed':
            subject = f'Issue Status Changed: {issue.title}'
            message = f'Issue status changed to {issue.get_status_display()}'
        
        # In a real application, you would send emails to relevant users
        logger.info(f'Notification: {subject} - {message}')
        
    except Issue.DoesNotExist:
        logger.error(f'Issue with id {issue_id} not found')
