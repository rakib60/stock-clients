import React, {Component} from 'react'
import ReactToPrint from 'react-to-print';
import {Button} from 'react-bootstrap';
import stockApi from '../../api/StockApi'
import PrintIcon from '@material-ui/icons/Print';
import Tooltip from '@material-ui/core/Tooltip';
class CategoryToPrint extends Component {
    constructor(props) {
        super(props);
        this.state = {categories: []}
    }

    componentDidMount() {
        this.refreshList()
    }

    async refreshList () {
        const response =  await stockApi.get('/categories');
        this.setState({categories: response.data})

    }

    render() {
        const {categories} = this.state;
      return (
        <div className="container">
            <div className="col-md-12">
            <h3 style={{textAlign: 'center', margin:'30px auto'}}>Category List</h3>
                    <table style={{border: '1px solid black', width: '100%', margin:'50px auto'}}>
            {
                <thead style={{border: '1px solid black'}}>
                    <th>CategoryID</th>
                    <th>CategoryName</th>
                </thead>
           }

          <tbody>
              {
                categories.map((category, index) => (
                    <tr style={{border: '1px solid black'}} key={index}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    </tr>
                ))              
            }

          </tbody>
        </table>
            </div>
        </div>
      );
    }
  }
   

  class CategoryListPrint extends React.Component {
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
          <div style={{display: 'none'}}><CategoryToPrint ref={el => (this.componentRef = el)} /></div>

        </div>
      );
    }
  }

  export default CategoryListPrint;