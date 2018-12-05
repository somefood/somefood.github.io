---
layout: post
title: 버전 업그레이드 후 보드 펌웨어 업데이트 실행
category: MikroTik
tags: [mikrotik]
comments: true
---

미크로틱 장비들은 패키지 버전을 업데이트 하고 나서 보드 펌웨어도 올려주는 편이 좋은데,
재부팅을 눌러 진행해야 한다. 
이런 번거로움을 줄이기 위해 스크립트와 스케쥴러를 통해 장비가 부팅되었을 시 펌웨어 버전 비교 후 자동으로 업데이트를 진행해준다.

```
/system routerboard
:if ([get current-firmware] = [get upgrade-firmware]) do={
    :log info message="current firmware is latest version";
} else={
    :log info message="current firmware is not latest version. It will be upgraded now.";
    /system routerboard upgrade
    :delay 2s
    /system reboot
}
```
