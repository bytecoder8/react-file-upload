import React from 'react'
import PropTypes from 'prop-types'

const Message = ({msg, type = 'primary'}) => {
    return(
        <div className={`alert alert-dismissible alert-${type}`} role="alert">
            {msg}
        </div>
    )
}

Message.propTypes = {
    msg: PropTypes.string.isRequired
}

export default Message
