import axios from "axios"
import '../App.css'
import React, { useContext, useEffect, useState } from 'react'
import { api } from "../api"
import { AuthContext } from "../Context/AuthProvider"
import { GoogleMap, InfoWindow, LoadScript, Marker, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import Slider from 'react-slick';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  IconButton,
  CardContent,
  Stack,
  Rating,
  styled,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TiptapEditor from './TiptapEditor';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

const steps = ['Basic Info', 'Upload File', 'Location', "Amenities"];
const containerStyle = {
  width: '100%',
  height: '500px'
};


const MyProperty = () => {
  const [properties, setProperties] = useState([])
  const { user } = useContext(AuthContext)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [guests, setGuests] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bed, setBed] = useState("");
  const [bathroom, setBathroom] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState([]);
  const [cid, setcid] = useState(0)
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState();
  const [existingImages, setExistingImages] = useState([]);
  const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #BB86FC',
    borderRadius: '16px',
    padding: theme.spacing(5),
    textAlign: 'center',
    backgroundColor: '#1E1E1E',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#2A2A2A',
    },
  }));
  const HiddenInput = styled('input')({
    display: 'none',
  });
  const getMyProperty = async () => {
    const res = await axios.get(`${api}/Property/host/${user?.id}`)
    if (res?.data) {
      setProperties(res?.data)
    }
  }

  useEffect(() => {
    getMyProperty()
  }, [])

  const [amenities, setAmenities] = useState([])

  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getAllCategories = async () => {
    const res = await axios.get(`${api}/PropertyCategoryTbls`)
    if (res?.data) {
      setCategory(res?.data)
    }
  }

  useEffect(() => {
    getAllAmenities()
    getAllCategories()
    handleEditClick()
  }, [])

  // open poup 
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState();

  // Handle Edit Button Click
  const handleEditClick = async (id) => {
    const res = await axios.get(`${api}/Property/${id}`)
    if (res?.data) {
      setSelectedProperty(res?.data)
      setOpenEdit(true);
    }
  };

  const handleClose = () => {
    setOpenEdit(false);
    setSelectedProperty(null);
  };

  useEffect(() => {
    if (selectedProperty) {
      setName(selectedProperty.propertyName);
      setDescription(selectedProperty.propertyDescription);
      setAddress(selectedProperty.propertyAdderss);
      setCity(selectedProperty.propertyCity);
      setState(selectedProperty.propertyState);
      setCountry(selectedProperty.propertyCountry);
      setGuests(selectedProperty.maxGuests);
      setBedroom(selectedProperty.bedRoom);
      setBed(selectedProperty.bed);
      setBathroom(selectedProperty.bathroom);
      setPrice(selectedProperty.propertyPrice);
      setLatitude(selectedProperty.latitude);
      setLongitude(selectedProperty.longitude);
      setStatus(selectedProperty.status);
      setcid(selectedProperty.categoryId);
      setSelected(JSON.parse(selectedProperty.amenities || "[]"));
      setExistingImages(selectedProperty.imagesNavigation || "[]");
    }
  }, [selectedProperty]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("hostId", user?.id);
    formData.append("propertyName", name);
    formData.append("propertyDescription", description);
    formData.append("propertyAdderss", address);
    formData.append("propertyCity", city);
    formData.append("propertyState", state);
    formData.append("propertyCountry", country);
    formData.append("maxGuests", guests);
    formData.append("bedRoom", bedroom);
    formData.append("bed", bed);
    formData.append("bathroom", bathroom);
    formData.append("status", status);
    formData.append("propertyPrice", price);
    formData.append("categoryId", cid);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    selected.forEach((id) => formData.append("amenities", id));
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.put(`${api}/Property/${selectedProperty.propertyId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setActiveStep(0)
      getMyProperty()
      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const handleDeleteClick = async (id) => {
    const res = await axios.delete(`${api}/Property/${id}`)
    if (res) {
      getMyProperty()
    }
  }

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [files]);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setLatitude(lat);
    setLongitude(lng);

    setClickedPosition({ lat, lng });
    setSelectedMarker(null)
  };

  const getAllAmenities = async () => {
    const res = await axios.get(`${api}/Amenities`)
    if (res.data) {
      setAmenities(res?.data)
    }
  }

  const center = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };

  const toggleAmenity = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );

    console.log(selected)
  };

  const handleDeleteExistingImage = async (id) => {
    try {
      await axios.delete(`${api}/Property/DeleteImage/${id}`);
      setExistingImages((prev) =>
        prev.filter((img) => img.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete image from database");
    }
  }
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

   const [mapLoaded, setMapLoaded] = useState(false);
  
    const handleLoad = () => {
      setMapLoaded(true);
    };
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: ""
    });
  

  const StepContent = () => {
    return (
      <>
        {activeStep === 0 && (
          <>
            <TextField
              label="Title"
              name="title"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <TiptapEditor
                content={description}
                onChange={(value) => setDescription(value)}

              />

            </Box>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Address"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="City"
                    fullWidth
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="State"
                    fullWidth
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Country"
                    fullWidth
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Guests"
                    fullWidth
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Bedroom"
                    fullWidth
                    type="number"
                    value={bedroom}
                    onChange={(e) => setBedroom(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Beds"
                    fullWidth
                    type="number"
                    value={bed}
                    onChange={(e) => setBed(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Bathrooms"
                    fullWidth
                    type="number"
                    value={bathroom}
                    onChange={(e) => setBathroom(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <TextField
                    label="Price"
                    fullWidth
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} size={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={cid}
                      onChange={(e) => setcid(e.target.value)}
                      label="Category"
                    >
                      {category?.map((cat) => (
                        <MenuItem key={cat} value={cat?.categoryId}>
                          {cat?.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </>

        )}

        {activeStep === 1 && (
          <>
            <Box
              sx={{
                maxWidth: 400,
                mx: 'auto',
                p: 3,
                borderRadius: '24px',
                boxShadow: 3,
                backgroundColor: '#121212',
                color: '#fff',
              }}
            >
              <Typography variant="h6" textAlign="center" fontWeight="bold">
                Upload your files
              </Typography>
              <Typography variant="body2" textAlign="center" mb={2}>
                File should be JPG/PNG/PDF
              </Typography>

              <label htmlFor="file-upload">
                <UploadBox
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <UploadFileIcon sx={{ fontSize: 48, color: '#3f51b5', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Drag & Drop your file or
                  </Typography>
                  <Button variant="contained" color="primary" component="span">
                    Browse File
                  </Button>
                  <HiddenInput
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </UploadBox>
              </label>
            </Box>
            {files.length > 0 && (
              <Box mt={3} display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                {files.map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  const fileUrl = URL.createObjectURL(file);
                  return (
                    <Box
                      key={index}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: 2,
                        backgroundColor: '#1e1e1e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={`preview-${index}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography variant="caption" color="white" textAlign="center" px={1}>
                          {file.name}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
            <Box
              mt={3} display="flex" flexWrap="wrap" gap={1} justifyContent="center"
            >
              {existingImages.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 2,
                    backgroundColor: '#1e1e1e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <img
                    src={img?.imageUrl}
                    alt={`existing-${index}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteExistingImage(img?.id)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </>
        )}

        {activeStep === 2 && (
          <div>
            {!isLoaded ? (
              <div>Loading Map...</div>
            ) : (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
                onLoad={handleLoad}
                onClick={handleMapClick}
              >
                <Marker key="marker" position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }} ></Marker>
                {clickedPosition && (
                  <OverlayView
                    position={clickedPosition}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="relative">
                      <div className="bg-white text-gray-800 shadow-lg p-2 rounded-lg w-[180px] md:w-[220px]">
                        <p>Latitude: {clickedPosition.lat.toFixed(6)}</p>
                        <p>Longitude: {clickedPosition.lng.toFixed(6)}</p>
                      </div>
                      {/* Down arrow */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                    </div>
                  </OverlayView>
                )}
              </GoogleMap>
            )}
          </div>
        )}

        {activeStep === 3 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Amentites
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select amenities for your place
            </Typography>
            {/* <Grid container spacing={2}>
            {amenities?.map((amn) => {
              const isSelected = selected.includes(amn?.id);
              return (
                <Grid item xs={12} sm={6} md={3} key={amn?.id} size={3}>
                  <Card
                    sx={{
                      border: isSelected ? '2px solid #f43f5e' : '2px solid #ddd',
                      backgroundColor: isSelected ? '#fff0f3' : '#fff',
                      borderRadius: 2,
                    }}
                  >
                    <CardActionArea onClick={() => toggleAmenity(amn?.id)} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isSelected ? (
                          <CheckBox sx={{ color: '#f43f5e' }} />
                        ) : (
                          <CheckBoxOutlineBlank sx={{ color: 'black' }} />
                        )}
                        {icon}
                        <Typography variant="body1" fontWeight={500} sx={{ color: 'black' }}>
                          {amn?.name}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid> */}
            <FormGroup >
              {amenities.map((amenity) => (
                <FormControlLabel
                  key={amenity?.id}
                  control={
                    <Checkbox
                      checked={selected.includes(amenity?.id)}
                      onChange={() => {
                        setSelected((prev) =>
                          prev.includes(amenity?.id)
                            ? prev.filter((id) => id !== amenity?.id)
                            : [...prev, amenity?.id]
                        );
                      }}
                    />
                  }
                  label={amenity.name}
                />
              ))}
            </FormGroup>
          </Box>
        )}
      </>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f59e0b'; // Amber
      case 'active':
        return '#10b981'; // Green
      case 'block':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
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
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1,
                    bgcolor: getStatusColor(p?.status),
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'capitalize'
                  }}
                >
                  {p?.status}
                </Box>
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
                    onClick={() => handleEditClick(p?.propertyId)}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      marginLeft: '10px',
                      padding: '6px 12px',
                      backgroundColor: '#cd3115',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleDeleteClick(p?.propertyId)}
                  >
                    Delete
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
          <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mt: 4, mb: 4 }}>
              <StepContent />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                {
                  activeStep !== steps.length - 1 && (
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>
                      <Button variant="contained" onClick={handleNext}>
                        Next
                      </Button>

                    </DialogActions>

                  )
                }
                {
                  activeStep === steps.length - 1 && (
                    <DialogActions>
                      <Button onClick={handleClose}>Cancel</Button>

                      <Button variant="contained" onClick={handleUpdate}>
                        Submit
                      </Button>

                    </DialogActions>
                  )
                }
              </Box>
            </Box>

          </Box>
        </DialogContent>

      </Dialog>

    </Container>
  )

}

export default MyProperty