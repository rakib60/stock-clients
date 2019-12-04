import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
export class AddStockOutModal extends Component {
    constructor(props) {
        super(props)
        this.state = {products: [], requisition: [], snackBarOpen: false, snackBarMsg: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const response = await stockApi.get('/products');
        this.setState({products: response.data})
        const data = await stockApi.get('/requisition');
        this.setState({requisition: data.data})
    }
    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    async handleSubmit(event) {
        event.preventDefault()
        const data = {
            id:null,
            productId: event.target.ProductName.value,
            requisitionId: event.target.RequisitionNumber.value,
            outQuantity: event.target.OutQuantity.value
            
        }
        
        try {
            const response = await stockApi.post('/stock-out', data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/stock-out');
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
            
        } catch(error) {
            this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
            alert('Failed')
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
                        Add StockOut
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="ProductName">
                                            <Form.Label>ProductName</Form.Label>
                                            <Form.Control as="select">
                                              {this.state.products.map(product => 
                                                 <option key={product.id} value={product.id}>
                                                     {product.name}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="RequisitionNumber">
                                            <Form.Label>RequisitionNumber</Form.Label>
                                            <Form.Control as="select">
                                              {this.state.requisition.map(requisition => 
                                                 <option key={requisition.id} value={requisition.id}>
                                                     {requisition.number}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId="OutQuantity">
                                            <Form.Label>OutQuantity</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="OutQuantity"
                                                required
                                                placeholder="OutQuantity"
                                                autoComplete="off"
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Add StockOut</Button>
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