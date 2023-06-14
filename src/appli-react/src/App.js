/* Import pour les routes*/
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";

/*Import pour gérer le context */
import { AppProvider } from "./utils/context/context";

/* Import des styles */
import './styles/index.scss';
import './styles/pages.scss';
import './styles/composants.scss';

/* Import des composants */
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Scenarios from "./pages/scenario/Scenarios";
import DetailsScenario from "./pages/scenario/DetailsScenario";
import Departements from "./pages/departement/Departements";
import DetailsDepartement from "./pages/departement/DetailsDepartement";
import Profil from "./pages/Profil";
import Profils from "./pages/Profils";
import Liberations from "./pages/Liberations";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppProvider>
          <Header />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/scenarios" element={<Scenarios />} />
            <Route exact path="/scenarios/:id" element={<DetailsScenario />} />
            <Route exact path="/departements" element={<Departements />} />
            <Route exact path="/departements/:id" element={<DetailsDepartement />} />
            <Route exact path="/profil" element={<Profil />} />
            <Route exact path="/profils/:id" element={<Profils />} />
            <Route exact path="/liberations" element={<Liberations />} />
            <Route path="*" element={<NotFound />} />
          </Routes >
          <Footer />
        </AppProvider >
      </BrowserRouter >
    </div >
  );
}

export default App;
