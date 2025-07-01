import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/progress' });

export const getProgress = async () => API.get('/');
export const getProgressById = async (id) => API.get(`/${id}`);
export const createProgress = async (data) => API.post('/', data);
export const updateProgress = async (id, data) => API.put(`/${id}`, data);
export const deleteProgress = async (id) => API.delete(`/${id}`);
