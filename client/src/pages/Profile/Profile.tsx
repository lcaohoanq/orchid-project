import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { orchidApi } from "../../apis/api.config";
import { useAuth } from "../../contexts/auth.context";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await orchidApi.get(`/accounts/me`);
      setProfile(res.data.data);
      setForm({
        name: res.data.data.name,
        email: res.data.data.email,
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // 👈 chỉ gọi 1 lần khi component mount

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await orchidApi.put(`/accounts/${user?.id}`, form);
      setUser(res.data.data); // Update user context
      await fetchProfile(); // Refresh profile data
      setOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6" align="center">
          Profile not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">My Profile</Typography>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} textAlign="center">
              <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}>
                {profile.name?.charAt(0) || "U"}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2">Full Name</Typography>
              <Typography variant="body1" mb={2}>
                {profile.name}
              </Typography>

              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1">{profile.email}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
