import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import homywayLogo from "../assets/images/homywayLogo.png";

function Footer() {
  const quickLinks = [
    { name: 'Villa', path: '/villa' },
    { name: 'Farm House', path: '/farmhouse' },
    { name: 'Hotel', path: '/hotel' },
    { name: 'About Us', path: '/about' },
  ];

  const contactInfo = [
    { icon: <Phone />, text: '+91 98248 73685' },
    { icon: <Email />, text: 'contact@homyway.com' },
    { icon: <LocationOn />, text: 'Surat, Gujarat, India' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e1e1e',
        color: 'white',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 5 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Logo and Description */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <img
                src={homywayLogo}
                alt="HomyWay Logo"
                style={{
                  height: '55px',
                  width: 'auto',
                  marginBottom: '1.5rem',
                }}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  mb: 3, 
                  maxWidth: '400px',
                  lineHeight: 1.7,
                }}
              >
                Discover your perfect getaway with HomyWay. We offer a curated selection of luxury villas, 
                farm houses, and hotels for unforgettable stays.
              </Typography>
              <Stack 
                direction="row" 
                spacing={2}
                sx={{
                  '& .MuiIconButton-root': {
                    transition: 'all 0.3s ease',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#b91c1c',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#b91c1c',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#b91c1c',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: '#b91c1c',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#b91c1c',
                }
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={2}>
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#b91c1c',
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <KeyboardArrowRight sx={{ fontSize: 20, mr: 1 }} />
                  {link.name}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: '40px',
                  height: '2px',
                  bgcolor: '#b91c1c',
                }
              }}
            >
              Contact Us
            </Typography>
            <Stack spacing={3}>
              {contactInfo.map((info, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                    },
                  }}
                >
                  <Box sx={{ 
                    color: '#b91c1c',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {info.icon}
                  </Box>
                  <Typography 
                    variant="body1"
                    sx={{
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {info.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ 
          my: { xs: 4, md: 5 }, 
          borderColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.5,
        }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            pt: 1,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.5px',
            }}
          >
            © {new Date().getFullYear()} HomyWay. All rights reserved.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{
              '& a': {
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                letterSpacing: '0.5px',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#b91c1c',
                },
              },
            }}
          >
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Policy</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
