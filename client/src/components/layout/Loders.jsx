import React, { memo } from 'react';
import {ScaleLoader} from 'react-spinners'

const Loders = () => {
  return (
    <div className=' loading'>
        <ScaleLoader color="#8975f0cf" />
    </div>
  )
}

export default memo(Loders)

