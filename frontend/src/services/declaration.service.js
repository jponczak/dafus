import http from "../http-common";

class DeclarationDataService {
    getAll(params) {
        return http.get("/declarations", { params });
    }

    get(id) {
        return http.get(`/declarations/${id}`);
    }

    findByCombined(combined) {
        return http.get(`/declarations?combined=${combined}`);
    }
}

export default new DeclarationDataService();