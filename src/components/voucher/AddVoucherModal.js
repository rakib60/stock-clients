import React, {Component} from 'react'
import { Modal, Button, Row, Col, Form } from  'react-bootstrap'
import stockApi from '../../api/StockApi'

import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
export class AddVoucherModal extends Component {
    constructor(props) {
        super(props)
        this.state = { snackBarOpen: false, snackBarMsg: '', selectedFile: null}
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this)
       
    }


    snackbarClose = (event) => {
        this.setState({snackBarOpen:false});
    }


    onChangeHandler(event) {
        event.preventDefault()
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
          })
    }

    async handleSubmit(event) {
        event.preventDefault()
        var data = new FormData()

        data.append('id',null)
        data.append('file',this.state.selectedFile);
        data.append('number', event.target.VoucherNumber.value)

        try {
            const response = await stockApi.post('/voucher', data);
            this.setState({snackBarOpen: true, snackBarMsg: response.data})
            const getData = await stockApi.get('/voucher');
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
                        Add Voucher
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        
                            <Row>
                                <Col sm={6}>
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Group controlId="VoucherNumber">
                                            <Form.Label>VoucherNumber</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="VoucherNumber"
                                                required
                                                placeholder="Voucher Number"
                                                autoComplete="off"

                                            />
                                        </Form.Group>
                                        <Form.Group controlId="VoucherFile">
                                            <Form.Label>VoucherFile</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="VoucherFile"
                                                required
                                                placeholder="Voucher file"
                                                autoComplete="off"
                                                encType="multipart/form-data"
                                                onChange={this.onChangeHandler}

                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit">Add Voucher</Button>
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