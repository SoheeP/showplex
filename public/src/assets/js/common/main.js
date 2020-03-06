let common = {};


function fadeIn (el, ms){
  el = document.querySelector(el);
  el.style.opacity = 0;
  if(ms){
    let opacity = 0;
    const timer = setInterval(function(){
      // setInterval 이 돌아가는 텀(50ms)만큼 증가할 때 일정한 속도로 opacity를 증가시키기 위함
      opacity += 50 / ms;
      if(opacity >= 1){
        clearInterval(timer);
        opacity = 1;
      }
      // 완전히 나타나기 전(1이 되기전)까지 일정속도로 증가하는 opacity를 보여줌
      el.style.opacity = opacity
    }, 50)
  } else {
    // 시간이 입력되지 않으면 그냥 바로 뚝 뚝 끊기게 보임
    el.style.opacity = 1;
  }
};

// get element
function elm(elm){
  let target = document.querySelectorAll(elm);
  if (target.length === 0) return null;
  if (target !== undefined || target !== null){
    return (target.length === 1) ? target[0] : target;
  } else {
    return null;
  }
}

function changeClass(elm, prevClass, currentClass){
  elm.classList.remove(prevClass);
  elm.classList.add(currentClass);
}

common.fadeIn      = fadeIn;
common.elm         = elm;
common.changeClass = changeClass;