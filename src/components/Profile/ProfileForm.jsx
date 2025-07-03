import { useEffect, useState } from "react";
import API from "../../api/api";

export default function ProfileForm() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/auth/profile").then(res => {
      setUser(res.data);
      setForm(res.data);
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    await API.put("/auth/profile", form);
    setMsg("Zaktualizowano profil!");
  };

  if (!user) return <div>Ładowanie...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-xl p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Twój profil</h2>
      {msg && <div className="mb-4 text-green-600">{msg}</div>}
      <input name="firstName" value={form.firstName || ""} onChange={handleChange} placeholder="Imię" className="mb-2 w-full p-2 border rounded-xl" />
      <input name="lastName" value={form.lastName || ""} onChange={handleChange} placeholder="Nazwisko" className="mb-2 w-full p-2 border rounded-xl" />
      <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Telefon" className="mb-2 w-full p-2 border rounded-xl" />
      <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Zapisz zmiany</button>
    </form>
  );
}
