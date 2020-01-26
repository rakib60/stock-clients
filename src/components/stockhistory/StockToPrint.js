import React, {Component} from 'react'
import ReactToPrint from 'react-to-print';
import stockApi from '../../api/StockApi'
import * as _ from "lodash";

import {Button} from 'react-bootstrap'
import PrintIcon from '@material-ui/icons/Print';
import Tooltip from '@material-ui/core/Tooltip';

class StockToPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {stocks: []}
    }

    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/stocks');
        this.setState({stocks: response.data})

    }

    render() {
        const {stocks} = this.state;
      return (
        <div className="container">
            <div className="col-md-12">
            <h3 style={{textAlign: 'center', margin:'30px auto'}}>Stocks List</h3>
            <table style={{border: '1px solid black', width: '100%', margin:'50px auto'}}>
            { 
            <thead style={{border: '1px solid black'}}>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Category</th>
                <th>Product Desc.</th>
                <th>InQuantity</th>
                <th>OutQuantity</th>
                <th>Current Quantity</th>
            </thead>
        
        }
          <tbody>
            {
                stocks.map(product => {

                    if ( !_.isEmpty(product.stockOuts)) {
                        var iterator = product.stockOuts.values()
                            var totalOutQuantity = 0
                            for(let key of iterator ) {
                                totalOutQuantity += key.outQuantity
                            }
                        
                    }

                    if ( !_.isEmpty(product.stockIns)) {
                        var data = product.stockIns.values()
                            var totalInQuantity = 0
                            for(let key of data ) {
                                totalInQuantity += key.inQuantity
                            }
                        
                    }
                    return [
                        <td> {product.id}</td>,
                        <td>{product.name}</td>,
                        <td>{product.category.name}</td>,
                        <td>{product.description}</td>,
                        <td>{_.isEmpty(product.stockIns) ? 0: totalInQuantity}</td>,
                        <td>{ _.isEmpty(product.stockOuts) ? 0: totalOutQuantity}</td>,
                        <td>{(_.isEmpty(product.stockIns) ? 0: totalInQuantity )- (_.isEmpty(product.stockOuts) ? 0: totalOutQuantity)}</td>

                    ]
                })
            }          
          </tbody>
        </table>
            </div>
        </div>
      );
    }
  }
   

  class StockListPrint extends React.Component {
    render() {
      return (
        <div className="col-12" style={{textAlign: 'end'}}>Print All
          <ReactToPrint
            trigger={() => <Button
                variant="successs" 
                >
                <Tooltip title="Print List" aria-label="Print List">
                    <PrintIcon/>
                </Tooltip>
                
                </Button>

            }
            content={() => this.componentRef}
          />
          <div style={{ display: 'none'}}><StockToPrint ref={el => (this.componentRef = el)} /></div>

        </div>
      );
    }
  }

  export default StockListPrint;