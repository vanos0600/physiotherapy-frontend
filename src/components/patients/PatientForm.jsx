import React from 'react';
import { FiUser, FiCalendar, FiActivity } from 'react-icons/fi';

const PatientForm = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: patient?.name || '',
    age: patient?.age || '',
    condition: patient?.condition || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field pl-10"
            placeholder="Ej: Juan Pérez"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Edad</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Ej: 45"
            />
          </div>
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Condición principal</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiActivity className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Ej: Lesión de rodilla"
            />
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
        >
          {patient ? 'Actualizar paciente' : 'Crear paciente'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;