import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as qs from 'qs';

// tslint:disable-next-line:no-var-requires
const UserAgentCtor = require('user-agents');
const UserAgent = new UserAgentCtor();

export function createHttpAgent(baseURL?: string, timeout?: number): AxiosInstance {
    const config: AxiosRequestConfig = {
        headers: {
            'User-Agent': UserAgent.random().toString(),
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br'
        }
    };
    if (baseURL) {
        config.baseURL = baseURL;
    }
    if (timeout) {
        config.timeout = timeout;
    }

    const ax = axios.create(config);
    ax.defaults.paramsSerializer = (params) => qs.stringify(params, {arrayFormat: 'repeat'});
    return ax;
}
