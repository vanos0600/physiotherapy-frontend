import React, { useEffect, useState } from 'react';
import { getUsers } from '../../api/userApi';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getUsers();
      setUsers(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
