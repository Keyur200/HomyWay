import React from "react";
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
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

function Host() {
  //const { user, checkAdmin } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState([]);

  const getAllUsers = async () => {
    const res = await axios.get(`${api}/Auth`);
    if (res) {
      setUsers(res.data);
    }
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);

  const [host, setHost] = React.useState([]);

  React.useEffect(() => {
    setHost(users?.filter((u) => u.gid === 2));
  }, [users]);

  return (
    <div>
      <Box sx={{ width: 900, margin: "auto", mt: 4 }}>
        {/* <Grid container spacing={3}>
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
        </Grid> */}
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
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {host.map((row) => (
                <TableRow key={row?.name}>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell>{row?.email}</TableCell>
                  <TableCell>{row?.phone}</TableCell>
                  {/* <TableCell align="right">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "white",
                        backgroundColor:
                          row.status === "Active" ? "green" : "red",
                        textAlign: "center",
                        minWidth: 80,
                      }}
                    >
                      {row.status === "Active" ? "Active" : "Blocked"}
                    </Box>
                  </TableCell> */}

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "white",
                        backgroundColor: "green",
                        textAlign: "center",
                        minWidth: 80,
                      }}
                    >
                      Active
                    </Box>
                  </TableCell>

                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ borderRadius: 2, minWidth: 40, padding: 1 }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ borderRadius: 2, minWidth: 40, padding: 1 }}
                      >
                        <BlockIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Host;
