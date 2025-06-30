import { CircularProgress, Typography } from "@mui/material";
import Container from "@mui/material/Container";

const Loading = () => {
  return (
    <Container sx={{ textAlign: "center", py: 5 }}>
      <CircularProgress />
      <Typography mt={2}>Loading orchids...</Typography>
    </Container>
  );
};

export default Loading;
