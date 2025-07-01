import React, { useEffect, useState } from 'react';
import { getProgress } from '../../api/progressApi';

const ProgressList = () => {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getProgress();
      setProgress(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Progress</h2>
      <ul>
        {progress.map((p) => (
          <li key={p._id}>{p.notes} - {new Date(p.date).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressList;
