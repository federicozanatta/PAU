import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Box from "@mui/material/Box";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

const imagenes = [banner1, banner2, banner3];

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ width: "50%", margin: "auto", marginBottom: 4, marginTop: 4 }}>
      <Slider {...settings}>
        {imagenes.map((imagen, index) => (
          <Box
            key={index}
            component="img"
            src={imagen}
            alt={`Banner ${index}`}
            sx={{ width: "100%", borderRadius: 2 }}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default Banner;
