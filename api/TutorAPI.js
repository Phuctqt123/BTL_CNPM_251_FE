import axiosClient from "./axiosClient.js";

const TutorAPI = {
    getProfile(id) {
        return axiosClient.get('/api/tutor/profile/${id}');
    },
    createSession(data) {
        return axiosClient.post('/api/tutor/session/register', data);
    },
    addDocument(data) {
        return axiosClient.post('/api/tutor/session/add_document', data);
    },
    deleteDocument(data) {
        return axiosClient.post('/api/tutor/session/delete_document', data);
    },
    getDocuments(sessionId) {
        return axiosClient.get('/api/tutor/session/${sessionId}/documents');
    },
    cancelSession(data) {
        return axiosClient.post('/api/tutor/session/cancel', data);
    },
    getHistory(id) {
        return axiosClient.get('/api/tutor/history/${id}');
    },
    reviews(data) {
        return axiosClient.post('/api/tutor/reviews', data);
    }
};

export default TutorAPI;