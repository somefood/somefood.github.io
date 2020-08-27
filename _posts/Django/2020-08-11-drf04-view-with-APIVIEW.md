---
layout: post
title: Django DRF - APIView를 활용한 뷰 만들기
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

## Serializer를 통한 뷰 처리
Form 처리와 유사한 방식으로 동작하지만, form 생성자의 첫번째 인자는 data이지만, Serializer 생성자의 첫번째 인자는 instance이다.

## DRF의 기본 CBV인 APIView
APIView 클래스 혹은 @api_view 장식자를 사용한다.
View에 여러 기본 속성을 부여해준다.
- renderer_classes : 직렬화 class 다수
- parser_classes: 비직렬화 class 다수
- authentication_classes: 인증 class 다수
- throttle_classes: 사용량 제한 class 다수
- permission_classes: 권한 class 다수
- content_negotiation_class: 요청에 따라 적절한 직렬화/비직렬화 class를 선택하는 class
- metadata_class: 메타 정보를 처리하는 class
- versioning_class: 요청에서 API버전 정보를 탐지하는 class

## APIView
하나의 CBV이므로 하나의 URL만 처리 가능
각 method(get, post, put, delete)에 맞게 멤버함수를 구현하면, 해당 method요청이 들어올 때 호출 아래의 과정을 거치고 나서 호출한다.
1. 직렬화/비직렬화 처리
2. 인증 체크
3. 사용량 제한 체크: 호출 허용량 범위인지 체크
4. 권한 클래스 지정: 비인증/인증 유저에 대해 해당 API호출을 허용할 것인지를 결정
5. 요청된 API 버전 문자열을 탐지하여, request.version에 저장
