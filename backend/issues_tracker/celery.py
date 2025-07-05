import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'issues_tracker.settings')

app = Celery('issues_tracker')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Periodic tasks
app.conf.beat_schedule = {
    'aggregate-daily-stats': {
        'task': 'analytics.tasks.aggregate_daily_stats',
        'schedule': crontab(minute='*/30'),  # Every 30 minutes
    },
}
