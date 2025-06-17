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
import Footer from "../Components/Footer";

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

  const [reviewsByProperty, setReviewsByProperty] = useState({});

  const getAllReviews = async () => {
    try {
      const allReviews = await Promise.all(
        propertiesByVilla.map(async (property) => {
          const res = await axios.get(`${api}/Reviews/property/${property.propertyId}`);
          return { propertyId: property.propertyId, reviews: res.data || [] };
        })
      );

      const reviewMap = {};
      allReviews.forEach(({ propertyId, reviews }) => {
        reviewMap[propertyId] = reviews;
      });

      setReviewsByProperty(reviewMap);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (propertiesByVilla.length) {
      getAllReviews();
    }
  }, [propertiesByVilla]);


  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: "absolute",
          top: "45%",
          right: -20,
          zIndex: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
          opacity: 0,
          transform: "translateX(20px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          ".slick-slider:hover &": {
            opacity: 1,
            transform: "translateX(-20px)",
          },
          "&:hover": {
            backgroundColor: "transparent",
            "& .MuiSvgIcon-root": {
              transform: "scale(1.2)",
            }
          },
          "& .MuiSvgIcon-root": {
            color: "#000",
            fontSize: "24px",
            transition: "transform 0.3s ease"
          }
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
          left: -20,
          zIndex: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
          opacity: 0,
          transform: "translateX(-20px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          ".slick-slider:hover &": {
            opacity: 1,
            transform: "translateX(20px)",
          },
          "&:hover": {
            backgroundColor: "transparent",
            "& .MuiSvgIcon-root": {
              transform: "scale(1.2)",
            }
          },
          "& .MuiSvgIcon-root": {
            color: "#000",
            fontSize: "24px",
            transition: "transform 0.3s ease"
          }
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
          pb: 10,
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

        <Divider sx={{ mb: 3, background: "rgb(187 187 187)" }} />

        <Container sx={{ mt: 4, mb: 8 }}>
          <Grid container spacing={3} >
            {propertiesByVilla?.filter(p => p?.status === 'active')?.map((p) => {
              const propertyReviews = reviewsByProperty[p?.propertyId] || [];
              const totalRating = propertyReviews.reduce((sum, r) => sum + r.rating, 0);
              const avgRating = propertyReviews.length ? totalRating / propertyReviews.length : 0;
              return (

                <Grid item xs={12} sm={6} md={4} lg={4} key={p?.id}>
                  <Card
                    sx={{
                      minWidth: 300,
                      maxWidth: 300,
                      borderRadius: 3,
                      background: "#1e1e1e",
                      color: "#fff",
                      position: "relative",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                      },
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
                        {p?.category?.categoryName} in {p?.propertyCity}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Rating
                          name="read-only"
                          value={parseFloat(avgRating.toFixed(2))}
                          precision={0.25}
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2">({propertyReviews?.length})</Typography>
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
                </Grid>

              )
            })}
          </Grid>
        </Container>
      </Container>

      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default Home;
