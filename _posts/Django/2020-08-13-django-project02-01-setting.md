---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(1)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# 프로젝트 생성 및 기본 환경 설정
이전에 장고로만 페이지를 구축했다면 이번에는 리액트와 함께 프로젝트를 설정하려고 한다.

## 설치
우리가 필요한 것은 django와 react 패키지들을 설치하고 설정해줘야한다.
### Django
사전에 파이썬 가상환경을 하나 생성해서 거기서 설치해주도록 하자
- pip install
> django
django-debug-toolbar (개발용에서 디버깅하기 좋다)

이후 프로젝트 하나를 생성해준다.
- django-admin startproject backend

### react
먼저 node.js를 설치해준 후, npm install --global yarn을 해준 후 아래처럼 입력해 react를 설치해 주자
yarn
> create react-app frontend (frontend는 원하는 이름으로 변경 가능)
