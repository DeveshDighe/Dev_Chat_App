import React, { memo } from 'react'
import { Helmet } from 'react-helmet-async'

const Title = ({title= 'Chat App', description = 'This is chat app dev chat'}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description}/>
    </Helmet>
  )
}

export default memo(Title)