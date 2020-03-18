# Showplex

[TOC]



### Introduction

영화, 연극, 뮤지컬에 대한 정보를 확인할 수 있으며 회원가입 및 자유게시판을 사용할 수 있습니다.
**포트폴리오용 페이지입니다. ** [페이지로 이동](http://34.64.177.248:8080/)

![FireShot Capture 002 - Home - localhost](https://user-images.githubusercontent.com/43696483/75973015-d7585b80-5f17-11ea-99b4-9162aa264a48.png)

![FireShot Capture 003 - Detail - localhost](https://user-images.githubusercontent.com/43696483/75973110-fce56500-5f17-11ea-8d55-fa5dd5ddcf00.png)

![FireShot Capture 004 - Sign up - localhost](https://user-images.githubusercontent.com/43696483/75973385-69606400-5f18-11ea-8187-ef4b61e35218.png)

##### USED

* Front
  * Bootstrap 4
  * Swiper
  * Scss
  * Express(ejs)
* Back
  * Node.js
  * Axios
  * MySql
  * Express-session

* Bundler
  * Gulp

##### Implement

* API data 출력
* 회원가입, 회원정보 수정
* 게시판 등록, 수정, 삭제
* 로그인 기록
* 게시판, 로그인 기록 페이지네이션



### Getting Start

이 페이지를 로컬에서 구동하여 확인하시려면 아래 내용을 따라 진행해주시면 됩니다.

##### 시작 전 필수 사항

1. Node.js 가 설치되어 있어야 합니다.
2. Git bash가 설치되어 있어야 합니다.
3. 

##### 설치방법

1. Git bash에서 아래 repo를 클론합니다.

   ```bash
   $ git clone https://github.com/SoheeP/showplex.git
   ```

2. Npm 을 이용하여 필요한 모듈을 설치합니다.

   ```bash
   $ npm i
   ```

3. Gulp를 실행하여 scss, js 파일들을 컴파일합니다.

   ```bash
   $ gulp
   ```

4. 2번과 3번이 완료되었다면, `npm start`로 로컬서버를 실행합니다.

   ```bash
   $ npm start
   ```

5. 브라우저에서 `localhost:5050`을 입력하여 접속합니다.

* Back-end(DB) 설치는 [여기로 이동해주세요.](https://github.com/SoheeP/showplex_db)



### Pages

##### Sign up

![signup](https://user-images.githubusercontent.com/43696483/76065314-bef74800-5fce-11ea-9c87-feb33993df14.gif)

* 필수 입력 영역은 Html `required` 속성 사용했습니다.
* 비밀번호 정규식 사용(숫자, 영문 조합 4~16자)

  * 비밀번호 암호는 hash 생성으로 단방향암호화를 적용했습니다.
  * 라이브페이지에서 테스트 하실 때엔 테스트용으로 작성하시기 바랍니다.
* Captcha로 자동입력방지
* 아이디 중복확인은 db에서 확인합니다.

* 가입 완료 후 로그인 페이지로 이동합니다.



##### Sign In - My Page, Change Profile

![signIn-mypage](https://user-images.githubusercontent.com/43696483/76620980-c049e700-6571-11ea-83c4-22c36e0687bf.gif)

* 로그인 후 My Page에 들어가면, 접속한 Log 데이터를 확인할 수 있습니다.

* Log 데이터는 페이지당 10개의 데이터가 나타나며 페이지네이션 목록으로 확인가능합니다.

* 회원정보 변경 시, 모든 사항 뿐만 아니라 일부 정보만 입력해도 수정될 수 있도록 백엔드 서버에서 처리하였습니다.

  ```js
  router.post('/profile/change', (req, res, next) => {
    console.log(req.body, 'req.body');
    // const { usernum, password, username, phone } = req.body;
    const { usernum, ...reqBody } = req.body;
    let body = {};
    let queryString = '';
    for(let key in reqBody){
      queryString += `${key}='${reqBody[key]}', `
    }
    query(`UPDATE showplex.user SET ${queryString.slice(0, queryString.length-2)} where usernum='${usernum}'`, (result) => {
      console.log(result, 'After update result');
      body.result = 1;
      db.query(`select * from showplex.user where usernum="${usernum}"`, async (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
          body.userData = _.omit(results[0], ['password', 'verifyNumber']);
          res.json(body);
        };
      });
    });
  })
  ```



##### Freeboard

![board](https://user-images.githubusercontent.com/43696483/76620989-c4760480-6571-11ea-98da-0245be486e87.gif)

* 로그인 상태에서만 글을 쓸 수 있습니다.
  &rarr; 로그인하지 않았을 경우 글 내용만 조회할 수 있습니다.
* 게시글 조회 및 수정, 삭제가 가능합니다.
  * 자신이 작성한 글을 확인했을 때만 수정, 삭제 버튼이 나타납니다.
  * 수정 시 기존 글 내용이 이미 삽입되어 있습니다.
  * 텍스트 에디터는 Summernote.js 사용하였습니다.
* 게시글은 페이지당 10개의 데이터가 나타나며 페이지네이션 목록으로 확인 가능합니다.
  * 5개 목록이 되기 전에는 이전, 다음 페이지로 이동하는 버튼이 나타나지 않습니다.

