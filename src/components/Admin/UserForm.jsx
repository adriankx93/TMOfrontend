import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Technik",
    phone: "",
    password: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!isNew) {
      API.get("/users")
        .then(res => {
          const user = res.data.find(u => u._id === id);
          if (user) setForm({ ...user, password: "" });
        });
    }
  }, [id, isNew]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      if (isNew) {
        await API.post("/users", form);
        setMsg("Użytkownik dodany!");
      } else {
        await API.put(`/users/${id}`, form);
        setMsg("Dane użytkownika zaktualizowane!");
      }
      setTimeout(() => navigate("/users"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Błąd zapisu");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        {isNew ? "Dodaj użytkownika" : "Edytuj użytkownika"}
      </h2>
      {error && <div className="mb-2 text-red-600">{error}</div>}
      {msg && <div className="mb-2 text-green-700">{msg}</div>}
      <div className="mb-2">
        <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2" placeholder="Imię" required />
        <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2" placeholder="Nazwisko" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2" placeholder="Email" required />
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2" placeholder="Telefon" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2">
          <option value="Technik">Technik</option>
          <option value="Koordynator">Koordynator</option>
          <option value="Admin">Admin</option>
        </select>
        <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded-xl mb-2" placeholder="Hasło (tylko przy tworzeniu)" required={isNew} />
      </div>
      <div className="mb-2">
        <label className="mr-2">Aktywny:</label>
        <input type="checkbox" name="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
      </div>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-bold hover:bg-blue-800 transition">
        Zapisz
      </button>
    </form>
  );
}
