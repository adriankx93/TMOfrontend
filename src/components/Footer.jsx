export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white text-center py-6 mt-16 rounded-t-2xl shadow-2xl">
      &copy; {new Date().getFullYear()} SINGU. All rights reserved.
    </footer>
  );
}
