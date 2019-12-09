import React, {Component} from 'react'
import Image from 'react-bootstrap/Image'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Row, Button, Col } from  'react-bootstrap'
import * as _ from "lodash";
import stockApi from '../../api/StockApi'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ModalImage,{Lightbox} from "react-modal-image";

import Img from 'react-image'



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

    closeLightbox = () => {
        this.state.open = true;
      };
     


    render() {
        const { match: { params } } = this.props;

        console.log(params.id,'fskldfjdslf',this.state.voucher.file)
        this.imageUrl = `http://localhost:3001/voucher/${params.id}/${this.state.voucher.file}` 
        console.log(this.imageUrl,'dddddddddddimage')
        const {stockIns}=this.state.voucher
        console.log('render')
        console.log('sfksfljsl',stockIns)
        // console.log(stockIns,'sdfslfjsfl')
        var imageStyle = {
            maxWidth: 250,
            maxHeight: 250,
            float: 'right'
        }
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
            
            <Col xs={6}  style={imageStyle} id="printButton">
            <ModalImage
                small={this.imageUrl}
                large={this.imageUrl}
                alt={this.state.voucher.file}
                hideDownload={true}
                hideZoom={true}
                id="printButton"
            />
            <br/>
            <a href={this.imageUrl} target="_blank">Save Image</a>
            {
            this.state.open && (
                <Lightbox
                medium={this.imageUrl}
                crossorigin="anonymous"
                target="_blank"
                alt="Hello World!"
                onClose={this.closeLightbox}
                className={imageStyle}
                />
            )
            }
            </Col>
         

            <CardContent>
            Voucher number:   {this.state.voucher.number}

              <Table className="mt-4" >
                  <TableHead>
                      <TableRow>
                          <TableCell>Stock-IN-ID</TableCell>
                          <TableCell>Product ID</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell>Product Description</TableCell>
                          <TableCell>Quantity</TableCell>
                      </TableRow>
                 </TableHead> 

                {!_.isEmpty(stockIns) && stockIns?<TableBody>
                     
                     {stockIns.map(stock => (
                        <TableRow key={stock.id}>
                        <TableCell>{stock.id}</TableCell>
                            <TableCell>{stock.productId}</TableCell>
                            <TableCell>{stock.product.name}</TableCell>
                            <TableCell>{stock.product.description}</TableCell>
                            <TableCell>{stock.inQuantity}</TableCell>

                        </TableRow>
                    ))}
                 </TableBody>: <TableBody><TableRow><TableCell colSpan={5} style={{textAlign: "center"}}>This Voucher does not have any Product in Stock</TableCell></TableRow></TableBody>}

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