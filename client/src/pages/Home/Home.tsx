import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { orchidApi } from "../../apis/api.config";
import Loading from "../../components/Loading";
import { useCart } from "../../contexts/cart.context";
import type { Orchid } from "../../types";
import { handleApiError } from "../../utils/errorHandler";
import Error from "../Error/Error";

export default function HomeScreen() {
  const [data, setData] = useState<Orchid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orchidApi.get("/public/orchids");
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err, "Failed to load orchids"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} fetchData={fetchData} />;
  }

  if (data.length === 0) {
    return (
      <Container sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h3">No Orchids Found</Typography>
        <Typography color="text.secondary">
          There are no orchids available at the moment.
        </Typography>
        <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>
          Refresh
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={4}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                image={item.url}
                alt={item.name}
                height="250"
              />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Chip
                  label={item.isNatural ? "Natural" : "Industry"}
                  color={item.isNatural ? "success" : "warning"}
                  size="small"
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" mt={2}>
                  {item.price ? `$${item.price.toFixed(2)}` : "N/A"}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: "flex", gap: 1, px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  component={RouterLink}
                  to={`/detail/${item.id}`}
                >
                  View Details
                </Button>
                <Button
                  variant={isInCart(item.id) ? "outlined" : "contained"}
                  color="success"
                  onClick={() => addToCart(item, 1, () => navigate("/login"))}
                  disabled={isInCart(item.id)}
                >
                  {isInCart(item.id) ? "Added" : "Add"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
