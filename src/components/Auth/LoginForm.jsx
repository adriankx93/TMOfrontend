import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Błąd logowania");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white shadow-2xl p-8 mt-16 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Logowanie</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <input name="email" placeholder="Login" className="mb-2 w-full p-2 border rounded-xl" value={form.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Hasło" className="mb-4 w-full p-2 border rounded-xl" value={form.password} onChange={handleChange} />
      <button className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">Zaloguj się</button>
    </form>
  );
}
