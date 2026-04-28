import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ children }) {
  return (
    <div className="w-full flex min-h-screen bg-gray-950 text-gray-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 min-w-0 bg-gray-900 p-4 sm:p-6">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
