---
layout: post
title: print함수 정리
category: Python
tags: [python]
comments: True
---

# print 함수 정리

- 가장 기본적인 출력 함수
- Seperator, End 옵션 사용
- Fromat 형식 출력


```python
# 기본 출력 결과 같음
print('Hello python') #작은 따옴표
print("Hello python") #큰 따옴표

# 세개로 묶으면 여러줄을 출력할 수 있다.
print("""Hello python""") # 새개로 묶기
print('''Hello python''') # 세개로 묶기
```

## seperator  옵션 사용

`print(3, 4)` 이런식으로 입력하면 결과로는
> 3 4

다음과 공백으로 나눠진다.
print의 sep 키워드를 활용하면 공백 대신에 다른 문자를 삽입할 수 있다.

```python
print(3, 4, sep=',')
```
> 3,4

```python
print('test', 'gmail.com', sep='@')
```
> test@gmail.com

## end 옵션 사용

C언어와 달리 파이썬의 `print()`는 기본적으로 출력 후 다음줄로 이동된다. 기본적으로 끝에 \\n 이 포함되기 때문이다.
이것은 `end` 옵션을 사용하여 변경할 수 있다.
##### end 옵션 사용 전
```python
print(3)
print(4)
```
> 3
4

##### end 옵션 사용 후
```python
print(3, end='') # end 값으로 원하는 값 삽입 가능
print(4, end='')
```
> 34

## format 사용
유동적인 값을 출력하는 기능으로 `format` 함수가 있다.

```python
print('{} and {}'.format('test', 'best'))
# 중괄호에 맞게끔 인자를 줘야한다.
# 순서에 맞게 표시가 된다.
```
> test and best

번호를 추가하여 순서를 줄 수도 있다.
```python
print('{0} and {1} and {0}'.format('a', 'b'))
# 0과 1 2개의 숫자만 있기에 format함수 안에는 2개의 인자만 넣어야 한다
```
> a and b and a

숫자가 아닌 키값으로도 할 수 있다.
```python
print("{a} are {b}".format(a='You', b = 'Me'))
# a에 You b는 Me 할당
```
> You are Me

##### `%s, %d, %f` 포맷팅 사용
> %s : 문자
%d : 정수
%f : 실수

```python
print("%s's number: %d" % ('serven', 7))
```
> seven's number: 7

```python
print("Test1: {0: 5d}, Price: {1: 4.2f}".format(776, 6543.123))
# 정수는 다섯자리로 표시, 실수는 소수점 둘째자리까지만 표시
```
> Test1:  776, Price: 6543.12

```python
print("Test1: {0: 05d}, Price: {1: 4.2f}".format(776, 6543.123))
# 5d앞에 0을 붙히면 남은자리는 0으로 채운다는 얘기이다
```
> Test1:00776, Price: 6543.12
