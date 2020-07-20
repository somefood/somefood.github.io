---
layout: post
title: Django01 프로젝트 - 쿼리셋 수정으로 성능 개선하기(Prefetch, Selected Related)
category: Django
tags: [django, python]
comments: true
---

## 문제
친구가 면접준비를 하면서 물었다. 웹 서비스를 하면서 병목이 많이 일어나는 곳이 어디가 있을까?
곰곰이 생각해보다가 답했다. "트래픽이 몰려서 네트워크에서 병목이 일어나지 않을까?" 그것도 정답이 될 수 있지만, DB 쿼리를 보내면서 많은 병목이 발생한다고 한다. 특히 나처럼 Django의 ORM을 이용하면 가장 쉽게 접하는 문제가 `django ORM N+1`이라고 한다.

먼저 ORM(Object Relation Mapper)는 객체와 관계형 데이터베이스의 데이터를 자동으로 매핑해주는 것이다. 즉, 객체를 통해 DB의 데이터를 다룰 수 있는 것이다. 이것을 통해 DB를 사용할 줄 몰라도 우리는 DB를 제어하고 사용할 수 있던 것이다. 하지만 ORM은 `Lazy-Loading` 방식을 사용하는데, 우리가 명령을 실행하면 바로 데이터를 가져오는 것이 아니라 실제 데이터를 불러와야 할 때 쿼리를 실행하는 방식이다. 이렇게 하다보니 쿼리 1번으로 N건의 데이터를 가져왔는데, 여기서 또 원하는 데이터를 얻기 위해선 N건의 데이터 수 만큼 반복해서 2차적으로 쿼리를 수행하면서 성능 저하의 문제가 생기는 것이다.

이것을 개선하기 위해서 `Eager-Loading`방식을 사용하면 된다. 이 방식은 사전에 쓸 데이터를 포함하여 쿼리를 날리기 때문에 쿼리를 많이 줄일 수 있다. 이때 사용되는 메소드로 `prefetch_related`와 `selected_related`가 있다.

## 이 두개가 무엇일까
- selected_related는 ForeignKey(1:N에서 N부분)와 OneToOneField 관계에서 활용할 수 있다. 이 메소드를 활용하면 DB단에서 INNER JOIN으로 쿼리한다.
- prefetch_related는 ForeignKey(1:N에서 1부분)와 ManyToManyField에서 활용할 수 있다. 이 메소드는 각 관계 별로 DB쿼리를 수행하고, 파이썬 단에서 조인을 수행한다.


## 적용 전
로컬에서 debug_toolbar를 활성화한채 페이지를 왔다갔다 하면서 몇개의 쿼리가 오고가는지 한 번 봐보았다. 인덱스 페이지에서 가게와 메뉴, 좋아요의 테이블을 쿼리하는것인데 44개의 쿼리와 20개의 중복되는 부분이 있는 것이다.
![많은 쿼리](/assets/post_img/django/query/duplicate.png)

## 적용 후
해당 view의 get_queryset메소드를 아래와 같이 변경했다.
```python
def get_queryset(self):
    return Store.objects.prefetch_related('menu_set').prefetch_related('like_users').all()
```
![쿼리 수정](/assets/post_img/django/query/other_problem.png)

아래와 같이 쿼리수는 줄은 것을 볼 수 있다! 하지만 아래를 보면 다른 중복 문제가 발생하여서 템플릿 파일의 코드를 살펴 보았다.
```html
{% raw %}
{% if store.menu_set.first.food_image %}
  {% thumbnail store.menu_set.first.food_image "370x250" crop="center" as im %}
    <img class="card-img-top" src="{{ im.url }}" alt="">
  {% endthumbnail %}
{% else %}
    <img class="card-img-top" src="{% static 'img/alt_image.png' %}" style="width:100%; height: 255px;">>
{% endif %}
{% endraw %}
```
위의 if의 조건문이 문제였는데, 가게 메뉴에서 첫 번째 레코드를 불러올려다 보니 다시 쿼리가 발생했던 것이다. 이 문제는 아래와 같이 forloop.first를 이용해서 해결해보았다. 이 부분은 데이터가 많이 없을 때는 문제가 없을거 같지만, 많아지면 서버쪽에서 부하가 올 수도 있으니 쿼리셋에 대해 더 이해해서 봐꿔봐야겠다. 어찌됐건 쿼리는 6개로 대폭 줄이는 경험을 할 수 있었다!

```html
{% raw %}
{% for menu in store.menu_set.all %}
  {% if forloop.first %}
    {% thumbnail menu.food_image "370x250" crop="center" as im %}
      {% if im.url %}
          <img class="card-img-top" src="{{ im.url }}" alt="">
      {% else %}
          <img class="card-img-top" src="{% static 'img/alt_image.png' %}" style="width:100%; height: 255px;">>
      {% endif %}
    {% endthumbnail %}
  {% endif %}
{% endfor %}
{% endraw %}
```

![쿼리 수정](/assets/post_img/django/query/solved.png)
