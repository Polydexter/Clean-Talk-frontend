import axios from "axios";

// Provides a set of custom methods to handle user info and login functions
class AuthService {
  setUserInLocalStorage(data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  setTokensInLocalStorage(data) {
    localStorage.setItem("tokens", JSON.stringify(data));
  }

  // Send credential to API, if success: store tokens, if not - return response data
  async login(email, password) {
    const response = await axios.post("http://localhost:8000/api/token/", {
      email,
      password,
    });
    if (!(response.data.access && response.data.refresh)) {
      return response.data;
    }
    const tokens = {
      access: response.data.access,
      refresh: response.data.refresh,
    };
    this.setTokensInLocalStorage(tokens);
    return tokens;
  }

  // Remove username and tokens from local storage on logout
  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return JSON.parse(user);
  }

  getCurrentUserTokens() {
    const tokens = localStorage.getItem("tokens");
    return JSON.parse(tokens);
  }
}

export default new AuthService();
