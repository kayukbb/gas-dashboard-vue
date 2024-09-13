import http from "../http-common";

const DataService = {
  getAll(table) {
    return http.get(`/${table}`);
  },

  getOne(table) {
    return http.get(`/${table}`);
  },
  postOne(table, data) {
    return http.post(`/${table}`, data);
  },
  // Add more methods for interacting with the backend API if needed
};

export default DataService;