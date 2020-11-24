---
layout: post
title: 자료구조 - Stack
category: Algorithm
tags: [algorithm, python, js]
comments: true
---

> [제로초](https://www.zerocho.com/category/Algorithm/post/5800b79e1dfb250015c38db6)님의 강의를 보고 실습해보았습니다.

## Stack(스택)

스택은 LIFO(Last-In-First-Out)구조로 마지막에 들어온게 처음으로 나가는 구조이다.


## 파이썬 예시
```python
def merge_sort(arr):
    if len(arr) < 2: return arr
    pivot = len(arr) // 2
    left = arr[0:pivot]
    right = arr[pivot:]
    return merge(merge_sort(left), merge_sort(right))


def merge(left, right):
    result = []
    while len(left) and len(right):
        if left[0] <= right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))

    while len(left): result.append(left.pop(0))
    while len(right): result.append(right.pop(0))
    return result


print(merge_sort([5, 2, 4, 7, 6, 1, 3, 8]))

```

## 느낀점
재귀함수 부분인 `merge(merge_sort(left), merge_sort(right))`에서 첫번째 인자 부분의 재귀를 먼저 처리하고 이후에 두번째 재귀를 처리함을 알 수 있게 되었다. 근데 재귀는 정말 헷갈리는거 같다..
