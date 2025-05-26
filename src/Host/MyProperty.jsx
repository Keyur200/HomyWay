import axios from "axios"
import '../App.css'
import React, { useContext, useEffect, useState } from 'react'
import { api } from "../api"
import { AuthContext } from "../Context/AuthProvider"
import Slider from 'react-slick';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Rating,
  Stack,
  Container,
  Grid
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MyProperty = () => {
  const [properties, setProperties] = useState([])
  const { user } = useContext(AuthContext)

  const getMyProperty = async () => {
    const res = await axios.get(`${api}/Property/host/${user?.id}`)
    if (res?.data) {
      setProperties(res?.data)
      console.log(res?.data)
    }
  }

  useEffect(() => {
    getMyProperty()
  }, [])
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '45%',
          right: 10,
          zIndex: 1,
          boxShadow: 1,
          // '&:hover': { backgroundColor: '#f0f0f0' }
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          top: '45%',
          left: 10,
          zIndex: 1,
          // backgroundColor: 'white',
          boxShadow: 1,
          // '&:hover': { backgroundColor: '#f0f0f0' }
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
    dotsClass: 'slick-dots'
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={3} size={6}>
        {
          properties?.map(p => (
            <Card sx={{ minWidth: 300, maxWidth: 300, borderRadius: 3, position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ position: 'relative' }}>
                  <Slider {...sliderSettings}>
                    {p?.imagesNavigation?.map((img, index) => (
                      <Box key={index}>
                        <img
                          src={img?.imageUrl}
                          style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Slider>
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    aria-label="add to favorites"
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                </Box>
              </Box>

              <CardContent>
                <Typography variant="body2" fontWeight="bold">
                  Flat in {p?.propertyCity}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Rating name="read-only" value={4.25} precision={0.25} readOnly size="small" />
                  <Typography variant="body2">(4)</Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {p?.propertyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {p?.bed} beds · {p?.bedRoom} bedrooms
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {/* <span style={{ textDecoration: 'line-through', color: '#888' }}>₹34,382</span>{' '} */}
                  <span style={{ fontWeight: 'bold' }}>₹{p?.propertyPrice}</span> per night
                </Typography>
              </CardContent>
            </Card>
          ))
        }
      </Grid>
    </Container>
  )
}

export default MyProperty