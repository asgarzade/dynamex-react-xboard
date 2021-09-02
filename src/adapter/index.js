import axios from 'axios';

const BASE_URL = process.env.REACT_APP_ENVIRONMENT === 'production' ? "https://api.dynamex.az" : process.env.REACT_APP_API_ENDPOINT;

let additionalHeaders = {};

if (process.env.REACT_APP_USE_TOKEN === 'YES') {
    additionalHeaders['Authorization'] = `Token ${process.env.REACT_APP_TOKEN}`
}

// axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    // baseURL: '/api/v1',
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    headers: {
        'Accept-Language': 'en',
        ...additionalHeaders
    }
});

const adapter = function (options) {
    function onSuccess(response) {
        return response.data;
    }
    function onError(error) {
        return Promise.reject(error.response || error.message);
    }
    return client(options)
        .then(onSuccess)
        .catch(onError);
};

export default adapter;
