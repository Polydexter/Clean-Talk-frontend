export default function authHeader() {
    const localStorageUser = localStorage.getItem('user');
    if (!localStorageUser) {
        return {}
    }

    const user = JSON.parse(localStorageUser);
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}`}
    }
    return {};
}
