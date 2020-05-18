---
layout: post
title: python심화 - Class Advanced
category: Python
tags: [python]
comments: true
---

Python 심화 - Class Advanced
======
### 우리는 왜 class를 사용해야 할까
파이썬에서 자주 사용하는 dictionary 자료형을 예로 들어보자. 만약 내가 학생을 관련해 만든다면은 학생의 이름, 번호, 학년, 등 성적 등을 만들 수가 있다. 아래 처럼 말이다. 3명의 학생에 대해 정보를 만들었는데, 얼핏봐도 수가 늘어나면 관리하기간 힘들어 보인다. 하지만 클래스를 사용하면 좀 더 직관적이고 효율적으로 관리할 수 있게 되는 것이다.

##### 딕셔너리 사용
```python
students_dicts = [
    {'stduent_name' : 'Kim',
     'student_number' : 1,
     'student_grade': 1,
     'student_detail':
        {'gender': 'Male', 'score1':95, 'score2':88}
     },
    {'stduent_name' : 'Park',
     'student_number' : 2,
     'student_grade': 2,
     'student_detail':
        {'gender': 'Female', 'score1':15, 'score2':28}
     },
    {'stduent_name' : 'Lee',
     'student_number' : 3,
     'student_grade': 3,
     'student_detail':
        {'gender': 'Male', 'score1':15, 'score2':83}
     }
]
```

##### 클래스 사용

```python
# 클래스 구조
# 구조 설계 후 재사용성 증가, 코드 반복 최소화, 메소드 활용

class Student():
    def __init__(self, name, number, grade, details):
        self._name = name
        self._number = number
        self._grade = grade
        self._details = details

    def __str__(self):
        return 'str : {}'.format(self._name)
    def __repr__(self):
        return 'repr : {}'.format(self._name)

student1 = Student('kim', 1, 1, {'gender': 'Male', 'score1': 95, 'score2': 88})
student2 = Student('Park', 2, 2, {'gender': 'Female', 'score1': 77, 'score2': 92})
student3 = Student('Lee', 3, 3, {'gender': 'Male', 'score1': 99, 'score2': 100})


# 이후 리스트에다가 인스턴스들을 삽입해준다
students_list = []
students_list.append(student1)
students_list.append(student2)
students_list.append(student3)


print(students_list)

# 반복(__st__)
for x in students_list:
    print(x)
```

### 클래스 변수와 인스턴스 변수
- 클래스 변수: 클래스에 선언한 변수, 인스턴스들 모두 공유하는 데이터일 때 사용하면 좋다.
- 인스턴스 변수: 인스턴스들만의 고유한 데이터들이라 보면 될거 같다.
##### 예시
```python
class Student:
    """
    이것은 클래스를 설명하는 문서다.
    클래스.__doc__() 사용하면 볼 수 있다.
    Student Class
    Author : Hong
    Date: 2020.04.21
    """

    #  클래스 변수 선언
    student_count = 0

    def __init__(self, name, number, grade, details, email=None):
        # 인스턴스 변수, self와 함께있는 것들은 인스턴스 변수라 보면 될거 같다.
        self._name = name
        self._grade = grade
        self._number = number
        self._details= details
        self._name = name
        self._email = email

        Student.student_count += 1 # 클래스 변수를 통해 학생 카운트

    def __str__(self):
        return 'str {}'.format(self._name)

    def __repr__(self):
        return 'str {}'.format(self._name)

    def detail_info(self):
        print('Current Id: {}'.format(id(self)))
        print('Student Detail Info : {} {} {}'.format(self._name, self._email, self._details))

    def __del__(self):
        Student.student_count -= 1

# Self 의미: 생성된 객체를 가리킨다.
studt1 = Student('Cho', 2, 3, {'gender': 'Male', 'score1' : 11, 'score2' : 44})
studt2 = Student('Chang', 4, 1, {'gender': 'Feale', 'score1' : 61, 'score2' : 74}, 'st2@naver.com')

# ID 확인 - 서로 다른 객체임을 확인
print(id(studt1))
print(id(studt2))

print(studt1._name == studt2._name)
print(studt1 is studt2) # id 값 비교하기

# dir & __dict__ 확인
# dict로 먼저 보고 dir로 보기
# __dict__는 인스턴스 내 속성값들만 보고, dir()은 상속받은 모든 속성들을 보여주기 때문이다!

print(dir(studt1))
print(dir(studt2))


print(studt1.__dict__) # 인스턴스 변수 값도 보여줌
print(studt2.__dict__) # 인스턴스 변수 값도 보여줌

# Docstring - 주석보기
print(Student.__doc__)
print()

# 실행
studt1.detail_info()
studt2.detail_info()

# 에러
# Student.detail_info()

Student.detail_info(studt1)
Student.detail_info(studt2)

# 비교
print(studt1.__class__, studt2.__class__)
print(id(studt1.__class__) == id(studt2.__class__))

print()

# 인스턴스 변수
# 직접 접근(PEP 문법적으로 권장 X)
studt1._name = 'HAHAHA' # 이런것을 권장않고, 메소드를 이용해 바꿀 수 있도록 하기
print(studt1._name, studt2._name)
print(studt1._email, studt2._email)

# 클래스 변수
# 인스턴스도 접근 가능
print(studt1.student_count)
print(studt2.student_count)
print(Student.student_count)

print()
print()

# 공유 확인
print(Student.__dict__) # student_count 보임
print(studt1.__dict__) # student_count 안보임.
print(studt2.__dict__) # student_count 안보임.

# 인스턴스 네임스페이스에 없으면 상위에서 검색
# 즉, 동일한 이름으로 변수 생성 가능(인스턴스 검색 후 -> 상위(클래스 변수, 부모 클래스 변수))

del studt2

print(studt1.student_count)
print(Student.student_count)
```


### 클래스 메소드 & 스태틱 메소드
인스턴스를 통하지 않고, 클래스에서 직접 호출할 때 사용하는 메소드이다.
- 클래스 메소드: 메소드 위에 @classmethod를 기입해준다. 단, 첫번째 매개변수로 cls로 입력해준다. 클래스 메서드는 정적 메서드처럼 인스턴스 없이 호출할 수 있다는 점은 같지만 클래스 메서드는 메서드 안에서 클래스 속성, 클래스 메서드에 접근해야 할 때 사용한다.

- 스태틱 메소드: 메소드 위에 @staticmethod를 기입해준다. 메서드의 실행이 외부 상태에 영향을 끼치지 않는 순수 함수(pure function)를 만들 때 사용한다. 정적 메서드는 인스턴스의 상태를 변화시키지 않는 메서드를 만들 때 사용합니다.
```python
# Chapter01-3
# 파이썬 심화
# 클래스 메소드, 인스턴스 메소드, 스태틱 메소드

# 기본 인스턴스 메소드

class Student(object):
    """
    Student Class
    Author : Kim
    Date : 2020.04.23
    Descriptipn : Class, Static, Instance Method
    """

    # Class Variable
    tuition_per = 1.0

    def __init__(self, id, first_name, last_name, email, grade, tuition, gpa):
        self._id = id
        self._first_name = first_name
        self._last_name = last_name
        self._email = email
        self._grade = grade
        self._tuition = tuition
        self._gpa = gpa

    # Instance Method - 인자로 self가 들어가면 인스턴스 메소드라 생각하면 될듯
    def full_name(self):
        return '{}, {}'.format(self._first_name, self._last_name)

    # Instance Method
    def detail_info(self):
        return 'Student Detail Info : {}, {}, {}, {}, {}, {}'.format(self._id, self.full_name(), self._email, self._grade, self._tuition,
                                                                     self._gpa)
    # Instance Method
    def get_fee(self):
        return 'Before Tuition -> Id: {}, fee: {}'.format(self._id, self._tuition)
    # Instance Method
    def get_fee_calc(self):
        return 'After Tuition -> Id: {}, fee: {}'.format(self._id, self._tuition * Student.tuition_per)

    def __str__(self):
        return 'Student Info -> name: {} grade: {} email: {}'.format(self.full_name(), self._grade, self._email)

    # Class Method
    @classmethod
    def raise_fee(cls, per):
        if per <= 1:
            print('Please Enter 1 or More')
            return
        cls.tuition_per = per
        print('Succed! tuition increased!')

    # Class Method
    @classmethod
    def student_const(cls, id, first_name, last_name, email, grade, tuition, gpa):
        return cls(id, first_name, last_name, email, grade, tuition * cls.tuition_per, gpa)

    # Static Method
    @staticmethod
    def is_scholarship_st(inst):
        if inst._gpa >= 4.3:
            return '{} is a scholarship recipient'.format(inst._last_name)
        return 'Sorry. Not a scholarship recipient.'

# 학생 인스턴스
student_1 = Student(1, 'Kim', 'Sarang', 'student1@naver.com', '1', 400, 3.5)
student_2 = Student(2, 'Lee', 'Myungho', 'student2@daum.com', '2', 500, 4.3)

# 기본정보
print(student_1)
print(student_2)

print()

# 전체 정보
print(student_1.detail_info())
print(student_2.detail_info())

print()

# 학비 정보(인상 전)
print(student_1.get_fee())
print(student_2.get_fee())

print()

# 학비 인상(클래스 메소드 사용 전) - 직접 접근해서 제어하면 좋지 않
# Student.tuition_per = 1.2

# 학비 인상(클래스 메소드 사용)
Student.raise_fee(1.3)

# 학비 정보(인상 후)
print(student_1.get_fee_calc())
print(student_2.get_fee_calc())
print()
# 클레스 메소드 인스턴스 생성 실습
student_3 = Student.student_const(3, 'Park', 'Minji', 'Student3@gmail.com', '3', 550, 4.5)
student_4 = Student.student_const(4, 'Cho', 'Sunghan', 'Student4@gmail.com', '4', 600, 4.1)

# 전체 정보
print(student_3.detail_info())
print(student_4.detail_info())
print()

# 학생 학비 변경 확인
print(student_3._tuition)
print(student_4._tuition)
print()

# 장학금 혜택 여부(스테이틱 메소드 미사용)
def is_scholarship(inst):
    if inst._gpa >= 4.3:
        return '{} is a scholarship recipient'.format(inst._last_name)
    return 'Sorry. Not a scholarship recipient.'

print(is_scholarship(student_1))
print(is_scholarship(student_2))
print(is_scholarship(student_3))
print(is_scholarship(student_4))
print()
# 장학금 혜택 여부(스테이틱 메소드 사용)
print(Student.is_scholarship_st(student_1))
print(Student.is_scholarship_st(student_2))
print(Student.is_scholarship_st(student_3))
print(Student.is_scholarship_st(student_4))

print()

print(student_1.is_scholarship_st(student_1))
print(student_2.is_scholarship_st(student_2))
print(student_3.is_scholarship_st(student_3))
print(student_4.is_scholarship_st(student_4))
```
