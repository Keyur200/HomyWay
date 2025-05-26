// EditPropertyStepper.js
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Step, StepLabel, Stepper, TextField, Typography,
  Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment
} from '@mui/material';

const steps = ['Basic Info', 'Upload Images', 'Location', 'Amenities'];

const EditPropertyStepper = ({ property, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [guests, setGuests] = useState('');
  const [bedroom, setBedroom] = useState('');
  const [bed, setBed] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [price, setPrice] = useState('');
  const [cid, setcid] = useState('');
  const [category, setCategory] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  
  useEffect(() => {
    if (property) {
      setName(property.propertyName || '');
      setCity(property.propertyCity || '');
      setPrice(property.propertyPrice || '');
      setBed(property.bed || '');
      setBedroom(property.bedRoom || '');
      // Load other fields similarly
    }
  }, [property]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleUpload = () => {
    console.log("Saving updated property", {
      name, city, price, bed, bedroom
      // send all updated fields
    });
    onClose(); // close dialog after save
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 3 }}>
        {activeStep === 0 && (
          <>
            <TextField
              label="Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price"
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Beds"
                  fullWidth
                  value={bed}
                  onChange={(e) => setBed(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Bedrooms"
                  fullWidth
                  value={bedroom}
                  onChange={(e) => setBedroom(e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* You can fill other steps similarly... */}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" onClick={handleUpload}>Save</Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EditPropertyStepper;
