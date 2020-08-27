---
layout: post
title: Django DRF - JSON 직렬화
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

파이썬에서 제공하는 JSON과 DRF JSON을 봐보도록 하겠다.

## 직렬화(Serialization)
모든 프로그래밍 언어의 통신에서 데이터는 필히 문자열로 표현되어야만 한다.
- 송신자: 객체를 문자열로 변환하여 데이터 전송 -> 직렬화
- 수신자: 수신한 문자열을 다시 객체로 변환하여 활용 -> 비직렬

각 언어에서 모두 지원하는 직렬화 포맷 (JSON XML 등)이 있고, 특정 언어에서만 지원하는 직렬화 포맷(Python - Pickle)이 있다. 근데 결국 JSON을 많이 사용한다고 한다.

## JSON포맷과 PICKLE 포맷
JSON 포맷
- 다른 언어/플랫폼과 통신할 때 주로 사용
- 표준 라이브러리 json 제공
- pickle에 비해 직렬화를 지원하는 데이터타입의 수가 적지만, 커스텀 Rule 지정이 가능하다.

PICKLE 포맷
- 파이썬 전용 포맷으로 파이썬 시스템끼리만 통시할 때 사용 가능
- 표준 라이브러리 pickle 제공

> 공통점으로는 둘다 쿼리셋에 대해서는 비/직렬화 할 수 없는 것이다. 그렇기에 특정 Rule을 만들어서 사용해줘야 한다.

## DjangoJSONEncoder를 통해 추가로 부여된 Rule
위를 사용하면 아래의 타입에 대한 Rule을 추가로 사용할 수 있다.
- datetime.datetime, datetime.date, datetime.time, datetime.timedelta
- decimal.Decimal, uuid.UUID, Promise

> 하지만 이것도 쿼리셋에 대해 해결하는 방법은 아닌 것이다. 그럼 어떻게 해야할까

### 방법1 - 직접 변환
다음처럼 직접 딕셔너리로 만들어서 변환해준다.
```Python
data = [
  {'id': post.id, 'title': post.tile}
  for post in Post.objects.all()
]
json.dumps(data, cls=DjangoJSONEncoder, ensure_ascill=False) # 두번째 키인자는 사실 필요없다. 기본 json으로 하는 것이라서.
```

### 방법2 - 직접 변환 Rule 지정하기
방법1처럼 직접할 수 있지만, 늘어나는 view마다 해줘야할 수도 있기에 힘든 방법이다. 그렇기에 커스텀 Rule을 만들어 줘서 사용해주자.
```Python
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.query import QuerySet

class MyJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, QuerySet):
            return tuple(ojb)
        elif isinstance(obj, Post):
            return {'id': obj.id, 'title': obj.title, 'content': obj.content}
        elif hasattr(obj, 'as_dict'):
            return obj.as_dict()
        return super().default(obj)
data = Post.ojbects.all()

# 직렬화할 때, 직렬화를 수행해줄 JSON Encoder를 지정해준다.
json.dumps(data, cls=MyJSONEncoder, ensure_ascill=False)
```

## rest_framework.renderer.JSONRender
rest_framework/utils/encoders.py의 JSONEncoder를 통한 직렬화
- 장고의 DjangoJSONEncoder를 상속받지 않고, json.JSONEncoder 상속을 통해 구현
- datetime.datetime/date/time/timedelta, decimal.Decimal, uuid.UUID, sixoniary_type
- \_\_getitem\_\_ 속성을 지원할 경우 dict(obj)변환
- \_\_iter\_\_ 속성을 지원할 경우, tuple 변환
- QuerySet 타입일 경우, tuple 변환
- .tolist 속성을 지원할 경우, obj.tolist()반환
> Model 타입은 미지원 -> ModelSerializer를 통해 변한한다.

## rest_framework.renderer.JSONRenderer
json.dumps에 대한 래핑 클래스 -> 보다 편리한 직렬화를 지원한다.
UTF8  인코딩도 추가로 수행한다.
```Python
from rest_framework.renderers import JSONRenderer

data = Post.objects.all()
JSONRenderer().render(data) # 이또한 Model 객체는 질결화가 없다.
```

##  ModelSerializer 사용
```Python
from rest_framework.serializers import ModelSerializer

# Post모델에 대한 ModelSerializer 정의
class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

post = Post.objects.first() # Post 타입
 serializer = PostSerializer(Post.objects.all(), many=True) # 다수일 때는 뒤에 many=True 키워드 인자를 넣어주자.
serializer = PostSerializer(post)
serializer.data # ReturnDict 타입

# 이후 json으로 변환가능하다.
import json
json_str_string = json.dumps(serializer.data, ensure_ascii=False)

# DRF에서 지원하는 JSON 변환 활용
from rest_framework.renderers import JSONRenderer
json_utf8_string = JSONRenderer().render(serializer.data)
```

## 장고 기본 View에서의 HttpResponse JSON 응답
모든 View는 HttpResponse 타입의 응답을 해야만 한다.
아래의 2가지 방법을 이용한다.
1. 직접 json.dumps를 통해 직렬화된 문자열을 획득하여 HttpResponse를 통해 응답
2. 1번을 정리하여 JsonResponse 지원 -> 내부적으로 json.dumps를 사용하며 DjangoJSONEncoder가 디폴트로 지정되어있다.

## DRF를 통한 HttpResponse JSON 응답
DRF Response를 활용한다.
```Python
qs = Post.objects.all()
serializer = PostSerializer(qs, many=True)

from rest_framework.response import Response
response = Response(serializer.data) # Content-Type: text/html 디폴트 지정
```

> Response에서는 "JSON 직렬화"가 Lazy하게 동작한다.
실제 응답 생성시에, rendered_content 속성에 접근하며, 이때 변환이 이뤄진다.

## 실제 DRF Serializer 활용

```Python
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['username', 'email']


class PostSerializer(serializers.ModelSerializer):
    # username = serializers.ReadOnlyField(source='author.username')
    author = AuthorSerializer()

    class Meta:
        model = Post
        fields = [
            'pk',
            'author',
            'message',
            'created_at',
            'updated_at'
        ]

class PublicPostListAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

```
