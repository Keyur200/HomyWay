import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModeToggle() {
  const { mode, setMode } = useColorScheme("dark");
  const [mounted, setMounted] = React.useState(false);


  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <Button variant="dark">Change mode</Button>;
  }

  return (
    <></>
  );
}

export default function Login(props) {
    
  const [email,setEmail] = React.useState();
  const [pass,setPass] = React.useState();

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${api}/Auth/login`, { email, password : pass });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  return (
    <main>
      <CssVarsProvider {...props}>
        <ModeToggle />
        <CssBaseline />
        <Sheet
          sx={{
            width: 300,
            mx: 'auto', // margin left & right
            my: 4, // margin top & bottom
            py: 3, // padding top & bottom
            px: 2, // padding left & right
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant="outlined"
        >
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body-sm">Sign in to continue.</Typography>
          </div>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              // html input attribute
              name="email"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="johndoe@email.com"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              // html input attribute
              name="password"
              type="password"
              value={pass}
              onChange={e=>setPass(e.target.value)}
              placeholder="password"
            />
          </FormControl>
          <Button onClick={handleLogin} sx={{ mt: 1 /* margin top */ }}>Log in</Button>
          <Typography
            endDecorator={<Link href="/sign-up">Sign up</Link>}
            sx={{ fontSize: 'sm', alignSelf: 'center' }}
          >
            Don&apos;t have an account?
          </Typography>
        </Sheet>
      </CssVarsProvider>
    </main>
  );
}
