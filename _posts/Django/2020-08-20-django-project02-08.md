---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(8)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# 장고에 JWT 토큰 발급 붙이기

JWT를 설치해 주자.
> pip install djangorestframework-jwt


settings 파일에 아래와 같이 설정해 준다.
```python
REST_FRAMEWORK = {
    'DEFAULT_PERMission_CLASSES': ["rest_framework.permissions.IsAuthenticated",],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_jwt.authentication.JSONWebTokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
}

JWT_AUTH = {
    'JWT_SECRET_KEY': SECRET_KEY,
    'JWT_ALGORITHM' : "HS256",
    'JWT_ALLOW_REFRESH': True,
    'JWT_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=28),
}
```

urls 파일 설정
```python
from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token
from .views import SignupView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='login'),
    path('token/', obtain_jwt_token),
    path('token/refresh/', refresh_jwt_token),
    path('token/verify/', verify_jwt_token),
]
```
