import Header from "../components/Header";
import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Cupon from "../components/Cupon";
const Home = () => {
  return (
    <>
      <Header />
      <FilterBar />
      <Banner />
      <Cupon />
      <ProductList />
      <Hero />
      <Footer />
    </>
  );
};

export default Home;
