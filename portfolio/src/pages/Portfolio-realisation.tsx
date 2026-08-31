import MainLayout2 from "../layouts/MainLayout2";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import Realisation from "../components/Realisations/Realisations";

const Portfolio = () => {
  return (
    <MainLayout2>
      <Realisation />
      <div id="contact2">
       <Contact />
      </div>
      <Footer />
    </MainLayout2>
  );
};

export default Portfolio;