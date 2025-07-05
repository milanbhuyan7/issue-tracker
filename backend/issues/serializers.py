from rest_framework import serializers
from .models import Issue, IssueTag, IssueTagAssignment, IssueComment
from users.serializers import UserSerializer

class IssueTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueTag
        fields = ['id', 'name', 'color', 'created_at']

class IssueTagAssignmentSerializer(serializers.ModelSerializer):
    tag = IssueTagSerializer(read_only=True)
    assigned_by = UserSerializer(read_only=True)
    
    class Meta:
        model = IssueTagAssignment
        fields = ['id', 'tag', 'assigned_by', 'assigned_at']

class IssueCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = IssueComment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

class IssueSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    tag_assignments = IssueTagAssignmentSerializer(many=True, read_only=True)
    comments = IssueCommentSerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'severity', 'status',
            'reporter', 'assignee', 'file_attachment', 'file_url',
            'tag_assignments', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reporter', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file_attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file_attachment.url)
        return None

class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['title', 'description', 'severity', 'file_attachment']
    
    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)
