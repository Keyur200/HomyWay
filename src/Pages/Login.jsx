import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Container } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import homywayLogo from "../assets/images/homywayLogo.png";
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${api}/Auth/login`, { email, password: pass });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if(res?.data?.user?.gid === 1){
          navigate('/admin/dashboard', { replace: true });       
        }else{
          navigate('/', { replace: true });
        }
        toast.success(`Login successful ${res?.data?.user?.name}`)
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.9))',
        backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlend: 'overlay',
      }}
    >
      <Container maxWidth="xs">
        <Sheet
          sx={{
            width: '100%',
            mx: 'auto',
            py: 4,
            px: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderRadius: 'lg',
            boxShadow: 'lg',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.1)',
          }}
          variant="outlined"
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={homywayLogo}
              alt="HomyWay Logo"
              style={{
                height: '60px',
                width: 'auto',
              }}
            />
          </Box>

          <Typography
            level="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              color: '#2e2e2e',
              fontWeight: 'bold',
              mb: 1,
            }}
          >
            Welcome Back!
          </Typography>
          <Typography
            level="body-sm"
            sx={{
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.7)',
              mb: 2,
            }}
          >
            Sign in to continue to HomyWay
          </Typography>

          <FormControl>
            <FormLabel
              sx={{
                color: 'rgba(0, 0, 0, 0.7)',
                mb: 1,
              }}
            >
              Email
            </FormLabel>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@email.com"
              startDecorator={<EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.5)' }} />}
              sx={{
                '--Input-decoratorChildHeight': '45px',
                '--Input-radius': '8px',
                '--Input-gap': '8px',
                '--Input-placeholderOpacity': 0.5,
                '--Input-focusedThickness': '2px',
                '--Input-minHeight': '45px',
                color: '#2e2e2e',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:focus-within': {
                  borderColor: '#b91c1c',
                  backgroundColor: '#fff',
                },
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel
              sx={{
                color: 'rgba(0, 0, 0, 0.7)',
                mb: 1,
              }}
            >
              Password
            </FormLabel>
            <Input
              name="password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your password"
              startDecorator={<LockIcon sx={{ color: 'rgba(0, 0, 0, 0.5)' }} />}
              sx={{
                '--Input-decoratorChildHeight': '45px',
                '--Input-radius': '8px',
                '--Input-gap': '8px',
                '--Input-placeholderOpacity': 0.5,
                '--Input-focusedThickness': '2px',
                '--Input-minHeight': '45px',
                color: '#2e2e2e',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:focus-within': {
                  borderColor: '#b91c1c',
                  backgroundColor: '#fff',
                },
              }}
            />
          </FormControl>

          <Button
            onClick={handleLogin}
            sx={{
              mt: 1,
              backgroundColor: '#b91c1c',
              color: '#fff',
              minHeight: '45px',
              fontSize: '1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#991b1b',
              },
            }}
          >
            Sign In
          </Button>

          <Typography
            endDecorator={
              <Link
                to="/signup"
                style={{
                  color: '#b91c1c',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              >
                Sign up
              </Link>
            }
            sx={{
              fontSize: 'sm',
              color: 'rgba(0, 0, 0, 0.7)',
              alignSelf: 'center',
            }}
          >
            Don't have an account?
          </Typography>

        </Sheet>
      </Container>
    </Box>
  );
}
