class AuthHeader {
  localStorageUser = localStorage.getItem("user");

  getAccessToken() {
    if (!localStorageUser) {
      return {};
    }
    const user = JSON.parse(localStorageUser);
    if (user?.access) {
      return { Authorization: `Bearer ${user.acces}` };
    }
    return {};
  }
}

export default new AuthHeader();
