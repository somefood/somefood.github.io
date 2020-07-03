---
layout: post
title: Django01 프로젝트 - 좋아요 기능 구현
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - 좋아요 기능 구현
=======

AJAX를 사용해서 좋아요 기능을 구현해 보았다.


## models
좋아요는 여러 유저가 여러 포스트에 각각 누르는 형식이니 ManyToManyField로 구성해줘야 한다.
이후 개수를 카운트 하기 위해 아래에 PositiveIntegerField를 추가했다.
```python
like_users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='like_boards')
like_count = models.PositiveIntegerField(default=0)
```

## Ajax 없이 구현해보기
한 번 Ajax없이 구성도 해보았다.

### urls
```python
path('<int:pk>/like/', views.like, name='like'),
```

### views
post.like_users를 통해 해당 게시물에 유저가 있는지 확인하고, 있으면 제거하고 없으면 넣어주는 형식이다.
```python
def like(request, pk):
    post = get_object_or_404(Userboard, pk=pk)
    if request.user in post.like_users.all():
        post.like_users.remove(request.user)
    else:
        post.like_users.add(request.user)
    return redirect(store.get_absolute_url())
```

## Ajax로 구현해보기
먼저 jQuery를 이용해서 스크립트를 만들어 준다.
선택자는 button태그에 like가 포함된 엘레먼트들을 고르게 해줬다.
이렇게 사용한 이유는, 아래 코드를 js파일로 저장해서 로드해서 사용하기 위해서다.
현재 내 프로젝트는 가게와 게시판 기능이 있는데, 각각 사용하기 위해서이다.
이렇게 하면 js파일에선 템플릿 변수를 사용못하기 때문에 script태그 안에 내가 사용할 변수들을 MyGlobal에 저장해 주었다.

### JavaScript
```JavaScript
{% raw %}
<script>
    var MyGlobal = {
        url: "{% url 'board:like' %}",
    }
</script>
$("[class*=like]").click(function () {
    var pk = $(this).attr('post-id')
    $.ajax({
        type: "GET",
        url: MyGlobal.url,
        data: {'pk': pk},
        dataType: "json",
        success: function (response) {
            $("#count-" + pk).html(response.like_count + "개");
            var users = $("#like-user-" + pk).text();
            if (response.message) {
                $('#like-heart-'+pk).removeClass('far fa-heart').addClass('fas fa-heart');
            } else {
                $('#like-heart-'+pk).removeClass('fas fa-heart').addClass('far fa-heart');
            }
        },
        error: function (request, status, error) {
            alert("로그인이 필요합니다.")
            window.location.replace("/accounts/login/")
        }
    })
});
{% endraw %}
```

### views
json 형태로 반환해주기 위해 아래의 두 모듈을 import 해준다.
```python
from django.http import HttpResponse
import json

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
    }
    return HttpResponse(json.dumps(context), content_type="application/json")
```

### html
```html
{% raw %}
<a href="{% url 'store:like' store.pk %}">
    {% if user in store.like_users.all %}
    <a href="{% url 'store:like' store.pk %}"><i class="fas fa-heart"></i></a>
    {% else %}
    <a href="{% url 'store:like' store.pk %}"><i class="far fa-heart"></i></a>
    {% endif %}
    <p class="card-text">
        {{ store.like_users.count }} 명이 좋아합니다.
    </p>
</a>
{% endraw %}
```
