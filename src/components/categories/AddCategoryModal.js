import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
export class AddCategoryModal extends Component {
    constructor(props) {
        super(props)
        this.state = { snackBarOpen: false, snackBarMsg: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    async handleSubmit(event) {
        event.preventDefault()
        const data = {
            id:null,
            name: event.target.CategoryName.value
        }
        
        try {
            const response = await stockApi.post('/categories', data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/categories');
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
                        Add Category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="CategoryName">
                                            <Form.Label>CategoryName</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="CategoryName"
                                                required
                                                placeholder="Category Name"
                                                autoComplete="off"

                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Add Category</Button>
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