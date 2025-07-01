import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/exercises' });

export const getExercises = async () => API.get('/');
export const getExerciseById = async (id) => API.get(`/${id}`);
export const createExercise = async (data) => API.post('/', data);
export const updateExercise = async (id, data) => API.put(`/${id}`, data);
export const deleteExercise = async (id) => API.delete(`/${id}`);
