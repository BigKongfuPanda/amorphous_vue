import es6Promise from 'es6-promise';
import axios from 'axios';
import qs from 'qs';
import { MessageBox, Message } from 'element-ui';
import router from '@/router';

es6Promise.polyfill();
require('promise.prototype.finally').shim();

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'api';
}

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    const method = response.config.method.toUpperCase();
    const _data = response.data;

    // 如果登录失败，则返回 302，由前端跳转到登录页面去
    if (_data.status == 302) {
        Message({
            message: _data.message,
            type: 'error'
        });
        return router.push({ path: '/login'});
    }
    
    if(_data.status != 0) {
        Message({
            message: _data.message,
            type: 'error'
        });
        return {
            status: -1,
            message: _data.message
        };
    }

    // GET 请求不会弹框
    if (method !== 'GET' && _data.status == 0) {
        Message({
            message: _data.message,
            type: 'success'
        });
    }

    return _data.data || {};
}, function (error) {
    // Do something with response error
    MessageBox.alert(error.message, '系统提示', { confirmButtonText: '确定' });
    return Promise.reject(error);
});

/**
 * 封装axios的通用请求
 * @param  {string}   method     get\post\put\delete
 * @param  {string}   url       请求的接口URL
 * @param  {object}   param     传的参数，没有则传空对象
 */
function http(method, url, param) {
    method = method.toLowerCase();
    param = param && typeof param === 'object' ? param : {};
    const config = {
        url: url,
        method: method,
        transformRequest: [function () {
            return qs.stringify(param);
        }],
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    // post请求时需要设定Content-Type
    if (method === 'post' || method === 'put' || method === 'delete') {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        config.data = param;
    } else if (method === 'get') {
        config.params = param;
    }

    // axios.defaults.baseURL = store

    return axios(config);
}

export {
    http
};
