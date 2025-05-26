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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
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

    const [amenities, setAmenities] = useState([])
  
    const getAllAmenities = async () => {
      const res = await axios.get(`${api}/Amenities`)
      if (res.data) {
        setAmenities(res?.data)
        console.log(res?.data)
      }
    }

  useEffect(() => {
    getAllAmenities()
  }, [])

  // open poup 
  const [openEdit, setOpenEdit] = useState(false);
const [selectedProperty, setSelectedProperty] = useState(null);

// Handle Edit Button Click
const handleEditClick = (property) => {
  setSelectedProperty(property);
  setOpenEdit(true);
};

const handleClose = () => {
  setOpenEdit(false);
  setSelectedProperty(null);
};






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
            <Card
  key={p?.id}
  sx={{ minWidth: 300, maxWidth: 300, borderRadius: 3, position: 'relative' }}
>
  <Box sx={{ position: 'relative' }}>
    <Slider {...sliderSettings}>
      {p?.imagesNavigation?.map((img, index) => (
        <Box key={index}>
          <img
            src={img?.imageUrl}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
            alt={`property-${index}`}
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
      <span style={{ fontWeight: 'bold' }}>₹{p?.propertyPrice}</span> per night
    </Typography>

    {/* Edit Button */}
    <Box mt={2}>
     <button
  style={{
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }}
  onClick={() => handleEditClick(p)}
>
  Edit
</button>

    </Box>
  </CardContent>
</Card>

          ))
        }
      </Grid>
      <Dialog open={openEdit} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Edit Property</DialogTitle>
  <DialogContent dividers>
  {selectedProperty && (
    <>
      {/* Property Basic Fields */}
      <TextField
        margin="dense"
        label="Property Name"
        fullWidth
        variant="outlined"
        value={selectedProperty.propertyName}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, propertyName: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Description"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={selectedProperty.description || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, description: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Address"
        fullWidth
        variant="outlined"
        value={selectedProperty.address || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, address: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="City"
        fullWidth
        variant="outlined"
        value={selectedProperty.propertyCity}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, propertyCity: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="State"
        fullWidth
        variant="outlined"
        value={selectedProperty.state || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, state: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Country"
        fullWidth
        variant="outlined"
        value={selectedProperty.country || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, country: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Guests"
        type="number"
        fullWidth
        variant="outlined"
        value={selectedProperty.guest || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, guest: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Category"
        fullWidth
        variant="outlined"
        value={selectedProperty.category || ''}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, category: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Price"
        type="number"
        fullWidth
        variant="outlined"
        value={selectedProperty.propertyPrice}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, propertyPrice: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Beds"
        type="number"
        fullWidth
        variant="outlined"
        value={selectedProperty.bed}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, bed: e.target.value })
        }
      />
      <TextField
        margin="dense"
        label="Bedrooms"
        type="number"
        fullWidth
        variant="outlined"
        value={selectedProperty.bedRoom}
        onChange={(e) =>
          setSelectedProperty({ ...selectedProperty, bedRoom: e.target.value })
        }
      />

      {/* Amenities Section */}
      <Box mt={2}>
        <Typography variant="subtitle1">Amenities</Typography>
        <Grid container spacing={1}>
          {["Wifi", "Parking", "TV", "Kitchen", "Washer", "AC"].map((amenity) => (
            <Grid item xs={6} key={amenity}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedProperty.amenities?.includes(amenity)}
                  onChange={(e) => {
                    let updated = selectedProperty.amenities || [];
                    if (e.target.checked) {
                      updated = [...updated, amenity];
                    } else {
                      updated = updated.filter(a => a !== amenity);
                    }
                    setSelectedProperty({ ...selectedProperty, amenities: updated });
                  }}
                />
                {' '} {amenity}
              </label>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Image Section */}
      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>Images</Typography>
        <Grid container spacing={2}>
          {selectedProperty.imagesNavigation?.map((img, idx) => (
            <Grid item xs={4} key={idx} style={{ position: 'relative' }}>
              <img
                src={img.imageUrl}
                alt={`property-${idx}`}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  const updatedImages = selectedProperty.imagesNavigation.filter((_, i) => i !== idx);
                  setSelectedProperty({ ...selectedProperty, imagesNavigation: updatedImages });
                }}
                sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#fff' }}
              >
                ✕
              </IconButton>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2 }}
        >
          Add New Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const newImage = {
                    imageUrl: reader.result
                  };
                  setSelectedProperty({
                    ...selectedProperty,
                    imagesNavigation: [...(selectedProperty.imagesNavigation || []), newImage]
                  });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </Button>
      </Box>
    </>
  )}
</DialogContent>


  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button
  variant="contained"
  onClick={async () => {
    try {
      await axios.put(`${api}/Property/${selectedProperty.id}?selectedProperty`, selectedProperty);
      console.log("Update successful");
      getMyProperty(); // Refresh list
      handleClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  }}
>
  Save
</Button>

  </DialogActions>
</Dialog>

    </Container>
  )
  
}

export default MyProperty