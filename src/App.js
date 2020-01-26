import React from 'react';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import './App.css';
import './Footer.css'
import {Home} from './components/Home'
import { Category } from './components/categories/Category'
import { Product } from './components/products/Product'
import { Voucher} from './components/voucher/Voucher'
import { StockIn } from './components/stockIn/StockIn'
import { Requisition } from './components/requisition/Requisition'
import { StockOut } from './components/stockOut/StockOut'
import { DetailsVoucherModal } from './components/voucher/DetailVoucherModal' 
import { UpdateVoucher } from './components/voucher/UpdateVoucher'
import { UpdateRequisition } from './components/requisition/UpdateRequisition'
import {Navigation } from './components/Navigation'
import { DetailsRequisitionModal } from './components/requisition/DetailRequisitionModal';
import { User } from './components/users/User';
// import SignUpPage from './components/signup/signuppage';
import SignInPage from './components/signin/signInPage';

import AuthService from './api/auth.service'

function App(props) {
  const LoginContainer = () => (
    <div>
      <Route path="/" render={() => <Redirect to="/signin" />} />
    </div>
  )

  const Logout = (props) => {
      let authservice = new AuthService()
      authservice.signout();
      props.history.push('/signin');
  }
  const DefaultContainer = () => (
    <div>
        <h5 className="m-3 d-flex justify-content-center">
          Welcome to Stock Management.
        </h5>
       <Navigation/>
        <Route path="/stocks" component={Home} exact/>
        <Route path="/category" component={Category}/>
        <Route path="/product" component={Product} />
        <Route path="/voucher" exact component={Voucher} />
        <Route path="/voucher/details/:id" component={DetailsVoucherModal} />
        <Route path="/voucher/edit/:id" component={UpdateVoucher} />
        <Route path="/stockin" component={StockIn} />
        <Route path="/requisition" exact component={Requisition} />
        <Route path="/requisition/details/:id" component={DetailsRequisitionModal} />
        <Route path="/requisition/edit/:id" component={UpdateRequisition}/>
        <Route path="/stockout" component={StockOut} />
        <Route path="/signout" render={Logout}/>
        {localStorage.getItem('isAdmin')==="2" ? <Route path="/user" component={User}/> : null}
        <div className="footer">
          Copyright © 2020 All Rights Reserved by Ennvisio Digital Private Ltd.
        </div>
    </div>
 )

  return (

    <BrowserRouter>
      <div className="container">
      <Switch>
        <Route exact path="/" component={LoginContainer}/>
        <Route  path="/signin" component={SignInPage} />
        <Route  component={DefaultContainer}/>
        
      </Switch>
      </div>
    </BrowserRouter>

  );
}

export default App;
