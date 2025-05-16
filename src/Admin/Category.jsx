import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { api } from "../api";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Category = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddCategory = async () => {
    const res = await axios.post(`${api}/PropertyCategoryTbls`, {
      categoryName: category,
    });
    if (res) {
      getAllCategories();
    }
  };

  const getAllCategories = async () => {
    const res = await axios.get(`${api}/PropertyCategoryTbls`);
    if (res) {
      setCategories(res.data);
    }
  };

  const handleDeleteCategory = async (id) => {
    const res = await axios.delete(`${api}/PropertyCategoryTbls/${id}`);
    if (res) {
      getAllCategories();
    }
  };

  const handleOpenEditDialog = async (id) => {
    const res = await axios.get(`${api}/PropertyCategoryTbls/${id}`);
    if (res.data) {
      setEditIndex(res.data.categoryId);
      setEditValue(res.data.categoryName);
      setIsDialogOpen(true);
    }
  };

  const handleEditCategory = async () => {
    const res = await axios.put(`${api}/PropertyCategoryTbls/${editIndex}`, {
      categoryName: editValue,
    });
    if (res) {
      getAllCategories();
    }
    setIsDialogOpen(false);
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <div>
      <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
        {/* Input and Button */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            padding: 2,
            borderRadius: 2,
            mb: 4,
          }}
        >
          <TextField
            label="Category Name"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ flexGrow: 1, height: 56 }}
            InputProps={{ sx: { height: 56 } }}
          />
          <Button
            variant="outlined"
            onClick={handleAddCategory}
            sx={{ height: 56, whiteSpace: "nowrap" }}
          >
            Add Category
          </Button>
        </Box>

        {/* Category Table */}
        {/* {categories.length > 0 ? ( */}
        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>#</strong>
                </TableCell>
                <TableCell>
                  <strong>Category Name</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cat?.categoryName}</TableCell>

                  <TableCell align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Tooltip title="Edit Category" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(cat?.categoryId)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category" arrow>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCategory(cat?.categoryId)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* ) : (
                    <Typography variant="body1" align="center" color="text.secondary">
                        No categories added yet.
                    </Typography>
                )} */}

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Category Name"
              variant="outlined"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCategory} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default Category;
