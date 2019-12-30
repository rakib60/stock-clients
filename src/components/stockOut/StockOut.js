import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {AddStockOutModal} from './AddStockOutModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

export class StockOut extends Component {


    constructor(props) {
        super(props);
        this.state = {stockOuts: [], addModalShow: false, editModalShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/stock-out');
        this.setState({stockOuts: response.data})

    }
    
    goRequisition = () => {
        this.props.history.push("/requisition/")
    }

    getData(data) {
        this.setState({stockOuts: data})
    }

    async deleteFile(pId) {  
        try {
                await stockApi.delete(`/stock-out/${pId}`) 
            } catch(error) {
                alert('TO Do Test')
            }
        
        const getData = await stockApi.get('/stock-out');

        this.setState({ alert: null, stockOuts: getData.data});
    }

    async delStockOut(pId) {
        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(pId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete StockOut
            </SweetAlert>
          );
      
        this.setState({
        alert: getAlert()
        });

    }

    hideAlert() {
        this.setState({
          alert: null
        });
      }


    render() {

        return (
           <Row>
            <Col>
            <br/>
            <AddStockOutModal/>
                <br/>
                <button  className="offset-10 btn btn-dark"  onClick={() => this.goRequisition()}>Back To Requistion</button>
            </Col>
            </Row>
        )
    }
}

