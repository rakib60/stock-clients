import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddStockOutModal} from './AddStockOutModal'
import {EditStockOutModal} from './EditStockOutModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class StockOut extends Component {


    constructor(props) {
        super(props);
        this.state = {stockOuts: [], addModalShow: false, editModalShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/stock-out');
        this.setState({stockOuts: response.data})

    }
    

    getData(data) {
        this.setState({stockOuts: data})
    }

    async deleteFile(pId) {  
        try {
                await stockApi.delete(`/stock-out/${pId}`) 
            } catch(error) {
                alert('TO Do Test')
            }
        
        const getData = await stockApi.get('/stock-out');

        this.setState({ alert: null, stockOuts: getData.data});
    }

    async delStockOut(pId) {
        console.log('sdflslfjskflsj')
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
            Are you want to delete StockOut
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
        const {stockOuts, sOutId, pId, rId, outQ} = this.state;

        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

        this.columns = [
            {
                name: "StockOutID",
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
                name: "Requistion no.",
                options: {
                    filter: true
                }
            },
            {
                name: "OutQuantity",
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
            <ButtonToolbar>
                <Button 
                variant="primary" 
                onClick={()=> this.setState({addModalShow: true})}>
                    Add StockOut
                </Button>
                <AddStockOutModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"StockOut List"}
                data={
                    stockOuts.map(StockOut => {
                        return [
                            StockOut.id,
                            StockOut.product.name,
                            StockOut.requisition.number,
                            StockOut.outQuantity,
                            <ButtonToolbar>
                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, sOutId:StockOut.id, pId: StockOut.product.id, rId:StockOut.requisition.id,  outQ:StockOut.outQuantity})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"
                            onClick={()=> this.delStockOut(StockOut.id)}
                            >
                                {this.state.alert}
                                Delete
                            </Button>
                            <EditStockOutModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                sid={sOutId}
                                pid={pId}
                                rid={rId}
                                outq={outQ}
                                

                            />
                            </ButtonToolbar>
                        ]
                    }
                )
                }
                columns={this.columns}
                options={options}
                
                />
                <br/>
            </Col>
            </Row>
        )
    }
}

