---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(2)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# 포스팅 목록 API를 구현하고 리액트에서 받아서 표현하기

## django 설정

앱을 설치해 후자
`python manage.py startapp instagram`
`python manage.py startapp accounts`

#### accounts 설정
accounts.models 파일에 다음과 같이 입력해준다.
```python
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.core.validators import RegexValidator
from django.template.loader import render_to_string
from django.shortcuts import resolve_url


class User(AbstractUser):
    class GenderChoices(models.TextChoices):
        MALE = "M", "남성"
        FEMALE = "F", "여성"

    follower_set = models.ManyToManyField("self", blank=True)
    following_set = models.ManyToManyField("self", blank=True)

    website_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(
        max_length=13,
        blank=True,
        validators=[RegexValidator(r"^010-?[1-9]\d{3}-?\d{4}$")],
    )
    gender = models.CharField(max_length=1, blank=True, choices=GenderChoices.choices)
    avatar = models.ImageField(
        blank=True,
        upload_to="accounts/avatar/%Y/%m/%d",
        help_text="48px * 48px 크기의 png/jpg 파일을 업로드 해주세요",
    )

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        else:
            return resolve_url("pydenticon_image", self.username)

    def send_welcome_email(self):
        subject = render_to_string(
            "accounts/welcome_eail_subject.txt", {"user": self,}
        )
        content = render_to_string(
            "accounts/welcome_email_content.txt", {"user": self,}
        )
        sender_email = settings.WELCOME_EMAIL_SENDER
        send_mail(subject, content, sender_email, [self.email], fail_silently=False)


```

이후 settings파일에 'AUTH_USER_MODEL = accounts.User'를 추가해주고 makemigrations와 migrate를 입력해준다.

admin 파일에 아래와 같이 입력해서 admin 페이지에서도 보이게 해준다.
```python
from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
```

### instagram 설정

```python
import re
from django.conf import settings
from django.db import models
from django.urls import reverse


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Post(TimeStampedModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='my_post_set',
                               on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='instagram/post/%Y/%m/%d')
    caption = models.CharField(max_length=500)
    tag_set = models.ManyToManyField('Tag', blank=True)
    location = models.CharField(max_length=100)
    like_user_set = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True,
                                           related_name='like_post_set')

    def __str__(self):
        return self.caption

    def extract_tag_list(self):
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.caption)
        tag_list =  []
        for tag_name in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            tag_list.append(tag)
        return tag_list

    def get_absolute_url(self):
        return reverse("instagram:post_detail", args=[self.pk])

    def is_like_user(self, user):
        return self.like_user_set.filter(pk=user.pk).exists()

    class Meta:
        ordering = ["-id"]


class Comment(TimeStampedModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()

    class Meta:
        ordering = ["-id"]


class Tag(TimeStampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
```

- admin 설정
mark_safe를 통해서 실제 태그를 삽입할 수 있다. 단, 주의할 점으로 함부로 썼다가 누군가가 올린 스크립트문이 실행될 수도 있으니 주의하면서 써야한다.
```python
from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Post, Comment, Tag


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["photo_tag", "caption"]
    list_display_links = ["caption"]

    def photo_tag(self, post):
        return mark_safe(f"<img src={post.photo.url} style='width: 100px;'/>")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass
```

## rest_framwwork 사용
이후 rest framework를 설치해서 사용해보도록 하겠다.
> pip install djangorestframework

settings 파일에 rest_framework의 이용은 인증된 유저만 사용할 수 있게 설정해준다.
```python
# 아래 내용 추가
REST_FRAMEWORK = {
    'DEFAULT_PERMission_CLASSES': ["rest_framework.permissions.IsAuthenticated",]
}
```

```python
# instagram/views.py
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # FIXME: 인증 적용


# instagram/serializers
from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


# instagram/urls
# DRF의 URL을 등록해준다.
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register('posts', views.PostViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]        
```

## react 사용(with axios)

일단 axios를 설치해주자.
> yarn add axios

그리고 최상단 폴더에 jsconfig.json이라는 파일을 생성해서 아래처럼 입력해주자.
절대 경로 지정해주는거 같은데 있으면 편하다 한다.
```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

PostList.js 파일을 만들어 아래 처럼 입력해보고 App.js에 등록해주고 실행해보자.
```javascript
import React, { useEffect } from "react";
import Axios from "axios";
const apiUrl = "http://localhost:8000/api/posts/";

function PostList() {
  // mount 되었을 때 한 번 실행
  useEffect(() => {
    Axios.get(apiUrl)
      .then((response) => {
          console.log("loaded response:", response)
      })
      .catch((error) => {
        // error.response;
      });
    console.log("mounted");
  }, []);
  return (
    <div>
      <h1>PostList</h1>
    </div>
  );
}

export default PostList;

```
그러면 다음과 같은 에러를 만나볼 수 있다. 이것은 CORS에러인데 서로 다른 호스트로부터 요청이 들어와서 그런 것이다. 같은 localhost인데? 할수도 있지만 포트까지 치면 엄연히 다른 호스트이다.
> Access to XMLHttpRequest at 'http://localhost:8000/api/posts/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

해결법으로 일단  `pip install django-cors-headers`를 설치해주고 settings에 아래 내용을 추가해주자.
```python
INSTALLED_APPS = [
    'corsheaders',
]
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
]
CORS_ORIGIN_WHITELIST = ["http://localhost:3000"]
```

이후 다시 js 파일들을 작성해주자.
map같이 순회하는 경우에는 컴포넌트들을 구분해주기 위해 식별할 수 있는key를 넣어주어야 한다. 아래의 예시에서는 post.id를 넣었다.
```javascript
// PostList.js
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Post from "Post";

const apiUrl = "http://localhost:8000/api/posts/";

function PostList() {
  const [postList, setPostList] = useState([]);
  useEffect(() => {
    Axios.get(apiUrl)
      .then((response) => {
        const { data } = response;
        console.log("loaded response:", response);
        setPostList(data);
      })
      .catch((error) => {
        // error.response;
      });
    console.log("mounted");
  }, []);
  return (
    <div>
      <h2>PostList</h2>
      {postList.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
}

export default PostList;

// Post.js
import React from "react";

function Post({ post }) {
  const { caption, location, photo } = post;
  return (
    <div>
      <img src={photo} alt={caption} style={{ width: "100px" }} />
      {caption}, {location}
    </div>
  );
}

export default Post;

```
