import React, {Component} from 'react'
import { Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'


import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

import * as _ from "lodash";



export class AddStockOutModal extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], requisition: [], snackBarOpen: false, snackBarMsg: '', productQuantity: [], categories: [], selectValue: "", initialCategoryId: "", productId: "", quantity: "", productName: "", rnumber: "", location: "", totalOutQuantity: 0, totalInQuantity: 0}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getProduct = this.getProduct.bind(this);

        this.handleProductQuantityAdd =  this.handleProductQuantityAdd.bind(this)
        this.handleInputValueChanged = this.handleInputValueChanged.bind(this)
        this.handleProductValueChanged = this.handleProductValueChanged.bind(this)
        this.handleProductQuantityRemove =  this.handleProductQuantityRemove.bind(this)
        this.onChangeHandler = this.onChangeHandler.bind(this)
        this.inputId = ''
    }

    async componentDidMount() {

        const data = await stockApi.get('/requisition');
        this.setState({requisition: data.data})

        const categories = await stockApi.get('/categories');
        this.setState({categories: categories.data, initialCategoryId: categories.data[0] ? categories.data[0].id : ''})

        const response = await stockApi.get(`/products?categoryId=${this.state.initialCategoryId}`);
        let initialProductIdForShownQuantity = response.data && response.data.length > 0 ? response.data[0].id : ''
        this.productQuantiyDetails(initialProductIdForShownQuantity)

        this.setState({products: response.data})
    }


    showProductName(id) {
        var name = ""
        // eslint-disable-next-line
        this.state.products.filter( (product) => {
            if(product.id === Number(id)) {
                name = product.name
            }})
            return name
    }


    handleProductQuantityAdd() {
        let array = this.state.productQuantity
        var productName = this.showProductName(!this.state.productId ? this.refs.defaultProduct.value : this.state.productId)
        array.push({ id: array.length + 1, productId: !this.state.productId ? this.refs.defaultProduct.value : this.state.productId, quantity: this.state.quantity, productName: productName  })
        this.setState({productQuantity: array, productId: '', quantity: ''})
    }

    async handleInputValueChanged(e, idx) {
        let nextData = this.state.productQuantity.slice();
        nextData[idx].quantity = e.target.value;
        this.setState({ productQuantity: nextData });
    }

    handleProductValueChanged(e, idx) {
        let productData = this.state.productQuantity.slice();
        productData[idx].productId = e.target.value;
        this.setState({productQuantity: productData})
    }

    handleProductQuantityRemove(idx) {
        let someArray = this.state.productQuantity;
        someArray.splice(idx, 1);
        this.setState({productQuantity: someArray})
    }



    onChangeHandler(event) {
        event.preventDefault()
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }
    async getProduct(cid) {
        const getProduct = await stockApi.get(`/products?categoryId=${cid}`);

        let initialProductIdForShownQuantity = getProduct.data && getProduct.data.length > 0 ? getProduct.data[0].id : ''
        this.productQuantiyDetails(initialProductIdForShownQuantity)
        this.setState({products: getProduct.data})
    }

    getRequisitionIdfromRequisitionNumber(data, rnumber) {
        var id = ""
        // eslint-disable-next-line
        data.filter( (requisition) => {
            if(requisition.number === Number(rnumber)) {
                id = requisition.id
            }})
            return id
    }

    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
    }

    async handleSubmit(event) {
        event.preventDefault()
        let file = this.state.selectedFile ? this.state.selectedFile : ''
        var formData = new FormData()
        formData.append('id', null)
        formData.append('file', file);
        formData.append('number', this.state.rnumber)
        formData.append('location', this.state.location)

        try {
            const response = await stockApi.post('/requisition', formData);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/requisition');
            const responsedData = getData.data

            if(responsedData.length > 0) {
                var rId = this.getRequisitionIdfromRequisitionNumber(responsedData, this.state.rnumber)
                var requisitionId = rId ? rId : ''
                this.setState({rnumber: ''})
                
            } else {
                alert('Requisition has no data')
            }
            
        } catch(error) {
            alert('Already exist Requisition with Same Number')
        }

        var productQuantityList= this.state.productQuantity

        const finalSubmit = async () => {
            await this.asyncForEach(productQuantityList, async (productQuantity) => {
                let submittedData = {
                    id: null,
                    productId: productQuantity.productId,
                    requisitionId: requisitionId,
                    outQuantity: productQuantity.quantity
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
          }
          finalSubmit()
          this.setState({productQuantity: []})
          
    }


    async productQuantiyDetails(id) {
        try {
            const response = await stockApi.get(`/products/${id}`)
            let product = response.data;
            
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
        } catch (error) {
            alert('This Product does not exist yet')
        }
    }

    render() {
        let handleDropdownChange =(e) => (
            this.getProduct(e.target.value)

        )

        let handleProductChange = (e) => (    
            // eslint-disable-next-line
            this.inputId = e.target.value ? e.target.value : this.refs.defaultProduct.value ,
            this.productQuantiyDetails(this.inputId),
            this.setState({productId: e.target.value})
            
        )
        
        

        return(
            
            <div className="container"  style={{backgroundColor: 'beige'}}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
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
                        
                                <div className="col-md-12">

                                    <Form  onSubmit={this.handleSubmit}>

                                    <div className="col-md-6">
                                    <Form.Group controlId="CategoryName" >
                                            <Form.Label>CategoryName</Form.Label>
                                            <Form.Control as="select"
                                            onChange={handleDropdownChange}
                                            >
                                              {this.state.categories.map(category => 
                                                 <option key={category.id} value={category.id}>
                                                     {category.name}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                    </Form.Group>
                                    </div>
                                    <div className="col-md-6" style={{display: 'flex', padding: '0px'}}>
                                    <div className="col-md-6">
                                    {this.state.products.length > 0 ? 
                                                                    <Form.Group controlId="ProductName">
                                                                    <Form.Label>ProductName</Form.Label>
                                                                    <Form.Control as="select"
                                                                    ref="defaultProduct"
                                                                    onChange={handleProductChange}
                                                                    >
                                                                      {this.state.products.map(product => 
                                                                         <option key={product.id} value={product.id}>
                                                                             {product.name}
                                                                         </option>       
                                                                    )}  
                                                                    </Form.Control>
                                                            </Form.Group>    : 'This category has no product'
                                
                                
                                }
                                    </div>

                                    {this.state.totalInQuantity > this.state.totalOutQuantity ? 

                                    <div className="col-md-6">
                                    {this.state.totalInQuantity > this.state.totalOutQuantity + Number(this.state.quantity) ? '':
                                    
                                    <span style={{color:'red'}}>
                                        stockout quantity must be less than stockin.
                                    </span>
                                    }
                                    <Form.Group controlId="OutQuantity">
                                            <Form.Label>OutQuantity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="OutQuantity"
                                                required
                                                placeholder="OutQuantity"
                                                autoComplete="off"
                                                value={this.state.quantity}
                                                onChange={e => this.setState({ quantity: e.target.value })}
                                                onKeyPress={event => {
                                                    if (event.key === 'Enter') {
                                                        this.handleProductQuantityAdd()
                                                    }
                                                  }}
                                            />
                                    </Form.Group>

                                    </div> :     
                                                  
                                            <div className="col-md-6">
                                                <span style={{color: 'red'}}>This product has no Stock In Quantity </span>
                                                <Form.Group controlId="OutQuantity">
                                                        <Form.Label>OutQuantity</Form.Label>
                                                        <Form.Control
                                                            type="number"
                                                            name="OutQuantity"
                                                            disabled
                                                            placeholder="OutQuantity"
                                                        />
                                                </Form.Group>

                                            </div> 
                                
                                
                                
                                
                                
                                }

                                        <div className="col-md-6">
                                             <h4>Product Quantity Summary:</h4>
                                             <p>InQuantity: {this.state.totalInQuantity}<br/>
                                             OutQuantity: {this.state.totalOutQuantity}</p>
                                             </div>
                                    </div>
                                    </Form>

                                
                                </div>
                                <div className="col-md-12">
                                {
                                this.state.products.length > 0 && !_.isEmpty(this.state.quantity) && this.state.totalInQuantity > this.state.totalOutQuantity + Number(this.state.quantity) ? 
                                <button
                                className="newFlyerButton btn mb-4"
                                type="button"
                                onClick={this.handleProductQuantityAdd}
                                >
                                <span>
                                    <span className="buttonText">ADD NEW</span>
                                </span>
                                </button>   : 

                                                <button
                                                className="newFlyerButton btn mb-4"
                                                type="button"
                                                disabled
                                                >
                                                <span>
                                                    <span className="buttonText">ADD NEW</span>
                                                </span>
                                                </button>
                            
                            }

                                <table className="table mt-3 bordered table-hover  white-table addNewSocial">
                                <thead className="thead-dark">
                                    {this.state.productQuantity.length > 0 ? 
                                    
                                        <tr className="row">
                                            <th className="col-3 col-s-3 col-m-3">Product Id</th>
                                            <th className="col-5 col-s-5 col-m-5">Product Name</th>
                                            <th className="col-3 col-s-3 col-m-3">Quantity</th>
                                            <th className="col-1 col-s-1 col-m-1">action</th>
                                        </tr> : ''
                                        
                                }

                                </thead>
                                <tbody>
                                    {this.state.productQuantity.map((productQuantity, idx) => (

                                        <tr key={idx} className="row">
                                            <td className="col-3 col-s-3 col-m-3">
                                            {productQuantity.productId}
                                            </td>
                                            <td className="col-5 col-s-5 col-m-5">
                                            <input
                                                    type="text"
                                                    placeholder="Product name"
                                                    disabled
                                                    value = {productQuantity.productName}
                                                />
                                            </td>

                                            <td className="col-3 col-s-3 col-m-3">
                                            <input
                                                type="number"
                                                placeholder="qty"
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
                                                    x
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                </table>
                                <div style={{display: 'flex'}} >
                                        <Form.Group controlId="RequisitionNumber" className="col-md-2">
                                            <Form.Label>RequisitionNumber</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="RequisitionNumber"
                                                required
                                                placeholder="Requisition Number"
                                                autoComplete="off"
                                                value={this.state.rnumber}
                                                onChange={e => this.setState({ rnumber: e.target.value })}

                                            />
                                        </Form.Group>
                                        <Form.Group controlId="Location" className="col-md-2">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Location"
                                                required
                                                placeholder="location"
                                                autoComplete="off"
                                                value={this.state.location}
                                                onChange={e => this.setState({ location: e.target.value })}

                                            />
                                        </Form.Group>
                                        <Form.Group controlId="RequisitonFile" className="col-md-4">
                                            <Form.Label>RequisitonFile</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="RequisitonFile"
                                                required
                                                placeholder="Requisiton file"
                                                autoComplete="off"
                                                encType="multipart/form-data"
                                                onChange={this.onChangeHandler}

                                            />
                                        </Form.Group>
                                        {
                                            this.state.productQuantity.length > 0 && this.state.rnumber ? <button
                                                                                    className="newFlyerButton btn mb-4 btn-success"
                                                                                    type="button"
                                                                                    
                                                                                    onClick={this.handleSubmit}
                                                                                    >
                                                                                    <span>
                                                                                        <span className="buttonText">ADD TO STOCK OUT</span>
                                                                                    </span>
                                                                                    </button> :
                                                                                                <button
                                                                                                className="newFlyerButton btn mb-4"
                                                                                                type="button"
                                                                                                disabled                                                                                                >
                                                                                                <span>
                                                                                                    <span className="buttonText">ADD TO STOCK OUT</span>
                                                                                                </span>
                                                                                                </button>
                                        }
                                </div>
                                </div>
                                
                        

            </div>
        )
    }
}