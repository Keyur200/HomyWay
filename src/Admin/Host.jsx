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
import { Box, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

function Host() {
  //const { user, checkAdmin } = React.useContext(AuthContext);
  const [users, setUsers] = React.useState([]);

  // get all user
  const getAllUsers = async () => {
    const res = await axios.get(`${api}/Auth`);
    if (res) {
      setUsers(res.data);
    }
  };

  React.useEffect(() => {
    getAllUsers();
  }, []);

  // get host details
  const [host, setHost] = React.useState([]);

  React.useEffect(() => {
    setHost(users?.filter((u) => u.gid === 2));
  }, [users]);

  // update user status

  const handleUpdateUserStatus = async (id, status) => {
    const res = await axios.patch(`${api}/Auth/${id}?status=${status}`);
    console.log(res);
    if (res) {
      getAllUsers();
    }
  };

  return (
    <div>
      <Box sx={{ width: 900, margin: "auto", mt: 4 }}>
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
                        backgroundColor:
                          row.status === "active"
                            ? "green"
                            : row.status === "pending"
                              ? "goldenrod"
                              : "red",
                        textAlign: "center",
                        minWidth: 80,
                      }}
                    >
                      {row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1)}
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
                      {(row.status === "pending" ||
                        row.status === "active" ||
                        row.status === "block") && (
                        <>
                          {(row.status === "pending" ||
                            row.status === "block") && (
                            <Tooltip
                              title={
                                row.status === "pending" 
                                  ? "Approve Host"
                                  : "Activate Host"
                              }
                              arrow
                            >
                              <Button
                                variant="outlined"
                                color="success"
                                sx={{
                                  borderRadius: 2,
                                  minWidth: 40,
                                  padding: 1,
                                }}
                                onClick={() =>
                                  handleUpdateUserStatus(row.id, "active")
                                }
                              >
                                <CheckCircleIcon />
                              </Button>
                            </Tooltip>
                          )}

                          {(row.status === "pending" ||
                            row.status === "active") && (
                            <Tooltip title="Block Host" arrow>
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                  borderRadius: 2,
                                  minWidth: 40,
                                  padding: 1,
                                }}
                                onClick={() =>
                                  handleUpdateUserStatus(row.id, "block")
                                }
                              >
                                <BlockIcon />
                              </Button>
                            </Tooltip>
                          )}
                        </>
                      )}
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
