import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Delete,
  Remove,
  Add,
  ArrowBack,
  CreditCard,
  ShoppingCart as CartIcon,
  Shield,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/cart.context";

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const [loading] = useState(false);

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(String(id), newQuantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(String(id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={5}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <CartIcon sx={{ fontSize: 60, color: "gray", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Add some beautiful orchids to your cart
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <img
                              src={item.url}
                              alt={item.name}
                              width={70}
                              height={70}
                              style={{
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                            <Box>
                              <Typography fontWeight={600}>
                                {item.name}
                              </Typography>
                              <Chip
                                label={item.isNatural ? "Natural" : "Industry"}
                                color={item.isNatural ? "success" : "warning"}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <IconButton
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              size="small"
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <TextField
                              type="number"
                              size="small"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                              }}
                              sx={{ width: 60 }}
                            />
                            <IconButton
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              size="small"
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/"
                  startIcon={<ArrowBack />}
                >
                  Continue Shopping
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <span>Subtotal:</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <span>Shipping:</span>
                <span>Free</span>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" mb={2}>
                <strong>Total:</strong>
                <strong>${cartTotal.toFixed(2)}</strong>
              </Box>
              <Button
                variant="contained"
                color="success"
                fullWidth
                size="large"
                startIcon={<CreditCard />}
              >
                Proceed to Checkout
              </Button>
              <Box mt={2} textAlign="center">
                <Typography variant="caption" color="text.secondary">
                  <Shield fontSize="inherit" sx={{ mr: 0.5 }} />
                  Secure Checkout
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Have a coupon?
              </Typography>
              <TextField
                placeholder="Coupon code"
                fullWidth
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="outlined" size="small">
                        Apply
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
