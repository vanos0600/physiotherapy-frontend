import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../api/appointmentApi';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getAppointments();
      setAppointments(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt._id}>{appt.date} - {appt.reason}</li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
