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

import {AddStockOutRequisition} from './AddStockOutRequisition'

const Status = {
    pending: 0,
    approved:1
}
export class UpdateRequisition extends Component {
    constructor(props) {
        super(props);
        this.state = {requisition: [], productQuantity: [], newAddedProductQuantity: [], selectedFile: null, rNumber: '', updatedFileName: '', alert: null, snackBarOpen: false, snackBarMsg: '', forImageShow: '', imageShow: '', selectedStatus: null}
        this.refreshList = this.refreshList.bind(this)
        this.handleProductQuantityRemove =  this.handleProductQuantityRemove.bind(this)
        this.handleInputValueChanged = this.handleInputValueChanged.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.forImageShow = this.forImageShow.bind(this);
        this.addStockOutRequisition = React.createRef();

    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.requisition_subtitle = "Requisition ID: " + params.id;
        this.refreshList(params.id)     
        this.forImageShow()
   
    }
    
    getDataFromAddStockOut = (dataFromChild) => {
        this.setState({newAddedProductQuantity : dataFromChild})
        
    }
    async refreshList (id) {
        const response =  await stockApi.get(`/requisition/${id}`);
        this.setState({requisition: response.data})

    }


    goRequisiton = () => {
        this.props.history.push("/requisition/")
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }


    async handleInputValueChanged(e, idx) {
        let {stockOuts} = this.state.requisition;
        let nextData = stockOuts.slice()
        nextData[idx].quantity = e.target.value;
        let productId = Number(nextData[idx].productId)
        let getProduct = await stockApi.get(`products/${productId}`) 
        let product = getProduct.data
        _.defer(() => {
            if ( !_.isEmpty(product.stockIns)) {
            var totalInQuantity = 0;
            var data = product.stockIns.values()
                for(let key of data ) {
                    totalInQuantity += key.inQuantity
                }
            this.setState({totalInQuantity: totalInQuantity})
        } else {
            this.setState({totalInQuantity: 0})
        }

        if ( !_.isEmpty(product.stockOuts)) {
            var totalOutQuantity = 0;
            var iterator = product.stockOuts.values()
                for(let key of iterator ) {
                    totalOutQuantity += key.outQuantity
                }
                this.setState({totalOutQuantity: totalOutQuantity})
        } else {
            this.setState({totalOutQuantity: 0})
        }
        })

        this.setState({ productQuantity: nextData });
    }
    
    hideAlert() {
        this.setState({
          alert: null
        });
      }

    async deleteFile(stockOut_id) {  
        try {
                await stockApi.delete(`/stock-out/${stockOut_id}`) 
            } catch(error) {
                alert('Failed')
            }

        const { match: { params } } = this.props;
        const updatedData = await stockApi.get(`/requisition/${params.id}/`)
        this.setState({ alert: null, requisition: updatedData.data});
    }

    async forImageShow () {
        const { match: { params } } = this.props;
       try {
            const data =  await stockApi.get(`requisition/${params.id}`)
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
        this.setState({
            selectedStatus: changeEvent.target.value
        });
    };

    async handleProductQuantityRemove(idx) {
        let {stockOuts} = this.state.requisition;
        const stockOut_id = stockOuts[idx].id
        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(stockOut_id)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete StockOut
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
        const file = this.state.selectedFile ? this.state.selectedFile : this.state.requisition.file;
        const status = this.state.selectedStatus ? this.state.selectedStatus : this.state.requisition.status;
        var data = new FormData()
        data.append('id', params.id)
        data.append('file', file)
        data.append('location', this.state.location ? this.state.location : this.state.requisition.location)
        data.append('number', this.state.rNumber ? this.state.rNumber : this.state.requisition.number )
        data.append('status', status)

        try {
            const response = await stockApi.patch(`/requisition/${params.id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get(`/requisition/${params.id}/`);
            this.setState({updatedFileName: getData.data.file})
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
        } catch(error) {

            alert('Requisition can not updated Properly.')
         }

         const finalSubmit = async () => {
            await this.asyncForEach(productQuantityList, async (productQuantity) => {
                const {id, productId, quantity, outQuantity } = productQuantity

                const updatedStockInData = {
                    id,
                    productId,
                    requisitionId: params.id,
                    outQuantity: Number(quantity) ? Number(quantity) : outQuantity
                }
    
                try {
                    const response = await stockApi.patch(`/stock-out/${updatedStockInData.id}`, updatedStockInData);
                    this.setState({snackBarOpen: true, snackBarMsg: response.data})

                } catch(error) {
                    this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
                    alert('Quantity Should be less than StockIn Quantity')
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
                    outQuantity: productQuantity.quantity,
                    requisitionId: params.id
                }
    
                try {
                    const response = await stockApi.post('/stock-out', submittedData);
                    this.setState({snackBarOpen: true, snackBarMsg: response.data})

                
                } catch(error) {
                    this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
                    alert('Quantity Should be less than StockIn Quantity')
                }
            });
            console.log('Done');
            const updatedData = await stockApi.get(`/requisition/${params.id}/`)
            this.setState({ requisition: updatedData.data});
          }

          stockInSubmit()
          this.addStockOutRequisition.current.getArray()

    }

    render() {
        const { match: { params } } = this.props;
        const file = this.state.updatedFileName ? this.state.updatedFileName : this.state.requisition.file
        this.imageUrl = `http://localhost:3001/requisition/${params.id}/${file}` 
        
        const {stockOuts}=this.state.requisition
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

        const defaultValue = this.state.requisition.status;
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
              title="Requisition Details"
              subheader={this.requisition_subtitle}
              
            />
            {
                
                localStorage.getItem('isAdmin')==="2" ?
                <Col xs={6}>
                <h6>Current Status : {this.state.requisition.status === 0 ? 'Pending' : 'Approved'}</h6>
                <Form.Group controlId="CategoryName" className="col-md-6" >
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" 
                    onChange={this.handleOptionChange}
                    >
                        {Object.values(Status).map(status => 
                            <option 
                            key={status} 
                            value={status} 
                            selected={defaultValue === status ? "selected": ""}>
                                {_.invert(Status)[status]}
                                
                            </option>       
                    )}  
                    </Form.Control>
                </Form.Group>
            </Col> : ''
            }
            <Col xs={6}  style={imageStyle} id="printButton">
            {this.state.imageShow ? <a href={this.imageUrl} target="_blank" rel="noopener noreferrer">Save Image</a> : 'This requisition has no Image'}
            <ModalImage
                small={this.imageUrl}
                large={this.imageUrl}
                alt={this.state.requisition.file}
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

            <Form.Group controlId="RequisitionNumber" className="col-3">
            <Form.Label>RequisitionNumber</Form.Label>
            <Form.Control
                type="number"
                name="RequisitionNumber"
                ref="defaultRequisition"
                defaultValue = {this.state.requisition.number}
                placeholder="Requisition Number"
                onChange={e => this.setState({ rNumber: e.target.value })}
            />
        </Form.Group>
        <Form.Group controlId="Location" className="col-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
                type="text"
                name="Location"
                defaultValue = {this.state.requisition.location}
                placeholder="Location"
                onChange={e => this.setState({ location: e.target.value })}
            />
        </Form.Group>
        <Form.Group controlId="RequisitionFile" className="col-6">
            <Form.Label>RequisitionFile</Form.Label>
            <Form.Control
                type="file"
                name="RequisitionFile"
                placeholder="Requisition file"
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
                                    {stockOuts ? 
                                    
                                        <tr className="row">
                                            <th className="col-3 col-s-3 col-m-3">Product Id</th>
                                            <th className="col-5 col-s-5 col-m-5">Product Name</th>
                                            <th className="col-3 col-s-3 col-m-3">Quantity</th>
                                            <th className="col-1 col-s-1 col-m-1">action</th>
                                        </tr> : ''
                                        
                                }

                                </thead>
                                {!_.isEmpty(stockOuts) && stockOuts? 
                                <tbody className="col-md-6">
                                    {stockOuts.map((productQuantity, idx) => (

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

                                                {

                                                this.state.totalInQuantity > this.state.totalOutQuantity + Number(productQuantity.quantity)  ?
                                                 '' : _.isUndefined(productQuantity.quantity) ? '' :
                                                    
                                                    <span style={{color:'red'}} id="updateBtn">
                                                        stockout quantity must be less than stockin.
                                                    </span>
                                                
                                                }
                                            <input
                                                type="number"
                                                placeholder="qty"
                                                ref="defaultQuantity"
                                                defaultValue = {productQuantity.outQuantity}
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
                                </tbody> : <tbody colSpan={5} style={{textAlign: "center"}}>This Requisition does not have any Product in Stock</tbody>}
                     </table>
            </div>
            <br/>
            <AddStockOutRequisition callbackFromUpdateRequisition={this.getDataFromAddStockOut} afterSubmitted={this.state.newAddedProductQuantity.length} ref={this.addStockOutRequisition}/>
                    <div className="col-md-12">
                    {
                        document.getElementById('updateBtn') ? 
                            <button
                                className="newFlyerButton btn mb-4  btn-primary"
                                type="button"
                                disabled
                                onClick={this.handleSubmit}
                                >
                                <span>
                                    <span className="buttonText">Update</span>
                                </span>
                            </button>: 
                                <button
                                    className="newFlyerButton btn mb-4  btn-primary"
                                    type="button"
                                    onClick={this.handleSubmit}
                                    >
                                    <span>
                                        <span className="buttonText">Update</span>
                                    </span>
                                </button>
                        

                    }

                        <Button  className="offset-10" variant="secondary" id="printButton" onClick={() => this.goRequisiton()}>Back</Button> 
                    </div>
        </div>
        )
    }
}