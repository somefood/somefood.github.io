---
layout: post
title: Django01 프로젝트 - 동국푸드(1) 시작하기
category: Django
tags: [django, python]
comments: true
---

> 결과물은 아래 링크에서 확인 가능합니다.
[깃허브](https://github.com/somefood/dongguk_food)
[결과물](http://somefood.pythonanywhere.com/)

Django01 프로젝트 - 동국푸드 시작하기
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
### accounts
Django에서 제공해주는 User와 1대1 관계를 통해 추가로 받고 싶은 정보들을 설정했다.
**(현재는 AbstractUser로 변경했기에 참고 정도로만 봐주자.)**

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

#### 현재 accounts는 AbstractUser로 변경했다.
```python
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True, verbose_name='이메일')
    nickname = models.CharField(max_length=30, unique=True, verbose_name='닉네임')
    phone_number = models.CharField(max_length=30, unique=True, verbose_name='전화번호')
```

### store
가게와 메뉴에 대한 정보를 관리한다.

```python
class Store(models.Model):
    name = models.CharField(max_length=50, verbose_name="가게명")
    slug = models.SlugField('SLUG', unique=True, allow_unicode=True, help_text='one word for alias')
    location = models.CharField(max_length=100, blank=True, verbose_name="위치")
    phone_number = models.CharField(max_length=30, blank=True, verbose_name="연락처")
    description = models.TextField(blank=True, verbose_name="설명")
    store_image = models.ImageField(blank=True, upload_to="store/store_pic")
    created_dt = models.DateTimeField(auto_now_add=True)
    modified_dt = models.DateTimeField(auto_now=True)
    likes = models.IntegerField(verbose_name='좋아요', default=0)
    tags = TaggableManager(blank=True)

    class Meta:
        verbose_name = '가게'
        verbose_name_plural = '가게'
        ordering = ['likes', ]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('store:detail', args=[self.slug])

class Menu(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, verbose_name="가게명")
    name = models.CharField(max_length=50, verbose_name="메뉴")
    description = models.CharField(max_length=50, blank=True, verbose_name="설명")
    food_image = models.ImageField(blank=True, upload_to="store/menu_pic")

    class Meta:
        verbose_name = '메뉴'
        verbose_name_plural = '메뉴'

    def __str__(self):
        return "{} - {}".format(self.store, self.name)
```

#### board
게시판을 관리하는 앱이다.
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

### settings 파일 설정
```python
INSTALLED_APPS += [
    'accounts',
    'board',
    'store',
]
# 유저 모델을 새로 사용하는거기 때문에 아래를 추가해준다.
AUTH_USER_MODEL = 'accounts.User'

# 로그인 필요 시, 이동되는 페이지
LOGIN_URL = '/accounts/login/'
# 로그인 성공 시, 리다이렉트 url
LOGIN_REDIRECT_URL = 'home'
# 로그아웃 성공 시, 리다이렉트 url
LOGOUT_REDIRECT_URL ='home'
# 웹페이지에 사용할 정적파일의 최상위 URL 경로

STATIC_URL = '/static/'
STATIC_DIR = os.path.join(BASE_DIR, 'static')

# 정적파일이 위치한 경로들을 지정하는 설정 항목, 이 설정 통해서 앱 밑에 static 파일 만들고 그런듯 함
STATICFILES_DIRS = [
    STATIC_DIR,
]
# collectstatic 시 파일 위치
STATIC_ROOT = os.path.join(BASE_DIR, '.static_root')

# 유저들이 업로드한 미디어 파일들에 대한 설정
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

여기까지 했으면 아래의 명령어를 마지막으로 입력해주자.
> python manage.py makemigrations
> python manage.py migrate

첫번째는 모델에 대해서 DB에 반영해줄 내용들을 만들어주고,
두번째로 DB에 적용시켜주는 것이다.

앞으로 이를 기반으로 홈페이지를 제작하고 알게된 것을 포스팅 해보고자 한다.
