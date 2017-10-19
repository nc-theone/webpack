
'use strict';

// 返回当前时间戳
export default () => {
  return new Date().getTime();
};

export function getYear() {
  return '2017';
}

export function getMonth() {
  return '10';
}

function getMinutes() {
  return 'minutes';
}

function getSeconds() {
  return 'seconds';
}

// 如果采用这种方式，即使在业务代码中没有用到 getSeconds 那么该方法也会被打包

export { getMinutes, getSeconds }
