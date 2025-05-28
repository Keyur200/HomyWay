import React from "react";
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
} from "@mui/material";
import { keyframes } from "@emotion/react";
import Navbar2 from "../Components/Navbar2";
import axios from "axios";
import { api } from "../api";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

function Villa() {
  const [propertiesByVilla, setPropertiesByVilla] = React.useState([]);
  const [category, setCategory] = React.useState(3);
  const [priceRange, setPriceRange] = React.useState([1000, 20000]);
  const [city, setCity] = React.useState("");
  const [bed, setBed] = React.useState("");

  const getMyPropertyByVilla = async (filters = {}) => {
    try {
      let queryParams = `category=1`;

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
        setPropertiesByVilla(res?.data);
      }
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  React.useEffect(() => {
    getMyPropertyByVilla({ category });
  }, []);

  const handleApplyFilters = () => {
    getMyPropertyByVilla({
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      city,
    });
  };

  const handleResetFilters = () => {
    setPriceRange([1000, 20000]);
    setCity("");
    getMyPropertyByVilla();
  };

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
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: "100vh" }}>
        <Box sx={{ display: "flex" }}>
          {/* Property Cards */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Grid container spacing={3}>
              {propertiesByVilla?.map((p) => (
                <Grid item key={p?.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      position: "relative",
                      background: "#1e1e1e",
                      color: "#fff",
                      animation: `${fadeIn} 1s ease-out`,
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <img
                        src={p?.imagesNavigation?.[0]?.imageUrl}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                        alt="property"
                      />
                      <IconButton
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        aria-label="add to favorites"
                      >
                        <FavoriteBorderIcon />
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
                        {p?.propertyName}
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
              ))}
            </Grid>
          </Box>

          {/* Filters */}
         <Box
  sx={{
    width: 200,
    p: 3,
    borderRadius: 3,
    backgroundColor: "#1e1e1e",
    color: "#fff",
    boxShadow: "0 2px 4px rgba(255, 255, 255, 0.05), 0 8px 16px rgba(255, 255, 255, 0.08)",

    position: "sticky",
    top: 80,
    height: "fit-content",
  }}
>


            <Typography variant="h6" gutterBottom>
              Filter
            </Typography>

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
              sx={{ color: "primary.main" }}
            />

            {/* City Dropdown */}
            <FormControl fullWidth sx={{ mt: 3 }} size="small">
              <InputLabel
                id="city-label"
                sx={{
                  color: "#fff",
                  "&.Mui-focused": {
                    color: "#fff",
                  },
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
                    borderColor: "#fff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  ".MuiSvgIcon-root": {
                    color: "#fff",
                  },
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
                  "&.Mui-focused": {
                    color: "#fff",
                  },
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
                    borderColor: "#fff",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#fff",
                  },
                  ".MuiSvgIcon-root": {
                    color: "#fff",
                  },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
              </Select>
            </FormControl>

            {/* Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{ py: 1, fontWeight: "500", fontSize: "0.85rem" }}
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ py: 1, fontWeight: "500", fontSize: "0.85rem" }}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Villa;
