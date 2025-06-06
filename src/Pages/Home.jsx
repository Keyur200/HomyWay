import axios from "axios";
import "../App.css";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../api";
import Slider from "react-slick";
import {
  Box,
  Typography,
  Grid,
  Card,
  Container,
  IconButton,
  CardContent,
  Stack,
  Rating,
  Button,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Navbar2 from "../Components/Navbar2";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";

const Home = () => {
  const [propertiesByVilla, setPropertiesByVilla] = useState([]);
  const { user } = useContext(AuthContext)

  const getMyPropertyVilla = async () => {
    const res = await axios.get(`${api}/Property`);
    if (res?.data) {
      setPropertiesByVilla(res.data);
    }
  };

  useEffect(() => {
    getMyPropertyVilla();
  }, []);



  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "45%",
          right: 10,
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "45%",
          left: 10,
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 2,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots",
  };

  const handleWishlist = async (propertyId) => {
    const exists = wishlist?.some(item => item.propertyId === propertyId);

    try {
      if (exists) {
        await axios.delete(`${api}/Wishlists/${user?.id}/${propertyId}`);
        toast.info("Removed from wishlist");
      } else {
        const res = await axios.post(`${api}/Wishlists`, {
          userId: user?.id,
          propertyId: propertyId,
        });

        if (res?.data?.message) {
          toast.error(res?.data?.message); 
        } else {
          toast.success("Added to wishlist");
        }
      }

      const updatedWishlist = await axios.get(`${api}/Wishlists/User/${user.id}`);
      setWishlist(updatedWishlist.data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };


  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (user?.id) {
      const res = await axios.get(`${api}/Wishlists/User/${user.id}`);
      setWishlist(res.data);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user?.id]);



  return (
    <Box>
      <Navbar2 />

      <Box
        sx={{
          height: { xs: 250, md: 400 },
          backgroundImage:
            "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          px: 3,
          borderRadius: 3,
          mb: 6,
          boxShadow: "inset 0 0 0 1000px rgba(0,0,0,0.4)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          mb={2}
          sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        >
          Find your perfect vacation rental
        </Typography>
        <Typography
          variant="h6"
          sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.7)" }}
        >
          Search from thousands of homes, apartments, and more
        </Typography>
      </Box>

      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Villa
        </Typography>
        <Divider sx={{ mb: 3, background: "rgb(187 187 187)" }} />

        <Container sx={{ mt: 4 }}>
          <Grid container spacing={3} >
            {propertiesByVilla?.map((p) => (
              <Card
                key={p?.id}
                sx={{
                  minWidth: 300,
                  maxWidth: 300,
                  borderRadius: 3,
                  background: "#1e1e1e",
                  color: "#fff",
                  position: "relative",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Slider {...sliderSettings}>
                    {p?.imagesNavigation?.map((img, index) => (
                      <Box key={index}>
                        <img
                          src={img?.imageUrl}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                          alt={`property-${index}`}
                        />
                      </Box>
                    ))}
                  </Slider>
                  <IconButton
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    aria-label="add to favorites"
                    onClick={() => handleWishlist(p?.propertyId)}
                  >
                    {wishlist?.some(item => item.propertyId === p?.propertyId) ? (
                      <FavoriteIcon sx={{ color: 'red' }} />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>

                </Box>

                <CardContent>
                  <Typography variant="body2" fontWeight="bold">
                    Flat in {p?.propertyCity}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Rating
                      name="read-only"
                      value={4.25}
                      precision={0.25}
                      readOnly
                      size="small"
                    />
                    <Typography variant="body2">(4)</Typography>
                  </Stack>

                  <Typography variant="body2" color="rgb(187 187 187)">
                    <Link to={`property/${p?.slugName}`}>{p?.propertyName}</Link>
                  </Typography>
                  <Typography variant="body2" color="rgb(187 187 187)">
                    {p?.bed} beds · {p?.bedRoom} bedrooms
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <span style={{ fontWeight: "bold" }}>
                      ₹{p?.propertyPrice}
                    </span>{" "}
                    per night
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Container>
    </Box>
  );
};

export default Home;
