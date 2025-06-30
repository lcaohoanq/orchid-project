import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import React from "react";

interface Props {
  error: string;
  fetchData: () => void;
}

const Error: React.FC<Props> = ({ error, fetchData }) => {
  return (
    <Container sx={{ mt: 3 }}>
      <Alert severity="error">
        <Typography variant="h6">Unable to Load Orchids</Typography>
        <Typography>{error}</Typography>
        <ul style={{ marginLeft: 20 }}>
          <li>
            Backend running at <code>http://localhost:8080</code>
          </li>
          <li>Your internet connection is working</li>
          <li>CORS is properly configured</li>
        </ul>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" color="error" onClick={fetchData}>
            Try Again
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Stack>
      </Alert>
    </Container>
  );
};

export default Error;
