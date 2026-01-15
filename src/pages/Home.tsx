import Hero from '../components/Hero';
import CompanyLogos from '../components/CompanyLogos';
import Features from '../components/Features';
import DashboardPreview from '../components/DashboardPreview';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <main className="bg-[#F8FAF9] dark:bg-slate-900 transition-colors duration-300">
      <Hero />
      <CompanyLogos />
      <Features />
      <DashboardPreview />
      <Testimonials />
    </main>
  );
};

export default Home;

