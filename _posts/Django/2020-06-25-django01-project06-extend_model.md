---
layout: post
title: Django01 프로젝트 - 모델 추가하기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - 모델 추가하기
=======

친구에게 만들고 있는 사이트에 피드백을 받았는데, 많이 부족함을 느꼈다. 이 사이트를 사용하는 사용자 관점에서 바라보라고. 처음 내 사이트 의중이 동국대 주변 가게들을 소개하는 거였고, 부가적으로 자유게시판 기능을 추가해서 사람들끼리 내용 공유를 하려는 것이다. 일단 메인은 `가게 소개`인 것이니, 이것에 초점을 두어야 한다고 다시 생각하게 되었다. 그렇기에 모델부터 조금씩 수정해보고자 한다.

## 카테고리 추가
가게에도 여러 업종이 있다. 이것을 크게 '음식집', '술집', '카페' 정도의 카테고리로 분류를 하는 것이 좋을 거 같다.

### store.models 파일 수정
정해진 카테고리에서만 저장할 것이기에 choices 필드 옵션을 사용하기로 했다.
아래 CATEGORIES처럼 이중 튜플을 만들어 주고, 각 튜플마다 첫 번째는 DB에 사용될 값과, form 위젯에서 사용될 값을 적어준다.
마지막으로 맨 아래와 같이 CharField에 choices=CATEGORIES를 적어주면 된다.
```python
class Store(models.Model):
    CATEGORIES = (
        ('restaurant', '음식집'),
        ('bar', '술집'),
        ('cafe', '카페'),
    )
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
    category = models.CharField(max_length=10, choices=CATEGORIES)
```

## store.urls 파일 수정
아래 내용을 urlpatterns에 추가했다.
```python
    path('<str:category>/', views.CategoryView.as_view(), name='categories'),
```

## store.views 파일 수정
template 파일은 기존꺼를 활용하면 된다.
```python
class CategoryView(ListView):
    template_name = 'store/index.html'
    context_object_name = 'store_list'

    def get_queryset(self):
        return Store.objects.filter(category=self.kwargs['category'])
```

## 홈페이지 클래스 뷰 수정
카테고리별로 하나씩 보여주기 위해서 filter로 갖고 온 후, 슬라이스 처리했다.
```python
class HomePageView(TemplateView):

    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['store_list'] = Store.objects.filter(category='restaurant')[:1] | \
                                Store.objects.filter(category='bar')[:1] | \
                                Store.objects.filter(category='cafe')[:1]

        return context
```
