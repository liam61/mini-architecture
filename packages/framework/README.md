# framework

a lower-layer framework for mini apps

1. service: handle logical service in mini-app

2. webview: handle UI display and user interaction

3. bridge: a bridge for service <-> native <-> webview

## API

### 1. ma

- ma.navigateTo(Object object)

- ma.redirectTo(Object object)

- ma.reLaunch(Object object)

- ma.navigateBack(Object object)

- ma.setNavigationBarTitle(String string)

- ma.getSystemInfo(Object object)

- ma.alert(String string)

- ma.openLink(String string)

### 2. Page

- Page({ data: object })

- this.setData(Object object)

## Components

### 1. view

`properties`

- class?: string

### 2. button

`properties`

- class?: string

- disabled?: boolean

`events`

- bindtap?: string（function name）
