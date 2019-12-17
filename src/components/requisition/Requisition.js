import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddRequisitionModal} from './AddRequisitionModal'
import {EditRequisitionModal} from './EditRequisitionModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class Requisition extends Component {

    constructor(props) {
        super(props);
        this.state = {requisition: [], addModalShow: false, editModalShow: false,  alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }

    componentDidMount() {
        this.refreshList()
    }

    onDetails = (id) => {
        this.props.history.push(`/requisition/details/${id}`)
    }

    async refreshList () {
        const response =  await stockApi.get('/requisition');
        this.setState({requisition: response.data})

    }
    
    getData(data) {
        this.setState({requisition: data})
    }

    async deleteFile(vid) {  
        try {
                await stockApi.delete(`/requisition/${vid}`) 
            } catch(error) {
                alert('This Requisition is assocciated with StockOut')
            }
        
        const getData = await stockApi.get('/requisition');

        this.setState({ alert: null, requisition: getData.data});
    }

    async delRequisition(vId) {

        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(vId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete Requisition
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

        const {requisition, rId, rNumber, rFile, rLoc} = this.state;

        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

        this.columns = [
            {
                name: "RequisitionID",
                options: {
                    filter: true
                }
            },
            {
                name: "RequisitionNumber",
                options: {
                    filter: true
                }
            },
            {
                name: "RequisitionFile",
                options: {
                    filter: true
                }
            },
            {
                name: "Location",
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
                    Add Requisition
                </Button>
                <AddRequisitionModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"Requisition List"}
                data={
                    requisition.map(requisition => {
                        return [
                            requisition.id,
                            requisition.number,
                            requisition.file,
                            requisition.location,
                          <ButtonToolbar>
                           <Button className="mr-2" variant="primary" onClick={()=>this.onDetails(requisition.id)}>
                            {/* // onClick={()=> this.setState({voucherDetailShow:true, vId:voucher.id,vNumber:voucher.number, vFile: voucher.file})} */}

                            Details
                            </Button>

                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, rId:requisition.id,rNumber:requisition.number, rFile: requisition.file, rLoc: requisition.location})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"
                            onClick={()=> this.delRequisition(requisition.id)}
                            >{this.state.alert}
                                Delete
                            </Button>
                            <EditRequisitionModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                rid={rId}
                                rnumber={rNumber}
                                rloc={rLoc}
                                rfile={rFile} 

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

