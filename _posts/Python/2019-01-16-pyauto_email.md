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

연습문제
- 네이버 웹툰 목록 중 업데이트 된 웹툰 크롤링 해서 이메일로 타이틀 명 및 썸네일 사진 보내보기

```python
# 신작 네이버 웹툰 목록을 크롤링, 요약메일 발송 해보기
# 필요한 패키지: requests, beautifulsoup4

import os
import requests
from bs4 import BeautifulSoup

import smtplib
from email.message import EmailMessage
from email.mime.application import MIMEApplication

list_url = 'http://comic.naver.com/webtoon/weekday.nhn'
html = requests.get(list_url).text
soup = BeautifulSoup(html, 'html.parser')
comic_list = []
for a_tag in soup.select('a[href*=list\.nhn]'):
    if not a_tag.select('.ico_updt'):
        continue
    img_tag = a_tag.find('img')
    title = img_tag.attrs['title'] # img 태그 내에서 title 속성 값
    img_src = img_tag['src'] # 썸네일 경로명
    img_name = os.path.basename(img_src) #썸네일 파일명
    img_data = requests.get(img_src, headers={'Referer': list_url}).content
    comic_list.append({
        'title': title,
        'img': {
            'src': img_src,
            'name': img_name,
            'data': img_data,
        },
    })

message = EmailMessage()
message['Subject'] = '웹툰 업데이트'
message['From'] = 'somefood@naver.com'
message['To'] = 'somefood@mikrotik.co.kr'
message.set_content('''이메일 내용
''')
message.add_alternative('''
<h1> 만화 목록</h1>
<ul>
    
''', subtype='html')

for comic in comic_list:
    with open(comic['img']['name'], 'wb') as f:
        f.write(comic['img']['data'])

    message.add_alternative('''
        <li>{}<img src="cid:{}"></li>
    '''.format(comic['title'],comic['img']['name']), subtype='html')

    with open(comic['img']['name'], 'rb') as f:
        filename = comic['img']['name']
        cid = filename
        img_data = f.read()
        part = MIMEApplication(img_data, name=filename)
        part.add_header('Content-ID', '<' + cid + '>')
        message.attach(part)

message.add_alternative('''
</ul>
''',subtype='html')

with smtplib.SMTP_SSL('smtp.naver.com', 465) as server:
    server.ehlo()
    server.login('somefood', 'elwkdldjhd123#')
    server.send_message(message)
```
<img src='/assets/post_images/email_webtoon_crawling.PNG'>
