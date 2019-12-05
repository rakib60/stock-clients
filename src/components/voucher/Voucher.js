import React, {Component} from 'react'
import { Link ,NavLink } from 'react-router-dom'

import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddVoucherModal} from './AddVoucherModal'
import {EditVoucherModal} from './EditVoucherModal'
import {DetailsVoucherModal } from './DetailVoucherModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class Voucher extends Component {


    constructor(props) {
        super(props);
        this.state = {voucher: [], addModalShow: false, editModalShow: false, voucherDetailShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }

    onDetails = (id) => {
        this.props.history.push(`/voucher/details/${id}`)
        // return(<DetailsVoucherModal/>)
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

        const {voucher, vId, vNumber, vFile} = this.state;

        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})
        let detailModalClose =() => this.setState({voucherDetailShow: false})

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
                    Add Voucher
                </Button>
                <AddVoucherModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"Voucher List"}
                data={
                    voucher.map(voucher => {
                        return [
                            voucher.id,
                            voucher.number,
                            voucher.file,
                          <ButtonToolbar>
                           <Button className="mr-2" variant="primary" onClick={()=>this.onDetails(voucher.id)}>
                            {/* // onClick={()=> this.setState({voucherDetailShow:true, vId:voucher.id,vNumber:voucher.number, vFile: voucher.file})} */}

                            Details
                            </Button>
                            {/* <DetailsVoucherModal
                                show = { this.state.voucherDetailShow }
                                onHide={ detailModalClose }
                                getdata={this.getData}
                                vid={vId}
                                vnumber={vNumber}
                                vfile={vFile}
                            /> */}
                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, vId:voucher.id, vNumber:voucher.number, vFile: voucher.file})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"
                            onClick={()=> this.delVoucher(voucher.id)}
                            >{this.state.alert}
                                Delete
                            </Button>
                            <EditVoucherModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                vid={vId}
                                vnumber={vNumber}
                                vfile={vFile}
                                

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

