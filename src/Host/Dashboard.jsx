import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { api } from "../api";
import { Box, Typography } from "@mui/material";
import { AuthContext } from "../Context/AuthProvider";
import { LogoutOutlined, TrendingUp } from "@mui/icons-material";
import MyProperty from "./MyProperty";
import MyBookings from "../Pages/Profile/MyBookings";
import MyWishlist from "../Pages/Profile/MyWishlist";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import AddProperty from "./AddProperty";
import EditProperty from "./EditProperty";
import BookingPerPropertyChart from "./BookingPerPropertyChart";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import VillaIcon from '@mui/icons-material/Villa';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AllBookings from "./AllBookings";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard(props) {
  const { window } = props;
  const { user, logOut } = React.useContext(AuthContext);
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;
  const [bookings, setBooking] = React.useState([])

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
      segment: "allbookings",
      title: "All Bookings",
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

  const [weeklyEarnings, setWeeklyEarnings] = React.useState([]);

  const getWeeklyEarnings = async () => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const res = await axios.get(`${api}/Bookings/weekly-host-earnings/${user?.id}`, {
        params: {
          startDate: sevenDaysAgo.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        }
      });

      if (res?.data) {
        setWeeklyEarnings(res.data);
      }
    } catch (error) {
      console.error('Error fetching weekly earnings:', error);
    }
  };

  React.useEffect(() => {
    if (user?.id) {
      getWeeklyEarnings();
    }
  }, [user?.id]);

  const chartData = {
    labels: weeklyEarnings.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        day: 'numeric'
      });
    }),
    datasets: [
      {
        label: 'Your Earnings',
        data: weeklyEarnings.map(item => item.totalEarnings),
        fill: true,
        borderColor: '#b91c1c',
        backgroundColor: 'rgba(185, 28, 28, 0.1)',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#1e1e1e',
        pointBorderColor: '#b91c1c',
        pointBorderWidth: 2,
        borderWidth: 3
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif"
          },
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: 'Last 7 Days Earnings',
        font: {
          size: 16,
          weight: 'bold',
          family: "'Roboto', sans-serif"
        },
        color: '#ffffff'
      },
      tooltip: {
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        titleFont: {
          size: 14,
          family: "'Roboto', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Roboto', sans-serif"
        },
        padding: 12,
        borderColor: '#b91c1c',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Earnings: ₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          font: {
            size: 12,
            family: "'Roboto', sans-serif"
          },
          color: '#ffffff',
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12,
            family: "'Roboto', sans-serif"
          },
          color: '#ffffff'
        },
        border: {
          color: 'rgba(255, 255, 255, 0.2)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

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
      case "/allbookings":
        return <AllBookings />;
      case "/mywishlist":
        return <MyWishlist />;
      case "/logout":
        logOut();               
        router.push("/login");  
        return null;
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

            <Box mt={4} mb={4}>
              <Paper 
                elevation={3}
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  backgroundColor: '#1e1e1e',
                  '& canvas': {
                    maxHeight: '400px'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUp sx={{ color: '#b91c1c' }} />
                  <Typography variant="h6" color="white">
                    Earnings Overview
                  </Typography>
                </Box>
                <Line data={chartData} options={chartOptions} />
              </Paper>
            </Box>

            <Typography variant="h4" gutterBottom>Bookings per Property</Typography>

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