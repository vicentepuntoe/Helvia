import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF9] dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayout;
