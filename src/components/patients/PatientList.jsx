import React from 'react';

const PatientList = ({ patients, onEdit, onDelete }) => {
  if (!patients || patients.length === 0) {
    return <p className="text-gray-500 py-4 text-center">No hay pacientes registrados</p>;
  }

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <div key={patient._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <div className="text-sm text-gray-600 mt-1">
                <p>Edad: {patient.age || 'No especificada'}</p>
                <p>Condición: {patient.condition || 'No especificada'}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(patient)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(patient._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientList;