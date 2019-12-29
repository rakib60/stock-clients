import React, {Component} from 'react'
import {Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import {AddProductModal} from '../products/AddProductModal'

// import Snackbar from '@material-ui/core/Snackbar'
// import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';

// import {BasicTextFields} from './formHelper'
import IconButton from '@material-ui/core/IconButton'




export class ProductQuantity extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], voucher: [], snackBarOpen: false, snackBarMsg: '', addModalShow: false, editModalShow: false, productQuantity: [], productId: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getProduct = this.getProduct.bind(this);

        this.handleProductQuantityAdd =  this.handleProductQuantityAdd.bind(this)
        this.handleInputValueChanged = this.handleInputValueChanged.bind(this)
        this.handleProductQuantityRemove =  this.handleProductQuantityRemove.bind(this)

    }

    async componentDidMount() {
        const response = await stockApi.get('/products');
        this.setState({products: response.data})
        const data = await stockApi.get('/voucher');
        this.setState({voucher: data.data})
    }
    handleProductQuantityAdd() {
        let array = this.state.productQuantity
        array.push({ id: array.length + 1, quantity: ""})
        this.setState({productQuantity: array})
    }

    handleInputValueChanged(e, idx) {
        console.log('xxxxxx')
        let nextData = this.state.productQuantity.slice();
        nextData[idx].quantity = e.target.value;
        this.setState({ productQuantity: nextData });
    }

    handleProductValueChanged(productId, idx) {
        let productData = this.state.productQuantity.slice();
        productData[idx].productId = productId;
        this.setState({productQuantity: productData})
    }
    
    handleProductQuantityRemove(idx) {
        let someArray = this.state.productQuantity;
        someArray.splice(idx, 1);
        this.setState({productQuantity: someArray})
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }
    async getProduct() {
        const getProduct = await stockApi.get('/products')
        this.setState({products: getProduct.data})
    }
    async handleSubmit(event) {
        event.preventDefault()
        const data = {
            id:null,
            productId: event.target.ProductName.value,
            // voucherId: event.target.VoucherNumber.value,
            inQuantity: event.target.InQuantity.value
            
        }
        
        // try {
        //     const response = await stockApi.post('/stock-in', data);
        //     this.setState({snackBarOpen: true, snackBarMsg: response.data})
        //     const getData = await stockApi.get('/stock-in');
        //     if(this.props.getdata) {
        //         this.props.getdata(getData.data)
        //     }
            
        // } catch(error) {
        //     this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
        //     alert('Failed')
        //  }
        
    }

    render() {

        let addModalClose =() => this.setState({addModalShow: false})
        return(
            
            <div className="container">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="VoucherNumber" className="col-md-6">
                    <Form.Label>VoucherNumber</Form.Label>
                    <Form.Control
                        type="number"
                        name="VoucherNumber"
                        required
                        placeholder="VoucherNumber"
                        autoComplete="off"
                    />
                </Form.Group>
                <button
                className="newFlyerButton btn mb-4"
                type="button"
                onClick={this.handleProductQuantityAdd}
                >
                <span>
                    <span className="buttonText">ADD NEW</span>
                </span>
                </button>
                <table className="table mt-3 bordered table-hover  white-table addNewSocial">
                <tbody>
                    {this.state.productQuantity.map((productQuantity, idx) => (
                        <tr key={idx} className="row">
                            <td className="col-4">
                            <div style={{display: 'flex'}} className="col-md-12">
                            <div className="col-md-9" style={{display: 'flex'}}>
                            <select
                                onChange={e => {
                                this.handleProductValueChanged(e.target.value, idx);
                                }}
                                value={productQuantity.productId || "SelectOption"}
                            >
                                <option value="SelectOption" disabled>
                                Select Product
                                </option>
                                {this.state.products.map(product => (
                                <option
                                    value={product.id}
                                    data={product}
                                    key={product.id}
                                >
                                    {product.name}
                                </option>
                                ))}
                            </select>
                            </div>
                            <br/>
                            <div className="col-md-3" style={{display: 'flex'}}>
                                Add Product
                            <Icon style={{ color: green[500] }} onClick={()=> this.setState({addModalShow: true})}>add_circle</Icon>
                            <AddProductModal
                                show={this.state.addModalShow}
                                onHide={addModalClose}
                                getdata={this.getProduct}
                            />
                            </div>
                            </div>
                            </td>

                            <td className="col-4" style={{paddingTop: '23px'}}>
                            <input
                                type="number"
                                placeholder="qty"
                                value = {productQuantity.quantity}
                                onChange= {(e) => this.handleInputValueChanged(e, idx)}
                            />
                            </td>
                            <td className="col-4">
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
                <Form.Group>
                    <Button variant="primary" type="submit">Add StockIn</Button>
                </Form.Group>
                </Form>
            {/* <Snackbar 
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
                /> */}

                        
                            {/* <Row>
                                <Col md={6} style={{display: 'flex'}}>

                                    <Form onSubmit={this.handleSubmit}>

                                        <div className="col-md-12" style={{display: 'flex'}}>

                                        <Form.Group controlId="ProductName" className="col-md-6">
                                            <Form.Label>ProductName</Form.Label>
                                            <Form.Control as="select">
                                              {this.state.products.map(product => 
                                                 <option key={product.id} value={product.id}>
                                                     {product.name}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="col-md-2" style={{marginTop: '36px', marginLeft: '-24px', marginRight: '-46px'}}>
                                            <Icon style={{ color: green[500] }} onClick={()=> this.setState({addModalShow: true})}>add_circle</Icon>
                                            <AddProductModal
                                                show={this.state.addModalShow}
                                                onHide={addModalClose}
                                                getdata={this.getProduct}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="InQuantity" style={{marginLeft: '30px'}} className="col-md-4">
                                            <Form.Label>InQuantity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="InQuantity"
                                                required
                                                placeholder="InQuantity"
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        </div>
                                        

                                        <Form.Group>
                                            <Button variant="primary" type="submit">Add StockIn</Button>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row> */}
            </div>
        )
    }
}