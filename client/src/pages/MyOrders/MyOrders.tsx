// ✅ Converted version using MUI v5
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import { orchidApi } from "../../apis/api.config";
import RefreshIcon from "@mui/icons-material/Refresh";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function MyOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orchidApi.get("/orders/me/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching my orders:", error);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusChip = (status) => {
    const statusMap = {
      PENDING: { color: "warning", icon: <AccessTimeIcon fontSize="small" /> },
      PROCESSING: { color: "info", icon: <RefreshIcon fontSize="small" /> },
      COMPLETED: {
        color: "success",
        icon: <CheckCircleIcon fontSize="small" />,
      },
      CANCELLED: { color: "error", icon: <CancelIcon fontSize="small" /> },
    };
    const config = statusMap[status] || { color: "default", icon: null };
    return (
      <Chip
        icon={config.icon}
        label={status}
        color={config.color}
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Container sx={{ py: 5 }}>
        <Box display="flex" justifyContent="center" alignItems="center" my={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 5 }}>
        <Alert
          severity="error"
          action={
            <Button
              onClick={fetchMyOrders}
              color="inherit"
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {orders.length === 0 ? (
        <Box textAlign="center" py={5}>
          <ReceiptLongIcon sx={{ fontSize: 48, color: "text.secondary" }} />
          <Typography variant="h6" mt={2}>
            No orders yet
          </Typography>
          <Typography color="text.secondary" mb={3}>
            You haven’t placed any orders yet. Start shopping to see your orders
            here!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<ShoppingBagIcon />}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Total Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>#{order.id.slice(-8)}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          component={Link}
                          to={`/orders/${order.id}`}
                        >
                          View
                        </Button>
                        {order.orderStatus === "PENDING" && (
                          <IconButton
                            color="error"
                            onClick={() =>
                              console.log("Cancel order", order.id)
                            }
                          >
                            <CancelIcon />
                          </IconButton>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Card sx={{ mt: 4, backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Grid container spacing={2} textAlign="center">
                <Grid item xs={6} md={3}>
                  <Typography variant="h6">{orders.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6">
                    {orders.filter((o) => o.orderStatus === "PENDING").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6">
                    {orders.filter((o) => o.orderStatus === "COMPLETED").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="h6">
                    $
                    {orders
                      .reduce((sum, o) => sum + o.totalAmount, 0)
                      .toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
