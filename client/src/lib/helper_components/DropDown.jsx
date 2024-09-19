import React from 'react'

const DropDown = ({content=[], handleListClick}) => {
  return (
    <ul className=' absolute top-10 bg-yellow-200 w-28 right-4 flex flex-col rounded-md'>
      {
        content.map((list)=>(
          <li onClick={()=>handleListClick(list)} className=' py-1 px-3'>{list}</li>
        ))
      }
    </ul>
  )
}
 
export default DropDown