---
layout: post
title: Django01 프로젝트 - accounts앱 CBV로 바꾸기
category: Django
tags: [django, python]
comments: true
---

Django01 프로젝트 - accounts앱 CBV로 바꾸기
=======
accounts앱은 로그인, 로그아웃, 회원가입등을 담당하는 앱이다.
예전에 OneToOneField로 Profile을 연결해서 지금까지 사용중이다.
Abstractuser를 통해 Profile의 내용들을 User모델에 넣을까 하다가, 굳이 그럴 필요는 없을거 같아서 일단 두고
Django의 인증기능들을 잘 활용하기 위해 FBV만 CBV로 바꿔보기로 했다.


# forms
ModelForm을 활용해서 패스워드 재확인을 위한 속성을 추가해주고, 적절하게 Attributes들을 넣어준 상태이다.
```python
from django.forms import ModelForm
from django.contrib.auth.models import User
from django import forms


class SignupForm(ModelForm): #회원가입을 제공하는 class이다.
    password_check = forms.CharField(max_length=200, widget=forms.PasswordInput(attrs={
        'placeholder': '비밀번호를 한 번 더 입력해주세요.', 'class': 'form-control', 'id': 'loginPW-check'}))
    # 아쉽게도 User 모델에서는 password_check 필드를 제공해주지 않는다.
    # 따라서 따로 password_check 필드를 직접 정의해줄 필요가 있다.
    # 입력 양식은 type은 기본이 text이다. 따라서 다르게 지정해주고 싶을 경우 widget을 이용한다.
    # widget=forms.PasswordInput()은 입력 양식을 password로 지정해주겠다는 뜻이다.

    field_order = ['username', 'password', 'password_check', 'email']
    # field_order=['username','password','password_check','last_name','first_name','email']
    # field_order는 만들어지는 입력양식의 순서를 정해준다.
    # 여기서 사용한 이유는 password 바로 밑에 password_check 입력양식을 추가시키고 싶어서이다.
    # 만약 따로 field_order를 지정해주지않았다면, password_check는 맨 밑에 생성된다.
    class Meta:
        model = User
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': '아이디를 입력해주세요.','id': 'loginID', 'class': 'form-control'}),
            'password': forms.PasswordInput(attrs={'placeholder': '비밀번호를 입력해주세요.', 'id': 'loginPW', 'class': 'form-control'}),
            'email' : forms.EmailInput(attrs={'placeholder': '이메일을 입력해주세요.', 'class':'form-control'})
        }
        fields = ['username', 'password', 'password_check', 'email']
#User model에 정의된 username, passwordm last_name, first_name, email을 입력양식으로

class SigninForm(ModelForm): #로그인을 제공하는 class이다.
    class Meta:
        model = User
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'id': 'loginID', 'placeholder': '아이디를 입력해주세요.'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control', 'id': 'loginPW', 'placeholder': '패스워드를 입력해주세요.'})
        }
        fields = ['username', 'password']

class ProfileForm(ModelForm):
    # address = forms.CharField(widget=forms.RadioSelect())
    class Meta:
        model = Profile
        fields = ['nickname', 'phone_number',]
        widgets = {
            'nickname': forms.TextInput(attrs={'placeholder': '닉네임을 입력해주세요.', 'class': 'form-control', 'id': 'nickName'}),
            'phone_number': forms.TextInput(attrs={'placeholder': '전화번호를 입력해주세요.', 'class': 'form-control', 'id': 'phoneNumber'}),
        }
```

# views
##로그인
먼저 로그인 기능을 살펴보겠다.
###FBV
함수로 만든 로그인 기능이다.
```python
def signin(request): #로그인 기능
    if request.user.is_authenticated: #유저가 인증되어있으면 아래 url로 리다이렉트
        return redirect(reverse('home'))
    if request.method == "GET":
        return render(request, 'accounts/signin.html', {'f': SigninForm})
    elif request.method == "POST":
        form = SigninForm(request.POST)
        id = request.POST['username']
        pw = request.POST['password']
        u = authenticate(username=id, password=pw)
	    # authenticate를 통해 DB의 username과 password를 클라이언트가 요청한 값과 비교한다.
	    # 만약 같으면 해당 객체를 반화하고 아니라면 none을 반환한다.

        if u: # u에 특정 값이 있다면,
            login(request, user=u) # u 객체로 로그인해라
            return HttpResponseRedirect(reverse('home'))
        else:
            return render(request, 'accounts/signin.html',{'f':form, 'error':'아이디나 비밀번호가 일치하지 않습니다.'})
```

###CBV
클래스뷰로 바꾸면 아래처럼만 템플릿만 변경해서 해주면 된다.
dispatch에서 이미 로그인한 유저면 홈으로 돌아가게끔 설정하고, 아니면 계속 실행하게 해준다.
```python
class UserLoginView(auth_views.LoginView):
    template_name = 'accounts/signin.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse('home'))
        return super().dispatch(request, *args, **kwargs)
```

##회원가입
인라인 폼을 활용해서 CBV로 구현해 보긴 했는데, 어렵고 힘들어서 FBV로 일단 다시 원복해서 사용할까 한다.
###FBV
```python
def signup(request):  # 역시 GET/POST 방식을 사용하여 구현한다.
    if request.user.is_authenticated:
        return redirect(reverse('home'))
    if request.method == "GET":
        return render(request, 'accounts/signup.html', {'f': SignupForm(),
                                                             'ef': ProfileForm(),
                                                             })
    elif request.method == "POST":
        form = SignupForm(request.POST)
        profile_form = ProfileForm(request.POST)
        if form.is_valid() and profile_form.is_valid():
            if form.cleaned_data['password'] == form.cleaned_data['password_check']:
            # cleaned_data는 사용자가 입력한 데이터를 뜻한다.
            # 즉 사용자가 입력한 password와 password_check가 맞는지 확인하기위해 작성해주었다.
                new_user = User.objects.create_user(form.cleaned_data['username'], form.cleaned_data['email'], form.cleaned_data['password'])
                # User.object.create_user는 사용자가 입력한 name, email, password를 가지고 아이디를 만든다.
                # 바로 .save를 안해주는 이유는 User.object.create를 먼저 해주어야 비밀번호가 암호화되어 저장된다.
                # new_user.last_name = form.cleaned_data['last_name']
                # new_user.first_name = form.cleaned_data['first_name']
                # 나머지 입력하지 못한 last_name과, first_name은 따로 지정해준다.
                # new_user.save(commit=False)
                new_user.profile.nickname = profile_form.cleaned_data['nickname']
                new_user.profile.phone_number = profile_form.cleaned_data['phone_number']
                new_user.save()
                # return render(request, 'accounts/sign_finish.html', {'user_name':profile_form.cleaned_data['nickname']})
                # return render(request, 'accounts/signup_done.html', {'user_name':profile_form.cleaned_data['nickname']})
                return redirect('home')
                # return HttpResponseRedirect(reverse('home'))
            else:
                return render(request, 'accounts/signup.html', {'f': form,
                                                                'ef': profile_form,
                                                                'error': '비밀번호와 비밀번호 확인이 다릅니다.'})  # password와 password_check가 다를 것을 대비하여 error를 지정해준다.
        else:  # form.is_valid()가 아닐 경우, 즉 유효한 값이 들어오지 않았을 경우는
            return render(request, 'accounts/signup.html', {'f': form,
                                                            'ef': profile_form,
                                                            })
            # return render(request, 'accounts/signup.html', {'f': form})
            # 원래는 error 메시지를 지정해줘야 하지만 따로 지정해주지 않는다.
            # 그 이유는 User 모델 클래스에서 자동으로 error 메시지를 넘겨줌
```
###CBV
책에서 봤던 인라인 폼셋을 활용해보기로 했다. 어째 더 지저분해지는거 같아서 위로 돌려 놓았다.
```python
# forms
ProfileInlineFormSet = inlineformset_factory(User, Profile,
                                             fields=['nickname','phone_number'])

# urls
path('signup/', views.UserSignUpView.as_view(), name='signup'),

# views
from django.contrib.auth import get_user_model
from django.forms.utils import ErrorList
from django import forms


class UserSignUpView(CreateView):
    model = get_user_model()
    form_class = SignupForm
    template_name = 'accounts/signup.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['formset'] = ProfileInlineFormSet(self.request.POST, self.request.FILES)
        else:
            context['formset'] = ProfileInlineFormSet()
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        if form.cleaned_data['password'] == form.cleaned_data['password_check']:
            formset = context['formset']
            if formset.is_valid():
                for eform in formset:
                    nickname = eform.cleaned_data['nickname']
                    phone_number = eform.cleaned_data['phone_number']
                print(nickname)
                print(phone_number)
                new_user = User.objects.create_user(form.cleaned_data['username'], form.cleaned_data['email'], form.cleaned_data['password'])
                new_user.profile.nickname = nickname
                new_user.profile.phone_number = phone_number
                new_user.save()
                return redirect('home')
            else:
                return self.render_to_response(self.get_context_data(form=form))
        else:
            form._errors[forms.forms.NON_FIELD_ERRORS] = ErrorList([
                u'비밀번호를 확인해주세요.'
            ])
            return self.render_to_response(self.get_context_data(form=form))
```

###html
```html
{% raw %}
{% if form.non_field_errors %}
	<div class="alert alert-danger">{{ form.non_field_errors }}</div>
{% endif %}

{% if formset.errors %}
	{% for dict in formset.errors %}
		{% for k, error in dict.items %}
			<div class="alert alert-danger">{{ k }} - 필수항목입니다.</div>
		{% endfor %}
	{% endfor %}
{% endif %}
<form action="" method="POST">
	{% csrf_token %}
	<div class="form-group">
		<h1><img src="{% static 'img/logo.png' %}" class="mainLogo"></h1>
		<label for="id">아이디</label>
		{{ form.username }}
	</div>
	<div id="check-user"></div>
	{{ formset.management_form }}
	{% for form in formset %}
		{{ form.id }}
	<div class="form-group">
		<label for="nickname">닉네임</label>
		{{ form.nickname|attr:"id:nickName"|add_class:"form-control"|attr:"placeholder:닉네임을 입력해주세요." }}
	</div>
	<div id="check-nickname"></div>
	<div class="form-group">
		<label for="phonenumber">전화번호</label>
		{{ form.phone_number|add_class:"form-control"|attr:"placeholder:전화번호를 입력해주세요." }}
	</div>
	{% endfor %}
	<div class="form-group">
		<label for="password">비밀번호</label>
		{{ form.password }}
	</div>
	<div>
		<label for="re-password">재확인</label>
		{{ form.password_check }}
	</div>
	<div class="alert alert-success" id="alert-success">비밀번호가 일치합니다.</div>
	<div class="alert alert-danger" id="alert-danger">비밀번호가 일치하지 않습니다.</div>
		<button type="submit" class="btn btn-outline-primary">회원가입하기</button>
</form>
 {% endblock %}
{% endraw %}
```
