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
import { Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import { AuthContext } from "../Context/AuthProvider";
import { CategoryOutlined, LogoutOutlined, TourOutlined } from "@mui/icons-material";
import MyProperty from "./MyProperty";
import LocationCity from "@mui/icons-material/LocationCity";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import AddProperty from "./AddProperty"; // Adjust path if necessary



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
      icon: <LocationCity />,
      children: [
        {
          segment: "addProperty",
          title: "Add Property",
          icon: <AddCircleOutline />,
        },
        {
          segment: "property",
          title: "property",
          icon: <FormatAlignCenter />,
        },
      ],
    },{
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
  // Component selector based on route
  const renderContent = () => {
    switch (router.pathname) {
        case "/property/addProperty":
        return <AddProperty />;
      case "/dashboard":
      default:
        return (
          <Box sx={{ width: 900, margin: "auto", mt: 4 }}>
           
           
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