import React, { useEffect, useState } from 'react';
import axios from 'axios';
// En la parte superior del archivo Exercise.js
import './Exercises.css';



const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    reps: '',
    sets: '',
    category: '',
    weight: '',
    duration: '',
    description: ''
  });

  const fetchExercises = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/exercises');
      setExercises(res.data);
    } catch (err) {
      console.error('Error al cargar ejercicios:', err.message);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/exercises', formData);
      setFormData({
        name: '',
        reps: '',
        sets: '',
        category: '',
        weight: '',
        duration: '',
        description: ''
      });
      fetchExercises();
    } catch (err) {
      console.error('Error al crear ejercicio:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/exercises/${id}`);
      fetchExercises();
    } catch (err) {
      console.error('Error al eliminar ejercicio:', err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ejercicios</h2>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4">
        <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} className="border p-2" />
        <input name="reps" placeholder="Repeticiones" value={formData.reps} onChange={handleChange} className="border p-2" />
        <input name="sets" placeholder="Series" value={formData.sets} onChange={handleChange} className="border p-2" />
        <input name="category" placeholder="Categoría" value={formData.category} onChange={handleChange} className="border p-2" />
        <input name="weight" placeholder="Peso (kg)" value={formData.weight} onChange={handleChange} className="border p-2" />
        <input name="duration" placeholder="Duración (HH:MM:SS)" value={formData.duration} onChange={handleChange} className="border p-2" />
        <textarea name="description" placeholder="Descripción" value={formData.description} onChange={handleChange} className="border p-2 col-span-2" />
        <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded">Crear Ejercicio</button>
      </form>

      <ul className="space-y-4">
        {exercises.map((exercise) => (
          <li key={exercise._id} className="border p-4 rounded">
            <h3 className="font-bold">{exercise.name}</h3>
            <p>Reps: {exercise.reps} | Sets: {exercise.sets} | Peso: {exercise.weight}kg</p>
            <p>Duración: {exercise.duration}</p>
            <p>Categoría: {exercise.category}</p>
            <p>{exercise.description}</p>
            <button
              onClick={() => handleDelete(exercise._id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;
