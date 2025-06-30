import { Add, Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { orchidApi } from "../../../apis/api.config";
import type { Category, Orchid } from "../../../types";

export default function ListOfOrchids() {
  const [data, setData] = useState<Orchid[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedOrchid, setSelectedOrchid] = useState<Orchid | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Orchid>({ defaultValues: { url: "" } });

  const fetchCategories = async () => {
    try {
      const res = await orchidApi.get("/public/categories");
      setCategoryList(res.data.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await orchidApi.get("/public/orchids");
      setData(res.data);
    } catch (error) {
      toast.error("Failed to load orchids");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (orchid: Orchid) => {
    toast.dismiss();
    try {
      await orchidApi.post("/orchids", orchid);
      toast.success("Orchid added!");
      setOpen(false);
      reset();
      fetchData();
    } catch (error: any) {
      const err =
        error?.response?.data?.message ||
        error?.response?.data?.reason ||
        error?.message ||
        "Failed to add orchid";
      toast.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrchid) return;
    setDeleting(true);
    toast.dismiss();
    try {
      await orchidApi.delete(`/orchids/${selectedOrchid.id}`);
      toast.success("Deleted successfully");
      await fetchData();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setSelectedOrchid(null);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Toaster />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Orchid Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add New Orchid
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((orchid) => (
              <TableRow key={orchid.id}>
                <TableCell>
                  <Avatar src={orchid.url} variant="rounded" />
                </TableCell>
                <TableCell>{orchid.name}</TableCell>
                <TableCell>
                  <Chip
                    label={orchid.isNatural ? "Natural" : "Industry"}
                    color={orchid.isNatural ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{orchid.description || "N/A"}</TableCell>
                <TableCell>
                  {orchid.price ? `$${orchid.price.toFixed(2)}` : "N/A"}
                </TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/manage/orchids/edit/${orchid.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setSelectedOrchid(orchid)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add Orchid Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Orchid</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
            <TextField
              label="Image URL"
              {...register("url", {
                required: "Image URL is required",
                pattern: {
                  value: /^https?:\/\/.+$/,
                  message: "Must be a valid URL",
                },
              })}
              error={!!errors.url}
              helperText={errors.url?.message}
              fullWidth
            />
            <TextField
              label="Description"
              {...register("description")}
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" },
                max: { value: 1000000000, message: "Too large" },
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
            />
            <TextField
              select
              label="Category"
              {...register("categoryId", { required: "Category is required" })}
              error={!!errors.categoryId}
              helperText={errors.categoryId?.message}
              fullWidth
              defaultValue=""
            >
              <MenuItem value="" disabled>
                <em>Select a category</em>
              </MenuItem>
              {categoryList.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Switch {...register("isNatural")} />}
              label="Natural"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!selectedOrchid} onClose={() => setSelectedOrchid(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{selectedOrchid?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrchid(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
