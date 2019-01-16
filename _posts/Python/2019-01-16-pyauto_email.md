---
layout: post
title: 이메일 보내기
category: Python
tags: [python]
comments: True
---

참고  
애스크장고  [AskDjango](https://www.askcompany.kr/)

메세지를 보내는 다양한 방법

- 이메일
  - 대량 발송 시에는 대량 발송 서비스 이용
  - 일반 네이버/지메일 계정을 통해 대량 발송 시, 스팸우려로 발송 거부 가능성 있음
  - 쇼핑몰에서 자주 사용됨
  - SMTP 프로토콜이나 특정 서비스의 API를 활용
- 문자
  - 가장 쉬우나, 건당 발송 비용 발생
  - 선거/마트 홍보 문자 등에 사용
  - 사람들이 요즘 잘 안봄
  - 서비스 업체의 open aip를 활용
- Android/iOS 앱 푸쉬
  - 메세지 발송에는 추가 비용이 없음
  - 단, 푸쉬를 너무 많이 보내면, 고객들이 푸쉬를 끄거나, 앱을 지울수도 있음
- 메세지 서비스 활용: 카톡, 라인, 슬랙, 텔래그램 등
  - 서비스 업체의 OpenAPI를 통해 발송 가능
  
이번 장에서는 네이버 메일 SMTP를 통해 이메일을 보내볼 것이다.

사전 준비
- 네이버 메일 접속하여 POP3/SMTP 사용 활성화 (아마 기본적으로 되어있을 것이다.)
- SMTP 접속 정보 확인
  - 서버명: smtp.naver.com
  - SMTP 포트: 465, 보안 연결(SSL)
  - 개인 아이디/ 비밀번호

```python
import smtplib
from email.message import EmailMessage
import getpass

print('='* 30, '메일 보내기')
password = getpass.getpass('Password:')

message = EmailMessage()
message['Subject'] = '파이썬 메일 테스트'
message['From'] = '아이디@naver.com'
message['To'] = '아이디@gmail.com'
message.set_content('''이메일 내용
파이썬 이메일 테스트.

이 부분에는 이메일의 내용을 쓰실 수 있으나, HTML은 불가하다.
HTML을 쓰면 태그가 그대로 노출된다.

''')

with smtplib.SMTP_SSL('smtp.naver.com', 465) as server:
    server.ehlo()
    server.login('아이디', password)
    server.send_message(message)

print('이메일 발송')
```

HTML로 보내는 방법은 다음과 같다.
```python
import smtplib
from email.message import EmailMessage
import getpass

print('='* 30, '메일 보내기')
password = getpass.getpass('Password:')

message = EmailMessage()
message['Subject'] = '파이썬 메일 테스트'
message['From'] = 'somefood@naver.com'
message['To'] = 'somefood@mikrotik.co.kr'
message.set_content('''이메일 내용
''')
message.add_alternative('''
<h1> HTML로 보내기</h1>
<ul>
    <li>파이썬</li>
    <li>자동화</li>
    <li>메일</li>
</ul>
''', subtype='html')

with smtplib.SMTP_SSL('smtp.naver.com', 465) as server:
    server.ehlo()
    server.login('somefood', password)
    server.send_message(message)

print('이메일 발송')
```
