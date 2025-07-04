export default function UsersTable() {
  const users = [
    { id: 1, name: "Jan Nowak", role: "Admin", status: "Aktywny" },
    { id: 2, name: "Alicja Kowalska", role: "Technik", status: "Aktywny" },
    { id: 3, name: "Piotr Zieliński", role: "Koordynator", status: "Zablokowany" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold mb-4 text-blue-900">Użytkownicy</h3>
      <table className="min-w-full">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="py-3 px-6 text-left">Imię i nazwisko</th>
            <th className="py-3 px-6 text-left">Rola</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-blue-50 transition">
              <td className="py-2 px-6">{u.name}</td>
              <td className="py-2 px-6">{u.role}</td>
              <td className="py-2 px-6">{u.status}</td>
              <td className="py-2 px-6">
                <button className="text-blue-600 hover:underline mr-2">Edytuj</button>
                <button className="text-red-500 hover:underline">Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
