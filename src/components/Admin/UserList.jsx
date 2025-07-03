import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Użytkownicy</h2>
      <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl" onClick={() => navigate("/users/new")}>Dodaj użytkownika</button>
      <table className="min-w-full bg-white rounded-xl shadow">
        <thead>
          <tr>
            <th className="px-3 py-2">Imię</th>
            <th className="px-3 py-2">Nazwisko</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Rola</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} className="text-center border-t">
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.active ? "Aktywny" : "Zablokowany"}</td>
              <td>
                <button className="text-blue-600 px-2" onClick={() => navigate(`/users/${u._id}/edit`)}>Edytuj</button>
                <button className="text-red-600 px-2">Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
