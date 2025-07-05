from celery import shared_task
from django.utils import timezone
from django.db.models import Count
from issues.models import Issue
from .models import DailyStats
import logging

logger = logging.getLogger(__name__)

@shared_task
def aggregate_daily_stats():
    """Aggregate daily statistics for issues"""
    today = timezone.now().date()
    
    try:
        # Get counts by status
        status_counts = Issue.objects.values('status').annotate(count=Count('id'))
        status_dict = {item['status']: item['count'] for item in status_counts}
        
        # Get counts by severity
        severity_counts = Issue.objects.values('severity').annotate(count=Count('id'))
        severity_dict = {item['severity']: item['count'] for item in severity_counts}
        
        # Update or create daily stats
        daily_stats, created = DailyStats.objects.update_or_create(
            date=today,
            defaults={
                'open_issues': status_dict.get('open', 0),
                'triaged_issues': status_dict.get('triaged', 0),
                'in_progress_issues': status_dict.get('in_progress', 0),
                'done_issues': status_dict.get('done', 0),
                'low_severity': severity_dict.get('low', 0),
                'medium_severity': severity_dict.get('medium', 0),
                'high_severity': severity_dict.get('high', 0),
                'critical_severity': severity_dict.get('critical', 0),
            }
        )
        
        action = 'Created' if created else 'Updated'
        logger.info(f'{action} daily stats for {today}')
        
    except Exception as e:
        logger.error(f'Error aggregating daily stats: {str(e)}')
