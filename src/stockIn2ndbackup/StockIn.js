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
import { ProductQuantity } from './ProductQuantityComponent'



const SignOutIconContainer = styled.div`
  margin-left: 10px;
  
  .signOutIcon {
    fill: #edf4ff;
  }
`;

export class StockIn extends Component {


    constructor(props) {
        super(props);
        this.state = {stockIns: [], addModalShow: false, editModalShow: false, alert: null, showNavigation: true}
        this.getData = this.getData.bind(this)
        this.columns = []
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
        // console.log(this.state,'sdffffffff')
        const {stockIns, sInId, pId, vId, inQ} = this.state;

        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

        this.columns = [
            {
                name: "StockInID",
                options: {
                    filter: true
                }
            },
            {
                name: "Product Name",
                options: {
                    filter: true
                }
            },
            {
                name: "Voucher no.",
                options: {
                    filter: true
                }
            },
            {
                name: "inQuantity",
                options: {
                    filter: true
                }
            },
            {
                name: "Actions",
                options: {
                    filter: false
                }
            }
        ]
        const options ={
            selectableRows: 'none',
            download: false,
            responsive: 'scrollMaxHeight'

        }
        return (
           <Row>
            <Col>
            <br/>
            <ProductQuantity/>
            
            <br/>
            <MUIDataTable
                title={"StockIn List"}
                data={
                    stockIns.map(StockIn => {
                        return [
                            StockIn.id,
                            StockIn.product.name,
                            StockIn.voucher.number,
                            StockIn.inQuantity,
                            <ButtonToolbar>
                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, sInId:StockIn.id, pId: StockIn.product.id, vId:StockIn.voucher.id,  inQ:StockIn.inQuantity})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"
                            onClick={()=> this.delStockIn(StockIn.id)}
                            >
                                {this.state.alert}
                                Delete
                            </Button>
                            <EditStockInModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                sid={sInId}
                                pid={pId}
                                vid={vId}
                                inq={inQ}
                                

                            />
                            </ButtonToolbar>
                        ]
                    }
                )
                }
                columns={this.columns}
                options={options}
                
                />
            </Col>
            <SignOutIconContainer>
              <IconButton onClick={this.handleSignOut}>
                <SignOutIcon className="signOutIcon" />
              </IconButton>
            </SignOutIconContainer>
            </Row>
        )
    }
}

