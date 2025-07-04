export default function LoginCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Logowanie</h2>
        <input className="mb-4 w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="Login" />
        <input type="password" className="mb-6 w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none" placeholder="Hasło" />
        <button className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition text-lg shadow">Zaloguj się</button>
      </div>
    </div>
  );
}
