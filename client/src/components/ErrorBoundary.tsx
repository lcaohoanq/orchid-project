import React from "react";
import PropTypes from "prop-types";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeIcon from "@mui/icons-material/Home";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="lg">
          <Box py={5}>
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon fontSize="large" />}
            >
              <AlertTitle>
                <Typography variant="h6" fontWeight="bold">
                  Oops! Something went wrong
                </Typography>
              </AlertTitle>

              <Typography variant="body1" gutterBottom>
                We&apos;re sorry, but something unexpected happened. The
                application has encountered an error.
              </Typography>

              {import.meta.env.DEV && this.state.error && (
                <Box mt={2} component="details">
                  <summary>Error Details (Development Mode)</summary>
                  <Box
                    mt={1}
                    component="pre"
                    sx={{
                      fontSize: "0.85rem",
                      backgroundColor: "#f5f5f5",
                      p: 2,
                      borderRadius: 1,
                      overflowX: "auto",
                    }}
                  >
                    {this.state.error?.toString()}
                    <br />
                    {this.state.errorInfo?.componentStack}
                  </Box>
                </Box>
              )}

              <Stack direction="row" spacing={2} mt={4}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<ReplayIcon />}
                  onClick={this.handleReload}
                >
                  Reload Page
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </Button>
              </Stack>
            </Alert>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
