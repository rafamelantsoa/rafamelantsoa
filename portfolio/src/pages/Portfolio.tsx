import MainLayout from "../layouts/MainLayout";
import Hero from "../components/Hero/Hero";
import Work from "../components/Work/Work";
import About from "../components/About/About";
import Services from "../components/Services/Experiences";
import Contact from "../components/Contact/Contact";
// import Realisations from "../components/Realisations/Realisations";
import Footer from "../components/Footer/Footer";

const Portfolio = () => {
  return (
    <MainLayout>
      <Hero />
      <Work />
      <About />
      <Services />
      {/* <Realisations /> */}
      <Contact />
      <Footer />
    </MainLayout>
  );
};

export default Portfolio;