import React, {Component} from 'react'
import {Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import {AddProductModal} from '../products/AddProductModal'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon';
import { green } from '@material-ui/core/colors';




export class AddStockInModal extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], voucher: [], snackBarOpen: false, snackBarMsg: '', addModalShow: false, editModalShow: false, productQuantity: []}
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
        array.push({ id: array.length + 1, productId: "", quantity: "" })
        this.setState({productQuantity: array})
    }

    handleInputValueChanged(e, idx) {
        let nextData = this.state.productQuantity.slice();
        nextData[idx].productId = e.target.value;
        nextData[idx].quantity = e.target.value;
        this.setState({ productQuantity: nextData });
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
            {/* <Modal 
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Add StockIn
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body> */}
                        
                            <Row>
                                <Col md={6} style={{display: 'flex'}}>

                                    <Form onSubmit={this.handleSubmit}>

                                        {/* <div className="col-md-12" style={{display: 'flex'}}>

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
                                        </div> */}
                                        
                                        <div className="col-md-12" style={{display: 'flex'}}>
                                        {/* <Form.Group controlId="VoucherNumber" className="col-md-6">
                                            <Form.Label>VoucherNumber</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="VoucherNumber"
                                                required
                                                placeholder="VoucherNumber"
                                                autoComplete="off"
                                            />
                                        </Form.Group> */}
                                        {/* <Form.Group controlId="VoucherNumber" style={{marginLeft: '30px'}} className="col-md-6">
                                            <Form.Label>VoucherNumber</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="VoucherNumber"
                                                required
                                                placeholder="VoucherNumber"
                                                autoComplete="off"
                                            />
                                        </Form.Group> */}
                                        </div>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Add StockIn</Button>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        
                    {/* </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
            </Modal> */}
            </div>
        )
    }
}