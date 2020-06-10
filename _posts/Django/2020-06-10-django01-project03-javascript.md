---
layout: post
title: Django01 프로젝트 - javascript 정리
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - javascript 정리
=======

웹 개발자로 나아가는데 있어 javascript는 정말 필요하다. 이것을 알아야 웹페이지에서 많은 것을 구현할 수 있는 것이다.


## 비밀번호 확인하기
```javascript
<script>
	$(function(){
		$('#alert-success').hide();
		$('#alert-danger').hide();
		$("#id_password_check").keyup(function(){
			var pwd1=$('#id_password').val();
			var pwd2=$('#id_password_check').val();
			if(pwd1 != "" || pwd2 != ""){
				if(pwd1 == pwd2){
					$("#alert-success").show();
					$("#alert-danger").hide();
				}else{
					$("#alert-success").hide();
					$("#alert-danger").show();
				}
			}
		});
	});
</script>
```
