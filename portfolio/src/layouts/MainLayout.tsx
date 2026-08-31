import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-backgroundColor text-zinc-900 dark:bg-zinc-950 dark:text-white transition-colors duration-300">
      
      {/* Navbar fixed + contenu scrollable */}
      <Navbar />

      <main>
        {children}
      </main>

    </div>
  );
};

export default MainLayout;