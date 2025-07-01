import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { 
  getPatients, 
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../api/patientApi';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const { request, loading, error } = useApi();

  const fetchPatients = useCallback(async () => {
    const data = await request(getPatients);
    setPatients(data);
  }, [request]);

  const addPatient = async (patient) => {
    const newPatient = await request(createPatient, patient);
    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  };

  const editPatient = async (id, updates) => {
    const updatedPatient = await request(updatePatient, id, updates);
    setPatients(prev => 
      prev.map(p => p._id === id ? updatedPatient : p)
    );
    return updatedPatient;
  };

  const removePatient = async (id) => {
    await request(deletePatient, id);
    setPatients(prev => prev.filter(p => p._id !== id));
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
    editPatient,
    removePatient
  };
};