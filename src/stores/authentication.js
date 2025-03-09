import ApiService from "@/core/services/ApiService";
import TokenService from "@/core/services/TokenService";
import { defineStore } from "pinia";

export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        user: null,
        user_id: TokenService.getUserId(),
        isAuthenticated: !!TokenService.getToken(),
        errors: []
    }),
    actions: {
        login(credentials) {
            return new Promise((resolve, reject) => {
                ApiService.post("login", credentials)
                    .then((response) => {
                        const data = response.data.data;

                        TokenService.saveToken(data.token);
                        TokenService.setUserId(data.user.id)
                        this.user = data.user
                        this.user_id = data.user.id;
                        this.isAuthenticated = true;
                        resolve(data)
                    })
                    .catch((error) => {
                        this.setError(error.response?.data?.errors);
                        reject(error)
                    });
            })
        },
        register(credentials) {
            return new Promise((resolve, reject) => {
                ApiService.post("register", credentials)
                    .then((response) => {
                        const data = response.data.data;

                        TokenService.saveToken(data.token);
                        TokenService.setUserId(data.user.id)
                        this.user = data.user
                        this.user_id = data.user.id;
                        this.isAuthenticated = true;
                        resolve(data)
                    })
                    .catch((error) => {
                        this.setError(error.response?.data?.errors);
                        reject(error)
                    });
            })
        },
        setAuth(authUser) {
            this.isAuthenticated = true
        },
        setError(error) {
            this.errors = { ...error };
        },
        verifyAuth() {
            if (TokenService.getToken()) {
                ApiService.setHeader();
                ApiService.get("user")
                    .then(({ data }) => {
                        data.data.token = TokenService.getToken();
                        this.setAuth(data);
                    })
                    .catch(({ response }) => {
                        this.setError(response.data.errors);
                        this.purgeAuth();
                    });
            } else {
                this.purgeAuth();
            }
        },
        purgeAuth() {
            this.isAuthenticated = false;
            this.user_id = null;
            this.user = {};
            this.errors = null;
            TokenService.destroyToken();
        },
        logout() {
            ApiService.post("logout");
            this.purgeAuth();
        }
    },
    getters: {
        isError: (state) => state.errors !== null,
    },
    persist: true
})
