---
layout: post
title: requests 써보기
category: Python
tags: [python, crawling]
comments: true
---

# GET 요청해보기
```python
import requests
response = requests.get('http://news.naver.com/main/home.nhn')
```

헤더에 커스텀 내용을 추가하고 싶을 시에는 dic형 변수를 만들어 입력해주는게 편하다.
```python
request_headers ={
    'User-Agent' : ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'),
    'Referer': 'http://news.naver.com/main/home.nhn', # 뉴스홈
}
```

requests의 기본 User-Agent는 'python-requests/버전'이런 식인데, 이것을 통해 응답을 거부할 수 있기에 fake User-Agent값을 설정해 주면 좋다.
fake_useragent모듈에서 UserAgent클래스를 추가한다.

```python
from fake_useragent import UserAgent
ua = UserAgent()
ua.ie
```

ua.ie는 User-Agent 값을 출력하는데, 실행시킬 때마다 다른 값이 표시된다.

인자를 보내는 방법이다.
requests.get 함수에 params=값을 넣어주면 된다.
```python
get_params ={'k1':'v1','k1':'v3','k2':'v2'}
response = requests.get('http://httpbin.org/get', params=get_params)

get_params = (('k1', 'v1'), ('k1', 'v3'), ('k2', 'v2'))
response = requests.get('http://httpbin.org/get', params=get_params)
```
두개의 경우를 표시했는데, 전자의 경우 key k1이 두개가 있다. 이런경우에는 마지막 k1의 value가 저장된다.
후자는 배열로 [v1,v3]가 저장된다.

```
{
  "args": {
    "k1": "v3", 
    "k2": "v2"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Connection": "close", 
    "Host": "httpbin.org", 
    "User-Agent": "python-requests/2.20.0"
  }, 
  "origin": "121.190.90.190", 
  "url": "http://httpbin.org/get?k1=v3&k2=v2"
}
```

```
{
  "args": {
    "k1": [
      "v1", 
      "v3"
    ], 
    "k2": "v2"
  }, 
  "headers": {
    "Accept": "*/*", 
    "Accept-Encoding": "gzip, deflate", 
    "Connection": "close", 
    "Host": "httpbin.org", 
    "User-Agent": "python-requests/2.20.0"
  }, 
  "origin": "121.190.90.190", 
  "url": "http://httpbin.org/get?k1=v1&k1=v3&k2=v2"
}
```

#POST 요청해보기

> response = requests.post('http://httpbin.org/post')
