import { Add, Home, Refresh, Remove, ShoppingCart } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { orchidApi } from "../../apis/api.config";
import Loading from "../../components/Loading";
import { useCart } from "../../contexts/cart.context";
import type { Orchid } from "../../types";
import { handleApiError } from "../../utils/errorHandler";

export default function DetailOrchid() {
  const [orchid, setOrchid] = useState<Partial<Orchid>>({});
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await orchidApi.get(`/public/orchids/${id}`);
      setOrchid(response.data);
    } catch (err) {
      setError(handleApiError(err, "Failed to load orchid details"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToCart = () => {
    addToCart(orchid as Orchid, quantity, () => navigate("/login"));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            Unable to Load Orchid
          </Typography>
          <Typography>{error}</Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchData}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/"
              startIcon={<Home />}
            >
              Go Home
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  if (!orchid.id) return null;

  return (
    <Container sx={{ py: 5 }}>
      <Breadcrumbs separator="›">
        <Button
          component={RouterLink}
          to="/"
          size="small"
          startIcon={<Home />}
          sx={{ textTransform: "none" }}
        >
          Home
        </Button>
        <Typography color="text.primary">{orchid.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {orchid.name}
          </Typography>

          <Chip
            label={orchid.isNatural ? "Natural Orchid" : "Industry Orchid"}
            color={orchid.isNatural ? "success" : "warning"}
            sx={{ mb: 2 }}
          />

          <Card>
            <CardHeader title="Description" />
            <CardContent>
              <Typography color="text.secondary">
                {orchid.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <ImageListItem>
            <img
              src={orchid.url}
              alt={orchid.name}
              style={{ height: 250, borderRadius: 8 }}
            />
          </ImageListItem>

          <Card sx={{ mt: 3 }}>
            <CardHeader title="Add to Cart" />
            <CardContent>
              <Typography variant="h6" color="success.main">
                Price: ${orchid.price?.toFixed(2)}
              </Typography>

              <Box mt={2}>
                <Typography variant="body1" gutterBottom>
                  Quantity:
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography>{quantity}</Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                </Stack>
              </Box>

              <Stack spacing={2} mt={3}>
                <Button
                  variant={
                    isInCart(String(orchid.id)) ? "outlined" : "contained"
                  }
                  color="success"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={isInCart(String(orchid.id))}
                  startIcon={<ShoppingCart />}
                >
                  {isInCart(String(orchid.id))
                    ? "Already in Cart"
                    : `Add ${quantity} item${quantity > 1 ? "s" : ""} to Cart`}
                </Button>

                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/cart"
                  startIcon={<ShoppingCart />}
                >
                  View Cart
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
