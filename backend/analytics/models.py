from django.db import models

class DailyStats(models.Model):
    date = models.DateField(unique=True)
    open_issues = models.IntegerField(default=0)
    triaged_issues = models.IntegerField(default=0)
    in_progress_issues = models.IntegerField(default=0)
    done_issues = models.IntegerField(default=0)
    
    # Severity breakdown
    low_severity = models.IntegerField(default=0)
    medium_severity = models.IntegerField(default=0)
    high_severity = models.IntegerField(default=0)
    critical_severity = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = 'Daily Stats'
    
    def __str__(self):
        return f'Stats for {self.date}'
