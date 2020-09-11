---
layout: post
title: Django01 프로젝트 - 동국푸드(3) forms, views 설정
category: Django
tags: [django, python]
comments: true
---

> 결과물은 아래 링크에서 확인 가능합니다.
[깃허브](https://github.com/somefood/dongguk_food)
[결과물](http://somefood.pythonanywhere.com/)

**templates 파일들 까지 설명하고 적기에는 무리가 있기에 깃허브 파일들을 확인해 주시기 바랍니다**
[프로젝트 templates](https://github.com/somefood/dongguk_food/tree/master/templates)
[accounts](https://github.com/somefood/dongguk_food/tree/master/accounts/templates/accounts)
[store](https://github.com/somefood/dongguk_food/tree/master/store/templates/store)
[board](https://github.com/somefood/dongguk_food/tree/master/board/templates/board)

views 파일들이 실제 장고 서비스의 내용들이기에 가장 중요하다고 생각되는 부분이다. views를 하기전에 forms 파일들도 설정해주도록 하겠다. forms파일을 통해 우리는 브라우저에 form태그를 쉽게 활용할 수 있다.

# forms 설정
## accounts forms
```python
from django import forms
from django.contrib.auth.forms import UserCreationForm
from accounts.models import User


class CustomUserCreationForm(UserCreationForm):

    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('email', 'nickname', 'phone_number', )


class FindUserForm(forms.Form):
    nickname = forms.CharField(max_length=30, label='닉네임', widget=forms.TextInput(attrs=
                                                                                  {'placeholder': '닉네임을 입력해주세요.',
                                                                                   'class': 'form-control',
                                                                                   'autofocus': 'autofocus'}))
    phone_number = forms.CharField(max_length=30, label='전화번호', widget=forms.TextInput(attrs=
                                                                                       {'placeholder': '전화번호를 입력해주세요.',
                                                                                        'class': 'form-control'}))
```
- 우리는 커스텀한 유저 모델을 사용할 것이기에 CustomUserCreationForm의 내용처럼 해주어야 한다.
- FindUserForm은 유저를 검색하기 위해 사용하는 것이다. widget을 통해 input 타입과 속성값, 클래스명 들을 줄 수 있다.

## store forms
```python
from django import forms
from .models import Store, Menu, Comment
from django.forms import inlineformset_factory

MenuInlineFormSet = inlineformset_factory(Store, Menu,
                                          fields=['name', 'description', 'food_image'],
                                          extra=2)


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('text', )
        widgets = {
            'text': forms.Textarea(attrs={'class': 'form-control', 'id': 'inputComment', 'rows': '3', 'style': 'resize:none;'}),
        }
```
- store 같은 경우에는 inlineformset_factory을 사용해봤는데, 모델을 지정할 때 가게 모델과 메뉴 모델을 설정했고 이는 1:N 관계이다. 이때 위 인라인폼셋을 사용하면 가게를 작성하는 동시에 메뉴들도 입력할 수 있게 해준다.

## board forms
```python
from django import forms
from .models import UserBoard, Comment


class BoardForm(forms.ModelForm):
    class Meta:
        model = UserBoard
        fields = ('title', 'content')
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '제목을 입력해주세요.'}),
            'content': forms.Textarea(attrs={'class': 'form-control', 'id': 'post_content', 'placeholder': '내용을 입력해주세요.'}),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('text', )
        widgets = {
            'text': forms.Textarea(attrs={'class': 'form-control', 'id': 'inputComment', 'rows': '3', 'style': 'resize:none;'}),
        }
```

# views 설정
폼을 다 설정했으니 이제 views들을 설정해주면 된다.

## accounts views
```python
from django.shortcuts import render, redirect, get_object_or_404
from django.http.response import HttpResponseRedirect
from django.contrib.auth.models import User
from django.urls import reverse_lazy, reverse

import json
from django.http import HttpResponse

from django.views.generic import TemplateView, CreateView, FormView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from django.contrib.auth import views as auth_views
from .forms import CustomUserCreationForm, FindUserForm

from django.contrib.auth import logout # 로그아웃 처리하기 위해 선언


# ajax로 통신하여 비동기적으로 유저명 체크
def check_user(request):
    cUser = get_user_model()
    if not cUser.objects.filter(username=request.POST.get('user_name')).exists():
        print('possible')
        context = {'msg': True}
    else:
        print('impossible')
        context = {'msg': False}
    return HttpResponse(json.dumps(context), content_type="application/json")


# ajax로 통신하여 비동기적으로 닉네임 체크
def check_nickname(request):
    cUser = get_user_model()
    if not cUser.objects.filter(nickname=request.GET.get('user_nickname')).exists():
        print('possible')
        context = {'msg': True}
    else:
        print('impossible')
        context = {'msg': False}
    return HttpResponse(json.dumps(context), content_type="application/json")


# 유저 검색
class FindUser(FormView):
    form_class = FindUserForm
    template_name = 'accounts/find_user.html'

    def form_valid(self, form):
        nickname = form.cleaned_data['nickname']
        phone_number = form.cleaned_data['phone_number']
        cUser = get_user_model()
        context = {}
        try:
            user = cUser.objects.get(nickname=nickname, phone_number=phone_number)
        except ObjectDoesNotExist:
            context['error'] = '일치하는 아이디가 없습니다.'
        else:
            context['username'] = user.username
        return render(self.request, 'accounts/find_user_done.html', context=context)


# 로그인 하는 뷰이다. auth_views.LoginView를 활용해서 기존에 있는 기능을 활용하면 된다.
# 추가적으로 GET, POST등을 구분하는 dispatch 단계에서 유저가 이미 로그인 되어있으면 리다이렉트 되게 처리했다.
class UserLoginView(auth_views.LoginView):
    template_name = 'accounts/signin.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse('home'))
        return super().dispatch(request, *args, **kwargs)


# 회원가입뷰이다.
class UserSignUpView(CreateView):
    template_name = 'accounts/signup.html'
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('accounts:signup_done')


# 회원가입이 성공하면 이 가입 완료 뷰로 이동된다.
class UserSignUpDoneView(TemplateView):
    template_name = 'accounts/signup_done.html'


# 마이페이지 뷰이다. 기본 제공하는 LoginRequiredMixin를 활용하면 로그인 되었을 때만 이용할 수 있게 해준다.
class MyPageV(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/mypage.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        cUser = get_user_model()
        u = cUser.objects.get(username=self.request.user)
        context['mylists'] = u.userboard_set.all()
        return context


# 로그아웃 뷰
def signout(request):
    logout(request)
    return HttpResponseRedirect(reverse('home'))
```


## store views
```python
from django.core.paginator import Paginator # 페이징 처리시 사용되는 클래스
from django.shortcuts import render, get_object_or_404, redirect
from django.template.loader import render_to_string
from django.urls import reverse_lazy, reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Store, Comment
from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView, FormMixin
from .forms import MenuInlineFormSet, CommentForm
from mysite.views import AdminOnlyMixin
from django.conf import settings
import json


# 전체 가게 목록을 보여주는 뷰
class StoreIndexView(ListView):
    template_name = 'store/index.html'
    context_object_name = "store_list"
    paginate_by = 10

    def get_queryset(self):
        return Store.objects.prefetch_related('menu_set').prefetch_related('like_users').all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        paginator = context['paginator']
        page_numbers_range = 5  # Display only 5 page numbers
        max_index = len(paginator.page_range)

        page = self.request.GET.get('page')
        current_page = int(page) if page else 1
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        if end_index >= max_index:
            end_index = max_index

        page_range = paginator.page_range[start_index:end_index]
        context['page_range'] = page_range
        return context


# 카테고리별로 보여주는 뷰
class CategoryView(ListView):
    template_name = 'store/index.html'
    context_object_name = 'store_list'
    paginate_by = 10

    def get_queryset(self):
        return Store.objects.filter(category=self.kwargs['category'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        paginator = context['paginator']
        page_numbers_range = 5  # Display only 5 page numbers
        max_index = len(paginator.page_range)

        page = self.request.GET.get('page')
        current_page = int(page) if page else 1
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        if end_index >= max_index:
            end_index = max_index

        page_range = paginator.page_range[start_index:end_index]
        context['page_range'] = page_range
        return context


# 좋아요 기능이다. ajax로 비동기적으로 처리해준다.
@login_required
def like(request):
    pk = request.GET.get('pk', None)
    store = get_object_or_404(Store, pk=pk)

    if request.user in store.like_users.all():
        store.like_users.remove(request.user)
        store.like_count -= 1
        store.save()
        message = False
    else:
        store.like_users.add(request.user)
        store.like_count += 1
        store.save()
        message = True
    context = {
        'like_count': store.like_users.count(),
        'message': message,
        'nickname': request.user.nickname
    }
    return HttpResponse(json.dumps(context), content_type="application/json")


# 댓글 목록을 보여주는 기능이다. 이것도 비동기적으로 갖고오게 했다.
class CommentListView(ListView):
    model = Comment
    paginate_by = 5
    template_name = '_comment_list.html'
    context_object_name = 'comment_list'

    def get_queryset(self):
        store = get_object_or_404(Store, slug=self.kwargs['slug'])
        return store.comment_set.all()

    def get_context_data(self, *args, **kwargs):
        store = get_object_or_404(Store, slug=self.kwargs['slug'])
        context = super().get_context_data(*args, **kwargs)
        paginator = context['paginator']
        page_numbers_range = 5  # Display only 5 page numbers
        max_index = len(paginator.page_range)

        page = self.request.GET.get('page')
        current_page = int(page) if page else 1
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        if end_index >= max_index:
            end_index = max_index

        page_range = paginator.page_range[start_index:end_index]
        context['page_range'] = page_range
        context['store'] = store
        return context


# 댓글 생성 비동기 작동
@login_required
def comment_create(request, slug):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})
    store = get_object_or_404(Store, slug=slug)
    form = CommentForm(request.POST)
    if form.is_valid():
        form.instance.writer = request.user
        form.instance.store = store
        form.save()
    paginator = Paginator(store.comment_set.all(), 5)
    last_page = paginator.num_pages
    return JsonResponse({'last_page': last_page, 'authenticated': True})


# 댓글 수정, 비동기 작동
@login_required
def comment_update(request, slug, pk):
    store = get_object_or_404(Store, slug=slug)
    comment = store.comment_set.get(pk=pk)
    if comment.writer == request.user:
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            comment = form.save()
            html = render_to_string('_comment_update.html', {'store':store, 'comment': comment} )
            return JsonResponse({'is_updated': True, 'html': html})


# 댓글 삭제, 비동기 작동
@login_required
def comment_delete(request, slug, pk):
    store = get_object_or_404(Store, slug=slug)
    comment = store.comment_set.get(pk=pk)
    if comment.writer == request.user:
        comment.delete()
    return JsonResponse({'is_deleted': True})


# 상세 페에지
class StoreDetailView(DetailView):
    model = Store
    template_name = 'store/store_detail.html'
    form_class = CommentForm

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = CommentForm()
        context['comments'] = self.object.comment_set.all()
        return context


# 가게 생성, AdminOnlyMixin은 직접 만들어 준건데, 해당 글을 쓴 유저만 할 수 있다.
class StoreCreateView(AdminOnlyMixin, CreateView):
    model = Store
    fields = ['category', 'name', 'location', 'phone_number', 'description', 'store_image', 'tags', 'running_time']
    initial = {'slug': 'auto-filling-do-not-input'}
    success_url = reverse_lazy('store:index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['formset'] = MenuInlineFormSet(self.request.POST, self.request.FILES)
        else:
            context['formset'] = MenuInlineFormSet()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return redirect(self.get_success_url())
        else:
            return self.render_to_response(self.get_context_data(form=form))


# 가게글 수정
class StoreEditView(AdminOnlyMixin, UpdateView):
    model = Store
    fields = ['category', 'name', 'location', 'phone_number', 'description', 'store_image', 'tags', 'running_time']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['formset'] = MenuInlineFormSet(self.request.POST, self.request.FILES, instance=self.object)
        else:
            context['formset'] = MenuInlineFormSet(instance=self.object)
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return redirect(self.get_success_url())
        else:
            return self.render_to_response(self.get_context_data(form=form))


# 가게글 삭제
class StoreDeleteView(AdminOnlyMixin, DeleteView):
    model = Store
    success_url = reverse_lazy('store:index')
```

## board views
board의 뷰는 store랑 거의 유사하기에 따로 설명은 안달도록 하겠다.
```python
from django.core.paginator import Paginator
from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.template.loader import render_to_string
from django.urls import reverse_lazy
from .models import UserBoard, Comment
from .forms import CommentForm
from django.views.generic import ListView, DetailView
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from mysite.views import OwnerOnlyMixin
from django.views.generic import CreateView, UpdateView, DeleteView
from django.views.generic.edit import FormMixin
from django.conf import settings
from django.http import JsonResponse
import json


class BoardIndex(ListView):
    template_name = 'board/index.html'
    context_object_name = 'board_list'
    paginate_by = 10

    def get_queryset(self):
        return UserBoard.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        paginator = context['paginator']
        page_numbers_range = 5  # Display only 5 page numbers
        max_index = len(paginator.page_range)

        page = self.request.GET.get('page')
        current_page = int(page) if page else 1
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        if end_index >= max_index:
            end_index = max_index

        page_range = paginator.page_range[start_index:end_index]
        context['page_range'] = page_range
        return context


class BoardCreateV(LoginRequiredMixin, CreateView):
    model = UserBoard
    fields = ('title', 'content', 'tags')
    success_url = reverse_lazy('board:index')
    template_name = 'board/board_form.html'

    def form_valid(self, form):
        form.instance.writer = self.request.user
        return super().form_valid(form)


class BoardUpdateV(OwnerOnlyMixin, UpdateView):
    model = UserBoard
    fields = ('title', 'content', 'tags')
    template_name = 'board/board_form.html'


class BoardDeleteV(OwnerOnlyMixin, DeleteView):
    model = UserBoard
    success_url = reverse_lazy('board:index')
    template_name = 'board/board_confirm_delete.html'


class CommentListView(ListView):
    model = Comment
    paginate_by = 5
    template_name = '_comment_list.html'
    context_object_name = 'comment_list'

    def get_queryset(self):
        store = get_object_or_404(UserBoard, slug=self.kwargs['slug'])
        return store.comment_set.all()

    def get_context_data(self, *args, **kwargs):
        store = get_object_or_404(UserBoard, slug=self.kwargs['slug'])
        context = super().get_context_data(*args, **kwargs)
        paginator = context['paginator']
        page_numbers_range = 5  # Display only 5 page numbers
        max_index = len(paginator.page_range)

        page = self.request.GET.get('page')
        current_page = int(page) if page else 1
        start_index = int((current_page - 1) / page_numbers_range) * page_numbers_range
        end_index = start_index + page_numbers_range
        if end_index >= max_index:
            end_index = max_index

        page_range = paginator.page_range[start_index:end_index]
        context['page_range'] = page_range
        context['store'] = store
        return context


@login_required
def comment_create(request, slug):
    if not request.user.is_authenticated:
        return JsonResponse({'authenticated': False})
    post = get_object_or_404(UserBoard, slug=slug)
    form = CommentForm(request.POST)
    if form.is_valid():
        form.instance.writer = request.user
        form.instance.post = post
        form.save()
    paginator = Paginator(post.comment_set.all(), 5)
    last_page = paginator.num_pages
    return JsonResponse({'last_page': last_page, 'authenticated': True})


@login_required
def comment_update(request, slug, pk):
    store = get_object_or_404(UserBoard, slug=slug)
    comment = store.comment_set.get(pk=pk)
    if comment.writer == request.user:
        form = CommentForm(request.POST, instance=comment)
        if form.is_valid():
            comment = form.save()
            html = render_to_string('_comment_update.html', {'comment': comment} )
            return JsonResponse({'is_updated': True, 'html': html})


@login_required
def comment_delete(request, slug, pk):
    store = get_object_or_404(UserBoard, slug=slug)
    comment = store.comment_set.get(pk=pk)
    if comment.writer == request.user:
        comment.delete()
    return JsonResponse({'is_deleted': True})


class BoardDetail(FormMixin, DetailView):
    model = UserBoard
    form_class = CommentForm
    template_name = 'board/detail.html'

    def get_success_url(self):
        return reverse('board:detail', args=[self.object.slug])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = CommentForm()
        context['comments'] = self.object.comment_set.all()
        return context


@login_required
def like(request):
    pk = request.GET.get('pk', None)
    board = get_object_or_404(UserBoard, pk=pk)

    if request.user in board.like_users.all():
        board.like_users.remove(request.user)
        board.like_count -= 1
        board.save()
        message = False
    else:
        board.like_users.add(request.user)
        board.like_count += 1
        board.save()
        message = True
    context = {
        'like_count': board.like_users.count(),
        'message': message,
        'nickname': request.user.nickname
    }
    return HttpResponse(json.dumps(context), content_type="application/json")
```


먼저 제네릭 뷰들을 갖고 온다.
```python
# views.py
from django.views.generic import GreateView, DetailView, UpdateView, DeleteView
```

#### 참고

> DetailView의 template_name은 `앱이름_detail.html`이다.
> Createview와 Updateview template_name을 지정하지 않으면 기본적으로 `앱이름_form.html` 형태로 지정된다.
> template_name_suffix: 템플릿명의 접두사 지정, 위처럼 입력하면 `앱이름_edit_form.html`으로 접근한다.
> DeleteView의 template_name은 `앱이름_confirm_delete.html`이다.

#### Create & Update html 코드
필자는 bootstrap을 사용해서 css를 꾸미고 있는 중이라 class명을 활용을 해야한다. 그렇기 위해서 앱 하나를 설치해줄 것이다.
`pip install django-widget-tweaks`
이후 settings 파일에 앱을 추가해 주자.
`INSTALLED_ALLS += [widget_tweaks]`

```html
{% raw %}
{% extends 'base.html' %}
{% load widget_tweaks %}

{% block content %}
<form action="" method="post" enctype="multipart/form-data">
    {% csrf_token %}
    {% for field in form %}
    <div class="form-group">
        {{ field.label_tag }}
        {% render_field field class="form-control" %}
    </div>
    {% endfor %}
    <input class="btn btn-primary" type="submit" value="수정">
</form>
{% endblock %}
{% endraw %}
```
- load widget_tweaks: 위에서 설치한 앱을 로드한다.
- render_field: 필드에 대해서 커스터마이징 해준다.


### 변경 후 CBV
```python
class StoreDeleteView(DeleteView):
  model = Store
  success_url = reverse_lazy('store:index')
```


#### Delete html 코드
```html
{% raw %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<form action="" method="post">
    {% csrf_token %}
    <p>Are you sure you want to delete "{ obejct }"?</p>
    <input type="submit" value="Confirm">
</form>
</body>
</html>
{% endraw %}
```
