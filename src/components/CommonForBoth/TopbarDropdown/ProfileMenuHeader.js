import React, { useState, useEffect } from "react"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import { useSelector} from "react-redux"
import { Link } from "react-router-dom"

// users
// import user4 from "../../../assets/images/users/avatar-4.jpg"
// import hand from "../../../assets/images/hand.PNG";
import polygon from "../../../assets/images/Polygon.png";
import logout from "../../../assets/images/logout.svg";
import drop_arrow from "../../../assets/images/drop_arrow.svg";
import { loginData } from "../../../pages/Authentication/store/apiServices";

const ProfileMenuHeader = props => {
  const [menu, setMenu] = useState(false)
  // const [userImg, setUserImg] = useState("");
  const [userData, setUserData] = useState();
  const reduxData = useSelector(user => user)
  const user = reduxData?.userupdate?.user?.user
  
  useEffect(() => {
    if(user){
      setUserData(user)
    } else {
      let loginDetail = loginData()
      setUserData(loginDetail)
    }
  }, [props.success, menu, user])

  
  // const getUserimg = async(url) => {
  //   // fetch(url, {
  //   //   credentials: 'include',
  //   //   method: 'POST',
  //   //   headers: {'Content-Type': 'application/json', },
  //   //   }).then(
  //   //     result => {
  //   //       setUserImg(result)
  //   //     })
  //   //     .catch((error) => {
  //   //     });
  //     try{
  //       let img = await(url)
  //     }catch(error) {
  //     }
  // }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect d-flex align-items-center user-dropdown"
          id="page-header-user-dropdown"
          tag="button"
        >
         {/* {userImg? (<img
            className="rounded-circle header-profile-user userImg"
            src={userImg}
            alt="Header Avatar"
          />) :  */}
          {/* ( */}
            <p className="rounded-circle header-profile-user"  alt="Header Avatar">
            <span className="userAvtar">
              {userData?.first_name?.charAt(0)?.toUpperCase()}
              {userData?.last_name?.charAt(0)?.toUpperCase()}
              </span>
          </p>
          {/* )} */}
          <span className="d-none d-xl-inline-block ms-1 fw-medium font-size-15">
            <img           
            src={drop_arrow}     
            className="arrow"      
          /></span>{" "}  
        </DropdownToggle>
        <h6 className='mb-0 d-flex align-items-center sd-name' style={{"textTransform": "capitalize"}}>
          Hi {" "} {userData?.first_name} {" "}{userData?.last_name}
          {/* {userData?.first_name? userData?.first_name?.charAt(0)?.toUpperCase() + userData?.first_name?.slice(1).toLowerCase() : ""} 
          {' '}{userData?.last_name? userData?.last_name?.charAt(0)?.toUpperCase() + userData?.last_name?.slice(1).toLowerCase() : ""} */}
        </h6>

        <DropdownMenu className="dropdown-menu-end" style={{ margin: 0 }}>
          <DropdownItem /*tag="a"*/  className="profile-header">
            <Link to={userData?.role === "User"? "/my-profile" : "/admin/my-profile"} className="dropdown-item">
            {/* <Link to="/" className="dropdown-item"> */}
              {" "}   
              My Account{" "}
              <img src={polygon} />
            </Link> 
          </DropdownItem>

          <div className="profile-center">
          {/* {userData?.role != "user"? 
          <DropdownItem /*tag="a" >    
            {/* <Link to="/user-management" className="dropdown-item">        */}
            {/* <Link to="/" className="dropdown-item">       
             User Management 
            </Link>
          </DropdownItem> :  */}
          {/* <DropdownItem /* tag="a" >     */}
            {/* <Link to="/user-account-detail" className="dropdown-item">        */}
            {/* <Link to="/user-account-detail" className="dropdown-item">       
              My Profile 
            </Link>
          </DropdownItem> } */}
          <DropdownItem /* tag="a"*/ >   
            <Link to="/change-password" className="dropdown-item">       
              Change Password     
            </Link>      
          </DropdownItem>
          {/* <DropdownItem  tag="a">   */}
            {/* <Link to="/security-settings" className="dropdown-item">        */}
            {/* <Link to="/" className="dropdown-item">       
              Security Settings    
            </Link>  */}
          {/* </DropdownItem> */}
          </div>         
          <div className="profile-header">
            <Link to={userData?.role === "User"? "/logout" : "/admin/logout"} className="dropdown-item p-0 d-flex align-items-center">
            <img           
              src={logout}           
            />
              <span > Log Out here</span>
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

 

export default ProfileMenuHeader
