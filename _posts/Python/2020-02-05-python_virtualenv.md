---
layout: post
title: 파이썬 가상환경
category: Python
tags: [python]
comments: True
---

### 가상환경을 써야하는 이유
프로젝트마다 쓰는 버전도 다르고 쓰는 패키지도 다르기 때문이다.
한 파이썬을 썼다가 버전도 꼬이고 문제가 생길 수 있기에 가상환경을 통해 버전도 나누고 패키지도 따로 관리할 수 있다.

|Project A|Project B|Project C|
|-|-|-|
|Python 3.6|Python 2.x|Python 3.7|
|Django|Numpy, Tensorflow|PyQT5|
|Web|Data Analysis|GUI APP|

```
# 생성하기
python -m venv python_basic

# 활성화하기
./activate.sh

# 비활성화하기
deactivate
```
