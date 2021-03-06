import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
// import {AddRequisitionModal} from './AddRequisitionModal'
// import {EditRequisitionModal} from './EditRequisitionModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import RequisitionListPendingPrint from './RequisitionPendingToPrint'
import RequisitionApprovedListPrint from './RequisitionToPrint'
import RequisitionDownloads from './RequisitionDownloads'
import MUIDataTable from "mui-datatables";

export class Requisition extends Component {

    constructor(props) {
        super(props);
        this.state = {requisition: [], addModalShow: false,  alert: null}
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

    onEdit = (id) => {
        this.props.history.push(`/requisition/edit/${id}`)
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
            const forImageDelete = await stockApi.get(`/requisition/${vid}`)
            const fileName = forImageDelete.data.file

            if(fileName) {
                await stockApi.delete(`/requisition/${vid}/${fileName}`)
            }
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

        const {requisition} = this.state;
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
                name: "Status",
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
            print: false,
            responsive: 'scrollMaxHeight'

        }

        return (
           <Row>
            <Col>
            <br/>           
             <ButtonToolbar>
                <div className="col-md-12" style={{display: 'flex'}}>
                <div className="col-md-10"></div>
                    <div className="col-md-2" style={{display: 'flex'}}>
                    <RequisitionListPendingPrint/>
                    <RequisitionApprovedListPrint/>
                    <RequisitionDownloads/>
                    </div>

                </div>
            </ButtonToolbar>
            <br/>
            <MUIDataTable 
                title={"Requisition List"}
                data={
                    requisition.map(requisition => {
                        return [
                            requisition.id,
                            requisition.number,
                            requisition.file ? requisition.file : '-',
                            requisition.location ? requisition.location : '-',
                            requisition.status === 0 ? "Pending" : "Approved",
                          <ButtonToolbar>
                           <Button className="mr-2" variant="primary" onClick={()=>this.onDetails(requisition.id)}>
                            Details
                            </Button>
                            {localStorage.getItem('isAdmin')==="1" && requisition.status === 1 ? 
                                <Button className="mr-2" variant="primary" disabled>
                                    Edit
                                </Button> : 
                                <Button className="mr-2" variant="primary" onClick={()=>this.onEdit(requisition.id)}>
                                     Edit
                                </Button>
                            }
                            {localStorage.getItem('isAdmin')==="1" && requisition.status === 1 ? 
                                <Button className="mr-2" variant="danger" disabled>
                                    Delete
                                </Button> : 
                            <Button className="mr-2" variant="danger"
                                    onClick={()=> this.delRequisition(requisition.id)}
                                    >{this.state.alert}
                                        Delete
                                    </Button>
                            }
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

