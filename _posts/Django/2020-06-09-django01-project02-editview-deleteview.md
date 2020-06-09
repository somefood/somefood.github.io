---
layout: post
title: Django 실전 정리
category: Django
tags: [django, python]
comments: true
---

Django UpdateView와 DeleteView 사용
=======

지금까지는 FBV 기반으로 수정과 삭제를 해보았는데, 계속 공부해보면서 UpdateView와 DeleteView를 사용해서 수정과 삭제를 진행해 보았다.

둘다 `django.views.generic.edit`에 위치한다.

####참고 자료:
- [클래스 뷰 - 공식 사이트](https://docs.djangoproject.com/en/3.0/ref/class-based-views/generic-editing/#django.views.generic.edit.UpdateView)
- [form 관련](https://simpleisbetterthancomplex.com/article/2017/08/19/how-to-render-django-form-manually.html)

## import
```python
# views.py
from django.views.generic.edit import UpdateView, DeleteView
```

## UpdateView 사용
#### 파이썬 코드
```python
class StoreEditView(UpdateView):
    model = Store
    fields = ['name', 'location', 'phone_number', 'description', 'store_image']
    template_name_suffix = '_eidt_form'
```
- fields: 모델에 있는 칼럼들 중 템플릿 form으로 사용할 것들을 지정한다. 모두 원하면 `__all__` 사용
- template_name_suffix: 템플릿명의 접두사 지정, 위처럼 입력하면 `앱이름_edit_form.html`으로 접근한다.

#### html 코드
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

## DeleteView 사용
#### 파이썬 코드
```python
class StoreDeleteView(DeleteView):
  model = Store
  success_url = reverse_lazy('store:index')
```

#### html 코드
```html
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
```

## urls 추가
```python
path('edit/<int:pk>', views.StoreEditView.as_view(), name='edit'),
path('delete/<int:pk>', views.StoreDeleteView.as_view(), name='delete'),
```
