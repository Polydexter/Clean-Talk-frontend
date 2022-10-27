
class AuthHeader {
    
    localStorageUser = localStorage.getItem('user');

    getAccessToken() {
        console.log('AuthHeader Access triggered')
        if (!localStorageUser) {
            return {}
        }
        const user = JSON.parse(localStorageUser);
        if (user && user.access) {
            return { Authorization: `Bearer ${user.acces}`}
        }
        return {};
    }
}

export default new AuthHeader
