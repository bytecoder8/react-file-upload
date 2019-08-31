import React from 'react'
import PropTypes from 'prop-types'

const Progress = ({ percent }) => {
    return(
        <div className="progress">{ percent }</div>
    )
}

Progress.propTypes = {
    percent: PropTypes.number.isRequired
}

export default Progress
