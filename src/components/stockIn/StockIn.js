import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddStockInModal} from './AddStockInModal'
import {EditStockInModal} from './EditStockInModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

import SignOutIcon from '@material-ui/icons/ExitToApp'
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import AuthService from '../../api/auth.service'
// import { ProductQuantity } from './ProductQuantityComponent'



// const SignOutIconContainer = styled.div`
//   margin-left: 10px;
  
//   .signOutIcon {
//     fill: #edf4ff;
//   }
// `;

export class StockIn extends Component {


    constructor(props) {
        super(props);
        this.state = {stockIns: [], addModalShow: false, editModalShow: false, alert: null, showNavigation: true}
        this.getData = this.getData.bind(this)
        this.data = []
        this.authservice = new AuthService()
    }
    componentDidMount() {
        this.refreshList()
    }


    handleSignOut = () => {
        this.authservice.signout();
        this.props.history.push('/signin');
    };




    async refreshList () {
        const response =  await stockApi.get('/stock-in');
        this.setState({stockIns: response.data})

    }
    

    goVoucher = () => {
        this.props.history.push("/voucher/")
    }

    getData(data) {
        this.setState({stockIns: data})
    }

    async deleteFile(pId) {  
        try {
                await stockApi.delete(`/stock-in/${pId}`) 
            } catch(error) {
                alert('TO Do Test')
            }
        
        const getData = await stockApi.get('/stock-in');

        this.setState({ alert: null, stockIns: getData.data});
    }

    async delStockIn(pId) {
        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(pId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete StockIn
            </SweetAlert>
          );
      
        this.setState({
        alert: getAlert()
        });

    }

    hideAlert() {
        this.setState({
          alert: null
        });
      }


    render() {

        return (
           <Row>
            <Col>
            <AddStockInModal/>
                <br/>
                <button  className="offset-10 btn btn-dark"  onClick={() => this.goVoucher()}>Back To Voucher</button>
            </Col>
            {/* <SignOutIconContainer>
              <IconButton onClick={this.handleSignOut}>
                <SignOutIcon className="signOutIcon" />
              </IconButton>
            </SignOutIconContainer> */}
            </Row>

        )
    }
}

