import {
  ArrowBack,
  Cancel,
  Download,
  History,
  Info,
  Receipt,
  Repeat,
  Replay,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orchidApi } from "../../../apis/api.config";

export default function OrderDetail() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const { orderId } = useParams();

  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orchidApi.get(`/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) fetchOrderDetail();
  }, [orderId, fetchOrderDetail]);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusChip = (status: string) => {
    const map = {
      PENDING: "warning",
      PROCESSING: "info",
      COMPLETED: "success",
      CANCELLED: "error",
    };
    return <Chip label={status} color={map[status] || "default"} />;
  };

  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 6 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchOrderDetail}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Receipt sx={{ fontSize: 50, color: "gray" }} />
        <Typography variant="h5" gutterBottom>
          Order not found
        </Typography>
        <Typography color="text.secondary">
          The order you're looking for doesn't exist.
        </Typography>
        <Button
          component={Link}
          to="/orders"
          variant="contained"
          sx={{ mt: 3 }}
        >
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Button
            component={Link}
            to="/orders"
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ mb: 1 }}
          >
            Back
          </Button>
          <Typography variant="h5">Order Details</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Replay />}
          onClick={fetchOrderDetail}
        >
          Refresh
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left: Order Info */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">Order ID</Typography>
                <Typography variant="subtitle1">#{order.id}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">Order Date</Typography>
                <Typography variant="subtitle1">
                  {formatDate(order.orderDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">Status</Typography>
                {getStatusChip(order.orderStatus)}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2">Account ID</Typography>
                <Typography variant="subtitle1">{order.accountId}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* Order Items */}
          <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Alert severity="info" icon={<Info />}>
              Order item details will appear here once the API is available.
            </Alert>
          </Card>
        </Grid>

        {/* Right: Summary + Timeline */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <span>Subtotal:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <span>Shipping:</span>
              <span>Free</span>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <span>Tax:</span>
              <span>$0.00</span>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              fontWeight="bold"
            >
              <strong>Total:</strong>
              <strong style={{ color: "#4caf50" }}>
                ${order.totalAmount.toFixed(2)}
              </strong>
            </Box>

            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              {order.orderStatus === "PENDING" && (
                <Button variant="outlined" color="error" startIcon={<Cancel />}>
                  Cancel Order
                </Button>
              )}
              {order.orderStatus === "COMPLETED" && (
                <Button variant="outlined" startIcon={<Repeat />}>
                  Reorder
                </Button>
              )}
              <Button variant="outlined" startIcon={<Download />}>
                Download Invoice
              </Button>
            </Box>
          </Card>

          <Card variant="outlined" sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              <History fontSize="small" sx={{ mr: 1 }} />
              Order Timeline
            </Typography>
            <Box mt={1}>
              <Typography variant="body2" gutterBottom>
                • Order Placed: {formatDate(order.orderDate)}
              </Typography>
              {order.orderStatus !== "PENDING" && (
                <Typography variant="body2" gutterBottom>
                  • Processing started - Status: {order.orderStatus}
                </Typography>
              )}
              {order.orderStatus === "COMPLETED" && (
                <Typography variant="body2" gutterBottom>
                  • Order Completed
                </Typography>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
