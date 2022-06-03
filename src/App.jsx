import './index.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';


class App extends React.Component {

  render() {
    return (
   
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path='/' element={<CategoryPage />} />
              <Route path='/product/:id' element={<ProductPage />} />
              <Route path='/cart' element={<CartPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
     

    );
  }
}


export default App;