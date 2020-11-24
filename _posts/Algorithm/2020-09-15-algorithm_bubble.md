---
layout: post
title: 버블 정렬
category: Algorithm
tags: [algorithm, python, js]
comments: true
---

> [제로초](https://www.zerocho.com/category/Algorithm/post/57f67519799d150015511c38)님의 강의를 보고 실습해보았습니다.

## 버블 정렬

버블정렬은 단순하다. 처음부터 인접한 두 수를 비교해서 바꿔주면 된다. 예시로 [5, 1, 7, 4] 같은 배열이 있으면,
1. 1과 5를 비교해서 크니 바꿔준다. [1, 5, 7, 4]
2. 5는 7보다 작으니 둔다. [1, 5, 7, 4]
3. 7이 4보다 크니 바꿔준다. [1, 5, 4, 7]
4. 1은 5보다 작으니 둔다. [1, 5, 4, 7]
5. 5와 4를 비교해서 5가 크니 바꿔준다. [1, 4, 5, 7]

이런 식이다. 계속 처음부터 돌아가 두 수를 비교해야 하니 비효율 적이고 O(n^2)에 속할 정도로 안좋다. 하지만, 이런 정렬도 있음을 알기 위해 해보자.


## 파이썬 예시
```python
def bubble_sort(arr):
    for i in range(len(arr)):
        for j in range(1, len(arr)-i):
            if arr[j-1] >= arr[j]:
                arr[j-1], arr[j] = arr[j], arr[j-1]
    return arr


print(bubble_sort([5, 1, 7, 4, 6, 3, 2, 8]))
```

두번째 반복문에 -i 를 넣어준 이유는 맨 마지막은 최종적으로 확정된 숫자기 때문에, 굳이 안돌리기 위해서 추가한 것이다.

## 느낀점
비효율적인 정렬이라지만, 이해하기는 가장 좋은 정렬인거 같고 설명대로 교육용으로 입문하긴 좋은거 같다.
