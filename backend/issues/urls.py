from django.urls import path
from . import views

urlpatterns = [
    path('', views.IssueListCreateView.as_view(), name='issue-list-create'),
    path('<int:pk>/', views.IssueDetailView.as_view(), name='issue-detail'),
    path('tags/', views.IssueTagListCreateView.as_view(), name='tag-list-create'),
    path('<int:issue_id>/tags/<int:tag_id>/', views.assign_tag_to_issue, name='assign-tag'),
    path('<int:issue_id>/comments/', views.IssueCommentListCreateView.as_view(), name='issue-comments'),
]
