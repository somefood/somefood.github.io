---
layout: post
title: 크롤링1
category: Python
tag: [python]
comments: true
---

# 크롤링이란

크롤링은 웹페이지의 소스를 갖고오는 행위를 말한다.
이 소스를 갖고와서 내가 원하는 데이터를 가공하여 볼 수 있다.
파이썬은 requests와 Beautifulsoup을 통해서 위의 동작을 코드내에서 처리할 수 있고,  
selenium을 통해서 웹 브라우저에서 직접 제어하는 방법도 있다 한다.  

크롤링으로 우리가 할 수 있는 것은 다음과 같다.

1. Bot 프로그램 연계
2. 정보를 가공해서 이메일 전송
3. 중단 예정인 서비스에서 자료 백업 등이 있다.

저작권 문제도 있다하니 유의해서 사용해야할 듯 하다.

크롤링할 때 HTTP 메소드로는 GET, POST 정도만 사용된다 한다.
GET은 리소스를 요청할 때 사용되고, POST는 리소스 추가 요청과 수정/삭제 목적으로 사용된다고 한다.

HTTP 요청/응답 패킷 형식은 다음과 같다.

요청패킷
  요청헤더: 클라이언트에서 필요한 Key/Value를 세팅 후 전달
  첫번째 빈 줄: 헤더와 Body 구분자
  Body: 클라이언트에서 필요한 Body를 세팅한 후, 요청 전달

응답패킷
  응답헤더: 서버에서 필요한 헤더 Key/Value를 세팅한 후, 응답 전달
  첫번째 빈 줄: 헤더와 Body 구분자
  Body: 서버에서 필요한 Body를 세팅한 후, 요청 전달
  
헤더는 HTTP 요청/응답 시에 헤더정보가 Key/Value 형식으로 세팅된다.
대부분 브라우저에서 다음 헤더를 설정한다.
User-Agent: 브라우저 종류
Referer: 이전 페이지 URL (이전에 어느 페이지에서 접속한건지 표시)
Accept-Language: 어떤 언어의 응답을 원하는지
Authorization: 인증 정보

크롤링 시에 User-Agent와 Referer 부분을 커스텀 해줘야 할 때도 있다.
파이썬 requests로 크롤링 시, User-Agent가 python-requests/2.xx 이런식으로 나오기 때문에 거부하는 경우도 있다 한다.
그렇기에 fake user-agent로 대체해주는게 좋다.  
referer 같은 경우에는 어떤 웹사이트는 이전 URL에서 넘어와야 정상적으로 소스를 주게 처리되었기 때문에, 이부분도 적절히 바꿔줘야 한다.

