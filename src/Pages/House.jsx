import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider as MuiSlider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import Navbar2 from "../Components/Navbar2";
import axios from "axios";
import { api } from "../api";
import Slider from "react-slick";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MapIcon from '@mui/icons-material/Map';
import CloseIcon from '@mui/icons-material/Close';
import { GoogleMap, InfoWindow, LoadScript, Marker, StandaloneSearchBox, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import FavoriteIcon from '@mui/icons-material/Favorite';

// Animations
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInZoom = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const cardAnimations = [slideInLeft, slideInRight, slideInUp, fadeInZoom];

function House() {
  const [propertiesByFarmHouse, setPropertiesByFarmHouse] = React.useState([]);
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = React.useState([]);
  const [category, setCategory] = React.useState(1002);
  const [priceRange, setPriceRange] = React.useState([1000, 20000]);
  const [city, setCity] = React.useState("");
  const [bed, setBed] = React.useState("");
  const [openFilterDialog, setOpenFilterDialog] = React.useState(false);
  const [openMapDialog, setOpenMapDialog] = React.useState(false);

  const mapContainerStyle = {
    width: '100%',
    height: '100vh'
  };

  const containerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: 20.5937,
    lng: 78.9629
  };

  const getMyPropertyByFarmhouse = async (filters = {}) => {
    try {
      let queryParams = `category=1002`;

      if (filters.maxPrice !== undefined) {
        queryParams += `&maxPrice=${filters.maxPrice}`;
      }
      if (filters.minPrice !== undefined) {
        queryParams += `&minPrice=${filters.minPrice}`;
      }
      if (filters.city) {
        queryParams += `&city=${filters.city}`;
      }

      const res = await axios.get(`${api}/Property/filter?${queryParams}`);
      if (res?.data) {
        setPropertiesByFarmHouse(res?.data);
      }
    } catch (error) {
      console.error("Error fetching properties", error);
    }
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

  const fetchWishlist = async () => {
    if (user?.id) {
      const res = await axios.get(`${api}/Wishlists/User/${user.id}`);
      setWishlist(res.data);
    }
  };

  React.useEffect(() => {
    getMyPropertyByFarmhouse({ category });
    fetchWishlist();
  }, [category, user?.id]);

  const handleApplyFilters = () => {
    getMyPropertyByFarmhouse({
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      city,
    });
  };

  const handleResetFilters = () => {
    setPriceRange([1000, 20000]);
    setCity("");
    getMyPropertyByFarmhouse();
  };

  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleOpenMapDialog = () => {
    setOpenMapDialog(true);
  };

  const handleCloseMapDialog = () => {
    setOpenMapDialog(false);
  };

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

  useEffect(() => {
    handleLoad()
  }, [center])

  const [mapLoaded, setMapLoaded] = useState(false);

  const handleLoad = () => {
    setMapLoaded(true);
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: ""
  });

  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);

  // Hide the default close button with CSS after InfoWindows mount
  useEffect(() => {
    const hideCloseButtons = () => {
      const closeButtons = document.querySelectorAll('.gm-ui-hover-effect');
      closeButtons.forEach(btn => btn.style.display = 'none');
    };
    setTimeout(hideCloseButtons, 500); // Delay ensures DOM is mounted
  });

  if (!isLoaded) return <div>Loading map...</div>;
  return (
    <div>
      <Navbar2 />

      {/* Banner */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage: `url('https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            p: 4,
            borderRadius: 2,
            animation: `${fadeIn} 2s ease-out`,
            mt: "40px",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>
            Welcome to the Farmhouse
          </Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Enjoy peaceful living in nature's embrace.
          </Typography>
        </Box>
      </Box>

      {/* Properties + Filters */}
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2, minHeight: "100vh" }}>
        <Box sx={{
          mb: 2,
          display: 'flex',
          gap: 2
        }}>
          <Button
            variant="contained"
            startIcon={<FilterAltIcon />}
            onClick={handleOpenFilterDialog}
            sx={{
              backgroundColor: "#b91c1c",
              color: "#fff",
              '&:hover': {
                backgroundColor: "#2e2e2e"
              }
            }}
          >
            Filters
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Property Cards */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Grid container spacing={2}>
              {propertiesByFarmHouse?.filter(p => p?.status === 'active')?.map((p, index) => {
                const animation = cardAnimations[index % cardAnimations.length];
                return (
                  <Grid item key={p?.id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        minWidth: 300,
                        maxWidth: 300,
                        borderRadius: 2,
                        position: "relative",
                        background: "#1e1e1e",
                        color: "#fff",
                        animation: `${animation} 0.8s ease-out`,
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: "both",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <Slider
                          {...sliderSettings}
                          className="slick-slider"
                        >
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
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,


                          }}
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
                          Farmhouse in {p?.propertyCity}
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
                        <Typography
                          variant="body2"
                          color="rgb(187 187 187)"
                          sx={{
                            '& a': {
                              color: 'inherit',
                              textDecoration: 'none',
                              '&:hover': {
                                color: '#b91c1c'
                              }
                            }
                          }}
                        >
                          <Link to={`/property/${p?.slugName}`}>{p?.propertyName}</Link>
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
                );
              })}
            </Grid>
          </Box>

          {/* Map Section - Hidden on mobile */}
          <Box
            sx={{
              width: 580,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#1e1e1e",
              color: "#fff",
              boxShadow:
                "0 2px 4px rgba(255, 255, 255, 0.05), 0 8px 16px rgba(255, 255, 255, 0.08)",
              position: "sticky",
              top: 80,
              height: "calc(100vh - 90px)",
              display: { xs: 'none', lg: 'flex' },
              flexDirection: "column",
              gap: 1
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Map View Coming Soon
            </Typography>
            <Box sx={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
                onLoad={handleLoad}
              >
                {propertiesByFarmHouse?.filter(p => p?.status === 'active')?.map((property) => {
                  const isHovered = hoveredPropertyId === property.propertyId;

                  return (
                    <div key={property.propertyId}>
                      {/* Main Price Bubble */}
                      <OverlayView
                        position={{
                          lat: parseFloat(property.latitude),
                          lng: parseFloat(property.longitude),
                        }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          className="relative transform -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer"
                          onMouseEnter={() => setHoveredPropertyId(property.propertyId)}
                          onMouseLeave={() => setHoveredPropertyId(null)}
                        >
                          <div className="bg-[#b91c1c] text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg z-10 min-w-[60px] text-center">
                            ₹{property.propertyPrice}
                          </div>
                          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-[#b91c1c]"></div>
                        </div>
                      </OverlayView>

                      {/* Hover OverlayView with Property Details */}
                      {isHovered && (
                        <OverlayView
                          position={{
                            lat: parseFloat(property.latitude),
                            lng: parseFloat(property.longitude),
                          }}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                          <div
                            className="absolute top-[-110px] left-[-100px] w-[200px] bg-white border border-gray-300 rounded-xl shadow-xl p-4 text-sm z-50"
                            onMouseEnter={() => setHoveredPropertyId(property.propertyId)}
                            onMouseLeave={() => setHoveredPropertyId(null)}
                          >
                              <img
                                src={property?.imagesNavigation[0]?.imageUrl}
                                alt={property?.propertyName}
                                className="w-full h-[80px] md:h-[100px] object-cover rounded-xl md:rounded-2xl mb-2"
                              />
                              <Link to={`/property/${property?.slugName}`}><h2 className="text-black md:text-lg font-semibold truncate">{property?.propertyName}</h2></Link>
                              <h2 className="text-black md:text-lg font-semibold truncate">{property?.propertyCity} - {property?.propertyAddres}</h2>
                              <p className="text-xs md:text-sm text-gray-600">Your Location</p>

                        </div>
                        </OverlayView>
                  )
                }
                    </div>
              );
                })}
            </GoogleMap>
          </Box>
        </Box>
      </Box>

      {/* Filter Dialog */}
      <Dialog
        open={openFilterDialog}
        onClose={handleCloseFilterDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: '#1e1e1e',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Price Filter */}
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              Price Range (₹) : {priceRange[0]} - {priceRange[1]}
            </Typography>
            <MuiSlider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={1000}
              max={20000}
              step={500}
              sx={{
                color: "#b91c1c",
                '& .MuiSlider-thumb': {
                  borderColor: "#b91c1c",
                },
                '& .MuiSlider-track': {
                  color: "#b91c1c",
                },
                '& .MuiSlider-rail': {
                  color: "#b91c1c",
                }
              }}
            />

            {/* City Dropdown */}
            <FormControl fullWidth sx={{ mt: 3 }} size="small">
              <InputLabel
                id="city-label"
                sx={{
                  color: "#fff",
                  "&.Mui-focused": { color: "#b91c1c" }
                }}
              >
                City
              </InputLabel>
              <Select
                labelId="city-label"
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{
                  color: "#fff",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b91c1c",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b91c1c",
                  },
                  ".MuiSvgIcon-root": { color: "#fff" }
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="fff">Fff</MenuItem>
              </Select>
            </FormControl>

            {/* Bed Dropdown */}
            <FormControl fullWidth sx={{ mt: 3 }} size="small">
              <InputLabel
                id="bed-label"
                sx={{
                  color: "#fff",
                  "&.Mui-focused": { color: "#b91c1c" }
                }}
              >
                Beds
              </InputLabel>
              <Select
                labelId="bed-label"
                label="Beds"
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                sx={{
                  color: "#fff",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b91c1c",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#b91c1c",
                  },
                  ".MuiSvgIcon-root": { color: "#fff" }
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleResetFilters}
            sx={{
              color: '#fff',
              '&:hover': {
                color: '#b91c1c'
              }
            }}
          >
            Reset
          </Button>
              <Button
            onClick={() => {
              handleApplyFilters();
              handleCloseFilterDialog();
            }}
                variant="contained"
            sx={{
              backgroundColor: "#b91c1c",
              '&:hover': {
                backgroundColor: "#991b1b"
              }
            }}
              >
                Apply
              </Button>
        </DialogActions>
      </Dialog>

      </Container>
    </div >
  );
}

export default House;
