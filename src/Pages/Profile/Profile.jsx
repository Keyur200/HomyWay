import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LayersIcon from "@mui/icons-material/Layers";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import { api } from "../../api";
import { AuthContext } from "../../Context/AuthProvider";

const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { title: "Profile", icon: <PersonIcon /> },
  { segment: "integrations", title: "Integrations", icon: <LayersIcon /> },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: { colorSchemeSelector: "class" },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);
  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);
  return router;
}

export default function Profile(props) {
  const { window } = props;
  const router = useDemoRouter("/profile");
  const demoWindow = window ? window() : undefined;
  const { user, checkAdmin } = React.useContext(AuthContext);

  const [isEditing, setIsEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    status: "active"
  });

  // Update form data when user data changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        status: user.status || "active"
      });
    }
  }, [user]);

  const updateUser = async () => {
    try {
      const queryParams = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }).toString();
      
      const response = await axios.patch(`${api}/Auth/updateUser/${user.id}?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        const response = await updateUser();

        if (response.data) {
          // Update the local storage with new user data if you're storing it there
          const updatedUser = { ...user, ...formData };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          setSnackbar({
            open: true,
            message: "Profile updated successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to update profile",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setLoading(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      // Make API call to upload profile picture
      const response = await axios.post(`${api}/users/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data?.url) {
        setFormData(prev => ({ ...prev, profilePic: response.data.url }));
        setSnackbar({
          open: true,
          message: "Profile picture updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setSnackbar({
        open: true,
        message: "Failed to update profile picture",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderContent = () => {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Card sx={{ position: 'relative', mb: 4 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 3
            }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={user?.avatarUrl || "/static/images/avatar/1.jpg"}
                  alt={user?.name}
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 3
                  }}
                />
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {formData.name || "User Profile"}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: formData.status === 'active' ? 'success.main' : 'grey.500',
                      mr: 1
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {formData.status}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                onClick={handleEditToggle}
                startIcon={isEditing ? null : <EditIcon />}
                disabled={loading}
                sx={{ ml: 'auto' }}
              >
                {loading ? <CircularProgress size={24} /> : isEditing ? "Save" : "Edit"}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="phone"
                  fullWidth
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  };

  // If user data is not loaded yet, show loading state
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>{renderContent()}</DashboardLayout>
    </AppProvider>
  );
}
