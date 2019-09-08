import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as qs from 'qs';
import { randomUserAgent } from './user_agent';

export function createHttpAgent(baseURL?: string, timeout?: number): AxiosInstance {
    const config: AxiosRequestConfig = {
        headers: {
            'User-Agent': randomUserAgent(),
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
