

// 返回最小与最大值之间的随机数，包含最大最小值
function getRandomInt(min,max){
  return Math.floor(Math.random() * (max - min+1) + min)
}

//将数组的副本循环随机打乱重组一个新数组返回
export function shuffle(arr){
  let _arr = arr.slice();
  for(let i=0;i<_arr.length;i++){
    let j = getRandomInt(0,i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
