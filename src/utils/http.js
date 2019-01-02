import es6Promise from 'es6-promise';
import axios from 'axios';
import qs from 'qs';

es6Promise.polyfill();
require('promise.prototype.finally').shim();

// import store from '../store/store';
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

    // axios.defaults.baseURL = store.
    return axios(config);
}

export {
    http
};
