import axios from 'axios';
import LoginService from './LoginService';

console.log("SOLPLAY_API_URL", import.meta.env.VITE_SOLPLAY_API_URL);
console.log("SOLPLAY_API_KEY", import.meta.env.VITE_SOLPLAY_API_KEY);

class BaseService {
    constructor(baseURL = import.meta.env.VITE_SOLPLAY_API_URL ) {
        this.baseURL = baseURL;
    }

    async getHeaders() {
        const token = await LoginService.token();
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    async doRequest(method, url, data = null, headers = {}) {
        console.log(method,url, data, headers);
        let result;
        let retry = 2;
        if (url.substr(0, 1) !== '/'){
            url = `/${url}`;            
        }
        url = `${this.baseURL}${url}`;
        while (retry) {
            let defaultHeaders = await this.getHeaders();
            retry--;
            try {
                result = await axios({
                    method,
                    url,
                    data,
                    headers: { ...defaultHeaders, ...headers }
                });
                break;
            } catch (error) {
                console.log("ERRROR",error.response , error.response.status,  retry)
                if (error.response && error.response.status === 401 && retry > 0) {
                    result = null;
                    await LoginService.refreshToken();
                    // await LoginService.getNewTokens();
                    // console.log("Nuevo token", token);
                } else {
                    throw error;
                }
            }
        }

        return result;
    }

    async doGet(url, headers = {}) {
        return this.doRequest('get', url, null, headers);
    }

    async doPost(url, data, headers = {}) {
        return this.doRequest('post', url, data, headers);
    }

    async doPut(url, data, headers = {}) {
        return this.doRequest('put', url, data, headers);
    }

    async doPatch(url, data, headers = {}) {
        return this.doRequest('patch', url, data, headers);
    }

    async doDelete(url, headers = {}) {
        return this.doRequest('delete', url, null, headers);
    }
}


export default BaseService;