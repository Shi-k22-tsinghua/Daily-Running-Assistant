---
title: 天天乐跑 - API
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.23"

---

# 天天乐跑 - API

Base URLs:

# Authentication

# 基础功能

## GET 返回所有用户信息

GET /api/users

例子：http://124.221.96.133:8000/api/users

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

```json
[
  {
    "_id": "67409a73c6cfed3ef9229970",
    "username": "shikai",
    "password": "password2",
    "createdAt": "2024-11-22T14:51:31.784Z",
    "updatedAt": "2024-11-22T14:51:31.784Z",
    "__v": 0
  },
  {
    "_id": "67413a12758f32498eb2b697",
    "username": "yushuren",
    "password": "password42",
    "createdAt": "2024-11-23T02:12:34.497Z",
    "updatedAt": "2024-11-23T02:12:34.497Z",
    "__v": 0
  },
  {
    "_id": "67413a3c758f32498eb2b69b",
    "username": "yushuren",
    "password": "password42",
    "createdAt": "2024-11-23T02:13:16.005Z",
    "updatedAt": "2024-11-23T02:13:16.005Z",
    "__v": 0
  },
  {
    "_id": "67414203da5d60c44ab9b143",
    "username": "testing",
    "password": "password42",
    "createdAt": "2024-11-23T02:46:27.929Z",
    "updatedAt": "2024-11-23T02:46:27.929Z",
    "__v": 0
  },
  {
    "_id": "674142d1da5d60c44ab9b14a",
    "username": "liyang",
    "password": "liyangpassword",
    "createdAt": "2024-11-23T02:49:53.765Z",
    "updatedAt": "2024-11-23T02:49:53.765Z",
    "__v": 0
  },
  {
    "_id": "67415563da5d60c44ab9b150",
    "username": "test",
    "password": "test",
    "createdAt": "2024-11-23T04:09:07.596Z",
    "updatedAt": "2024-11-23T04:09:07.596Z",
    "__v": 0
  },
  {
    "_id": "67418e13da5d60c44ab9b15b",
    "username": "yushurenTest",
    "password": "yushurenpassword",
    "createdAt": "2024-11-23T08:10:59.531Z",
    "updatedAt": "2024-11-23T08:10:59.531Z",
    "__v": 0
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» username|string|true|none||none|
|» password|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

## POST 注册

POST /api/users

例子：http://124.221.96.133:8000/api/users

> Body 请求参数

```json
{
  "username": "test_username",
  "password": "test_password"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

```json
{
  "username": "test_username",
  "password": "test_password",
  "_id": "674194cfda5d60c44ab9b15f",
  "createdAt": "2024-11-23T08:39:43.038Z",
  "updatedAt": "2024-11-23T08:39:43.038Z",
  "__v": 0
}
```

> 400 Response

```json
{
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» username|string|true|none||none|
|» password|string|true|none||none|
|» _id|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## GET 根据username返回单个用户信息

GET /api/users/{id}

例子：http://124.221.96.133:8000/api/users/:id

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|id|path|string| 是 |none|

> 返回示例

```json
[
  {
    "_id": "67409a73c6cfed3ef9229970",
    "username": "shikai",
    "password": "password2",
    "createdAt": "2024-11-22T14:51:31.784Z",
    "updatedAt": "2024-11-22T14:51:31.784Z",
    "__v": 0
  },
  {
    "_id": "67413a12758f32498eb2b697",
    "username": "yushuren",
    "password": "password42",
    "createdAt": "2024-11-23T02:12:34.497Z",
    "updatedAt": "2024-11-23T02:12:34.497Z",
    "__v": 0
  },
  {
    "_id": "67413a3c758f32498eb2b69b",
    "username": "yushuren",
    "password": "password42",
    "createdAt": "2024-11-23T02:13:16.005Z",
    "updatedAt": "2024-11-23T02:13:16.005Z",
    "__v": 0
  },
  {
    "_id": "67414203da5d60c44ab9b143",
    "username": "testing",
    "password": "password42",
    "createdAt": "2024-11-23T02:46:27.929Z",
    "updatedAt": "2024-11-23T02:46:27.929Z",
    "__v": 0
  },
  {
    "_id": "674142d1da5d60c44ab9b14a",
    "username": "liyang",
    "password": "liyangpassword",
    "createdAt": "2024-11-23T02:49:53.765Z",
    "updatedAt": "2024-11-23T02:49:53.765Z",
    "__v": 0
  },
  {
    "_id": "67415563da5d60c44ab9b150",
    "username": "test",
    "password": "test",
    "createdAt": "2024-11-23T04:09:07.596Z",
    "updatedAt": "2024-11-23T04:09:07.596Z",
    "__v": 0
  },
  {
    "_id": "67418e13da5d60c44ab9b15b",
    "username": "yushurenTest",
    "password": "yushurenpassword",
    "createdAt": "2024-11-23T08:10:59.531Z",
    "updatedAt": "2024-11-23T08:10:59.531Z",
    "__v": 0
  }
]
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» _id|string|true|none||none|
|» username|string|true|none||none|
|» password|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

## PUT 更新用户

PUT /api/users/update

例子：http://124.221.96.133:8000/api/users

> Body 请求参数

```json
{
  "username": "test_username",
  "password": "test_password"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

```json
{
  "username": "test_username",
  "password": "test_password",
  "_id": "674194cfda5d60c44ab9b15f",
  "createdAt": "2024-11-23T08:39:43.038Z",
  "updatedAt": "2024-11-23T08:39:43.038Z",
  "__v": 0
}
```

> 400 Response

```json
{
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» username|string|true|none||none|
|» password|string|true|none||none|
|» _id|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## DELETE 删除用户

DELETE /api/users/delete

例子：http://124.221.96.133:8000/api/users/delete

> Body 请求参数

```json
{
  "username": "test_username",
  "password": "test_password"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

```json
{
  "username": "test_username",
  "password": "test_password",
  "_id": "674194cfda5d60c44ab9b15f",
  "createdAt": "2024-11-23T08:39:43.038Z",
  "updatedAt": "2024-11-23T08:39:43.038Z",
  "__v": 0
}
```

> 400 Response

```json
{
  "message": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» username|string|true|none||none|
|» password|string|true|none||none|
|» _id|string|true|none||none|
|» createdAt|string|true|none||none|
|» updatedAt|string|true|none||none|
|» __v|integer|true|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

## POST 登录

POST /api/users/login

例子：http://124.221.96.133:8000/api/users/login

> Body 请求参数

```json
{
  "username": "test_username",
  "password": "test_password"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

```json
{
  "message": "Login successful",
  "token": "token",
  "user": {
    "_id": "674194cfda5d60c44ab9b15f",
    "username": "test_username",
    "password": "test_password",
    "createdAt": "2024-11-23T08:39:43.038Z",
    "updatedAt": "2024-11-23T08:39:43.038Z",
    "__v": 0
  }
}
```

> 401 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|none|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|
|» token|string|true|none||none|
|» user|object|true|none||none|
|»» _id|string|true|none||none|
|»» username|string|true|none||none|
|»» password|string|true|none||none|
|»» createdAt|string|true|none||none|
|»» updatedAt|string|true|none||none|
|»» __v|integer|true|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» message|string|true|none||none|

# 用户settings

## POST 修改头像

POST /api/users/update/profilepic

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 修改昵称

PUT /api/users/update/nickname

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET get昵称

GET /api/users/profilepic/{username}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# run数据

## PUT 上传 Run Data

PUT /api/users/run/data

> Body 请求参数

```json
{
  "username": "SHIKAI",
  "runData": {
    "meters": 5000,
    "seconds": 1500,
    "latitude": 37.775,
    "longitude": -122.4195,
    "running": true,
    "markers": [
      {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "id": 1
      },
      {
        "latitude": 37.775,
        "longitude": -122.4195,
        "id": 2
      }
    ],
    "start": "2024-12-09T10:00:00Z"
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 上传 Run Record

POST /api/users/run/record

> Body 请求参数

```yaml
{}

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 根据id获取 run record

GET /api/users/run/records/{username}/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 根据id删除 run record

DELETE /api/users/run/records/{username}/{id}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|id|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取当前 Run Data

GET /api/users/run/data/{username}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取 Run Record

GET /api/users/run/records/{username}

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 多人跑步

## GET 获取 Run Room

GET /api/runRoom/{runID}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|runID|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取所有 Run Room

GET /api/runRoom/all

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 创建Run Room

POST /api/runRoom/create

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 加入Run Room

POST /api/runRoom/join

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 退出 Run Room

POST /api/runRoom/leave

> Body 请求参数

```json
{
  "runID": 159,
  "username": "SHIKAI",
  "password": 159
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除 Run Room

DELETE /api/runRoom/delete

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 更新 Run Room

POST /api/runRoom/update

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 论坛

## POST 发帖

POST /api/users/share/posts

> Body 请求参数

```json
{
  "title": "b",
  "content": "b",
  "username": "test"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取全部帖子

GET /api/users/share/posts

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 根据postId获取帖子

GET /api/users/share/posts/{postId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## PUT 更新帖子

PUT /api/users/share/posts/{postId}

> Body 请求参数

```json
{
  "title": "b",
  "content": "b",
  "username": "test"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除帖子

DELETE /api/users/share/posts/{postId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 根据username获取帖子

GET /api/users/share/{username}/posts

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 发布评论

POST /api/users/share/posts/{postId}/comments

> Body 请求参数

```json
{
  "content": "comment1",
  "username": "test"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 获取单个帖子下的评论

GET /api/users/share/posts/{postId}/comments/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## DELETE 删除评论

DELETE /api/users/share/comments/{commentId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|commentId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 点赞帖子

POST /api/users/share/posts/{postId}/likePost

> Body 请求参数

```json
{
  "username": "username"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 取消点赞帖子

POST /api/users/share/posts/{postId}/unlikePost

> Body 请求参数

```json
{
  "username": "test"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 点赞评论

POST /api/users/share/posts/{CommentId}/likeComment

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|CommentId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 取消点赞评论

POST /api/users/share/posts/{commentId}/unlikeComment

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|commentId|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 查看用户是否点赞帖子

POST /api/users/share/posts/{postId}/ifLikedPost

> Body 请求参数

```json
{
  "username": "test4"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|postId|path|string| 是 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 删除数据库

## DELETE 删除所有 Users

DELETE /api/posts/deleteAll

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

<h2 id="tocS_User">User</h2>

<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
"string"

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|string|false|none||none|

