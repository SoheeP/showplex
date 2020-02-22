$(document).ready(function() {
  $('#summernote').summernote({
    height: 150,
    tabsize: 2
  });
});

let writeForm = common.elm('#writeForm');
let contents = common.elm('#summernote');
let title = common.elm('.section__write__title');

console.log(writeForm);
console.log(textValue);
console.log(titleValue)

writeForm.addEventListener("submit", (e) =>{
  e.preventDefault();
  let writeConfig = {
    url: '/board/freeboard/write',
    method: 'post',
    data: {
      title: title.value,
      contents: contents.value
    }
  };
  axios(writeConfig).then((response) => {
    let { data } = response;
    if(data.result === 1 ){
      console.log('등록완료')
    } else if(data.result === 2 ){
      console.log('무언가의 오류로 등록 실패')
    }
  })
  console.log(textValue.value);
  console.log(titleValue.value);
})

