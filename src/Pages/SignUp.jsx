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
import { RadioGroup, Radio } from '@mui/joy';
import { toast } from 'react-toastify';
export default function SignUp() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [gid, setGid] = React.useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${api}/Auth/register`, { name, email, password: pass, phone, status : "active", gid });
            if (res.data) {
                navigate('/login', { replace: true });
                toast.success("Registration successful.")
            }
        } catch (error) {
            console.error('Registration failed', error);
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
                        Sign up to continue to HomyWay
                    </Typography>

                    <FormControl>
                        <FormLabel
                            sx={{
                                color: 'rgba(0, 0, 0, 0.7)',
                                mb: 1,
                            }}
                        >
                            User Name
                        </FormLabel>
                        <Input
                            name="email"
                            type="email"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            Phone no
                        </FormLabel>
                        <Input
                            name="phone"
                            type="email"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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

                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel
                            sx={{
                                color: 'rgba(0, 0, 0, 0.7)',
                                mb: 1,
                            }}
                        >
                            Select Role
                        </FormLabel>
                        <RadioGroup
                            name="role"
                            value={gid} 
                            onChange={(e) => setGid(e.target.value)}
                            orientation="horizontal"
                            sx={{ gap: 2 }}
                        >
                            <Radio
                                value="3"
                                label="User"
                                sx={{
                                    color: '#2e2e2e',
                                    '--Radio-actionColor': '#b91c1c',
                                    '--Radio-labelColor': '#2e2e2e',
                                }}
                            />
                            <Radio
                                value="2"
                                label="Host"
                                sx={{
                                    color: '#2e2e2e',
                                    '--Radio-actionColor': '#b91c1c',
                                    '--Radio-labelColor': '#2e2e2e',
                                }}
                            />
                        </RadioGroup>
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
                        Sign Up
                    </Button>

                    <Typography
                        endDecorator={
                            <Link
                                to="/login"
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
                                Login
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
