import React, { useEffect, useMemo, useState } from "react"
import { withRouter, Link, useHistory   } from "react-router-dom";
const AddToCart1 = props => {
      return (
        <div>
          <section className="rs-product-delivery-section rs-product-section">
            <div className="rs-product-left">
              <div className="rs-product-left-title">
                <div className="rs-product-left-link">
                  <a href="#"><i className="feather icon-arrow-left" />back to listing</a>
                </div>
                <h2>2x Intel Xeon DoDeca-Core Silver 4214 ✨</h2>
              </div>
              <div className="rs-product-left-contentbar">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="rs-product-left-box">
                      <h5>Delivery time</h5>
                      <p className="rs-product-left-content">5 business days *<br /><br />* Due to high demand and the impact of the current pandemic on the availability of server hardware, delivery times may differ and can’t always be guaranteed.</p>
                    </div>
                    <div className="rs-product-left-box">
                      <h5>Server Configurations</h5>
                      <ul>
                        <li><p>Chassis:</p><span>DELL R740XD (12XLFF)</span></li>
                        <li><p>CPU:</p><span>2x Intel Xeon Silver 4214</span></li>
                        <li><p>Cores:</p><span>24 Cores / 48 Threads @ 2.20GHz</span></li>
                        <li><p>RAM:</p><span>128GB DDR4</span></li>
                        <li><p>Storage:</p><span>1x 480GB SSD</span></li>
                        <li><p>Network:</p><span>1Gbps Duplex</span></li>
                        <li><p>Traffic:</p><span>30 TB</span></li>
                        <li><p>Location:</p><span>Europe</span></li>
                      </ul>
                    </div>
                  </div>
                  <div className="offset-lg-1 col-lg-4">
                    <div className="rs-product-left-box rs-product-left-box-second">
                      <h5><small>Incl. taxes</small></h5>
                      <h5>Monthly Total</h5>
                      <div className="rs-product-left-price">
                        <h4>€279</h4>
                        <h5>€379.45</h5>
                      </div>
                      <div className="rs-product-left-text-price">
                        <ul>
                          <li><p>Setup Cost:</p><span>€279</span></li>					
                          <li><p>Taxes</p><span>€50.22</span></li>					
                        </ul>
                      </div>
                      <div className="rs-product-left-text-price">
                        <ul>
                          <li><p>Total (incl. taxes)</p><span className="rs-product-left-price-color">€329.22</span></li>
                        </ul>
                      </div>
                      <div className="rs-product-left-price-btn">
                        <a href="#">Add to Cart</a>
                      </div>
                      <div className="rs-product-left-price-content">
                        <p>Local taxes may apply</p>
                        <a href="#">Learn more</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-left-contentbar">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="rs-product-left-box rs-product-left-box-bill">
                      <h5>Choose Billing Cycle</h5>
                      <ul>
                        <li>Monthly<br />€55.28EUR</li>
                        <li>Quarterly<br />€52.52EUR</li>
                        <li>Semi-Annually<br />€49.76EUR</li>
                        <li>Semi-Annually<br />€49.76EUR</li>						
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-left-contentbar">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="rs-product-left-box rs-product-left-box-list">
                      <h5>Configurable Options</h5>
                      <div className="rs-product-left-box-inner">
                        <h6>Network Uplink</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>1 Gbps Duplex</option>
                          <option value={1}>10 Gbps Duplex</option>
                          <option value={2}>30 Gbps Duplex</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>Preferred Location</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>Frankfurt</option>
                          <option value={1}>Europe</option>
                          <option value={2}>Amsterdam</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>Operating System</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>CentOS7</option>
                          <option value={1}>Debian 10</option>
                          <option value={2}>Debian 11</option>
                          <option value={3}>Ubuntu 18.04</option>
                          <option value={4}>Ubuntu 20.04</option>
                          <option value={5}>VMWare vSphere ESXi 6.7</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>Traffic</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>30 TB Tier 1 Traffic</option>
                          <option value={1}>1 IPv4 €3.00EUR</option>
                          <option value={2}>2 IPv4 €6.00EUR</option>
                          <option value={3}>3 IPv4 €9.00EUR</option>
                          <option value={4}>4 IPv4 €12.00EUR</option>
                          <option value={5}>5 IPv4 €15.00EUR</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>RAM</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>128GB DDR4 RAM</option>
                          <option value={1}>64GB DDR4 RAM</option>
                          <option value={2}>32GB DDR4 RAM</option>
                        </select>
                      </div>	
                      <div className="rs-product-left-box-inner">
                        <h6>Additional IPs</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>None</option>
                          <option value={1}>1 IPv4 €3.00EUR</option>
                          <option value={2}>2 IPv4 €6.00EUR</option>
                          <option value={3}>3 IPv4 €9.00EUR</option>
                          <option value={4}>4 IPv4 €12.00EUR</option>
                          <option value={5}>5 IPv4 €15.00EUR</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>Disk</h6>
                        <div className="rs-product-left-box-select">
                          <h4>HDD</h4>
                          <select className="form-select rs-product-left-select-first" aria-label="Default select example">
                            <option selected>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                          <select className="form-select" aria-label="Default select example">
                            <option selected>2TB SATA HDD (€3.19 each)</option>
                            <option value={1}>3TB SATA HDD (€4.49 each)</option>
                            <option value={2}>4TB SATA HDD (€5.59 each)</option>
                            <option value={3}>5TB SATA HDD (€6.29 each)</option>
                          </select>
                        </div>
                        <div className="rs-product-left-box-select">
                          <h4>SSD</h4>
                          <select className="form-select rs-product-left-select-first" aria-label="Default select example">
                            <option>0</option>
                            <option value={1} selected>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                          <select className="form-select" aria-label="Default select example">
                            <option>2TB SATA HDD (€3.19 each)</option>
                            <option value={1}>3TB SATA HDD (€4.49 each)</option>
                            <option value={2} selected>4TB SATA HDD (€5.59 each)</option>
                            <option value={3}>5TB SATA HDD (€6.29 each)</option>
                          </select>
                        </div>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>RAID Setup</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option>None</option>
                          <option value={1}>RAID</option>
                          <option value={2} selected>No RAID</option>
                        </select>
                      </div>
                      <div className="rs-product-left-box-inner">
                        <h6>RAID Type</h6>
                        <select className="form-select" aria-label="Default select example">
                          <option selected>None</option>
                          <option value={1}>RAID</option>
                          <option value={2}>No RAID</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-left-contentbar">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="rs-product-left-box rs-product-left-link">
                      <h5>Share your configuration</h5>
                      <div className="rs-product-left-link-btn">
                        <a href="#"><i className="feather icon-link " />copy link</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-left-contentbar">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="rs-product-left-link">
                      <a href="#"><i className="feather icon-arrow-left" />Back to listing</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }
export default withRouter(AddToCart1)