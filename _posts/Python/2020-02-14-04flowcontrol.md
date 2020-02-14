---
layout: post
title: 04 흐름 제어
category: Python
tags: [python]
comments: true
---
04 제어문
=======

##### 참고  
애스크장고  [AskDjango](https://www.askcompany.kr/)

## 조건문
if/else를 통해 참/거짓을 판별하여 흐름을 제어할 수 있다.
```Python
if 조건식:
  print("참이면 여기!")
else:
  print("거짓이면 여기!")
```

elif 추가해서 더 많은 경우로 나눌 수 있다.
```python
score = 80
if score > 80:
  print("A")
elif score > 60:
  print("B")
else:
  print("C")
```

## 반복문
Iterable(반복가능한) Object로부터 가져올 값들을 모두 가져올 때까지 반복

for 변수 in `Iterable Object`:
- 매 항목마다 수행할 코드 블록
- 반복하다가 break문을 통해 반복문을 빠져나올 수 있다.
- 또는 continue문을 통해 건너뛰고 위에서부터 진행할 수 있다.

#### 기본
```python
for i in range(20): # 0에서 19까지 순회
  print(i)
# 19까지 출력하면 더 이상 순회할기 없기에 위 반복문은 종료된다.
```
#### break
if문을 곁들여 조건에 성립하면 break하여 for문을 종료한다.
```python
for i in range(20): # 0에서 19까지 순회
  print(i)
  if i > 10: #i가 10을 초과하면 종료한다.
    break
```
#### continue
if문을 곁들여 조건에 성립하면 건너뛰고 위에서 다시 시작한다.
```python
for i in range(20): # 0에서 19까지 순회
  if i % 2 == 0: # 짝수인 숫자는 건너뛰고 다시 위에서 시작
    continue
  print(i)
```

### 중첩 반복문
이중 for문이라고도 불리는데, 2차원 리스트, 튜플 활용할 때 아주 중요하다.
```python
for i in range(2,10):
    for j in range(1,10):
        print(i, j)
        break
```
반복문 내에서의 break는 근접한 반복문만 종료시킨다.
즉, 두 번째에서 1을 출력하고 종료하고
다시 위로 올라가 i는 i+1가 되고를 반복한다.

>결과
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
gugu()
```
2 1
출력 후 종료

for문을 사용하게되면 range함수를 자주 접하게 된다.
range함수는 문법적으로는 리스트가 아니라 Iterable(순회가능한) 객체이다.

### while
while문도 for문처럼 반복을 수행한다.
```Python
while 조건:
    매 항목마다 수행할 코드 블록
```

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

#### 연습문제
2, 4, 6, 8단 구구단 출력하기
```python
# range(start,stop,step) step에 2를 입력하여 2씩 넘어간다.
for i in range(2,9,2):
	for j in range(1,10): # 1~9 곱할 수
		print(i*j, end=' ')
    # i*j 곱한 수 출력
    # end 값을 스페이스 한칸을 주어 줄바꿈을 안하고 한 칸 띄어 출력한다.
	print() # 다음 단을 위해 한 번 줄바꿈 한다.
```
