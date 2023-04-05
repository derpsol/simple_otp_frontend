import "./App.css";
import Home from "./view";
import { Container } from "@mui/material";
import { AuthProvider } from "./auth/JwtContext";

function App() {
  return (
    <AuthProvider>
      <Container maxWidth="xl">
        <Home />
      </Container>
    </AuthProvider>
  );
}

export default App;
