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
import Authentifie from "./pages/Home/Authentifie/Authentifie";
import Scenarios from "./pages/scenarios/scenarios";
import DetailsScenario from "./pages/scenarios/DetailsScenario";
import Departements from "./pages/Departements/Departements";
import DetailsDepartement from "./pages/Departements/DetailsDepartement";
import ProfesseurModification from "./pages/Professeur/ProfesseurModification";
import Contraintes from "./pages/users/Contraintes";
import TestAPIs from "./pages/TestAPIs";
import NotFound from "./pages/NotFound";

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
            <Route exact path="/authentifie" element={<Authentifie />} />
            <Route exact path="/scenarios" element={<Scenarios />} />
            <Route exact path="/scenarios/:id" element={<DetailsScenario />} />
            <Route exact path="/departements" element={<Departements />} />
            <Route exact path="/departements/:id" element={<DetailsDepartement />} />
            <Route exact path='/contraintes' element={<Contraintes />} />
            <Route exact path="/professeurs/modifier/:id" element={<ProfesseurModification />} />
            <Route exact path="/api" element={<TestAPIs />} />

            <Route path="*" element={<NotFound />} />
          </Routes >
          <Footer />
        </AppProvider >
      </BrowserRouter >
    </div >
  );
}

export default App;
