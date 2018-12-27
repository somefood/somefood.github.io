---
layout: post
title: 흐름 제어
category: Python
tags: [python]
comments: true
---

참고  
애스크장고  [AskDjango](https://www.askcompany.kr/)

# 조건문
if/elif/else를 통해 참/거짓을 판별하여 흐름을 제어할 수 있다.



# 반복문
Iterable Object로부터 가져올 값들을 모두 가져올 때까지 반복

for 변수 in 리스트:
  매 항목마다 수행할 코드 블록
반복하다가 break문을 통해 반복문을 빠져나올 수 있다.
ex)
```python
for i in range(20):
  print(i)
  if i > 10: #i가 10을 초과하면 종료한다.
    break
```
### 중첩 반복문
```python
for i in range(2,10):
    for j in range(1,10):
        print(i, j)
        break
```
반복문 내에서의 break는 근접한 반복문만 종료시킨다.  

결과
2 1
3 1
4 1
5 1
6 1
7 1
8 1
9 1

중첩 반복문을 한 번에 종료시키려면, 예외를 발생시키거나 함수 내에서 return문을 발생시켜야 한다.
```python
def gugu():
    for i in range(2,10):
        for j in range(1,10):
            print(i, j)
            return None
```
gugu()
2 1
출력 후 종료

for문을 사용하게되면 range함수를 자주 접하게 된다.
range함수는 문법적으로는 리스트가 아니라 Iterable(순회가능한) 객체이다.

### while
while문도 for문처럼 반복을 수행한다.
while 조건:
    매 항목마다 수행할 코드 블록
```python
i = 0
while i < 20:
    print(i)
    if i > 10:
        break
    i += 1
```
반복문은 무한 루프를 구성 시 용이하다.
반복문 조건을 항상 True로 하면 된다.
```python
while True:
    if로 특정 조건을 충족하면 break로 종료하면 된다.
```

for문에서 무한루프를 원한다면, itertools.count 함수를 통해 호출한다.
```python
from itertools import count

for i in count(1):
    print(i)
    if i > 60:
        break
```
i는 1부터 증가한다.

연습문제
2, 4, 6, 8단 구구단 출력하기
```python
for i in range(2,9,2): # range(start,stop,step) step에 2를 입력하여 2씩 넘어간다.
	for j in range(1,10): # 1~9 곱할 수
		print(i*j, end=' ') # i*j 곱한 수 출력, end 값을 스페이스 한칸을 주어 줄바꿈을 안하고 한 칸 띄어 출력한다.
	print() # 
```

