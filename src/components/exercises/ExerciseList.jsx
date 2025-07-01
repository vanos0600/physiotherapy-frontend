import React, { useEffect, useState } from 'react';
import { getExercises } from '../../api/exerciseApi';

const ExerciseList = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getExercises();
      setExercises(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Exercises</h2>
      <ul>
        {exercises.map((ex) => (
          <li key={ex._id}>{ex.name} - {ex.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseList;
