---
layout: post
title: Django01 프로젝트 - Abstractuser로 유저 모델 바꾸기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - Abstractuser로 유저 모델 바꾸기
=======

[참고](https://chohyeonkeun.github.io/2019/05/24/190524-django-custom-user/)
[참고](https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html#abstractuser)
전 포스트까지만 해도 OneToOneField로 프로파일을 만들어 사용했는데, 과감하게 Abstractuser로 바꿔보기로 결심했다. Abstractuser로 상속받은 모델을 사용하려면,
- settings파일에서 AUTH_USER_MODEL = `앱이름.클래스명`으로 지정해준다. ex) accounts.User
- 다른 모델에서 위 모델을 참조할 때 `from django.conf import settings`해서 `settings.AUTH_USER_MODEL`로 사용해야 한다. 또는, `from django.contrib.auth import get_user_model`메소드를 불러와 현재 사용중인 모델을 불러와서 사용하자.


## Model 변경
아래와 같이 수정했다. 이메일은 기본으로 제공하나, djagno의 기본 기능 중 비밀번호 리셋이 있는데, 이는 이메일을 통해서 초기화를 진행한다. 하지만 기본옵션이 중복이 허용이기에 위 기능이 작동하지 않는 것이다. (바꾸면 되겠지만 아직 그정도 실력은 아닌지라..) 여튼 지금은 `unique`옵션을 통해 중복을 허용하지 않게 설정했다.
```python
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(max_length=254, unique=True, verbose_name='이메일')
    nickname = models.CharField(max_length=30, verbose_name='닉네임')
    phone_number = models.CharField(max_length=30, verbose_name='전화번호')
```

## admin 등록
모델을 입력하고 makemigrations와 migrate를 진행했으면, admin페이지에 등록해보자.
필드에 우리가 추가한 칼럼들을 넣기 위해 아래처럼 입력해주면 된다.
```python
from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    UserAdmin.fieldsets[1][1]['fields']+=('nickname', 'phone_number')
    UserAdmin.add_fieldsets += (
        (('Additional Info'),{'fields':('nickname','phone_number')}),
    )
admin.site.register(User, CustomUserAdmin)
```

## forms 변경
이전에 사용했던 form은 다 지워버리고 새로 만들어 준다. 다 지웠을 때 아쉬우면서 개운했다 ㅎㅎ
아래 메타클래스처럼 입력해주면 template에서 다 입력할 수 있다.
```python
from django.contrib.auth.forms import UserCreationForm
from accounts.models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email', 'nickname', 'phone_number', )
```


## views 변경
이전에 사용했던 것보다 훨씬 깔끔하게 사용할 수 있게 되었다.
```python
from .forms import CustomUserCreationForm


class UserSignUpView(CreateView):
    template_name = 'accounts/signup.html'
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('accounts:signup_done')
```
