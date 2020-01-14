import React, {Component} from 'react'

import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
// import {AddVoucherModal} from './AddVoucherModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'
import VoucherListPendingPrint from './VoucherPendingToPrint'
import VoucherApprovedListPrint from './VoucherToPrint'
import VoucherDownloads from './VoucherDownloads'
import MUIDataTable from "mui-datatables";

export class Voucher extends Component {


    constructor(props) {
        super(props);
        this.state = {voucher: [], addModalShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }

    onDetails = (id) => {
        this.props.history.push(`/voucher/details/${id}`)
    }

    onEdit = (id) => {
        this.props.history.push(`/voucher/edit/${id}`)
    }
    async refreshList () {
        const response =  await stockApi.get('/voucher');
        this.setState({voucher: response.data})

    }
    

    getData(data) {
        this.setState({voucher: data})
    }

    async deleteFile(vid) {
        try {
            const forImageDelete = await stockApi.get(`/voucher/${vid}`)
            const fileName = forImageDelete.data.file
            console.log(fileName,'bref')

            if(fileName) {
                await stockApi.delete(`/voucher/${vid}/${fileName}`)
            }
            await stockApi.delete(`/voucher/${vid}`) 
            } catch(error) {
                alert('This Voucher is assocciated with StockIn')
            }
        
        const getData = await stockApi.get('/voucher');

        this.setState({ alert: null, voucher: getData.data});
    }

    async delVoucher(vId) {

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
            Are you want to delete Voucher
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

        const {voucher} = this.state;

        // let addModalClose =() => this.setState({addModalShow: false})

        this.columns = [
            {
                name: "VoucherID",
                options: {
                    filter: true
                }
            },
            {
                name: "VoucherNumber",
                options: {
                    filter: true
                }
            },
            {
                name: "VoucherFile",
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
            // responsive: 'scrollMaxHeight',
            responsive: 'scrollFullHeight'

        }
        return (
           <Row>
            <Col>
            <br/>
            <ButtonToolbar>
                {/* <Button 
                variant="primary" 
                onClick={()=> this.setState({addModalShow: true})}>
                    Add Voucher
                </Button>
                <AddVoucherModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                /> */}
                <div className="col-md-12" style={{display: 'flex'}}>
                <div className="col-md-10">
                </div>
                    <div className="col-md-2" style={{display: 'flex'}}>
                    <VoucherListPendingPrint/>
                    <VoucherApprovedListPrint/>
                    <VoucherDownloads/>
                    </div>

                </div>
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"Voucher List"}
                data={
                    voucher.map(voucher => {
                        return [
                            voucher.id,
                            voucher.number,
                            voucher.file ? voucher.file : '-',
                            voucher.status === 0 ? "Pending" : "Approved",
                          <ButtonToolbar>
                           <Button className="mr-2" variant="primary" onClick={()=>this.onDetails(voucher.id)}>
                            Details
                            </Button>
                            {localStorage.getItem('isAdmin')==="1" && voucher.status === 1 ? 
                                <Button className="mr-2" variant="primary" disabled>
                                    Edit
                                </Button> : 
                                <Button className="mr-2" variant="primary" onClick={()=>this.onEdit(voucher.id)}>
                                     Edit
                                </Button>
                            }
                            {localStorage.getItem('isAdmin')==="1" && voucher.status === 1 ? 
                                <Button className="mr-2" variant="danger" disabled>
                                    Delete
                                </Button> : 
                            <Button className="mr-2" variant="danger"
                                    onClick={()=> this.delVoucher(voucher.id)}
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

