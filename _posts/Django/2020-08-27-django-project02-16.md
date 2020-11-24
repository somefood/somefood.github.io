---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(16)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# 유저 Follow
accounts/views
```python
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import get_object_or_404


# get_queryset을 추가해줘서 팔로잉 중인것은 뺀다.
class SuggestionListAPIView(ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = SuggestionUserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.exclude(pk=self.request.user.pk)
        qs = qs.exclude(pk__in=self.request.user.following_set.all())
        return qs


@api_view(['POST'])
def user_follow(request):
    username = request.data["username"]

    follow_user = get_object_or_404(get_user_model(), username, is_active=True)
    request.user.following_set.add(follow_user)
    follow_user.follower_set.add(request.user)
    return Response(status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def user_unfollow(request):
    username = request.data["username"]

    follow_user = get_object_or_404(get_user_model(), username, is_active=True)
    request.user.following_set.remove(follow_user)
    follow_user.follower_set.remove(request.user)
    return Response(status.HTTP_204_NO_CONTENT)
```


accounts/urls
```Python
    path("follow/", views.user_follow, name="user_follow"),
    path("unfollow/", views.user_unfollow, name="user_unfollow"),
```
