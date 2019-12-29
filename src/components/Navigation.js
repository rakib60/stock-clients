import React, {Component} from 'react'
 
import {NavLink} from 'react-router-dom'

import {Navbar, Nav} from 'react-bootstrap'

export class Navigation extends Component {
    render() {
        return (
            <Navbar bg="dark" expand="lg">
                <Navbar.Toggle area-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    {/* <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/">Home</NavLink> */}
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/category">Category</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/product">Product</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/voucher">Voucher</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/stockin">StockIn</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white" 
                    to="/requisition">Requisition</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/stockout">StockOut</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/stocks">Stocks</NavLink>
                    {localStorage.getItem('isAdmin')==="2" ? <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/user">Users</NavLink> : null}
                    <NavLink className="d-inline p-2 bg-dark text-white offset-4" style={{whiteSpace: 'nowrap'}}
                    to="/signout">Log Out</NavLink>
                </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}