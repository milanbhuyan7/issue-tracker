from django.contrib import admin
from .models import Issue, IssueTag, IssueTagAssignment, IssueComment

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', 'severity', 'status', 'reporter', 'assignee', 'created_at']
    list_filter = ['severity', 'status', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['-created_at']

@admin.register(IssueTag)
class IssueTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name']

@admin.register(IssueComment)
class IssueCommentAdmin(admin.ModelAdmin):
    list_display = ['issue', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content']
