import React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ColorModeIconDropdown from "./ColorModeIconDropdown";
import { AuthContext } from "../Context/AuthProvider";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import homywayLogo from "../assets/images/homywayLogo.png";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "relative",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

function Navbar2() {
  const [open, setOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { user, loggedIn, logOut } = React.useContext(AuthContext);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters sx={{
        background: "rgb(54 54 54 / 40%)"}}>
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link to="/">
              <img 
                src={homywayLogo} 
                alt="HomyWay Logo" 
                style={{ 
                  height: "40px",
                  width: "auto",
                }}
              />
            </Link>
           
          </Box>

          {/* Center: Menu Items */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button
             component={Link}
              to="/villa"
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              Villa
            </Button>

            <Button
              component={Link}
              to="/farmhouse"
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              Farm House
            </Button>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              Hotel
            </Button>
            <Button
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: "#fff",
                "&:hover": {
                  color: "#1976d2",
                },
              }}
            >
              About Us
            </Button>
          </Box>

          {/* Right: Color mode, Login/Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {loggedIn ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{ backgroundColor: "#0288d1" }}
                      alt={user?.name}
                      src={user?.avatarUrl || "/static/images/avatar/1.jpg"}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    component={Link}
                    to="/profile"
                  >
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography onClick={logOut} textAlign="center">
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                color="primary"
                variant="contained"
                size="small"
              >
                Login
              </Button>
            )}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <ColorModeIconDropdown size="medium" />
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="top"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                  sx: {
                    top: "var(--template-frame-height, 0px)",
                  },
                }}
              >
                <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <MenuItem>Features</MenuItem>
                  <MenuItem>Testimonials</MenuItem>
                  <MenuItem>Highlights</MenuItem>
                  <MenuItem>Pricing</MenuItem>
                  <MenuItem>FAQ</MenuItem>
                  <MenuItem>Blog</MenuItem>
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <Button color="primary" variant="contained" fullWidth>
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar2;
