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
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

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
          background: "rgb(54 54 54 / 40%)"
        }}>
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
              to={'/villa'}
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: location.pathname === "/villa" ? "#b91c1c" : "#fff",
                fontWeight: location.pathname === "/villa" ? 600 : 400,
                "&:hover": {
                  color: "#b91c1c",
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
                color: location.pathname === "/farmhouse" ? "#b91c1c" : "#fff",
                fontWeight: location.pathname === "/farmhouse" ? 600 : 400,
                "&:hover": {
                  color: "#b91c1c",
                },
              }}
            >
              Farm House
            </Button>
            <Button
              component={Link}
              to="/hotel"
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: location.pathname === "/hotel" ? "#b91c1c" : "#fff",
                fontWeight: location.pathname === "/hotel" ? 600 : 400,
                "&:hover": {
                  color: "#b91c1c",
                },
              }}
            >
              Hotel
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="text"
              size="small"
              sx={{
                textTransform: "capitalize",
                color: location.pathname === "/about" ? "#b91c1c" : "#fff",
                fontWeight: location.pathname === "/about" ? 600 : 400,
                "&:hover": {
                  color: "#b91c1c",
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
                      sx={{ backgroundColor: "#b91c1c" }}
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
                  {
                    user?.gid === 1 && (
                      <MenuItem
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to="/admin/dashboard"
                        sx={{
                          "&:hover": {
                            color: "#b91c1c",
                          },
                        }}
                      >
                        <Typography textAlign="center">Profile</Typography>
                      </MenuItem>
                    )
                  }
                  {
                    user?.gid === 2 && (
                      <MenuItem
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to="/host/dashboard"
                        sx={{
                          "&:hover": {
                            color: "#b91c1c",
                          },
                        }}
                      >
                        <Typography textAlign="center">Profile</Typography>
                      </MenuItem>
                    )
                  }
                  {
                    user?.gid === 3 && (
                      <MenuItem
                        onClick={handleCloseUserMenu}
                        component={Link}
                        to="/profile"
                        sx={{
                          "&:hover": {
                            color: "#b91c1c",
                          },
                        }}
                      >
                        <Typography textAlign="center">Profile </Typography>
                      </MenuItem>
                    )
                  }
                  <MenuItem
                    onClick={handleCloseUserMenu}
                    sx={{
                      "&:hover": {
                        color: "#b91c1c",
                      },
                    }}
                  >
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
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#b91c1c",
                  "&:hover": {
                    backgroundColor: "#991b1b",
                  },
                }}
              >
                Login
              </Button>
            )}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              {/* <ColorModeIconDropdown size="medium" /> */}
              <IconButton
                aria-label="Menu button"
                onClick={toggleDrawer(true)}
                sx={{
                  color: "#fff",
                  "&:hover": {
                    color: "#b91c1c",
                  },
                }}
              >
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
                    <IconButton
                      onClick={toggleDrawer(false)}
                      sx={{
                        "&:hover": {
                          color: "#b91c1c",
                        },
                      }}
                    >
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  <MenuItem
                    component={Link}
                    to="/villa"
                    sx={{
                      color: location.pathname === "/villa" ? "#b91c1c" : "inherit",
                      fontWeight: location.pathname === "/villa" ? 600 : 400,
                      "&:hover": { color: "#b91c1c" }
                    }}
                  >
                    Villa
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/farmhouse"
                    sx={{
                      color: location.pathname === "/farmhouse" ? "#b91c1c" : "inherit",
                      fontWeight: location.pathname === "/farmhouse" ? 600 : 400,
                      "&:hover": { color: "#b91c1c" }
                    }}
                  >
                    Farm House
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/hotel"
                    sx={{
                      color: location.pathname === "/hotel" ? "#b91c1c" : "inherit",
                      fontWeight: location.pathname === "/hotel" ? 600 : 400,
                      "&:hover": { color: "#b91c1c" }
                    }}
                  >
                    Hotel
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/about"
                    sx={{
                      color: location.pathname === "/about" ? "#b91c1c" : "inherit",
                      fontWeight: location.pathname === "/about" ? 600 : 400,
                      "&:hover": { color: "#b91c1c" }
                    }}
                  >
                    About Us
                  </MenuItem>
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#b91c1c",
                        "&:hover": {
                          backgroundColor: "#991b1b",
                        },
                      }}
                    >
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
