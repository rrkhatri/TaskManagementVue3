const TOKEN_KEY = "token";
const USER_ID_KEY = "user_id";

export const getToken = () => {
    return window.localStorage.getItem(TOKEN_KEY);
}

export const saveToken = (token) => {
    window.localStorage.setItem(TOKEN_KEY, token);
}

export const destroyToken = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_ID_KEY);
}

export const setUserId = (userId) => {
    window.localStorage.setItem(USER_ID_KEY, userId.toString());
}

export const getUserId = () => {
    return window.localStorage.getItem(USER_ID_KEY);
}

export default { getToken, saveToken, destroyToken, getUserId, setUserId };

