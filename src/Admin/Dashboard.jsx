import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Grid from "@mui/material/Grid";
import Category from "./Category";
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
import Host from "./Host";
import { 
  CategoryOutlined,
  LogoutOutlined, 
  SupervisorAccountOutlined,
  GroupOutlined,
  VillaOutlined,
  CurrencyRupee
} from "@mui/icons-material";
import User from "./User";
import Property from "./Property";

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
    segment: "category",
    title: "Categories",
    icon: <CategoryOutlined />,
  },
  {
    segment: "property",
    title: "Property",
    icon: <VillaOutlined />,
  },
  {
    segment: "host",
    title: "Hosts",
    icon: <SupervisorAccountOutlined />,
  },
  {
    segment: "user",
    title: "Users",
    icon: <GroupOutlined />,
  },
  {
    kind: "divider",
  },
  {
    segment: "logout",
    title: "Logout",
    icon: <LogoutOutlined />,
  }
];

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

export default function Dashboard(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;
  const [users, setUsers] = React.useState([]);
  const [category, setCategory] = React.useState([]);

  // get all user data 
  const getAllUsers = async () => {
    const res = await axios.get(`${api}/Auth`);
    if (res) {
      setUsers(res.data);
    }
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);


  // get all category data
  const getAllCategories = async () => {
    const res = await axios.get(`${api}/PropertyCategoryTbls`);
    if (res) {
      setCategory(res.data);
    }
  };

  React.useEffect(() =>{
    getAllCategories();
  },[])

 
  const [user2, setUser] = React.useState([]);

  React.useEffect(() => {
    setUser(users?.filter((u) => u.gid === 3));
  }, [users]);

  
  const [host, setHost] = React.useState([]);

  React.useEffect(() => {
    setHost(users?.filter((u) => u.gid === 2));
  }, [users]);

  const [earnings,setEarnings] = React.useState(0)
  const getEarnings = async () => {
    const res = await axios.get(`${api}/Bookings/adminEarnings`)
    if(res?.data){
      setEarnings(res?.data)
    }
  }

  React.useEffect(()=>{
    getEarnings()
  },[])

  const stats = [
    {
      label: "Total Earnings",
      value: earnings,
      icon: <CurrencyRupee fontSize="large" sx={{ color: "#ff5252" }} />,
      bgColor: "#ffebee",
      textColor: "#ff3d00",
    },
    {
      label: "Users",
      value: user2?.length,
      icon: <GroupOutlined fontSize="large" sx={{ color: "#4a00e0" }} />,
      bgColor: "#eef4ff",
      textColor: "#2962ff",
    },
    {
      label: "Hosts",
      value: host?.length,
      icon: <SupervisorAccountOutlined fontSize="large" sx={{ color: "#ff8f00" }} />,
      bgColor: "#fff8e1",
      textColor: "#ff6f00",
    },
    {
      label: "Categories",
      value: category?.length,
      icon: <CategoryOutlined fontSize="large" sx={{ color: "#00b0ff" }} />,
      bgColor: "#e1f5fe",
      textColor: "#039be5",
    },
  ];

  // Component selector based on route
  const renderContent = () => {
    switch (router.pathname) {
      case "/category":
        return <Category />;
      case "/host":
        return <Host />;
        case "/user":
          return <User />;
       case "/property":
        return <Property />;
      case "/dashboard":
      default:
        return (
          <Box sx={{ width: 900, margin: "auto", mt: 4 }}>
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
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <Typography variant="h4" gutterBottom>
              Hosts
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <caption>Hosts</caption>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone no</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {host.map((row) => (
                    <TableRow key={row?.name}>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.email}</TableCell>
                      <TableCell>{row?.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <hr style={{ marginTop: "30px", marginBottom: "20px" }} />
            <Typography variant="h4" gutterBottom>
              Users
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <caption>Users</caption>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone no</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user2.map((row) => (
                    <TableRow key={row?.name}>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.email}</TableCell>
                      <TableCell>{row?.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
      
    >
      <DashboardLayout>{renderContent()}</DashboardLayout>
    </AppProvider>
  );
}
