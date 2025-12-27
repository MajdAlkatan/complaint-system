import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      {/* <AdminHeader /> */}
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
