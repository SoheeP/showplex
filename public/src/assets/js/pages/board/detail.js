let deleteBtn = common.elm('.section__detail__button.delete');

function deleteBoard(){
  let path = window.location.pathname;
  let pathArr = path.split('/');
  let boardSeq = pathArr[pathArr.length-1];

  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault;
    let deleteConfig = {
      url: '/board/freeboard/detail/delete',
      method: 'post',
      data: {
        id: boardSeq,
      }
    };
    axios(deleteConfig).then((response) => {
      let { data } = response;
      console.log(data);
      if(data.result === 1){
        //삭제 성공
        alert('삭제가 완료되었습니다.');
        window.location.href = '/board/freeboard';
      } else if(data.result === 2) {
        alert('삭제되지 않았습니다. 관리자에게 문의하세요.');
      };
    });
  });
}

if(deleteBtn !== null || deleteBtn !== undefined){
  deleteBoard();
} 