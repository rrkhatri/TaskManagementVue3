import TokenService from "@/core/services/TokenService";
import axios from "axios";
import VueAxios from "vue-axios";

class ApiService {
  static init(app) {
    this.vueInstance = app;
    this.vueInstance.use(VueAxios, axios);
    this.vueInstance.axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  }

  static setHeader() {
    this.vueInstance.axios.defaults.headers.common["Authorization"] = `Bearer ${TokenService.getToken()}`;
    this.vueInstance.axios.defaults.headers.common["Accept"] = "application/json";
  }

  static prepareUrl(resource) {
    return (import.meta.env.VITE_APP_API_URL).replace(/\/$/, '') + '/' + resource.replace(/^\//, '');
  }

  static query(resource, params) {
    return this.vueInstance.axios.get(resource, params);
  }

  static get(resource, params = null) {
    return this.vueInstance.axios.get(`${resource}`, params);
  }

  static post(resource, params = null) {
    return this.vueInstance.axios.post(`${resource}`, params);
  }

  static update(resource, slug, params) {
    return this.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  static put(resource, params) {
    return this.vueInstance.axios.put(`${resource}`, params);
  }

  static delete(resource, params = null) {
    return this.vueInstance.axios.delete(resource, params);
  }
}

export default ApiService;
