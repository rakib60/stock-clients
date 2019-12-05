import React, {Component} from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Row, Button } from  'react-bootstrap'
// import * as _ from "lodash";
import stockApi from '../../api/StockApi'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';



export class DetailsVoucherModal extends Component {
    constructor(props) {
        super(props);
        this.state = {voucher: []}
        this.refreshList = this.refreshList.bind(this)
    }

    componentDidMount() {
        const { match: { params } } = this.props;
        this.voucher_subtitle = "Voucher ID: " + params.id;
        this.refreshList(params.id)
    }

    async refreshList (id) {
        const response =  await stockApi.get(`/voucher/${id}`);
        this.setState({voucher: response.data})

    }

    print = () => {
        const printableElements = document.getElementById('printme').innerHTML;
        const orderHtml = '<html><head><title></title><style>#printButton{display:none} #center{text-align:center}</style></head><body>' + printableElements + '</body></html>'
        const oldPage = document.body.innerHTML;
        document.body.innerHTML = orderHtml;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldPage;
       

    }

    goVoucher = () => {
        this.props.history.push("/voucher/")
    }


    render() {
        // this.imageUrl = `http://localhost:3001/voucher/${this.props.vid}/${this.props.vfile}` 
        // console.log(this.imageUrl,'dddddddddddimage')
        const {stockIns}=this.state.voucher
        // if(stockIns) {
        //     var data = stockIns;
        // }
        console.log(stockIns,'sdfslfjsfl')
        return(
            
            <div id='printme'>
            <br/>
            <Row className="col-md-9" >
            <br/>
            <Card className="col-md-12">
            <CardHeader id="center"
              title="Voucher Details"
              subheader={this.voucher_subtitle}
              
            />
            <CardContent>
                Voucher number:   {this.state.voucher.number}
              {/* <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to cook together with your
                guests. Add 1 cup of frozen peas along with the mussels, if you like.
              </Typography> */}
              <Table className="mt-4" >
                  <TableHead>
                      <TableRow>
                          <TableCell>Stock-In-ID</TableCell>
                          <TableCell>Product ID</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell>Product Description</TableCell>
                          <TableCell>Quantity</TableCell>
                      </TableRow>
                 </TableHead> 

                 <TableBody>
                     {/* {stockIns.map(stock => (
                        <TableRow key={stock.id}>
                        <TableCell>{stock.id}</TableCell>
                            <TableCell>{stock.productId}</TableCell>
                            <TableCell>{stock.product.name}</TableCell>
                            <TableCell>{stock.product.description}</TableCell>
                            <TableCell>{stock.inQuantity}</TableCell>

                        </TableRow>
                    ))} */}

                 </TableBody>

              </Table>
            </CardContent>

          </Card>
         

        </Row>
        <br/>
        <Row className="col-md-9">
            <Button  variant="primary" id="printButton" onClick={() => this.print()}>Print</Button>
            <Button  className="offset-10" variant="secondary" id="printButton" onClick={() => this.goVoucher()}>Back</Button> 
        </Row>
        </div>
        )
        
    }
}