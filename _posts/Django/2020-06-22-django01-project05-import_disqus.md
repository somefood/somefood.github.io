---
layout: post
title: Django01 프로젝트 - DISQUS를 이용해 댓글기능 구현하기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - DISQUS를 이용해 댓글기능 구현하기
=======

#### 사전 작업
DISQUS를 활용해서 댓글 기능을 추가해보도록 해보았다. 그전에 DISQUS에서 사이트 하나를 만들어 줘야한다.
1. DISQUS 사이트에 접속해서 가입 후 `get_started` 클릭
2. `I want to install Disqus on my site` 클릭
3. 소문자 형태로 web site name 정해주기 공백대신 `-` 사용 카테고리는 tech ex)my-site
4. 아래 Basic으로 무료로 제공하는 거 사용


#### settings 파일 변수 추가
굳이 안해줘도 되긴 하지만 하드 코딩을 조금 줄이기 위해 settings파일에 변수로 저장했다.
```python
DISQUS_SHORTNAME = 'my-site'
DISQUS_MY_DOMAIN = 'http://127.0.0.1:8000' #로컬에서 확인
```

#### views 수정
댓글은 포스트들을 상세보기 할때만 필요하기에 DetailView에서 구현해주면 된다.
get_context_data를 사용해서 템플릿에 사용할 변수들을 추가해 줄 수 있다.
```python
from django.conf import settings # settings에서 입력한 변수를 사용하기 위해 import


class BoardDetail(DetailView):
    model = UserBoard
    template_name = 'board/detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['disqus_short'] = f"{settings.DISQUS_SHORTNAME}"
        context['disqus_id'] = f"post-{self.object.id}-{self.object.slug}"
        context['disqus_url'] = f"{settings.DISQUS_MY_DOMAIN}{self.object.get_absolute_url()}"
        context['disqus_title'] = f"{self.object.slug}"
        return context
```

#### html 내용 추가
디테일 파일에 들어가서 disqus에서 제공하는 코드들을 삽입하고 템플릿 변수들을 넣어주면 된다.
```html
<div id="disqus_thread"></div>
<script>
/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/

var disqus_config = function () {
    this.page.identifier = '{{ disqus_id }}'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    this.page.url = '{{ disqus_url }}';  // Replace PAGE_URL with your page's canonical URL variable
    this.page.title = '{{ disqus_title }}'
};

(function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://{{ disqus_short }}.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
</noscript>
```
