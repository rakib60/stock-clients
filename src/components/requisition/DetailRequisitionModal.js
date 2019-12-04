import React, {Component} from 'react'
import { Modal, Button, Row, Col } from  'react-bootstrap'
import Iframe from 'react-iframe'




export class DetailsRequisitionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {categories: []}
    }


    render() {

        this.imageUrl = `http://localhost:3001/requisition/${this.props.rid}/${this.props.rfile}` 
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
                        Requisition Details 
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            
                            <Row>
                                <Col sm={3} style={{height: '500px'}}>
                                    <div>
                                    <h6>Requisition ID:</h6>  
                                    <p>{this.props.rid}</p>
                                    </div>
                                    <div>
                                    <h6>Requisition Number:</h6>  
                                    <p>{this.props.rnumber}</p>
                                    </div>
                                    <div>
                                    <h6>Requisition File name:</h6>  
                                    <p>{this.props.rfile}</p>
                                    </div>
                                    <div>
                                    <h6>Location:</h6>  
                                    <p>{this.props.rloc}</p>
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