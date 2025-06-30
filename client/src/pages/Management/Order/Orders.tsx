import { Receipt, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  type ChipProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orchidApi } from "../../../apis/api.config";
import type { Order } from "../../../types";

export default function Orders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orchidApi.get("/orders");
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const colorMap: Record<string, ChipProps["color"]> = {
    PENDING: "warning",
    PROCESSING: "info",
    COMPLETED: "success",
    CANCELLED: "error",
  };

  const getStatusChip = (status: keyof typeof colorMap | string) => {
    const chipColor: ChipProps["color"] =
      colorMap[status as keyof typeof colorMap] || "default";
    return <Chip label={status} color={chipColor} size="small" />;
  };

  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Receipt fontSize="large" sx={{ color: "gray", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No orders found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You haven't placed any orders yet.
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 3 }}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">My Orders</Typography>
      </Box>

      {/* Desktop Table */}
      <Box display={{ xs: "none", md: "block" }}>
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      to={`/manage/orders/${order.id}`}
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Box>

      {/* Mobile Card View */}
      <Box display={{ xs: "block", md: "none" }}>
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography variant="subtitle1">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(order.orderDate)}
                    </Typography>
                  </Box>
                  {getStatusChip(order.orderStatus)}
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" color="success.main">
                    ${order.totalAmount.toFixed(2)}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/orders/${order.id}`}
                    size="small"
                    variant="outlined"
                    startIcon={<Visibility />}
                  >
                    Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
