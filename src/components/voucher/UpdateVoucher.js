import React, {Component} from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Row, Button, Col } from  'react-bootstrap'
import * as _ from "lodash";
import stockApi from '../../api/StockApi'


import SweetAlert from 'react-bootstrap-sweetalert';
import Snackbar from '@material-ui/core/Snackbar'



import ModalImage, { Lightbox } from "react-modal-image";
import IconButton from '@material-ui/core/IconButton'

import {Form } from  'react-bootstrap'

import {AddStockInVoucher} from './AddStockInVoucher'

const Status = {
    pending: 0,
    approved:1
}

export class UpdateVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {voucher: [], productQuantity: [], newAddedProductQuantity: [], selectedFile: null, vNumber: '', updatedFileName: '', alert: null, snackBarOpen: false, snackBarMsg: '', forImageShow: '', imageShow: '', selectedStatus: null}
        this.refreshList = this.refreshList.bind(this)
        this.handleProductQuantityRemove =  this.handleProductQuantityRemove.bind(this)
        this.handleInputValueChanged = this.handleInputValueChanged.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.forImageShow = this.forImageShow.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.addStockInVoucher = React.createRef();

    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.voucher_subtitle = "Voucher ID: " + params.id;
        this.refreshList(params.id)     
        this.forImageShow()
   
    }
    
    getDataFromAddStockIn = (dataFromChild) => {
        this.setState({newAddedProductQuantity : dataFromChild})
        
    }
    async refreshList (id) {
        const response =  await stockApi.get(`/voucher/${id}`);
        this.setState({voucher: response.data})

    }


    goVoucher = () => {
        this.props.history.push("/voucher/")
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }


    handleInputValueChanged(e, idx) {
        let {stockIns} = this.state.voucher;
        let nextData = stockIns.slice()
        nextData[idx].quantity = e.target.value;
        this.setState({ productQuantity: nextData });
    }
    
    hideAlert() {
        this.setState({
          alert: null
        });
      }

    async deleteFile(stockIn_id) {  
        try {
                await stockApi.delete(`/stock-in/${stockIn_id}`) 
            } catch(error) {
                alert('Failed')
            }

        const { match: { params } } = this.props;
        const updatedData = await stockApi.get(`/voucher/${params.id}/`)
        this.setState({ alert: null, voucher: updatedData.data});
    }

    async forImageShow () {
        const { match: { params } } = this.props;
       try {
            const data =  await stockApi.get(`voucher/${params.id}`)
            if(data && data.data.file) {
                this.setState({imageShow: 'hasImage'})
            } else {
                this.setState({imageShow: ''})
            }
        }
       catch(error) {
            this.setState({imageShow: ''})
       }
    }
    
    handleOptionChange = changeEvent => {
        console.log(changeEvent,'changeEvent')
        this.setState({
            selectedStatus: changeEvent.target.value
        });
      };

    async handleProductQuantityRemove(idx) {
        let {stockIns} = this.state.voucher;
        const stockIn_id = stockIns[idx].id
        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(stockIn_id)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete StockIn
            </SweetAlert>
          );
      
        this.setState({
        alert: getAlert()
        });

        const { match: { params } } = this.props;
        this.refreshList(params.id)  

    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
    }

    async handleSubmit(event) {
        event.preventDefault()
        var productQuantityList= this.state.productQuantity
        let { match: { params } } = this.props;
        const file = this.state.selectedFile ? this.state.selectedFile : this.state.voucher.file;
        const status = this.state.selectedStatus ? this.state.selectedStatus : this.state.voucher.status;
        var data = new FormData()
        data.append('id', params.id)
        data.append('file', file)
        data.append('number', this.state.vNumber ? this.state.vNumber : this.state.voucher.number )
        data.append('status', status)
        try {
            const response = await stockApi.patch(`/voucher/${params.id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get(`/voucher/${params.id}/`);
            this.setState({updatedFileName: getData.data.file})
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
        } catch(error) {

            alert('Voucher can not updated Properly.')
         }

         const finalSubmit = async () => {
            await this.asyncForEach(productQuantityList, async (productQuantity) => {
                const {id, productId, quantity, inQuantity } = productQuantity

                const updatedStockInData = {
                    id,
                    productId,
                    voucherId: params.id,
                    inQuantity: Number(quantity) ? Number(quantity) : inQuantity //this.refs.defaultQuantity.value
                }
    
                try {
                    const response = await stockApi.patch(`/stock-in/${updatedStockInData.id}`, updatedStockInData);
                    this.setState({snackBarOpen: true, snackBarMsg: response.data})

                } catch(error) {
                    this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
                 }
            });
            console.log('Done');
          }
          finalSubmit()
          var newProductQuantityList= this.state.newAddedProductQuantity
          const stockInSubmit = async () => {
            await this.asyncForEach(newProductQuantityList, async (productQuantity) => {
                let submittedData = {
                    id: null,
                    productId: productQuantity.productId,
                    inQuantity: productQuantity.quantity,
                    voucherId: params.id
                }
    
                try {
                    const response = await stockApi.post('/stock-in', submittedData);
                    this.setState({snackBarOpen: true, snackBarMsg: response.data})

                
                } catch(error) {
                    this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
                }
            });
            console.log('Done');
            const updatedData = await stockApi.get(`/voucher/${params.id}/`)
            this.setState({ voucher: updatedData.data});
          }

          stockInSubmit()
          this.addStockInVoucher.current.getArray()

    }

    render() {
        const { match: { params } } = this.props;
        const file = this.state.updatedFileName ? this.state.updatedFileName : this.state.voucher.file
        // this.forImageShow()
        this.imageUrl = `http://localhost:3001/voucher/${params.id}/${file}` 
        
        const {stockIns}=this.state.voucher
        var imageStyle = {
            maxWidth: 250,
            maxHeight: 250,
            float: 'right'
        }


        let onChangeHandler = (event) => (
            this.setState({
                selectedFile: event.target.files[0],
                loaded: 0,
              })
        )

        return(
            
            <div id='printme'>
                <Snackbar 
                anchorOrigin={{vertical:'bottom', horizontal:'center'}} 
                open ={this.state.snackBarOpen}
                autoHideDuration = {3000}
                onClose={this.snackbarClose}
                message= {<span id="message-id"> {this.state.snackBarMsg}</span>}
                action={[
                    <IconButton
                    key="close"
                    arial-label="close"
                    color="inherit"
                    onClick={this.snackbarClose}
                    >
                        x
                    </IconButton>
                ]}
                />
            <br/>
            <Row className="col-md-9" >
            <br/>
            
            <Card className="col-md-12">
            
            <CardHeader id="center"
              title="Voucher Details"
              subheader={this.voucher_subtitle}
              
            />
            {
                localStorage.getItem('isAdmin')==="2" ?
                <Col xs={6}>
                <Form.Group controlId="CategoryName" className="col-md-6" >
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select"
                    onChange={this.handleOptionChange}
                    >
                        {Object.values(Status).map(status => 
                            <option key={status} value={status}>
                                {_.invert(Status)[status]}
                            </option>       
                    )}  
                    </Form.Control>
                </Form.Group>
            </Col> : ''
            }

            <Col xs={6}  style={imageStyle} id="printButton">
            {this.state.imageShow ? <a href={this.imageUrl} target="_blank" rel="noopener noreferrer">Save Image</a> : 'This voucher has no Image'}
            <ModalImage
                small={this.imageUrl}
                large={this.imageUrl}
                alt={this.state.voucher.file}
                hideDownload={true}
                hideZoom={true}
                id="printButton"
            />
            <br/>

            {
            this.state.open && (
                <Lightbox
                medium={this.imageUrl}
                crossorigin="anonymous"
                target="_blank"
                alt="Hello World!"
                
                onClose={this.closeLightbox}
                className={imageStyle}
                />
            )
            }
            </Col>
         

            <CardContent>

            <Form.Group controlId="VoucherNumber" className="col-3">
            <Form.Label>VoucherNumber</Form.Label>
            <Form.Control
                type="number"
                name="VoucherNumber"
                ref="defaultVoucher"
                defaultValue = {this.state.voucher.number}
                placeholder="Voucher Number"
                onChange={e => this.setState({ vNumber: e.target.value })}
            />
        </Form.Group>
        <Form.Group controlId="VoucherFile" className="col-6">
            <Form.Label>VoucherFile</Form.Label>
            <Form.Control
                type="file"
                name="VoucherFile"
                placeholder="Voucher file"
                encType="multipart/form-data"
                onChange={onChangeHandler}

            />
        </Form.Group>

            </CardContent>

          </Card>
         
        </Row>

            <div className="col-md-12">
            <table className="table mt-3 bordered table-hover  white-table addNewSocial">
                                <thead className="thead-dark col-md-6">
                                    {stockIns ? 
                                    
                                        <tr className="row">
                                            <th className="col-3 col-s-3 col-m-3">Product Id</th>
                                            <th className="col-5 col-s-5 col-m-5">Product Name</th>
                                            <th className="col-3 col-s-3 col-m-3">Quantity</th>
                                            <th className="col-1 col-s-1 col-m-1">action</th>
                                        </tr> : ''
                                        
                                }

                                </thead>
                                {!_.isEmpty(stockIns) && stockIns? 
                                <tbody className="col-md-6">
                                    {stockIns.map((productQuantity, idx) => (

                                        <tr key={idx} className="row">
                                            <td className="col-3 col-s-3 col-m-3">
                                            {productQuantity.productId}
                                            </td>

                                            <td className="col-5 col-s-5 col-m-5">
                                            <input
                                                    type="text"
                                                    placeholder="Product name"
                                                    disabled
                                                    value = {productQuantity.product.name}
                                                />
                                            </td>

                                            <td className="col-3 col-s-3 col-m-3">
                                            <input
                                                type="number"
                                                placeholder="qty"
                                                ref="defaultQuantity"
                                                defaultValue = {productQuantity.inQuantity}
                                                value = {productQuantity.quantity}
                                                onChange= {(e) => this.handleInputValueChanged(e, idx)}
                                            />
                                            </td>
                                            <td className="col-1 col-s-1 col-m-1">
                                                <IconButton
                                                key="close"
                                                arial-label="close"
                                                color="secondary"
                                                onClick={() => this.handleProductQuantityRemove(idx)}
                                                >
                                                    {this.state.alert}
                                                    x
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody> : <tbody colSpan={5} style={{textAlign: "center"}}>This Voucher does not have any Product in Stock</tbody>}
                     </table>
            </div>
            <br/>
            <AddStockInVoucher callbackFromUpdateVoucher={this.getDataFromAddStockIn} afterSubmitted={this.state.newAddedProductQuantity.length} ref={this.addStockInVoucher}/>
                    <div className="col-md-12">
                        <button
                        className="newFlyerButton btn mb-4  btn-primary"
                        type="button"
                        onClick={this.handleSubmit}
                        >
                        <span>
                            <span className="buttonText">Update</span>
                        </span>
                        </button>
                        <Button  className="offset-10" variant="secondary" id="printButton" onClick={() => this.goVoucher()}>Back</Button> 
                    </div>
        </div>
        )
    }
}