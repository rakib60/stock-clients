import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export class EditStockOutModal extends Component {
    constructor(props) {
        super(props);
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
            id: event.target.StockOutId.value,
            productId: event.target.ProductName.value,
            requisitionId: event.target.RequisitionNumber.value,
            outQuantity: event.target.OutQuantity.value
            
        }

        const id = data.id;
        
        try {
            const response = await stockApi.patch(`/stock-out/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/stock-out');
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
        } catch(error) {
            this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
            alert('Quantity Should not more than StockIn Quantity')
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
                        Edit StockOut
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="StockOutId">
                                            <Form.Label>Id</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="StockOutId"
                                                required
                                                disabled
                                                defaultValue = {this.props.sid}
                                                placeholder="StockOutId"
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
                                        <Form.Group controlId="RequisitionNumber">
                                            <Form.Label>Requisition Number</Form.Label>
                                            <Form.Control as="select" defaultValue= {this.props.vid}>
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
                                                defaultValue= { this.props.outq}
                                                placeholder="OutQuantity"
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Update StockOut</Button>
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