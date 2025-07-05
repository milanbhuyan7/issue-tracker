from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from issues.models import Issue
from .models import DailyStats
from .serializers import DailyStatsSerializer
from core.permissions import IsMaintainerOrAdmin

class DailyStatsListView(generics.ListAPIView):
    queryset = DailyStats.objects.all()[:30]  # Last 30 days
    serializer_class = DailyStatsSerializer
    permission_classes = [IsMaintainerOrAdmin]

@api_view(['GET'])
@permission_classes([IsMaintainerOrAdmin])
def dashboard_stats(request):
    # Current issue counts by status
    status_counts = Issue.objects.values('status').annotate(count=Count('id'))
    
    # Current issue counts by severity
    severity_counts = Issue.objects.values('severity').annotate(count=Count('id'))
    
    # Total issues
    total_issues = Issue.objects.count()
    
    return Response({
        'total_issues': total_issues,
        'status_counts': list(status_counts),
        'severity_counts': list(severity_counts),
    })
