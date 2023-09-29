import React, { useEffect, useMemo, useState } from "react"
import { withRouter, Link, useHistory   } from "react-router-dom";
const BuyProduct = props => {
      return (
        <div>
          <section className="rs-product-listing-section rs-product-section">
            <div className="rs-product-left">
              <div className="rs-product-tab">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-europe-tab" data-bs-toggle="pill" data-bs-target="#pills-europe" type="button" role="tab" aria-controls="pills-europe" aria-selected="true">Europe</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-America-tab" data-bs-toggle="pill" data-bs-target="#pills-America" type="button" role="tab" aria-controls="pills-America" aria-selected="false">America</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-mumbai-tab" data-bs-toggle="pill" data-bs-target="#pills-mumbai" type="button" role="tab" aria-controls="pills-mumbai" aria-selected="false">Mumbai,IN</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-singapore-tab" data-bs-toggle="pill" data-bs-target="#pills-singapore" type="button" role="tab" aria-controls="pills-singapore" aria-selected="false">Singapore</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-hong-tab" data-bs-toggle="pill" data-bs-target="#pills-hong" type="button" role="tab" aria-controls="pills-hong" aria-selected="false">Hong Kong</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-japan-tab" data-bs-toggle="pill" data-bs-target="#pills-japan" type="button" role="tab" aria-controls="pills-japan" aria-selected="false">Japan</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-sydney-tab" data-bs-toggle="pill" data-bs-target="#pills-sydney" type="button" role="tab" aria-controls="pills-sydney" aria-selected="false">Sydney</button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-europe" role="tabpanel" aria-labelledby="pills-europe-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <Link to="/add-to-cart">Buy Now</Link>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <Link to="/add-to-cart1">Buy Now1</Link>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-America" role="tabpanel" aria-labelledby="pills-America-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-mumbai" role="tabpanel" aria-labelledby="pills-mumbai-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-singapore" role="tabpanel" aria-labelledby="pills-singapore-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-hong" role="tabpanel" aria-labelledby="pills-hong-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-japan" role="tabpanel" aria-labelledby="pills-japan-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-sydney" role="tabpanel" aria-labelledby="pills-sydney-tab" tabIndex={0}>
                    <div className="rs-product-left-contentbar">
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                      <div className="rs-product-left-box">
                        <h5>1x Intel Quad-Core Xeon E3-1230</h5>
                        <div className="rs-product-left-text-price">
                          <ul>
                            <li><p>CPU</p><span>1x 4 cores 3.20GHz</span></li>					
                            <li><p>HP DL120 G7</p><span>4 LFF bays</span></li>					
                            <li><p>RAM</p><span>16GB DDR3</span></li>					
                            <li><p>HDD</p><span>2x2TB SATA</span></li>					
                            <li><p>TRAFFIC</p><span>30 TB</span></li>			
                          </ul>
                        </div>
                        <div className="rs-product-left-price-btn">
                          <a href="#">Buy Now</a>
                        </div>
                        <div className="rs-product-left-price-content">
                          <p>* One-off €49.00 setup fee applies.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rs-product-table-page">
                <div className="rs-product-table-no-page">
                  <p>1-8 of 25</p>
                </div>
                <div className="rs-product-table-page-box">
                  <div className="rs-product-table-per-page">
                    <p>Rows per page:</p>
                    <select className="form-select" aria-label="Default select example">
                      <option>1</option>
                      <option value={1}>2</option>
                      <option value={2}>3</option>
                      <option value={3}>4</option>
                      <option value={4}>5</option>
                      <option value={5}>6</option>
                      <option value={6}>7</option>
                      <option value={7} selected>8</option>
                      <option value={8}>9</option>
                      <option value={9}>10</option>
                      <option value={10}>11</option>
                      <option value={11}>12</option>
                      <option value={12}>13</option>
                      <option value={13}>14</option>
                      <option value={14}>15</option>
                      <option value={15}>16</option>
                      <option value={16}>17</option>
                      <option value={17}>18</option>
                      <option value={18}>19</option>
                      <option value={19}>20</option>
                      <option value={20}>21</option>
                      <option value={21}>22</option>
                      <option value={22}>23</option>
                      <option value={23}>24</option>
                      <option value={24}>25</option>
                    </select>
                  </div>
                  <div className="rs-product-table-page-list">
                    <ul>
                      <li><a href="#"><i className="feather icon-chevron-left" /></a></li>
                      <li>1</li>
                      <li>/</li>
                      <li>4</li>
                      <li><a href="#"><i className="feather icon-chevron-right" /></a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    export default withRouter(BuyProduct);