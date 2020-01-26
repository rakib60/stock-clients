import React, {Component} from 'react'
import ReactToPrint from 'react-to-print';
import stockApi from '../../api/StockApi'
import {Button} from 'react-bootstrap'
import PrintIcon from '@material-ui/icons/Print';
import Tooltip from '@material-ui/core/Tooltip';
class ProductToPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {products: []}
    }

    componentDidMount() {
        this.refreshList()
    }

    async refreshList () {
        const response =  await stockApi.get('/products');
        this.setState({products: response.data})

    }

    render() {
        const {products} = this.state;
      return (
        <div className="container">
            <div className="col-md-12">
            <h3 style={{textAlign: 'center', margin:'30px auto'}}>Product List</h3>
                    <table style={{border: '1px solid black', width: '100%', margin:'50px auto'}}>
            { 
                      <thead style={{border: '1px solid black'}}>
                      <th>ProductID</th>
                      <th>ProductName</th>
                      <th>ProductDesc</th>
                      <th>ImpCode</th>
                      <th>CategoryName</th>
                    </thead>
        
        }

          <tbody>
    
            { products.map((Product, index) => (
                    <tr style={{border: '1px solid black'}} key={index}>
                    <td>{Product.id}</td>
                    <td>{Product.name}</td>
                    <td>{Product.description}</td>
                    <td>{Product.impCode ? Product.impCode : '-'}</td>
                    <td>{Product.category.name}</td>
                    </tr>
                ))}                 
          </tbody>
        </table>
            </div>
        </div>
      );
    }
  }
   

  class ProductListPrint extends React.Component {
    render() {
      return (
        <div className="col-12" style={{textAlign: 'end'}}>Print All
          <ReactToPrint
            trigger={() => <Button 
                variant="secondarys" 
                >
              <Tooltip title="Print All" aria-label="Print All">
                    <PrintIcon/>
                </Tooltip>
            </Button>}
            content={() => this.componentRef}
          />
          <div style={{display: 'none'}}><ProductToPrint ref={el => (this.componentRef = el)} /></div>

        </div>
      );
    }
  }

  export default ProductListPrint;