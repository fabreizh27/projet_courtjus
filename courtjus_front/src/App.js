import {Route, Routes, BrowserRouter } from "react-router-dom";

import Header from './components/header';
import Travel from './components/travel';
import Producteurs from './components/producteurs';
import Footer from './components/footer';


function App() {
  return (
    <>

      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Travel />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel/:postId" element={<Travel />} />
          <Route path="/producteurs" element={<Producteurs />} />
          <Route
              path="*"
              element={
              <main style={{ padding: "1rem" }}>
                <p>un petit soucis ...</p>
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
