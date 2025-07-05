from rest_framework import serializers
from .models import DailyStats

class DailyStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyStats
        fields = [
            'date', 'open_issues', 'triaged_issues', 'in_progress_issues', 
            'done_issues', 'low_severity', 'medium_severity', 
            'high_severity', 'critical_severity'
        ]
