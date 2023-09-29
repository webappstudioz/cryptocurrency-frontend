import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BarChart from '../AllCharts/apex/barchart';
import { getDataTraffic } from './store/apiService';

function DataTraffic() {
    
    const params = useParams();

    useEffect(() => {
        let config = {
            params: {
                commands: 'lw_datatraffic',
                whmcs_hostingid: params.id
            }
        }
        getDataTraffic(config).then(res => {
        }).catch(err => {
        })
    }, [])

    return (
        <>
            <BarChart />
        </>
    )
}

export default DataTraffic