import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { orchidApi } from "../../../apis/api.config";
import type { Account } from "../../../types";

export default function ListOfEmployees() {
  const [data, setData] = useState<Account[]>([]);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Account>();

  const fetchData = async () => {
    try {
      const response = await orchidApi.get("/accounts");
      setData(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch employee data");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (formData: Account) => {
    try {
      await orchidApi.post("/accounts/create-new-employee", formData);
      toast.success("Employee added successfully!");
      setOpen(false);
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error?.response?.data?.reason || "Failed to add employee");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Toaster />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Employees List</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add New Employee
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>
                <Avatar
                  src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${emp.name}`}
                  alt={emp.name}
                />
              </TableCell>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.role_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Add Employee */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <Typography variant="body2" color="textSecondary">
              Password will be set to "1" by default.
            </Typography>

            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
