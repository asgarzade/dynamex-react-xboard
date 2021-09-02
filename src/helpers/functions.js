import queryString from "query-string";

export const isEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

export const round = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

export const toggleClass = (element, condition, className) => {
    condition ? element.classList.add(className) : element.classList.remove(className);
};

export const updateParams = (props, param, value) => {
    const prevParams = queryString.parse(props.location.search);

    props.history.push({
        search: queryString.stringify({
            ...prevParams,
            [param]: value
        })
    });
};

export const removeParams = (props, params) => {
    const newparams = queryString.parse(props.location.search);
    params.forEach(param => delete newparams[param])
    props.history.push({
        search: queryString.stringify(newparams)
    });
};