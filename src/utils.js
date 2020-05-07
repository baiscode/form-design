const objCopy = function(target) {
  if(typeof target === 'object') {
    const copyTarget = Array.isArray(target) ? [] : {};
    for(let i in target) {
      copyTarget[i] = objCopy(target[i]);
    }
    return copyTarget;
  }else {
    return target;
  }
}

const randomId = function(){
  let randomId = '';
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F'];
  let i = 10;
  while(i) {
    randomId += arr[Math.ceil(Math.random() * 15)] ;
    i --;
  }
  return randomId;
}

export {
  objCopy,
  randomId
}