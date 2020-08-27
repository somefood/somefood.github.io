---
layout: post
title: Django DRF - Throttling (최대 호출 횟수 제한하기)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

## 장고의 Cache 지원
- Memcached 서버 지원: django.core.cache.backends.MemcachedCache
- 데이터베이스 캐시(비추): django.core.cache.backends.DatabaseCache
- 파일시스템 캐시(비추): django.core.cache.backends.FileBasedCache
- 로컬 메모리 캐시(장고서버가 재시작 되면 다 날라간다): django.core.cache.backends.LocMemCache
더미 캐시: django.core.cache.backends.dummy.DummyCache
- redis를 활용하는 방법도 있다.
