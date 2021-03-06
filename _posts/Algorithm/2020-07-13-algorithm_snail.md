---
layout: post
title: 달팽이 배열(Python)
category: Algorithm
tags: [algorithm, python]
comments: true
---

달팽이 배열
========

달팽이 배열은 주어진 수(n)에 맞춰 nxn의 이중 배열을 생성하여서, 시계 방향으로 숫자가 늘어나는 배열이다. 이 시계 방향이 마치 달팽이 껍질 형태기 때문에 그리 부르는 듯 하다.
아래의 사진처럼 4x4 배열을 보면 더 이해가 갈 것이다.
![달팽이 배열](/assets/post_img/algorithm/snail.png)


## 규칙
n은 4로 주어졌다 가정하고, 규칙을 한 번 살펴보도록 하자.
1. 0행 0열부터 시작해서 1열, 2열, 3열로 증가하는 것을 볼 수 있다. **(n 만큼 열 증가)**
2. 이번엔 3열을 유지하고, 1행, 2행, 3행으로 증가하는 것을 볼 수 있다. 0행은 이미 채워졌으니 1행부터 채우는 것이다. **(n-1만큼 행 증가)**
3. 3행 3열에서 다시 열 감소가 이루어져 3행 0열까지 돌아온다. **(n-1만큼 열 감소)**
4. 3행 0열에서 다시 행 감소로 위로 올라간다. **(n-2만큼 행 감소)**

위의 과정들이 반복되어서 n이 0보다 작으면 종료되면 되는 것이다.

위의 규칙들을 살펴보면 처음 두 번은 열과 행이 증가하고, 두 번은 열과 행이 감소하는 것이다. 계속해서 열 -> 행 순서로 반복되는 것이다. 그리고 열일 때는 n인 상태고, 행일 때는 n-1형태로 n이 줄어드는 것을 볼 수 있다.

## 코드
코드를 통해 한 번 살펴보면 이해하기 좋을 것이다.
#### 파이썬
```python
def snail(n):
    arr = [[0 for j in range(n)] for i in range(n)] #1
    row = 0 #2
    col = -1 #2
    cnt = 1 #3
    trans = 1 #4
    while n > 0: #5
        for i in range(n): #6
            col += trans
            arr[row][col] = cnt
            cnt += 1
        n -= 1 #7
        for j in range(n): #8
            row += trans
            arr[row][col] = cnt
            cnt += 1
        trans *= -1 #9
    return arr


arr = snail(4)
for i in arr:
    for j in i:
        print('%5d' %j , end=' ')
    print()
```

1. 먼저 이중 배열을 만들어 준다. 각 자리는 0으로 초기화한다.
2. 인덱스에 접근할 row와 col을 초기화해준다. 이때, col을 -1로 초기화 해준 이유는 아래서 선언한 trans 변수를 통해 행열의 증가, 감소시킬건데, col을 0부터 작으면 index 초과 오류가 나기 때문이다.
3. cnt=1로 초기화해 인덱스마다 증가시켜 값을 넣어준다.
4. trans=1 을 통해 행열의 증가와 감소를 바꿔준다. 이때, 곱하기 -1을 해줘서 스위칭 해주면 된다.
5. while문을 선언해서 n이 0보다 클 때까지만 반복시킨다.
6. 먼저 열부터 제어해볼 것이다. for문에 col을 넣지 않은 이유는, col은 trans변수를 통해 증가, 감소할 것이기 때문이고, 위의 for문은 단순히 횟수를 반복시키기 위해 존재하는 것이다.
7. 위의 규칙을 봤듯이, 열은 n, 행은 n-1형태이기에 n을 1 감소시킨다.
8. 행을 제어하는 부분이다. 위의 열과 마찬가지로 trans로 증가 감소해주면 된다.
9. 이 부분이 중요하다. 규칙을 보면, (열, 행) 증가 (열, 행) 감소 형태이다. 이것을 위해 trans를 곱하기 -1을 해주어서 스위칭을 해주는 것이다.

이 과정들을 거치고 나면 달팽이 배열이 예쁘게 표시될 것이다.

#### JavaScript
```JavaScript
function snail(n){
  var array = Array.from(Array(n),()=> Array());
  var row = 0
  var col = -1
  var count = 1
  var trans = 1
  while (n>0){
    for(var i=0; i<n; i++){
      col+=trans;
      console.log("row:", row, "col:", col)
      array[row][col] = count;
      count++;
    }
    n--;
    for(var j=0; j<n; j++){
      row+=trans;
      console.log("row:", row, "col:", col)
      array[row][col] = count;
      count++;
    }
    trans *= -1
  }
  console.log(array);
}

snail(5)
```

## 느낀점
처음에 이 문제를 보았을 때, 어떤식으로 접근해야할지 감이 안왔다. 풀어왔던 이중배열 문제들은 첫 번째 행의 열에 대해 제어하는 그런 류의 문제(삼각형 문제)들만 풀어봤기 때문이다. 결국에는 계속 인터넷을 보고 풀었는데, 계속 잊어먹게 되는 것이다. 그러다 이번에는 필기도 해보면서 풀어보았고, 결국 풀 수 있었다. 예전에 참고했던것과 완전 판반이긴 했지만, 혼자 생각해보며 풀었다는 것에 큰 의의를 두고 싶다. 참 알고리즘이란 것은 어렵지만, 프로그래밍에 있어 사고력을 키워줄 수 있는 거 같다. 앞으로도 열심히 풀어봐야겠다.
