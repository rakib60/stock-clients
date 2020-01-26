import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export class EditProductModal extends Component {
    constructor(props) {
        super(props);
        this.state = {categories: [], snackBarOpen: false, snackBarMsg: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    async componentDidMount() {
        const response = await stockApi.get('/categories');
        this.setState({categories: response.data})
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    async handleSubmit(event) {
        event.preventDefault()
        const data = {
            id: event.target.ProductId.value,
            name: event.target.ProductName.value,
            description: event.target.ProductDescription.value,
            categoryId: event.target.CategoryName.value,
            
        }

        const id = data.id;
        
        try {
            const response = await stockApi.patch(`/products/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/products');
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
                        Edit Product
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="ProductId">
                                            <Form.Label>ProductId</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ProductId"
                                                required
                                                disabled
                                                defaultValue = {this.props.pid}
                                                placeholder="ProductId"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="ProductName">
                                            <Form.Label>ProductName</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ProductName"
                                                required
                                                defaultValue = {this.props.pname}
                                                placeholder="Category Name"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="ProductDescription">
                                            <Form.Label>ProductDescription</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ProductDescription"
                                                required
                                                defaultValue = {this.props.pdes}
                                                placeholder="Product Description"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="CategoryName">
                                            <Form.Label>CategoryName</Form.Label>
                                            <Form.Control as="select" defaultValue = {this.props.cid}>
                                              {this.state.categories.map(category => 
                                                 <option key={category.id}  value={category.id}>
                                                     {category.name}
                                                 </option>       
                                            )}  
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Update Product</Button>
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