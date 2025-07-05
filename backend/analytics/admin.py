from django.contrib import admin
from .models import DailyStats

@admin.register(DailyStats)
class DailyStatsAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'open_issues', 'triaged_issues', 'in_progress_issues', 
        'done_issues', 'created_at'
    ]
    list_filter = ['date']
    ordering = ['-date']
    readonly_fields = ['created_at', 'updated_at']
