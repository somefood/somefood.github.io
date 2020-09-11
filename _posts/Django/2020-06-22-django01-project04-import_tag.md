---
layout: post
title: Django01 프로젝트 - 동국푸드(4) 태그 구현하기
category: Django
tags: [django, python]
comments: true
---


> 결과물은 아래 링크에서 확인 가능합니다.
[깃허브](https://github.com/somefood/dongguk_food)
[결과물](http://somefood.pythonanywhere.com/)

태그는 우리가 이미 많은 SNS나 글들을 볼때, 이용중이다. 태그를 눌러서 관련된 게시글을 찾을 때 아주 좋은 기능이다. 친절한 Django에서는 이 Tag 패키지가 있기에 이것을 사용해 보았다.

## 태그용 패키지 설치
```python
pip install django-taggit
pip install django-taggit-templatetags2
```

## settings 파일에 등록
```python
INSTALLED_APPS += [
		'taggit',
		'taggit_templatetags2'
]
# 태그 이름에 대소문자를 구문하지 않는다는 항목
TAGGIT_CASE_INSENSITIVE = True

# 태그 클라우드에 나타나는 태그 최대 개수 지정
TAGGIT_LIMIT = 50
```

## model 파일 수정
- taggit앱을 import 해서 TaggableManager 매니저를 정의한다.
- tags 컬럼을 TaggableManager로 정의한다. ManyToManyField및 models.Manager 역할을 동시에 한다고 한다. null=True 디폴트로 지정.
```python
from taggit.managers import TaggableManager # 매니저 정의

class UserBoard(models.Model):

    tags = TaggableManager(blank=True) # 추가
```

## admin 파일 수정
- **list_display에 'tag_list' 추가**: TaggableManager 클래스는 list_display 항목에 직접 등록할 수 없어서 아래에 메소드로 정의해서 등록해준다.
- **get_queryset 메소드 오버라이딩**: ManyToManyField 관계의 Tag 테이블의 관련 레코드를 한 번의 쿼리로 미리 가져오기 위해 정의. N:N관계의 성능을 높이기 위해 뒤에 prefetch_related() 메소드 사용.
- **tag_list 메소드 정의**: tag_list 항목에 보여줄 내용 정의. 각 태그의 name필드를 보여줌.
```python
@admin.register(UserBoard)
class UserBoardAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'content', 'modified_dt', 'tag_list')
    list_filter = ('modified_dt',)
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('tags')

    def tag_list(self, obj):
        return ', '.join(o.name for o in obj.tags.all())
```

## urls 등록
```python
path('tag/', views.TagCloudTV.as_view(), name='tag_cloud'),
path('tag/<str:tag>/', views.TaggedObjectLV.as_view(), name='tagged_object_list'),
```

## views 작성
```python
from django.views.generic import TemplateView

class TagCloudTV(TemplateView):
    template_name = 'taggit/taggit_cloud.html'


class TaggedObjectLV(TemplateView):
    template_name = 'taggit/taggit_post_list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        store = Store.objects.filter(tags__name=self.kwargs.get('tag'))
        board = UserBoard.objects.filter(tags__name=self.kwargs.get('tag'))

        context['store_list'] = store
        context['board_list'] = board
        context['tagname'] = self.kwargs['tag']
        return context
```

## template 파일 작성
```html
{% raw %}
{% extends "base.html" %}
<!-- tag_cloud.html -->
{% block content %}

<div class="taggit-cloud">
    {% load taggit_templatetags2_tags %}
    {% get_tagcloud as tags %}
    {% for tag in tags %}
    <span class="tag-{{tag.weight|floatformat:0}}">
        <a href="{% url 'helpers:tagged_object_list' tag.name %}">{{tag.name}}({{tag.num_times}})</a>
    </span>
    {% endfor %}
</div>
{% endblock %}

<!-- taggit_post_list.html -->
{% extends "base.html" %}

{% block content %}
<h1>Posts for tag - {{ tagname }}</h1>
<br>
{% for store in store_list %}
<a href="{{ store.get_absolute_url }}">{{ store.name }}</a>
{% endfor %}

{% for board in board_list %}
<a href="{{ board.get_absolute_url }}">{{ board.title }}</a>
{% endfor %}
{% endblock %}
{% endraw %}
```
