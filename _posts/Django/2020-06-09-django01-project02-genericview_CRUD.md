---
layout: post
title: Django01 프로젝트 - GenericView CRUD 구현
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - Django GenericView CRUD 구현
=======

지금까지 FBV기반으로 CRUD로 구현해봤는데, CBV기반으로 바꾸어 보기로 했다.

####참고 자료:
- [클래스 뷰 - 공식 사이트](https://docs.djangoproject.com/en/3.0/ref/class-based-views/generic-editing/#django.views.generic.edit.UpdateView)
- [form 관련](https://simpleisbetterthancomplex.com/article/2017/08/19/how-to-render-django-form-manually.html)

# import
먼저 제네릭 뷰들을 갖고 온다.
```python
# views.py
from django.views.generic import GreateView, DetailView, UpdateView, DeleteView
```

# CREATE

### 변경 전 FBV 기반
```python
@login_required
def post_new(request):
    template_name = 'board/board_success.html'
    if request.method == "POST":
        username = request.user
        form = BoardForm(request.POST)
        if form.is_valid():
            item = form.save(commit=False) # 유저를 저장하기 위해 commit을 미룸
            user = User.objects.get(username=username)
            item.writer = user
            item.board_save()
            message = "항목을 추가하였습니다."
            return render(request, template_name, {"message": message})
    else:
        template_name = 'board/board_form.html'
        form = BoardForm
        return render(request, template_name, {"form": form})
```

### 변경 후 CBV 기반
LoginRequiredMixin은 장고에서 제공해주는 것으로 FBV에서 사용되는 login_required와 같은 기능이다.
```python
class BoardCreateV(LoginRequiredMixin, CreateView):
    model = UserBoard
    fields = ('title', 'content', 'tags')
    success_url = reverse_lazy('board:index')
    template_name = 'board/board_form.html'

    # 폼의 writer에 현재 로그인된 유저를 저장하고 이후 진행하게 한다.
    def form_valid(self, form):
        form.instance.writer = self.request.user
        return super().form_valid(form)
```

# READ
### 변경 전 FBV 기반
```python
def post_detail(request, pk=pk):
    post = get_object_or_404(UserBoard, pk=pk)
    return render(request, 'board/board_detail', {'post', post})
```

### 변경 후 CBV 기반
```python
class BoardDetail(DetailView):
    model = UserBoard
    template_name = 'board/detail.html'
```
> DetailView의 template_name은 `앱이름_detail.html`이다.

# UPDATE

### 변경 전 FBV 기반
```python
@login_required
def post_edit(request, pk):
    post = get_object_or_404(UserBoard, pk=pk)
    if request.method == "POST":
        form = BoardForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save()
            post.save()
            return HttpResponseRedirect(reverse('board:detail', kwargs={'pk':pk}))
    else:
        form = BoardForm(instance=post)
    return render(request, 'board/board_form.html', {"form": form})
```


### 변경 후 CBV 기반
OwnerOnlyMixin은 AccessMixin이라는 클래스를 상속해서 해당 글 작성자가 접근했을 때만 이용할 수 있도록 했다.
```python
class BoardUpdateV(OwnerOnlyMixin, UpdateView):
    model = UserBoard
    fields = ('title', 'content', 'tags')
    template_name = 'board/board_form.html'
```
- fields: 모델에 있는 칼럼들 중 템플릿 form으로 사용할 것들을 지정한다. 모두 원하면 `__all__` 사용
- template_name_suffix: 템플릿명의 접두사 지정, 위처럼 입력하면 `앱이름_edit_form.html`으로 접근한다.

> 참고로 Createview와 Updateview template_name을 지정하지 않으면 기본적으로 `앱이름_form.html` 형태로 지정된다.

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

# Delete
### 변경 전 FBV
삭제는 별거 없다. 갖고와서 delete로 삭제해주면 된다.
```python
def post_delete(request, pk):
    post = get_object_or_404(UserBoard, pk=pk)
    post.delete()
    return redirect('board:index')
```

### 변경 후 CBV
```python
class StoreDeleteView(DeleteView):
  model = Store
  success_url = reverse_lazy('store:index')
```
> DeleteView의 template_name은 `앱이름_confirm_delete.html`이다.

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
