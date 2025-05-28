// StepperForm.jsx
import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { GoogleMap, InfoWindow, LoadScript, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Grid,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
  Card,
  CardActionArea
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TiptapEditor from './TiptapEditor';
import axios from 'axios';
import { api } from '../api'
import { AuthContext } from '../Context/AuthProvider';
import { markers } from './marker';
const steps = ['Basic Info', 'Upload File', 'Location', "Amenities"];

const containerStyle = {
  width: '700px',
  height: '500px'
};

const center = {
  lat: 22.9734, // Center of India
  lng: 78.6569
};



export default function AddProperty() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const { user, checkAdmin } = React.useContext(AuthContext);
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


  const getAllCategories = async () => {
    const res = await axios.get(`${api}/PropertyCategoryTbls`)
    if (res?.data) {
      setCategory(res?.data)
    }
  }

  useEffect(() => {
    getAllCategories()
    getAllAmenities()
  }, [])

  const handleUpload = async () => {
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
    formData.append("status", "Pending");
    formData.append("propertyPrice", price);
    formData.append("categoryId", cid);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    selected.forEach((id) => {
      formData.append("amenities", id);
    });
    files.forEach((file) => formData.append("files", file));

    try {
      const res = await axios.post(`${api}/Property`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);

  // When clicking anywhere on map
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setLatitude(lat);
    setLongitude(lng);

    setClickedPosition({ lat, lng });
    setSelectedMarker(null)
  };

  const [amenities, setAmenities] = useState([])

  const getAllAmenities = async () => {
    const res = await axios.get(`${api}/Amenities`)
    if (res.data) {
      setAmenities(res?.data)
    }
  }
  const [selected, setSelected] = useState([]);

  const toggleAmenity = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );

    console.log(selected)
  };
  const StepContent = (
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

        </>
      )}

      {activeStep === 2 && (
        <div>
          <LoadScript googleMapsApiKey={""}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5} onClick={handleMapClick}>

              {clickedPosition && !selectedMarker && (
                <InfoWindow position={clickedPosition} onCloseClick={() => setClickedPosition(null)}>
                  <div style={{ color: 'black' }}>
                    <strong>Clicked Position</strong><br />
                    Latitude: {clickedPosition.lat}<br />
                    Longitude: {clickedPosition.lng}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
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
          <Grid container spacing={2}>
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
                        {/* {icon} */}
                        <Typography variant="body1" fontWeight={500} sx={{ color: 'black' }}>
                          {amn?.name}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );


  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>
        {StepContent}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {
            activeStep !== steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )
          }
          {
            activeStep === steps.length - 1 && (
              <Button variant="contained" onClick={handleUpload}>
                Submit
              </Button>
            )
          }
        </Box>
      </Box>

    </Box>
  );
}
