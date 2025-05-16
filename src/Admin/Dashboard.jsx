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
import Category from "./Category";
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
import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import { AuthContext } from "../Context/AuthProvider";
import Host from "./Host";
import { CategoryOutlined, LogoutOutlined, TourOutlined } from "@mui/icons-material";
import User from "./User";
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
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "host",
    title: "Hosts",
    icon: <TourOutlined />,
  },
   {
    segment: "user",
    title: "Users",
    icon: <PersonIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "logout",
    title: "Logout",
    icon: <LogoutOutlined />,
  }
  // {
  //   kind: "divider",
  // },
  // {
  //   kind: "header",
  //   title: "Analytics",
  // },
  // {
  //   segment: "reports",
  //   title: "Reports",
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: "sales",
  //       title: "Sales",
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: "traffic",
  //       title: "Traffic",
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: "integrations",
  //   title: "Integrations",
  //   icon: <LayersIcon />,
  // },
];





const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
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

const Skeleton = styled("div")(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
];

export default function Dashboard(props) {
  const { window } = props;
  const { user, checkAdmin } = React.useContext(AuthContext);
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

  // get only user details 
  const [user2, setUser] = React.useState([]);

  React.useEffect(() => {
    setUser(users?.filter((u) => u.gid === 3));
  }, [users]);

  // get only host details 
  const [host, setHost] = React.useState([]);

  React.useEffect(() => {
    setHost(users?.filter((u) => u.gid === 2));
  }, [users]);


// data for box details like user count || host count || category count
  const stats = [
    {
      label: "Users",
      value: user2?.length,
      icon: <PersonIcon fontSize="large" sx={{ color: "#4a00e0" }} />,
      bgColor: "#eef4ff",
      textColor: "#2962ff",
    },
    {
      label: "Hosts",
      value: host?.length,
      icon: <BusinessCenterIcon fontSize="large" sx={{ color: "#ff8f00" }} />,
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
    {
      label: "Events",
      value: 696,
      icon: <EventIcon fontSize="large" sx={{ color: "#ff5252" }} />,
      bgColor: "#ffebee",
      textColor: "#ff3d00",
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
          return <User/>;
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
    >
      <DashboardLayout>{renderContent()}</DashboardLayout>
    </AppProvider>
  );
}
