import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'

export class EditUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = { snackBarOpen: false, snackBarMsg: '', selectedOption: ''}
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }

    handleOptionChange = changeEvent => {
        this.setState({
          selectedOption: changeEvent.target.value
        });
    };


    async handleSubmit(event) {
        event.preventDefault()
        const password = event.target.Password.value
        const confrim_password = event.target.ConfrimPassword.value
        if(password !== confrim_password) {
            alert("Passwords don't match")
        } else {
            var data = {
                id:event.target.UserId.value,
                firstName: event.target.FirstName.value,
                lastName: event.target.LastName.value,
                email: event.target.Email.value,
                isAdmin: Number(this.state.selectedOption),
                password: password
            }
        }
        
        try {
            const id = data.id;
            const response = await stockApi.patch(`/users/${id}`, data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/users');
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
                        Edit User
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="UserId">
                                            <Form.Label>UserId</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="UserId"
                                                required
                                                disabled
                                                defaultValue = {this.props.uid}
                                                placeholder="UserId"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="FirstName">
                                            <Form.Label>FirstName</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="FirstName"
                                                required
                                                placeholder="First Name"
                                                defaultValue = {this.props.fname}

                                            />
                                        </Form.Group>
                                        <Form.Group controlId="LastName">
                                            <Form.Label>LastName</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="LastName"
                                                required
                                                placeholder="Last Name"
                                                defaultValue = {this.props.lname}

                                            />
                                        </Form.Group>
                                        <Form.Group controlId="Email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="example@gmail.com"
                                                defaultValue = {this.props.email}

                                            />
                                        </Form.Group>
                                        <div className="mb-3" style={{display: 'flex'}}>
                                            User type:
                                        <div className="form-check" style={{paddingLeft: '30px'}}>
                                        <label>
                                        <input
                                            type="radio"
                                            name="user"
                                            value="1"
                                            checked={this.state.selectedOption === "1"}
                                            onChange={this.handleOptionChange}
                                            className="form-check-input"
                                        />
                                        User
                                        </label>
                                    </div>
                                    <div className="form-check" style={{paddingLeft: '30px'}}>
                                    <label>
                                    <input
                                        type="radio"
                                        name="admin"
                                        value="2"
                                        checked={this.state.selectedOption === "2"}
                                        onChange={this.handleOptionChange}
                                        className="form-check-input"
                                    />
                                    Admin
                                    </label>
                                    </div>
                                        </div>
                                    <Form.Group controlId="Password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="Password"
                                            required
                                            placeholder="xxxxxxxxxx"

                                        />
                                    </Form.Group>
                                    <Form.Group controlId="ConfrimPassword">
                                        <Form.Label>Confrim Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="confrimPassword"
                                            required
                                            placeholder="xxxxxxxxxx"

                                        />
                                    
                                    </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Update User</Button>
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