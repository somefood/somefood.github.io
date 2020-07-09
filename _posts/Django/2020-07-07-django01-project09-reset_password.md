---
layout: post
title: Django01 프로젝트 - 패스워드 리셋하기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - 패스워드 리셋하기
=======

[패스워드 리셋 참고](https://learndjango.com/tutorials/django-password-reset-tutorial)
auth
```python
from django.contrib.auth import views
  7 from django.urls import path
  8
  9 urlpatterns = [
 10     path('login/', views.LoginView.as_view(), name='login'),
 11     path('logout/', views.LogoutView.as_view(), name='logout'),
 12
 13     path('password_change/', views.PasswordChangeView.as_view(), name='password_change'),
 14     path('password_change/done/', views.PasswordChangeDoneView.as_view(), name='password_change_done'),
 15
 16     path('password_reset/', views.PasswordResetView.as_view(), name='password_reset'),
 17     path('password_reset/done/', views.PasswordResetDoneView.as_view(), name='password_reset_done'),
 18     path('reset/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
 19     path('reset/done/', views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
 20 ]
```
