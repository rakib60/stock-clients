import React, {Component} from 'react'
import { Modal, Button, Row, Col } from  'react-bootstrap'
import Iframe from 'react-iframe'




export class DetailsVoucherModal extends Component {
    constructor(props) {
        super(props);
        this.state = {categories: []}
    }


    render() {
        this.imageUrl = `http://localhost:3001/voucher/${this.props.vid}/${this.props.vfile}` 
        console.log(this.imageUrl,'dddddddddddimage')
        return(
            <Modal 
                    {...this.props}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Voucher Details 
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            
                            <Row>
                                <Col sm={3} style={{height: '500px'}}>
                                    <div>
                                    <h6>Voucher ID:</h6>  
                                    <p>{this.props.vid}</p>
                                    </div>
                                    <div>
                                    <h6>Voucher Number:</h6>  
                                    <p>{this.props.vnumber}</p>
                                    </div>
                                    <div>
                                    <h6>Voucher File name:</h6>  
                                    <p>{this.props.vfile}</p>
                                    </div>

                                </Col>
                                <Col sm={9}>

                                    <Iframe
                                    url={this.imageUrl}
                                    width="100%"
                                    height="100%"
                                    display="initial"
                                    position="relative"
                                    />

                                </Col>
                            </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
            </Modal>
        )
    }
}