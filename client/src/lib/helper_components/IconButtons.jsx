import { Badge, Grow, IconButton, Tooltip } from '@mui/material'
import React, { memo } from 'react'

const IconButtonsComp = ({ title, Iccon, onClick, value, data, isClicked}) => {
  return (
    <Tooltip
      title={title}
      placement="right"
      arrow
      aria-label={title}
      TransitionComponent={Grow}
    >
      <IconButton sx={isClicked ? { bgcolor: '#eff3f6' } : {}} onClick={() => onClick(data)}>

        {value ? <Badge badgeContent={value} color='error'> {<Iccon />}</Badge> : <Iccon />}
      </IconButton>
    </Tooltip>
  )
}

export default memo(IconButtonsComp)