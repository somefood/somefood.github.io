---
layout: post
title: 합병 정렬
category: Algorithm
tags: [algorithm, python, js]
comments: true
---

> [제로초](https://www.zerocho.com/category/Algorithm/post/57ee1fc107c0b40015045cb4)님의 강의를 보고 실습해보았습니다.

## 합병 정렬

이번엔 합병 정렬에 대해 알아보겠다.
합병 정렬은 O(NlogN)의 복잡도를 가진 정렬로 준수한 성능을 가졌다고 한다. 다만, 30개 이하일 때는 삽입정렬이랑 별 차이가 없다고 한다. 합병 정렬은 분할 정복 알고리즘에 속하는데, 폰 노이만에 의해 개발되었다고 한다. 분할 정복이란 어떤 문제를 그대로 해결할 수 없을 때, 작은 문제로 분할해서 푸는 방법이다.

이 합병 정렬은 배열을 두 개로 나누고, 나눈 것을 다시 두개로 계속 나눠 정렬 한다. 이를 위해 재귀함수를 이용해서 계속 쪼개주고 쪼갤 수 없을 때까지 나눈 후, 좌 우 비교해서 큰 것을 새로운 배열에 입력해준다. 이 때 새로운 배열이 필요하기에 새로운 메모리가 요구되기도 한다.


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
