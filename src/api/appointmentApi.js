import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/appointments' });

export const getAppointments = async () => API.get('/');
export const getAppointmentById = async (id) => API.get(`/${id}`);
export const createAppointment = async (data) => API.post('/', data);
export const updateAppointment = async (id, data) => API.put(`/${id}`, data);
export const deleteAppointment = async (id) => API.delete(`/${id}`);
