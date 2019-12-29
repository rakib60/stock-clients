import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export class EditStockInModal extends Component {
    constructor(props) {
        super(props);
        this.state = {products: [], voucher: [], snackBarOpen: false, snackBarMsg: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    async componentDidMount() {
        const response = await stockApi.get('/products');
        this.setState({products: response.data})
        const data = await stockApi.get('/voucher');
        this.setState({voucher: data.data})
    }
    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    async handleSubmit(event) {
        console.log(event.target.StockInId.value,'ggggggggg')
        event.preventDefault()

        const data = {
            id: event.target.StockInId.value,
            productId: event.target.ProductName.value,
            voucherId: event.target.VoucherNumber.value,
            inQuantity: event.target.InQuantity.value
            
        }

        const id = data.id;
        
        try {
            const response = await stockApi.patch(`/stock-in/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/stock-in');
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
        } catch(error) {
            this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
         }
    }

    render() {
        return(
            <div className="container">
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
            <Modal 
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Edit StockIn
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="StockInId">
                                            <Form.Label>Id</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="StockInId"
                                                required
                                                disabled
                                                defaultValue = {this.props.sid}
                                                placeholder="StockInId"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="ProductName">
                                            <Form.Label>Product Name</Form.Label>
                                            <Form.Control as="select" defaultValue= {this.props.pid}>
                                              {this.state.products.map(product => 
                                                 <option key={product.id} value={product.id}>
                                                     {product.name}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="VoucherNumber">
                                            <Form.Label>Voucher Number</Form.Label>
                                            <Form.Control as="select" defaultValue= {this.props.vid}>
                                              {this.state.voucher.map(voucher => 
                                                 <option key={voucher.id} value={voucher.id}>
                                                     {voucher.number}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="InQuantity">
                                            <Form.Label>InQuantity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="InQuantity"
                                                required
                                                defaultValue= { this.props.inq}
                                                placeholder="InQuantity"
                                                // autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Update StockIn</Button>
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
            </Modal>
            </div>
        )
    }
}