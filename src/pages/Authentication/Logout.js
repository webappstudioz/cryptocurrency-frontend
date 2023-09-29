import PropTypes from 'prop-types'
import React, { useEffect } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { loginSuccess, logoutUser, getServiceName, removeUserDetail } from "../../store/actions"
import { useDispatch } from "react-redux"
import { userNotUpdated } from '../../store/auth/userdetails/actions'
import { removeServices } from '../../store/services/actions'
import { removeNotifications } from '../../store/auth/notification/action'
import { removeCards } from '../../store/savedcards/action'
import { removeSupportTickets } from '../../store/supportTickets/actions'
import { removeFetchedServices } from '../../store/syncedServices/action'
import { osListFetched } from '../../store/osInstallList/action'
const Logout = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loginSuccess())
    dispatch(userNotUpdated())
    dispatch(removeNotifications())
    dispatch(removeServices())
    dispatch(removeCards())
    dispatch(removeUserDetail())
    dispatch(removeSupportTickets())
    dispatch(removeFetchedServices())
    dispatch(getServiceName())
    dispatch(osListFetched())
    props.logoutUser(props.history)
  },[])

  return <></>
}

Logout.propTypes = {
  history: PropTypes.object,
  logoutUser: PropTypes.func
}

export default withRouter(connect(null, { logoutUser })(Logout))
