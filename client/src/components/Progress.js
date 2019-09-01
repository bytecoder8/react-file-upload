import React from 'react'
import PropTypes from 'prop-types'

const Progress = ({ percent }) => {
    return(
        <div className="progress">
            <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{width: `${percent}%`}}>{ percent }</div>
        </div>
    )
}

Progress.propTypes = {
    percent: PropTypes.number.isRequired
}

export default Progress
