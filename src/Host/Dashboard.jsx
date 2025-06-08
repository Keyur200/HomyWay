import * as React from "react";
import { createTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import Grid from "@mui/material/Grid";
import { Navigate, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { api } from "../api";
import { Box, Typography, Container } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import { AuthContext } from "../Context/AuthProvider";
import { CategoryOutlined, LogoutOutlined, TourOutlined } from "@mui/icons-material";
import MyProperty from "./MyProperty";
import MyBookings from "../Pages/Profile/MyBookings";
import MyWishlist from "../Pages/Profile/MyWishlist";
import LocationCity from "@mui/icons-material/LocationCity";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import AddProperty from "./AddProperty"; // Adjust path if necessary
import EditProperty from "./EditProperty";
import BookingPerPropertyChart from "./BookingPerPropertyChart";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import VillaIcon from '@mui/icons-material/Villa';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ListAltIcon from '@mui/icons-material/ListAlt';



export default function Dashboard(props) {
  const { window } = props;
  const { user, checkAdmin } = React.useContext(AuthContext);
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;
  const [users, setUsers] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      segment: "property",
      title: "Property",
      icon: <ApartmentIcon />,
      children: [
        {
          segment: "addProperty",
          title: "Add Property",
          icon: <AddCircleOutline />,
        },
        {
          segment: "myproperty",
          title: "My Properties",
          icon: <ListAltIcon />,
        },
      ],
    },
    {
      segment: "mybookings",
      title: "My Bookings",
      icon: <BookOnlineIcon />,
    },
    {
      segment: "mywishlist",
      title: "My Favorites",
      icon: <FavoriteIcon />,
    },
    {
      segment: "logout",
      title: "Logout",
      icon: <LogoutOutlined />,
    }
  ];

  const [bookings, setBooking] = React.useState([])

  const getAllBookings = async () => {
    const res = await axios.get(`${api}/Bookings/host/${user?.id}`)
    if (res?.data) {
      setBooking(res?.data)
    }
  }

  React.useEffect(() => {
    getAllBookings()
    totalEarnings()
    getMyProperty()
  }, [user?.id])

  const [earning, setEarning] = React.useState(0)

  const totalEarnings = async () => {
    const res = await axios.get(`${api}/Bookings/total/${user?.id}`)
    if (res?.data) {
      setEarning(res?.data)
    }
  }

  const [properties, setProperties] = React.useState([])
  const getMyProperty = async () => {
    const res = await axios.get(`${api}/Property/host/${user?.id}`)
    if (res?.data) {
      setProperties(res?.data)
    }
  }


  const demoTheme = createTheme({
    colorSchemes: { light: true, dark: true },
    cssVariables: {
      colorSchemeSelector: "class",
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            "& .MuiToolbar-root": {
              "& .MuiTypography-root": {
                "&.app-title": {
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#b91c1c"
                }
              }
            }
          }
        }
      }
    },
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

  const stats = [
    {
      label: "Total Earnings",
      value: earning,
      icon: <CurrencyRupeeIcon fontSize="large" sx={{ color: "#4a00e0" }} />,
      bgColor: "#eef4ff",
      textColor: "#2962ff",
    },
    {
      label: "My Hosting",
      value: properties?.length,
      icon: <VillaIcon fontSize="large" sx={{ color: "#ff8f00" }} />,
      bgColor: "#fff8e1",
      textColor: "#ff6f00",
    },
    {
      label: "Total Booking",
      value: bookings?.length,
      icon: <BookOnlineIcon fontSize="large" sx={{ color: "#00b0ff" }} />,
      bgColor: "#e1f5fe",
      textColor: "#039be5",
    },
    {
      label: "My Favorites",
      value: "0",
      icon: <FavoriteIcon fontSize="large" sx={{ color: "#ff5252" }} />,
      bgColor: "#ffebee",
      textColor: "#ff3d00",
    },
  ];


  function useDemoRouter(initialPath) {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
      return {
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(String(path)),
      };
    }, [pathname]);

    return router;
  }
  // Component selector based on route
  const renderContent = () => {
    switch (router.pathname) {
      case "/property/addProperty":
        return <AddProperty />;
      case "/property/myproperty":
        return <MyProperty />;
      case "/mybookings":
        return <MyBookings />;
      case "/mywishlist":
        return <MyWishlist />;
      
      case "/dashboard":
      default:
        return (
          <Box sx={{ width: 900, margin: "auto", mt: 4 }}>

            <Typography variant="h4" gutterBottom>Host Dashboard</Typography>
            <Grid container spacing={3}>
              {stats.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      width: 200, // fixed width
                      height: 180, // optional: fixed height
                      p: 3,
                      backgroundColor: item.bgColor,
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box display="flex" justifyContent="center" mb={2}>
                      {item.icon}
                    </Box>
                    <Typography
                      align="center"
                      variant="subtitle1"
                      sx={{ color: item.textColor }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      align="center"
                      variant="h5"
                      sx={{ fontWeight: 600, color: item.textColor }}
                    >
                      {item.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <BookingPerPropertyChart />
          </Box>
        );
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      title="HomyWay"
      titleProps={{ className: "app-title" }}
      branding={{
        // logo: {
        //   src: homywayLogo,
        //   alt: "HomyWay Logo",
        // },
        title: "HomyWay",
      }}
    >
      <DashboardLayout>{renderContent()}</DashboardLayout>
    </AppProvider>
  );
}