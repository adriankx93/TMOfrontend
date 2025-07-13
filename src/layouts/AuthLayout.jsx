export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#10151f] via-[#192132] to-[#222c3a]">
      {/* ANIMOWANE TECHNO-TŁO */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <svg className="w-full h-full absolute opacity-10 animate-pulse" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-indigo-400/10 blur-2xl rounded-full animate-pulse"></div>
      </div>
      {/* FORMULARZ */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
