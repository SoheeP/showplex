[TOC]

# Showplex

### Introduction

한 페이지에서 영화, 연극, 뮤지컬에 대한 정보를 확인할 수 있는 페이지입니다.

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

### Pages

##### Sign up

![signup](https://user-images.githubusercontent.com/43696483/76065314-bef74800-5fce-11ea-9c87-feb33993df14.gif)

* 필수 입력 영역은 Html `required` 속성 사용

* 비밀번호 정규식 사용(숫자, 영문 조합 8~16자)

* Captcha로 자동입력방지 

* 아이디 중복확인은 db에서 확인

  ```js
  // db - auth.js파일
  router.route('/signup')
  .post(async (req, res, next) => {
  
    const email  = req.body.email,
    password     = req.body.password,
    username     = req.body.username,
    phone        = req.body.phone,
    verifyNumber = req.body.captcha;
     
    let verify, result;
    /** 
     * NOTE: result 값 
     * 1: 가입 완료
     * 2: 무엇인가의 에러로 인한 실패
     * 3: 인증 실패
     * 4: 중복 체크
     * */ 
    if(verifyNumber.length === 0){
      //인증번호(captcha) 없음
      result = { result: 3 };
      res.json(result)
    } else {
      verify = 1;
      db.query(`select * from showplex.user where email="${email}"`, (err, results) => {
        if(err) throw err;
        if(results.length > 0 ){
          //이미 있는 아이디일 때
          res.json({ result: 4 });
        } else {
          // 데이터 삽입
          db.query(`insert into showplex.user (email, password, username, phone, verifyNumber, verify) values ("${email}", "${password}", "${username}", "${phone}", "${verifyNumber}", "${verify}")`, (error, results) => {
            if(error){
              result = { result: 2 };
              res.json(result);
              console.log(`Error: 2 : ${error}, ${results}`);
            } else {
              result = { result: 1 };
              res.json(result);
              console.log(`Success ! ${results}`);
            };
          });
        };
      });
    };
  });
  ```

  

* 가입 완료 후 로그인 페이지로 이동