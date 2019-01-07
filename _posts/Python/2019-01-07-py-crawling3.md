---
layout: post
title: 슬랙에 음악 상위 3곡 보내기
category: Python
tags: [python, crawling]
comments: True
---

## 슬랙봇으로 busg뮤직 상위 3곡을 보내 보았다.
### 사전 준비: Slack 가입, Bot 생성, Python Slacker 설치

```python
import requests
from bs4 import BeautifulSoup
from slacker import Slacker
token = 'xoxb-12312312312312312312' # slack으로 만든 봇 ID를 입력해준다.

html = requests.get('https://music.bugs,co.kr/chart').text
soup = BeautifulSoup(html,'html.parser')

top3_list=[]

count=0 # 나는 3곡만 할꺼니가 카운트를 줬다.

for tag in soup.select('.list.trackList.byChart tbody tr'):  # bugs차트에서 top100 부분
    if count == 3:
        break # 3곡 하고 break로 종료
    else:
        titles = tag.select('th a')   # 타이틀은 th태그로 둘러쌓여있음. list화
        imgs = tag.select('td img')   # td img 태그. list화
        lyrics = tag.select('.trackInfo') # trackInfo 클래스 검색
        for title, img, lyric in zip(titles,imgs, lyrics): # zip함수를 이용하여 순서 튜플화
            lyric_src = lyric['href']                               #가사 사이트 저장
            get_lyric = requests.get(lyric['href']).text            
            lyric_soup = BeautifulSoup(get_lyric, 'html.parser')    #가사 사이트 크롤링
            lyric = lyric_soup.find('xmp').text                     #가사는 xmp태그로 둘러져 있다.
            lyric = '\n'.join(lyric.splitlines()[:6])               #splitlines를 개행별로 나눈 후 다시 개행 입혀줌
            top3_list.append({'title':title.text,                   #top3_list에 dict형식으로 append 해줌.
                              'img_src':img['src'],
                              'lyric_src':lyric_src,
                              'lyric':lyric,
                             })
    count+=1

for i in top3_list:
    attachments = []
    attachments.append({
        "fallback": i['title'], #알림 메세지에 보이는 텍스트
        "title": i['title'], # 제목 (볼드체로 보여짐)
        "title_link": i['lyric_src'], # 제목 링크
    # 본문 텍스트
        "text": i['lyric'],
    # "image_url": "", # 이미지 URL
        "thumb_url": i['img_src'], # 썸네일 URL
        "color": "#7CD197", # 첨부별 왼쪽 Bar 색상
    })
    slack.chat.post_message('#webtoon', '2019년 벅스차트 TOP 3', attachments=attachments)
```
