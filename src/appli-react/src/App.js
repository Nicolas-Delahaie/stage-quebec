import { BrowserRouter, Routes } from "react-router-dom";
import { Route } from "react-router";
import Home from "./pages/Home/Home";
import Header from "./components/layout/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
