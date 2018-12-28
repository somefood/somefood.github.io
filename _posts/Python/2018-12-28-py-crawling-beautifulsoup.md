---
layout: post
title: BeautifulSoup 사용하기
category: Python
tags: [python, crawling, beautifulsoup]
comments: true
---

# HTTP 응답
웹서버에서는 일반적으로 HTML, CSS, JavaScript, Image 형식의 응답을 한다.
HTML 문서는 중첩된 태그로 구성된 계층적인 구조이다.

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>AskDjango</title>
  </head>
  <body>
    <h1>AskDjango VOD</h1>
    <ul id="vod_list">
      <li class="vod">파이썬 차근차근 시작하기</li>
      <li class="vod">장고 기본편</li>
    </ul>
    <hr/>
  </body>
</html>
```

