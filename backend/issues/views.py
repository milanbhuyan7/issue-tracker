from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from .models import Issue, IssueTag, IssueComment
from .serializers import (
    IssueSerializer, IssueCreateSerializer, IssueTagSerializer, 
    IssueCommentSerializer
)
from core.permissions import (
    IsOwnerOrMaintainerOrAdmin, IsMaintainerOrAdmin, IsReporterForCreate
)
from users.models import User
from .tasks import send_issue_notification

class IssueListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsReporterForCreate]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return IssueCreateSerializer
        return IssueSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Issue.objects.all()
        
        # Filter based on user role
        if user.role == User.REPORTER:
            queryset = queryset.filter(reporter=user)
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        severity_filter = self.request.query_params.get('severity')
        search = self.request.query_params.get('search')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if severity_filter:
            queryset = queryset.filter(severity=severity_filter)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        issue = serializer.save()
        # Send notification asynchronously
        send_issue_notification.delay(issue.id, 'created')

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsOwnerOrMaintainerOrAdmin]
    
    def perform_update(self, serializer):
        old_status = self.get_object().status
        issue = serializer.save()
        
        # Send notification if status changed
        if old_status != issue.status:
            send_issue_notification.delay(issue.id, 'status_changed')

class IssueTagListCreateView(generics.ListCreateAPIView):
    queryset = IssueTag.objects.all()
    serializer_class = IssueTagSerializer
    permission_classes = [IsMaintainerOrAdmin]

@api_view(['POST'])
@permission_classes([IsMaintainerOrAdmin])
def assign_tag_to_issue(request, issue_id, tag_id):
    try:
        issue = Issue.objects.get(id=issue_id)
        tag = IssueTag.objects.get(id=tag_id)
        
        assignment, created = issue.tag_assignments.get_or_create(
            tag=tag,
            defaults={'assigned_by': request.user}
        )
        
        if created:
            return Response({'message': 'Tag assigned successfully'})
        else:
            return Response({'message': 'Tag already assigned'}, status=400)
    
    except (Issue.DoesNotExist, IssueTag.DoesNotExist):
        return Response({'error': 'Issue or tag not found'}, status=404)

class IssueCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = IssueCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        issue_id = self.kwargs['issue_id']
        return IssueComment.objects.filter(issue_id=issue_id)
    
    def perform_create(self, serializer):
        issue_id = self.kwargs['issue_id']
        issue = Issue.objects.get(id=issue_id)
        serializer.save(author=self.request.user, issue=issue)
