export default function AuthLayout({ children }) {
  return (
    <div className="bg-slate-900 min-h-screen w-full flex items-center justify-center">
      {children}
    </div>
  );
}
