// 表单校验规则

// 整数
export const integer = (rule, value, callback) => {
  const reg = /^(0|-?[1-9]\d*)$/;
  if(!reg.test(value)) {
    callback(new Error('请输入整数, 如 -2,-1,0,1,2,...'))
  } else {
    callback();
  }
};

// 正整数
export const positiveInteger = (rule, value, callback) => {
  const reg = /^[1-9]\d*$/;
  if(!reg.test(value)) {
    callback(new Error('请输入正整数, 如 1,2,3,...'))
  } else {
    callback();
  }
};

// 自然数 0, 1, 2, ...
export const number = (rule, value, callback) => {
  const reg = /^(0|[1-9]\d*)$/;
  if(!reg.test(value)) {
    callback(new Error('请输入自然数, 如 0,1,2,3,...'))
  } else {
    callback();
  }
};

// 小于，默认是 99999999
export const ltNumber = (max = 99999999) => {

  return (rule, value, callback) => {
    if (typeof value !== 'number') {
      value = Number(value);
    }
  
    if(value <= max) {
      callback();      
    } else {
      callback(new Error(`请输入不大于${max}的数值`))
    }
  };
};

// 大于，默认是 0
export const gtNumber = (min = 0) => {

  return (rule, value, callback) => {
    if (typeof value !== 'number') {
      value = Number(value);
    }
  
    if(value >= min) {
      callback();
    } else {
      callback(new Error(`请输入不小于${min}的数值`))
    }
  };
};

// 介于 默认：[0, 99999999]
export const Range = (min = 0, max = 99999999) => {

  return (rule, value, callback) => {
    if (typeof value !== 'number') {
      value = Number(value);
    }
  
    if(value >= min && value <= max) {
      callback();      
    } else {
      callback(new Error(`请输入${min} - ${max}之间的数值`))
    }
  };
};

export const checkFurnace = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('炉号不能为空'));
  }

  const reg = /^0[1-9]-[0-9]{8}-[0-9]{2}\/[0-9]{2}$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error('炉号格式错误'));
  }
};