import React from 'react'
import { Card, CardBody, Input } from "reactstrap"
import serverdown from "../../assets/images/server-down.png"


function ServiceNotFound() {
  return (
      <div className='service-not-found'>
          <Card>
              <CardBody>
                  <img src ={serverdown}></img>
                    Service not active
              </CardBody> 
          </Card>
          
      
      </div>
  )
}

export default ServiceNotFound