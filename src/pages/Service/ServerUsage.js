import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import TextLoader from "../../components/textLoader";
import BarChart from "../AllCharts/apex/barchart";
import BandwidthChart from "../AllCharts/apex/BandwidthChart";

const ServerUsage = ({ barChartData, bandwidthChartData, barchartLoader, bandwidthLoader, product} = props) => {
  const [loading, setLoading] = useState(true);
  const [chartLoader, setchartLoader] = useState(true);

  useEffect(() => {
    if(barchartLoader === false && bandwidthLoader === false){
      setchartLoader(false)
      setLoading(false)
    }
  },[bandwidthLoader, barchartLoader])

  return (
    <div className="tab_content graphcontain">
      <div className="row">
        <div className="col-md-12">
              <div
                className={
                  chartLoader
                    ? "chartcontainer overlayerloader"
                    : "chartcontainer"
                }
              >
                {
                  <div className="Graphcontainer">
                    <Card>
                      <CardBody>
                        <BarChart 
                          barChartData={barChartData}
                          product={product}
                        />
                      </CardBody>
                    </Card>
                    {barChartData && (
                      <div className="barDetails">
                        <span className="head">
                          Total in / out <span className="dash-gap">-</span>
                          <span className="details">
                            {barChartData?.total_incommings} /{" "}
                            {barChartData?.total_outgoings}
                          </span>
                        </span>
                        <span className="head">
                          Average in / out per day{" "}
                          <span className="dash-gap">-</span>
                          <span className="details">
                            {barChartData?.average_incommings} /{" "}
                            {barChartData?.average_outgoings}
                          </span>
                        </span>
                        <span className="head">
                          Expected in / out <span className="dash-gap">-</span>
                          <span className="details">
                            {barChartData?.expected_incomming}/
                            {barChartData?.expected_outgoings}
                          </span>
                        </span>
                        <span className="head">
                          Peak<span className="dash-gap">-</span>
                          <span className="details">{barChartData?.peak}</span>
                        </span>
                      </div>
                    )}
                  </div>
                }
                {
                  <div className="Graphcontainer">
                    <Card>
                      <CardBody>
                        <BandwidthChart
                          bandwidthChartData={bandwidthChartData}
                          product={product}
                        />
                      </CardBody>
                    </Card>
                    {bandwidthChartData && (
                      <div className="barDetails">
                        <span className="head">
                          Average Incoming <span className="dash-gap">-</span>
                          <span className="details">
                            {bandwidthChartData?.average_incommings}
                          </span>
                        </span>
                        <span className="head">
                          Average Outgoing <span className="dash-gap">-</span>
                          <span className="details">
                            {" "}
                            {bandwidthChartData?.average_outgoings}
                          </span>
                        </span>
                        <span className="head">
                          95<sup>th </sup> Percentile
                          <span className="dash-gap">-</span>
                          <span className="details">{bandwidthChartData?.[95]}</span>
                        </span>
                      </div>
                    )}
                  </div>
                }
              </div>
              <TextLoader loading={loading} loader={chartLoader}/>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ServerUsage);
