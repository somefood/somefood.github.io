---
layout: post
title: Django Pythonanywhere 배포하기
category: Django
tags: [django, python]
comments: true
---

장고를 runserver뿐만 아니라 실제로 웹서버에 올리는 연습도 필요하다고 생각한다. AWS도 있고 Azure등 호스팅 서비스가 많지만, 무료로 실습하기 아주 좋은 사이트는 `pythonanywhere`라 생각한다. 위 서비스는 장고나 플라스크 같은 웹프레임워크를 올릴 수 있고 공부하기 아주 용이한 사이트이다. 배포하기도 쉽다! 나의 프로젝트가 어느정도 윤곽이 잡혔으면 한 번 차근차근 설정해보아 인터넷에 올려보자.

> github계정과 git을 다를 줄 안다고 판단하에 작성합니다.

## settings파일 분리

우리는 runserver로 실습 시 `DEBUG=True`인 상태로 진행을 했다. 개발 환경이니까 디버깅을 해야했기 때문이다. 하지만, 우리는 배포하기 위함이니 DEBUG모드는 비활성화 해줘야 한다. 즉, 개발환경에서는 활성화하고 배포에서는 비활성화를 해주는 것인데, 일일이 settings 파일을 건드려주면 여간 불편할 것이다. 그렇기에 우리는 개발용, 배포용으로 settings 파일을 분리해주는 것이 좋다. 다음의 과정으로 분리한다.

1. settings.py 파일이 있는 위치에 settings 디렉토리를 생성
2. settings.py를 settings디렉토리에 이동
3. settings.py 파일명을 base.py(기본이 되는 파일로 이름은 원하는대로)로 변경
4. dev.py(개발용), prod.py(배포용) 파일을 생성 (마찬가지로 파일명은 원하는 대로)
5. 각 파일 첫줄에 `from .base.py import *` 입력

5번까지 마치면 dev, prod파일은 base의 내용을 그대로 갖고 온것이다. 여기서 배포용에는 몇 가지를 바꿔주면 된다.

```python
DEBUG = False
ALLOWED_HOST = ['호스트명.pythonanywhere.com'] # pythoanywhere의 호스트명을 적으면 된다.
```

이렇게 하면 배포용 settings가 완성된다!

## STATIC_ROOT 설정

우리가 runserver로 개발 서버를 사용하면 문제없이 static 자원들을 갖고와 사용할 수 있었다. 하지만 DEBUG가 꺼진 배포용은 그렇지 않다. 효율적인 서비스를 위해 static자원은 보통 웹서버에서 관리하기 때문이다. 그렇기에 우리는 웹서버가 관리한 static 경로에다가 우리가 지금까지 사용한 static 자원들을 모아줘야 한다. 그럴 때 필요한 것이 이 `STATIC_ROOT`이다. 위 경로를 설정해주면 이후 `python manage.py collectstatic` 명령어를 실행하면 해당 위치에 모든 static 파일이 저장된다. 배포용에서만 사용하면 될테네 prod파일에 추가해주자.

```python
STATIC_ROOT = os.path.join(BASE_DIR, 'www_dir', 'static')
```

경로는 본인이 원하는 곳으로 지정해줘도 된다.

## pythonanywhere 설정

> 이전의 과정까지 모두 github에 올려주시기 바랍니다.

STATIC_ROOT까지 설정했으면 배포까지 문제가 없을 것이다.
이제 pythonanywhere에 접속해 회원가입과 우리의 파일을 올리고 추가 설정을 해주면 된다. 가입은 아래서 해주면 된다.

> https://www.pythonanywhere.com/registration/register/beginner/

로그인까지 완료되면 우측 상단의 `Consoles`로 들어가서 Start a new console의 Bash를 클릭해준다. 참고로 파이썬 가상환경도 설정하면 좋지만, 여기서는 이 서비스만 사용해볼 것이기에 설정은 안하도록 하겠다. 추후에 올릴 수 있으면 올리겠다. Bash를 누르면 콘솔 창이 하나 마련될텐데 이것이 우리의 웹서버가 될 서버인 것이다. 이제 우리가 github에 올린 우리의 서비스를 clone 해주면 된다.

클론된 디렉토리로 들어간 후, migrate와 collectstatic 명령어를 입력해주면 된다. 여기서 주의할 점은 우리는 settings를 분리했기 때문에 뒤에 다음과 같이 추가해서 입력해주자.

`python manage migrate --settings=mysite.settings.prod`

`python manage collectsatic --settings=mysite.settings.prod`

자, 마지막으로 pythonanywhere메뉴 중에 `Web`으로 이동한다. 처음 만드는거면 web app을 새로 만들어야 한다. Next 버튼을 누르다 보면 `Select a Python Web framework`가 보일텐데 여기서 `Manual configuration`을 선택해준 후, 자신의 파이썬 버전을 골라주면 된다. 그러고 다시 Web 메뉴로 이동하면 설정 화면이 보일 것이다. 여기서 우리는 `Source code, Working directory, WSGI configuration file, Static files`의 내용들만 설정해주면 된다.
순서대로 클릭해서 다음처럼 입력해주자.

1. Source code: /home/사용자/프로젝트명
2. Working directory: /home/사용자
3. WSGI configuration file: 클릭한 다음, 조금 내리다 보면 `+++++ Django ++++++`로 시작하는 부분이 있는데, import os부터 +++ FLASK +++ 이전까지 주석을 지워주면 된다. 한 번에 다 지우는 방법으로 커서로 라인을 선택해준 다음에 `컨트롤 + /(윈도우 버전) 또는 command + /(맥 버전)` 해주면 된다. 이후에 path에 Source code에 입력해준 경로명을 입력해주고, os.environ['DJANGO_SETTING_MODULE]의 값으로 'mysite.settings.prod'를 입력해주면 된다.
4. Static files: URL - /static/, Directory - /home/사용자명/프로젝트명/www_dir/static(위에서 STATIC_ROOT로 설정해준 경로!)

여기까지 완료 후 맨 위의 `Reload 호스트명.pythonanywhere.com` 클릭해주고, 해당 url로 접속해주면 우리의 서비스 화면을 볼 수 있다.
