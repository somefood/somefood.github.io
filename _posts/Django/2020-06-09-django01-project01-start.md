---
layout: post
title: Django01 프로젝트 - 시작하기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - 시작하기
=======

지금까지 패스트캠퍼스와 여러 튜토리얼을 보면서 Django에 대해 어느정도 지식을 쌓아뒀지만, 아직까지 나만의 프로젝트를 만들어 본적이 없었다. 개발자가 되기 위해서 중요한 것은 `뭐든 만들어 보자.` 인거 같다. 그렇기에 첫 번째 프로젝트를 시작해 보려고 한다.

- 프로젝트명: 동국푸드
- 설명: 필자는 현재 동국대에 재직자 전형으로 재학중이다. 나름대로 대학생활을 즐기면서 여러 음식집들을 방문하여 친구들과 가게들에 대한 평을 해봤었고, 이런 계기로 가게들을 설명하는 자유 커뮤니티를 만들어 보고자 한다.


## 준비하기

- 프로젝트 생성: 예전에 사용했던 프로젝트 위에서 사용해서 mysite로 시작했다.
`django-admin startproject mysite`

- 앱 생성: 내가 생각한 앱들은 회원정보, 가게소개, 게시판 정도로 생각했다.
  - 회원정보: 로그인, 로그아웃, 회원가입을 구현하기
  - 가게소개: 동국대 주변 음식집에 대한 정보를 소개, 좋아요 기능 구현 예정
  - 게시판: 일반 자유게시판, 좋아요 기능 구현 예장
`django-admin startapp accounts, store, board` 앱 별로 다 실행해준다.

- 모델 생성: 각 앱들에 대한 모델들을 정의해줬다.
##### accounts: Django에서 제공해주는 User와 1대1 관계를 통해 추가로 받고 싶은 정보들을 설정했다.
```python
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=30, null=True, verbose_name='닉네임',)
    phone_number = models.CharField(max_length=30, null=True, verbose_name='전화번호',)

    class Meta:
        verbose_name = '프로필'
        verbose_name_plural = '프로필'

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
```

##### store
```python
from django.db import models
from django.shortcuts import reverse

class Store(models.Model):
    name = models.CharField(max_length=50, verbose_name="가게명")
    location = models.CharField(max_length=100, verbose_name="위치")
    phone_number = models.CharField(max_length=30, blank=True, verbose_name="연락처")
    description = models.TextField(blank=True, verbose_name="설명")
    store_image = models.ImageField(blank=True, upload_to="store/store_pic")
    likes = models.IntegerField()

    class Meta:
        verbose_name = '가게'
        verbose_name_plural = '가게'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('store:detail', args=[self.id])

class Menu(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, verbose_name="가게명")
    name = models.CharField(max_length=50, verbose_name="메뉴")
    description = models.CharField(max_length=50, verbose_name="설명")
    votes = models.IntegerField(default=0, verbose_name="투표수")
    food_image = models.ImageField(blank=True, upload_to="store/menu_pic")

    class Meta:
        verbose_name = '메뉴'
        verbose_name_plural = '메뉴'
        ordering = ['-votes',]

    def __str__(self):
        return "{} - {}".format(self.store, self.name)
```

##### board
```python
from django.db import models
from django.contrib.auth.models import User

class UserBoard(models.Model):
    title = models.CharField(max_length=50, blank=True, verbose_name='제목')
    writer = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='작성자')
    created_date = models.DateTimeField(auto_now_add=True)
    content = models.TextField(verbose_name='내용')
    hits = models.IntegerField(null=True, blank=True, verbose_name='좋아요')

    def __str__(self):
        return '유저:{}, 제목:{}'.format(self.writer, self.title)

    def board_save(self):
        self.save()

    class Meta:
        ordering = ['-created_date']
        verbose_name = '게시판'
        verbose_name_plural = '게시판'

```