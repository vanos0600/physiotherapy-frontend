// src/api/pacienteApi.js
import axios from 'axios';

const API = import.meta.env.VITE_API_URL + '/pacientes';

export const getPacientes = async (token) => {
  const res = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
