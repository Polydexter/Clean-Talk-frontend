
class AuthHeader {
    
    localStorageUser = localStorage.getItem('user');

    getAccessToken() {
        if (!localStorageUser) {
            return {}
        }
        const user = JSON.parse(localStorageUser);
        if (user && user.access) {
            return { Authorization: `Bearer ${user.acces}`}
        }
        return {};
    }

    getRefreshToken() {
        if (!localStorageUser) {
            return {}
        }
        const user = JSON.parse(localStorageUser);
        if (user && user.refresh) {
            return { Authorization: `Bearer ${user.refresh}`}
        }
        return {};
    }
   
}

export default new AuthHeader
