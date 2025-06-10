import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { api } from '../api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TvIcon from '@mui/icons-material/Tv';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BalconyIcon from '@mui/icons-material/Balcony';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import HotTubIcon from '@mui/icons-material/HotTub';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import SecurityIcon from '@mui/icons-material/Security';
import PetsIcon from '@mui/icons-material/Pets';
import SpaIcon from '@mui/icons-material/Spa';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ElevatorIcon from '@mui/icons-material/Elevator';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Property() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [propertyAmenities, setPropertyAmenities] = useState([]);

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'transparent',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'transparent',
          color: 'white',
          '&:hover': {
            bgcolor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    dotsClass: "slick-dots custom-dots",
  };

  const getProperties = async (status) => {
    try {
      const res = await axios.get(`${api}/Property/Status/${status}`);
      if (res?.data) {
        setProperties(res.data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const getPropertyAmenities = async (amenityIds) => {
    try {
      if (!amenityIds) return [];
      
      // Parse the amenity IDs if they're in string format
      const ids = typeof amenityIds === 'string' ? JSON.parse(amenityIds) : amenityIds;
      
      if (!Array.isArray(ids) || ids.length === 0) return [];

      // Fetch amenities for each ID
      const amenityPromises = ids.map(id => 
        axios.get(`${api}/Amenities/${id}`)
          .then(res => res.data)
          .catch(err => {
            console.error(`Error fetching amenity ${id}:`, err);
            return null;
          })
      );

      const results = await Promise.all(amenityPromises);
      return results.filter(amenity => amenity !== null);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      return [];
    }
  };

  useEffect(() => {
    getProperties(activeTab);
  }, [activeTab]);

  const handlePropertyClick = async (property) => {
    setSelectedProperty(property);
    setOpenDialog(true);
    
    // Log the status to debug
    console.log('Property Status:', property.status);
    
    if (property.amenities) {
      const amenities = await getPropertyAmenities(property.amenities);
      setPropertyAmenities(amenities);
    } else {
      setPropertyAmenities([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProperty(null);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${api}/Property/Status/${status}?id=${id}`);
      getProperties(activeTab);
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating property status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'active':
        return '#10b981';
      case 'block':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getAmenityIcon = (amenityName) => {
    const name = amenityName.toLowerCase();
    if (name.includes('wifi')) return <WifiIcon />;
    if (name.includes('parking')) return <LocalParkingIcon />;
    if (name.includes('pool')) return <PoolIcon />;
    if (name.includes('gym') || name.includes('fitness')) return <FitnessCenterIcon />;
    if (name.includes('restaurant') || name.includes('dining')) return <RestaurantIcon />;
    if (name.includes('tv') || name.includes('television')) return <TvIcon />;
    if (name.includes('ac') || name.includes('air') || name.includes('cooling')) return <AcUnitIcon />;
    if (name.includes('laundry') || name.includes('washer')) return <LocalLaundryServiceIcon />;
    if (name.includes('kitchen') || name.includes('refrigerator')) return <KitchenIcon />;
    if (name.includes('balcony') || name.includes('patio')) return <BalconyIcon />;
    if (name.includes('fireplace')) return <FireplaceIcon />;
    if (name.includes('hot tub') || name.includes('jacuzzi')) return <HotTubIcon />;
    if (name.includes('grill') || name.includes('bbq')) return <OutdoorGrillIcon />;
    if (name.includes('beach')) return <BeachAccessIcon />;
    if (name.includes('security') || name.includes('safe')) return <SecurityIcon />;
    if (name.includes('pet')) return <PetsIcon />;
    if (name.includes('spa')) return <SpaIcon />;
    if (name.includes('room') || name.includes('suite')) return <MeetingRoomIcon />;
    if (name.includes('elevator') || name.includes('lift')) return <ElevatorIcon />;
    if (name.includes('smoking')) return <SmokingRoomsIcon />;
    return <HomeIcon />; // default icon
  };

  // Add a helper function to normalize status
  const normalizeStatus = (status) => {
    return status?.toLowerCase()?.trim() || '';
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Property Management
      </Typography>
      
      <Stack direction="row" spacing={2} mb={3}>
        <Button 
          variant={activeTab === 'pending' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('pending')}
          sx={{
            bgcolor: activeTab === 'pending' ? 'primary.main' : 'transparent',
            '&:hover': {
              bgcolor: activeTab === 'pending' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Pending Properties
        </Button>
        <Button 
          variant={activeTab === 'active' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('active')}
          sx={{
            bgcolor: activeTab === 'active' ? 'primary.main' : 'transparent',
            '&:hover': {
              bgcolor: activeTab === 'active' ? 'primary.dark' : 'action.hover',
            }
          }}
        >
          Active Properties
        </Button>
      </Stack>

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: 'background.paper',
          '& .MuiTableCell-root': {
            borderColor: 'divider',
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Property Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Host Info</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => (
              <TableRow 
                key={property.propertyId} 
                onClick={() => handlePropertyClick(property)}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    transition: 'background-color 0.2s ease'
                  }
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      width: 100,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      boxShadow: 1
                    }}
                  >
                    <img 
                      src={property.imagesNavigation?.[0]?.imageUrl} 
                      alt={property.propertyName}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover' 
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                    {property.propertyName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stripHtml(property.propertyDescription).slice(0, 100)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {property.propertyCity}, {property.propertyState}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2}>
                    <Box display="flex" alignItems="center">
                      <BedIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">{property.bedRoom}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <BathtubIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">{property.bathroom}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2">{property.maxGuests}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center">
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {property.host?.name || 'N/A'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {property.host?.phone || 'No phone'}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={property.status}
                    sx={{ 
                      bgcolor: getStatusColor(property.status),
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none'
          }
        }}
      >
        {selectedProperty && (
          <>
            <DialogTitle sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              pb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <HomeIcon color="primary" />
                <Typography variant="h5" component="span">
                  {selectedProperty.propertyName}
                </Typography>
              </Stack>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ 
                mb: 3,
                position: 'relative',
                '& .slick-dots': {
                  bottom: 16,
                  '& li button:before': {
                    color: 'white',
                    opacity: 0.5,
                    fontSize: 12,
                  },
                  '& li.slick-active button:before': {
                    color: 'white',
                    opacity: 1,
                  },
                },
              }}>
                <Slider {...sliderSettings}>
                  {selectedProperty.imagesNavigation?.map((image, index) => (
                    <div key={index}>
                      <Box
                        sx={{
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
                          },
                        }}
                      >
                        <img
                          src={image.imageUrl}
                          alt={`Property ${index + 1}`}
                          style={{ 
                            width: '100%', 
                            height: 400, 
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </Box>
    </div>
                  ))}
                </Slider>
              </Box>
              
              <Box sx={{ px: 3, pb: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {stripHtml(selectedProperty.propertyDescription)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Location
                    </Typography>
                    <Box display="flex" alignItems="center" mb={3}>
                      <LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        {selectedProperty.propertyAdderss}, {selectedProperty.propertyCity}, {' '}
                        {selectedProperty.propertyState}, {selectedProperty.propertyCountry}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 4 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Property Details
                    </Typography>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'background.default',
                            borderRadius: 2
                          }}
                        >
                          <Stack spacing={1}>
                            <PersonIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              Max Guests
                            </Typography>
                            <Typography variant="h6">
                              {selectedProperty.maxGuests}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'background.default',
                            borderRadius: 2
                          }}
                        >
                          <Stack spacing={1}>
                            <BedIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              Bedrooms
                            </Typography>
                            <Typography variant="h6">
                              {selectedProperty.bedRoom}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'background.default',
                            borderRadius: 2
                          }}
                        >
                          <Stack spacing={1}>
                            <BathtubIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              Bathrooms
                            </Typography>
                            <Typography variant="h6">
                              {selectedProperty.bathroom}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'background.default',
                            borderRadius: 2
                          }}
                        >
                          <Stack spacing={1}>
                            <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                            <Typography variant="body2" color="text.secondary">
                              Price per night
                            </Typography>
                            <Typography variant="h6">
                              ${selectedProperty.propertyPrice}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Amenities
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {propertyAmenities.map((amenity) => (
                        <Chip 
                          key={amenity.id}
                          icon={getAmenityIcon(amenity.name)}
                          label={amenity.name}
                          sx={{ 
                            bgcolor: 'background.default',
                            '&:hover': { bgcolor: 'action.hover' },
                            '& .MuiChip-icon': {
                              color: 'primary.main'
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom color="primary">
                      Host Information
                    </Typography>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        bgcolor: 'background.default',
                        borderRadius: 2,
                        mb: 3
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Host Name
                              </Typography>
                              <Box display="flex" alignItems="center">
                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                <Typography variant="body1">
                                  {selectedProperty.host?.name || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Contact Number
                              </Typography>
                              <Typography variant="body1">
                                {selectedProperty.host?.phone || 'No phone number provided'}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Paper>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ 
              p: 3, 
              borderTop: 1, 
              borderColor: 'divider',
              gap: 2
            }}>
              {(normalizeStatus(selectedProperty.status) === 'pending' || 
                normalizeStatus(selectedProperty.status) === 'block') && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusUpdate(selectedProperty.propertyId, 'active')}
                  startIcon={<CheckCircleIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: 'success.dark' 
                    }
                  }}
                >
                  Activate
                </Button>
              )}
              {(normalizeStatus(selectedProperty.status) === 'active') && (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleStatusUpdate(selectedProperty.propertyId, 'pending')}
                  startIcon={<BlockIcon />}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: 'error.dark' 
                    }
                  }}
                >
                  Pending
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default Property;
