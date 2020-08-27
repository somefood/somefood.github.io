---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(5)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# 간단한 회원가입 API 만들기

#### serializers
```python
from rest_framework import  serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class SignupSeriallizer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ['pk', 'username', 'password']
```


#### views
```python
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.generics import CreateAPIView
from .serializers import SignupSeriallizer


class SignupView(CreateAPIView):
    model = get_user_model()
    serializer_class = SignupSeriallizer
    permission_classes = [
        AllowAny,
    ]

```
