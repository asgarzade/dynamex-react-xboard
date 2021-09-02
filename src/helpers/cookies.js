export const getCookie = cname => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0, j = ca.length; i < j; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// export const setCookie = (cname, cvalue, expiryDate) => {
//     document.cookie = `${cname}=${cvalue}; expires=${expiryDate}`;
// }

// export const deleteCookie = cname => {   
//     document.cookie = cname +'=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// }