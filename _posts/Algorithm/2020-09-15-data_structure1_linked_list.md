---
layout: post
title: 자료구조1 - 연결리스트(linked list)
category: Algorithm
tags: [algorithm, python, js]
comments: true
---

참고
> [제로초](https://www.zerocho.com/category/Algorithm/post/58008a628475ed00152d6c4d)님
[초보몽키](https://wayhome25.github.io/cs/2017/04/17/cs-19/)님

## 자료구조
먼저, 자료구조는 데이터의 표현 및 저장 방법을 의미하고, 알고리즘은 그 저장된 데이터를 처리하는 과정이다. 물론 우리는 알고리즘을 풀 때, 배열이라는 좋은 자료구조를 이용해서 풀고 있지만 자료구조에 대해서 일부 알아둬야 하는 것이 좋다.

## 연결리스트
자료구조의 가장 기본적인 형태이다. 연결 리스트는 여러개의 **노드**로 연결되어 있는 형태이고 각각의 노드는 데이터와 다음 노드가 무엇인지 알려주는 주소를 가지고 있는다. 그리고 새로운 데이터를 추가하거나, 위치 찾기, 제거기능이 있어야 한다.

## 노드의 기본적인 형태
파이썬에서 클래스를 활용해 노드를 다음과 같이 정의할 것이다.
```python
class Node:
    def __init__(self, data):
      self.data = data
      self.next = None
```
data와 next를 가지는 형태로 정의했다.


## 파이썬 예시
```python


```

## 느낀점
재귀함수 부분인 `merge(merge_sort(left), merge_sort(right))`에서 첫번째 인자 부분의 재귀를 먼저 처리하고 이후에 두번째 재귀를 처리함을 알 수 있게 되었다. 근데 재귀는 정말 헷갈리는거 같다..
