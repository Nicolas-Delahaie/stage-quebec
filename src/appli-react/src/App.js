/* Import pour les routes*/
import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";

/*Import pour gérer le context */
import { AppProvider } from "./utils/context/context";

/* Import des styles */
import './styles/index.scss';
import './styles/pages.scss';
import './styles/composants.scss';

/* Import des pages */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Scenarios from "./pages/scenarios";
import DetailsScenario from "./pages/scenario/DetailsScenario";
import Departements from "./pages/Departements";
import DetailsDepartement from "./pages/DetailsDepartement";
import Profil from "./pages/Profil";
import Liberations from "./pages/Liberations";
import NotFound from "./pages/NotFound";

/* Import des Layout */
import Header from "./components/Header";


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
            <Route exact path="/liberations" element={<Liberations />} />
            <Route path="*" element={<NotFound />} />
          </Routes >
        </AppProvider >
      </BrowserRouter >
    </div >
  );
}

export default App;
