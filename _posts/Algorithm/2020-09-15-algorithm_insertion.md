---
layout: post
title: 삽입정렬
category: Algorithm
tags: [algorithm, python, js]
comments: true
---

> [제로초](https://www.zerocho.com/category/Algorithm/post/57e39fca76a7850015e6944a)님의 강의를 보고 실습해보았습니다.

기초적인 정렬 중 하나인 삽입 정렬에 대해 알아보겠다.
삽입 정렬은 두 번째 숫자부터 이전의 숫자를 비교해서 정렬하는 방법이다.

## 예시
1. [5, 6, 1, 2, 4, 3]
처음의 배열 예시이다.
2. [5, **6**, 1, 2, 4, 3]
앞의 5와 비교하는데 5보다 크기 때문에 그냥 그 자리에 둔다.
3. [5, 6, **1**, 2, 4, 3]
1은 앞의 5, 6보다 작기 때문에 5, 6 앞에 넣어준다.
4. [1, 5, 6, **2**, 4, 3]
2는 1보다는 크고, 5와 6보다는 작기 때문에 그 사이에 넣어준다.
5. [1, 2, 5, 6, **4**, 3]
마찬가지 과정으로 1,2와 5,6 사이에 넣어준다.
6.[1, 2, 4, 5, 6, **3**]
마지막으로 1,2와 4,5,6 사이에 3을 넣고, 다음 숫자가 없으므로 종료한다.

이렇게 하면 [1, 2, 3, 4, 5, 6] 정렬이 완료된다.

```python
def insertion_sort(arr):
    temp = 0
    for i in range(1, len(arr)):
        temp = arr[i]
        for j in range((i-1), -1, -1):
            if arr[j] > temp:
                arr[j+1] = arr[j]
            else:
                continue
            arr[j] = temp
    return arr


print(insertion_sort([5, 6, 1, 2, 4, 3]))
```
