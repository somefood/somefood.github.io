---
layout: post
title: Django01 프로젝트 - 동국푸드(2) urls 설정
category: Django
tags: [django, python]
comments: true
---

> 결과물은 아래 링크에서 확인 가능합니다.
[깃허브](https://github.com/somefood/dongguk_food)
[결과물](http://somefood.pythonanywhere.com/)


이전 시간에 모델을 설정했으니, 그에 대해 url을 설정해준다.

## 프로젝트 urls 설정
먼저 프로젝트의 urls 파일에 아래 처럼 추가해주자. 뭔가 많아 보일테지만 일단은 입력해주자.
```python
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView
from django.conf import settings
from django.conf.urls.static import static

from store.models import Store

class HomePageView(TemplateView):

    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['store_list'] = Store.objects.filter(category='restaurant')[:1] | \
                                Store.objects.filter(category='bar')[:1] | \
                                Store.objects.filter(category='cafe')[:1]

        return context

urlpatterns = [
    path('board/', include('board.urls')),
    path('store/', include('store.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('', HomePageView.as_view(), name='home'),
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

```
- HomePageView는 최초 접속 시 보여줄 화면에 대해 정의한 것인데, 따로 둘데가 없기에 urls에 바로 정의해줬다.
- accounts를 보면 두개가 있기에 의아할 수도 있는데, 첫번째는 내가 정의한 앱으로 가는 것이고, 두번째는 장고에서 기본 제공해주는 auth앱으로 들어가는 것이다. 장고가 기본적으로 비밀번호 변경, 찾기 같은 기능을 제공해주는데 이것을 이용해주려고 둔 것이다.
- include를 사용해서 만약 'url/board'로 들어왔으면 나머지의 내용들은 board의 urls에서 참고하겠다는 의미이다.
- 맨 마지막에는 DEBUG가 True일 때 작동들 하는 것이다. debug_toolbar에 대해서는 나중에 적도록 하겠다.

## 나머지 앱 urls 설정
지금은 views의 내용을 아직 만들지 않았기에 오류가 뜰테지만 일단은 입력해주자.
#### accounts
```python
from django.urls import path
from . import views

app_name = 'accounts'
urlpatterns = [
	path('login/', views.UserLoginView.as_view(), name='login'),
	path('logout/', views.signout, name='logout'),
	path('signup/', views.UserSignUpView.as_view(), name='signup'),
	path('signup/done/', views.UserSignUpDoneView.as_view(), name='signup_done'),
	path('mypage/', views.MyPageV.as_view(), name='mypage'),
	path('checkuser/', views.check_user, name='check_user'),
	path('checknickname/', views.check_nickname, name='check_nickname'),
	path('finduser/', views.FindUser.as_view(), name='find_user')
]
```
- 이름대로 login, logout, 회원가입, 마이페이지가 있다.
- checkuser, checknickname: 회원가입 시 유저명, 닉네임 중복을 확인하는 용으로 쓴다. (ajax 활용)
- finduser: 유저 검색 기능이다.

#### store
```python
from django.urls import path
from . import views

app_name = 'store'
urlpatterns = [
    path('', views.StoreIndexView.as_view(), name='index'),
    path('category/<str:category>/', views.CategoryView.as_view(), name='category'),
    path('like/', views.like, name='like'),
    path('detail/<str:slug>/', views.StoreDetailView.as_view(), name='detail'),
    path('detail/<str:slug>/comment/', views.CommentListView.as_view(), name='comment'),
    path('detail/<str:slug>/comment/create/', views.comment_create, name='comment_create'),
    path('detail/<str:slug>/comment/update/<int:pk>/', views.comment_update, name='comment_update'),
    path('detail/<str:slug>/comment/delete/<int:pk>/', views.comment_delete, name='comment_delete'),
    path('create/', views.StoreCreateView.as_view(), name='store_add'),
    path('edit/<int:pk>/', views.StoreEditView.as_view(), name='store_edit'),
    path('delete/<int:pk>/', views.StoreDeleteView.as_view(), name='store_delete'),
]
```
- 가게 리스트와 상세페이지, 가게글 CRUD,(superuser만) 댓글(CRUD)를 구현할 것이다.

#### board
```python
from django.urls import path
from . import views

app_name = 'board'
urlpatterns = [
    path('', views.BoardIndex.as_view(), name='index'),
    path('detail/<str:slug>/', views.BoardDetail.as_view(), name='detail'),
    path('detail/<str:slug>/comment/create/', views.comment_create, name='comment_create'),
    path('detail/<str:slug>/comment/', views.CommentListView.as_view(), name='comment'),
    path('detail/<str:slug>/comment/create/', views.comment_create, name='comment_create'),
    path('detail/<str:slug>/comment/update/<int:pk>/', views.comment_update, name='comment_update'),
    path('detail/<str:slug>/comment/delete/<int:pk>/', views.comment_delete, name='comment_delete'),
    path('like/', views.like, name='like'),
    path('post/new/', views.BoardCreateV.as_view(), name='post_add'),
    path('post/edit/<int:pk>/', views.BoardUpdateV.as_view(), name='post_edit'),
    path('post/delete/<int:pk>/', views.BoardDeleteV.as_view(), name='post_delete'),
]
```
- 게시판 리스트와 상세페이지, 게시판 CRUD,(superuser만) 댓글(CRUD)를 구현할 것이다.
