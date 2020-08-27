---
layout: post
title: Django 프로젝트02 - 리액트와 SPA 방식으로 인스타그램 만들기(3)
category: Django
tags: [django, python]
comments: true
---

에듀캐스트 장고&리액트 강의를 듣고 정리하는 글이다.

# react-router-dom을 활용한 라우팅 처리
아래를 설치해주자.
> yarn add react-router-dom

리액트의 src폴더 밑에 pages와 components 폴더를 생성해줄건데, pages에는 라우팅을 처리하는 컴포넌트를 넣고 components에는 위의 내용들을 표현해줄 컴포넌트들을 만들어 줄 것이다.

최상위 index.js를 다음과 같이 수정
```javascript
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
import Root from "pages";

ReactDOM.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById("root")
);
```
BrowserRouter로 Root컴포넌트를 감싸줘서 그 밑에서 Route를 이용할 수 있도록 해준다.

#### pages/index.js를 작성
<Route> 컴포넌트를 활용해 django의 urls와 최대한 비슷하게 구현해 준다.
exact를 안하게 될시, 일치하는 것들이 모든것들이 표시되기에 해주는 것이 좋다.
```javascript
import React from "react";
import { Route } from "react-router-dom";
import AppLayout from "components/AppLayout";
import Home from "./Home"
import About from "./About"
import AccountsRoutes from "./accounts"

function Root() {
  return <AppLayout>
      최상위 컴포넌트
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route path="/accounts" component={AccountsRoutes} />
      </AppLayout>;
}

export default Root;

```

#### accounts/index.js
함수안에 {match}라는 것이 보일텐데, 상위에서 일치한 url을 갖고와줄 수 있다.
```javascript
import React from "react";
import { Route } from "react-router-dom";
import Profile from "./Profile";
import Login from "./Login";

function Routes({match}) {
  return (
    <>
      <Route exact path={match.url + "/profile"} component={Profile} />
      <Route exact path={match.url + "/login"} component={Login} />
    </>
  );
}

export default Routes;

```
