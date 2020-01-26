import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import * as _ from "lodash";
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

const Status = {
    inActive: 0,
    active: 1,
}
export class EditCategoryModal extends Component {
    constructor(props) {
        super(props);
        this.state = { snackBarOpen: false, snackBarMsg: '', selectedStatus: null}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitForUser = this.handleSubmitForUser.bind(this)
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    handleOptionChange = changeEvent => {
        this.setState({
            selectedStatus: changeEvent.target.value
        });
    };
    
    async handleSubmitForUser(event) {
        event.preventDefault()
        const data = {
            id: event.target.CategoryId.value,
            name: event.target.CategoryName.value
        }

        const id = data.id;

        try {
            const response = await stockApi.patch(`/categories/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/categories');
            if(this.props.getdata) {
                this.props.getdata(getData.data)
            }
        } catch(error) {
            this.setState({snackBarOpen: true, snackBarMsg: 'Failed'})
         }
    }

    async handleSubmit(event) {
        event.preventDefault()
        const status = this.state.selectedStatus ? this.state.selectedStatus : event.target.Status.value;
        const data = {
            id: event.target.CategoryId.value,
            name: event.target.CategoryName.value,
            deleteStatus: status,
        }

        const id = data.id;
        
        try {
            const response = await stockApi.patch(`/categories/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/categories');
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
                        Edit Category
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                            {localStorage.getItem('isAdmin')==="2" ?
                            
                            <Col sm={6}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="CategoryId">
                                    <Form.Label>CategoryId</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CategoryId"
                                        required
                                        disabled
                                        defaultValue = {this.props.cid}
                                        placeholder="CategoryId"
                                    />
                                </Form.Group>
                                <Form.Group controlId="CategoryName">
                                    <Form.Label>CategoryName</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CategoryName"
                                        required
                                        defaultValue = {this.props.cname}
                                        placeholder="Category Name"
                                    />
                                </Form.Group>
                                
                                <Form.Group controlId="Status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" defaultValue = {this.props.cstatus}
                                onChange={this.handleOptionChange}
                                >
                                    {Object.values(Status).map(status => 
                                        <option key={status} value={status} >
                                            {_.invert(Status)[status]}
                                        </option>       
                                )}  
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit">Update Category</Button>
                            </Form.Group>
                            </Form>
                        </Col> : <Col sm={6}>
                                    <Form onSubmit={this.handleSubmitForUser}>
                                        <Form.Group controlId="CategoryId">
                                            <Form.Label>CategoryId</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="CategoryId"
                                                required
                                                disabled
                                                defaultValue = {this.props.cid}
                                                placeholder="CategoryId"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="CategoryName">
                                            <Form.Label>CategoryName</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="CategoryName"
                                                required
                                                defaultValue = {this.props.cname}
                                                placeholder="Category Name"
                                            />
                                        </Form.Group>
                                    <Form.Group>
                                        <Button variant="primary" type="submit">Update Category</Button>
                                    </Form.Group>
                                    </Form>
                                </Col>
                        }
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