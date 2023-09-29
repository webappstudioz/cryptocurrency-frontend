import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getBandwidth } from './store/apiService';
import BandwidthChart from '../AllCharts/apex/BandwidthChart';
function BandwidthChartContainer() {
    const params = useParams();

    useEffect(() => {
        let config = {
            params: {
                commands: 'lw_bandwidth',
                whmcs_hostingid: params.id
            }
        }
        getBandwidth(config).then(res => {
        }).catch(err => {
        })
    }, [])
    return (
        <>
            <BandwidthChart />  
        </>
    )
}

export default BandwidthChartContainer