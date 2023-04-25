/* Import pour les routes*/
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";

/*Import pour gérer le context */
import { AppProvider } from "./utils/context/context";

/* Import des styles */
import GlobalStyles from "./utils/styles/global";

/* Import des pages */
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import Authentifie from "./pages/Home/Authentifie/Authentifie";
import Scenarios from "./pages/scenarios/scenarios";
import Departements from "./pages/Departements/Departements";
import TestAPIs from "./pages/TestAPIs";

/* Import des Layout */
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppProvider>
          <GlobalStyles />
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/authentifie" element={<Authentifie />} />
            <Route exact path="/scenarios" element={<Scenarios />} />
            <Route exact path="/departements" element={<Departements />} />

            <Route exact path="/api" element={<TestAPIs />} />
          </Routes>
          <Footer />
        </AppProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
