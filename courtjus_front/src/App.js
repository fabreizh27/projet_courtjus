import {Route, Routes, BrowserRouter } from "react-router-dom";

import Header from './components/header';
import Travel from './components/travel';
import Producteurs from './components/producteurs';
import Adherents from './components/adherents';
import UserView from './components/userFiche';
import Footer from './components/footer';
import Biasses from './components/biasses';
import BiasseFiche from './components/biasseFiche';

function App() {
  return (
    <>

      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Travel />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel/:postId" element={<Travel />} />
          <Route path="/userfiche" element={<UserView />} />
          <Route path="/userfiche/:postId" element={<UserView />} />
          <Route path="/producteurs" element={<Producteurs />} />
          <Route path="/adherents" element={<Adherents />} />
          <Route path="/biasses" element={<Biasses />} />
          <Route path="/biasses/:postId" element={<BiasseFiche />} />
          <Route
              path="*"
              element={
              <main>
                <div className="main-down"></div>
                <section className="section-prods"><p className="p-impact">Demande rejetée - Vous n'etes pas autorisé à acceder à ces informations</p></section>
              </main>
            }
          />
        </Routes>
        <Footer/>
      </BrowserRouter>

    </>
  );
}

export default App;
