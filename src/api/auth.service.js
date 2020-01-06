import stockApi from './StockApi'

export default class AuthService  {
    _accessToken = null;

    saveToken(data) {
        const {accessToken, isAdmin} = data
        this._accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('isAdmin', isAdmin)
        return 
    }

    loadToken() {
        const token = localStorage.getItem('accessToken');
        this._accessToken = token;
        return token;
    }

    _getCommonOptions() {
        const token = this.loadToken();

        return {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        };
    }


    removeToken() {

        localStorage.removeItem('isAdmin')
        localStorage.removeItem('accessToken');
    }

    async signin(email, password) {
        const result = await stockApi.post('/auth/login', { email, password }, this._getCommonOptions());
        var data = {
            accessToken: result.data.accessToken,
            isAdmin: result.data.isAdmin
        }
        this.saveToken(data);
        
        return result.data;
    }

//   async signup(username, password) {
//     await post(`${this.BASE_URL}/auth/signup`, { username, password });
//   }

    async signout() {
        await stockApi.get('/auth/logout')
        this.removeToken();
    }
}
