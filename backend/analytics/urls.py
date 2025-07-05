from django.urls import path
from . import views

urlpatterns = [
    path('daily-stats/', views.DailyStatsListView.as_view(), name='daily-stats'),
    path('dashboard/', views.dashboard_stats, name='dashboard-stats'),
]
