import React, { useEffect } from 'react';
import ErrorImg from '../../assets/images/404-error.png'
    const PageNotFound = () => {
        
    useEffect(() =>{
    },[])
        return(
            <div className="authentication-bg page-not-found">
                <img src={ErrorImg} />
                <h3>Page not found</h3>
            </div>
        )
    }

    export default PageNotFound;