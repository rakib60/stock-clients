import { CSVLink } from "react-csv";
import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from '@material-ui/core/Tooltip';

import stockApi from '../../api/StockApi'


export default class VoucherDownloads extends Component {
    constructor(props) {
        super(props);
        this.state = {voucher: []}

    }
    componentDidMount() {
        this.refreshList()
    }

    async refreshList () {
        const response =  await stockApi.get(`/voucher/`);
        this.setState({voucher: response.data})
    }

    render() {
        const {voucher} = this.state;

        const headers = [
            { label: "ID", key: "id" },
            { label: "Number", key: "number" },
            { label: "Status", key: "submittedStatus"}
          ];
        
        const csvData = []
        for (let i = 0; i < voucher.length; i++ ) {
            var submittedStatus = voucher[i] && voucher[i].status === 0 ? 'Pending' : 'Approved'
            var data = voucher[i]
            let {id, number} = data;
            csvData.push({
                id,
                number,
                submittedStatus
            })
          }

      return (
        <div>
          <CSVLink 
            data={csvData}
            headers={headers}
            filename={"Voucher List.csv"}>
            <Button variant="secondarys"> 
                <Tooltip title="Download" aria-label="Download">
                    <CloudDownloadIcon/>
                </Tooltip></Button>
          </CSVLink>
        </div>
      );
    }
  }