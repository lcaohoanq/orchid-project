import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { orchidApi } from "../../../apis/api.config";
import type { Category, Orchid } from "../../../types";

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Orchid>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, orchidRes] = await Promise.all([
          orchidApi.get("/public/categories"),
          orchidApi.get(`/public/orchids/${id}`),
        ]);
        setCategoryList(categoryRes.data.data);
        reset(orchidRes.data);
        setImagePreview(orchidRes.data.url);
      } catch (error) {
        toast.error("Failed to load orchid data");
        navigate("/manage/orchids");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset, navigate]);

  const onSubmit = async (formData: Orchid) => {
    try {
      await orchidApi.put(`/orchids/${id}`, formData);
      toast.success("Orchid updated successfully!");
      setTimeout(() => navigate("/manage/orchids"), 1500);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.reason ||
        "Failed to update orchid.";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box py={5} textAlign="center">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={5}>
        <Typography variant="h5" color="primary" gutterBottom>
          Edit Orchid
        </Typography>
        <hr />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {[
                { name: "name", label: "Name", required: true },
                {
                  name: "url",
                  label: "Image URL",
                  required: true,
                  validate: (value: string) =>
                    !value || value.startsWith("http")
                      ? true
                      : "Must be a valid URL",
                },
                { name: "description", label: "Description", multiline: true },
                {
                  name: "price",
                  label: "Price",
                  type: "number",
                  required: true,
                  min: { value: 0, message: "Price must be positive" },
                  max: {
                    value: 1000000000,
                    message: "Price must be up to 1 billion",
                  },
                },
              ].map(({ name, label, ...rules }) => (
                <Box mt={3} key={name}>
                  <Controller
                    name={name as keyof Orchid}
                    control={control}
                    rules={
                      rules.required && {
                        required: `${label} is required`,
                        ...(rules.pattern && { pattern: rules.pattern }),
                        ...(rules.min && { min: rules.min }),
                      }
                    }
                    render={({ field }) => (
                      <TextField
                        label={label}
                        fullWidth
                        multiline={!!rules.multiline}
                        rows={rules.multiline ? 4 : undefined}
                        type={rules.type || "text"}
                        {...field}
                        error={!!errors[name as keyof Orchid]}
                        helperText={
                          errors[name as keyof Orchid]?.message as string
                        }
                      />
                    )}
                  />
                </Box>
              ))}

              <Box mt={3}>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Category"
                      fullWidth
                      {...field}
                      error={!!errors.categoryId}
                      helperText={errors.categoryId?.message as string}
                    >
                      <MenuItem value="">
                        <em>Select a category</em>
                      </MenuItem>
                      {categoryList.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>

              <Box mt={3}>
                <Controller
                  name="isNatural"
                  control={control}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography>Is Natural</Typography>
                      <Switch
                        {...field}
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    </Box>
                  )}
                />
              </Box>

              <Box mt={4} display="flex" gap={2}>
                <Button variant="contained" color="primary" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/manage/orchids")}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
