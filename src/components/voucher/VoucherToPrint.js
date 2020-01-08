import React, {Component} from 'react'
import ReactToPrint from 'react-to-print';
import stockApi from '../../api/StockApi'
import {Button} from 'react-bootstrap'
import PrintIcon from '@material-ui/icons/Print';
import Tooltip from '@material-ui/core/Tooltip';

const Status = {
    pending: 0,
    approved:1
}
class VoucherToPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {voucher: []}
    }

    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get(`/voucher/?status=${Status.approved}`);
        this.setState({voucher: response.data})

    }

    render() {
        const {voucher} = this.state;
      return (
        <div className="container">
            <div className="col-md-12">
            <h3 style={{textAlign: 'center', margin:'30px auto'}}>Voucher Approved List</h3>
                    <table style={{border: '1px solid black', width: '100%', margin:'50px auto'}}>
            { 
                      <thead style={{border: '1px solid black'}}>
                      <th>VoucherID</th>
                      <th>VoucherNumber</th>

                    </thead>
        
        }

          <tbody>
              
            {   voucher.map((voucher, index) => (
                    <tr style={{border: '1px solid black'}} key={index}>
                    <td>{voucher.id}</td>
                    <td>{voucher.number}</td>
                    </tr>
                ))}            
                       
            

          </tbody>
        </table>
            </div>
        </div>
      );
    }
  }
   

  class VoucherApprovedListPrint extends React.Component {
    render() {
      return (
        <div>
          <ReactToPrint
            // trigger={() => <a className="btn btn-secondary" href="#">Print All</a>}
            trigger={() => <Button 
                variant="successs" 
                >
                <Tooltip title="Approved List" aria-label="Approved List">
                    <PrintIcon/>
                </Tooltip>
                
                </Button>

            }
            content={() => this.componentRef}
          />
          <div style={{display: 'none'}}><VoucherToPrint ref={el => (this.componentRef = el)} /></div>

        </div>
      );
    }
  }

  export default VoucherApprovedListPrint;