import React, { useEffect, useState } from "react";
import axios from "axios";

const AddPatient = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/patients",
        { name, age: Number(age) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setAge("");
      if (onAdded) onAdded();
    } catch (err) {
      setError("Error adding patient");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Patient</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        min={0}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Patient"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;

  return (
    <div>
      <h2>Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient._id || patient.id}>
              {patient.name} - {patient.age} years old
            </li>
          ))}
        </ul>
      )}

      <AddPatient onAdded={fetchPatients} />
    </div>
  );
};

export default Patients;
