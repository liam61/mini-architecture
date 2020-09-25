# mini-architecture

a full mini app architecture demo

## Packages

- [android](https://github.com/lawler61/mini-architecture/tree/master/android) a project for user terminals, provides Javascript runtime

- [framework](https://github.com/lawler61/mini-architecture/tree/master/framework) a lower-layer framework for mini apps

- [pack](https://github.com/lawler61/mini-architecture/tree/master/pack) a tool for packing user mini-app project and framework

- [mini](https://github.com/lawler61/mini-architecture/tree/master/mini) an example of mini-app

- [cli](https://github.com/lawler61/mini-architecture/tree/master/cli) mini-architecture cli

## Start

### 1. required environment

1. [Node](https://nodejs.org/zh-cn/), [Yarn](https://yarn.bootcss.com/)

2. [Java](https://www.oracle.com/cn/java/technologies/javase/javase-jdk8-downloads.html)

3. [Android](https://developer.android.com/studio/releases/platform-tools), you can also use [Android Studio](https://developer.android.com/studio/?hl=zh-cn) to download

4. [ADB](https://developer.android.com/studio/command-line/adb?hl=zh-cn)

### 2. 🔥quick start

1. `yarn global add @mini-architecture/cli`

2. `ma-cli -m build -e @mini --no-zip`

before you run, don't forget to connect mobile to you computer. It may be slow for the first time while you running

see [@mini-architecture/cli](https://github.com/lawler61/mini-architecture/tree/master/cli) for more details

### 3. dev

1. `git clone git@github.com:lawler61/mini-architecture.git && cd mini-architecture`

2. `yarn`

3. `yarn bootstrap` for all packages

4. `yarn dev / build` for dev or build

### 4. Quick install

install form [built apk](./mini-demo.apk)

## Testing env

1. OS: Mac

2. Mobile: 小米10（android 10）

## Blog post

[mini-architecture：从零手撸一整套小程序架构](https://github.com/lawler61/blog/blob/master/js/mini-architecture/index.md)

## Records

<image src="./record.gif" width=400 alt="mini record" />

## TODO

- [x] build logs

- [x] package publish 改造

- [x] package dev & cli 调用

- [x] cli

- [ ] devtools

- [ ] v8 thread worker

- [ ] v8 thread debug tool

- [ ] all view page build in one html

## References

1. [hera](https://github.com/weidian-inc/hera)

2. [hera-cli](https://github.com/weidian-inc/hera-cli)

3. [EMP — 基于 Vue.js 的小程序引擎底层框架实现](https://zhaomenghuan.js.org/blog/what-is-emp.html)

4. [Polymer](https://polymer-library.polymer-project.org/3.0/docs/about_30)
