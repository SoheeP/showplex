let copyBtn = common.elm('.contact__button-copy');

common.footerBottom();

copyBtn.addEventListener("click", (e)=>{
  e.preventDefault();
  let temp = document.createElement('textarea');
  document.body.appendChild(temp);
  temp.value = 'psh950502@naver.com';
  // textarea 내용 전체 선택
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  alert('Copied!');
})