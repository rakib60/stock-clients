import React, {Component} from 'react'
import ReactToPrint from 'react-to-print';
import stockApi from '../../api/StockApi'
import {Button} from 'react-bootstrap'
import PrintDisabledIcon from '@material-ui/icons/PrintDisabled';
import Tooltip from '@material-ui/core/Tooltip';

const Status = {
    pending: 0,
    approved:1
}

class RequisitionToPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {requisition: []}
    }
    componentDidMount() {
        this.refreshList()
    }

    async refreshList () {
        const response =  await stockApi.get(`/requisition/?status=${Status.pending}`);
        console.log(response.data, 'data-tata')
        this.setState({requisition: response.data})

    }

    render() {
        const {requisition} = this.state;
      return (
        <div className="container">
            <div className="col-md-12">
            <h3 style={{textAlign: 'center', margin:'30px auto'}}>Requisition Pending List</h3>
                    <table style={{border: '1px solid black', width: '100%', margin:'50px auto'}}>
            { 
                      <thead style={{border: '1px solid black'}}>
                      <th>RequisitionID</th>
                      <th>RequisitionNumber</th>
                      <th>Location</th>

                    </thead>
        
        }

          <tbody>
              
            { requisition.map((requisition, index) => (
                    <tr style={{border: '1px solid black'}} key={index}>
                    <td>{requisition.id}</td>
                    <td>{requisition.number}</td>
                    <td>{requisition.location ? requisition.location: '-'}</td>
                    </tr>
                ))}            
                       
          </tbody>
        </table>
            </div>
        </div>
      );
    }
  }
   

  class RequisitionListPendingPrint extends React.Component {
    render() {
      return (
        <div>
          <ReactToPrint
            // trigger={() => <a className="btn btn-secondary" href="#">Print All</a>}
            trigger={() => <Button 
                variant="secondarys" 
               >
                    <Tooltip title="Pending List" aria-label="Pending List">
                    <PrintDisabledIcon/>
                    </Tooltip>
                    
                </Button>}
            content={() => this.componentRef}
          />
          <div style={{display: 'none'}}><RequisitionToPrint ref={el => (this.componentRef = el)} /></div>

        </div>
      );
    }
  }

  export default RequisitionListPendingPrint;