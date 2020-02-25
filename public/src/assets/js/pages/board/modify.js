$(document).ready(function() {
  $('#summernote').summernote({
    height: 150,
    tabsize: 2
  });
});

let writeForm = common.elm('#writeForm');
let contents = common.elm('#summernote');
let title = common.elm('.section__write__title');

writeForm.addEventListener("submit", (e) =>{
  e.preventDefault();
  if(title.value === '' || contents.value === ''){
    alert('입력되지 않았습니다.')
  } else {
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
      alert('등록이 완료되었습니다.');
      window.location.href = '/board/freeboard';
    } else if(data.result === 2 ){
      alert('등록에 실패하였습니다.');
    }
  })
  }
})

