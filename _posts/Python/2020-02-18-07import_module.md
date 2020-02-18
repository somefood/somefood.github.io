---
layout: post
title: 07 모듈과 패키지
category: Python
tags: [python]
comments: true
---
07 모듈과 패키지
========
파이썬은 다른 능력자분들이 미리 만들어둔 파이썬 파일들을 불러와서
함수나 클래스들을 호출할 수 있고, 이를 통해 `크롤링`이나 `엑셀 제어` 등 다양한 업무를 수행할 수 있다. 이때 불러온 파이썬 파일을 모듈이라고 부른다.
나도 언젠간 그런 모듈을 배포할 수 있는 개발자가 되기를 희망하며 열심히 공부해야겠다!

모듈을 불러올 때는 경로명을 입력해줘야 하는데 절대경로와 상대경로가 있다.
- 절대 경로: 최초의 시작점부터 원하는 파일명까지 가는 경로.
  - ex) C:\\Users\\hsj4665\\Desktop\\study\\test.py
- 상대 경로: 현재 위치에서 원하는 파일명까지 가는 경로
  - `..` : 부모 디렉토리
  - `.` : 현재 디렉토리
  - ex) ./test2.py 현재 폴더에 있는 test2.py파일에 접근

#### 문법
```python
# 모듈 임포트 할 때
import 파일명 (.py는 제외)
파일명.함수()
파일명.클래스()
이런식으로 호출

# 모듈에서 특정 함수나 클래스를 사용할 때
from 파일명 import 함수 또는 클래스
함수()
클래스()
이런식으로 호출
```

#### 사용1(클래스)
```python
from pkg.fibonacci import Fibonacci

Fibonacci.fib(300)

print("ex1 :", Fibonacci.fib2(400))
print("ex1: ", Fibonacci(title="test").title)
```

#### 사용2(클래스) `*` 사용 메모리 많이 사용돼서 권장 x
```python
from pkg.fibonacci import *

Fibonacci.fib(300)

print("ex2 :", Fibonacci.fib2(400))
print("ex2: ", Fibonacci(title="test").title)
```

#### 사용3(클래스) - 이름이 길 때 `as` 활용
```python
from pkg.fibonacci import Fibonacci as fb

fb.fib(300)

print("ex3 :", fb.fib2(400))
print("ex3: ", fb(title="tasdest").title)
```

#### 사용4(함수)
```python
import pkg.calculations as c

print("ex4 :", c.add(10,100))
```

#### 사용5(함수) - 권장
```python
from pkg.calculations import div as d
print("ex5 : ", int(d(100,10)))
```

#### 사용6
```python
import pkg.prints as P
import builtins
P.prt1()
P.prt2()
print(dir(builtins))
```

## 모듈에 보이는 `if __name__ == "__main__"`:
기본적으로 모듈을 호출하면 모듈의 파일이 실행되는 식이다 보니
테스트 용으로 사용한 함수나 클래스가 실행 될 수도 있다.
이를 방지하기 위해 `if __name__ == "__main__"`를 사용하여 본래 파일을 실행할 때에만, 함수나 클래스가 실행되도록 한다.
