import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom'
import './App.css';

import {Home} from './components/Home'
import { Category } from './components/categories/Category'
import { Product } from './components/products/Product'
import { Voucher} from './components/voucher/Voucher'
import {Navigation } from './components/Navigation'
function App() {
  return (
    <BrowserRouter>
        <div className="container">
          <h3 className="m-3 d-flex justify-content-center">
            React js with nest js 
          </h3>
          <h5 className="m-3 d-flex justify-content-center">
            Stock Management Portal
          </h5>
          <Navigation/>
            <Switch>
              <Route path="/" component={Home} exact/>
              <Route path="/category" component={Category}/>
              <Route path="/product" component={Product} />
              <Route path="/voucher" component={Voucher} />

            </Switch>
        </div>
    </BrowserRouter>
    
  );
}

export default App;
