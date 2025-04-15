import React from 'react'
import { useRouteError } from 'react-router-dom'
const Error = () => {
    const err = useRouteError()
    console.log(err)
  return (
    <div className='flex flex-col justify-center items-center h-[40vh] w-full'>
        <p className='text-3xl text-gray-500'>OOPS!</p>
        <p className='text-2xl text-gray-500 mt-2'>{err.status} : {err.statusText}</p>
        <p className='text-2xl text-gray-500 mt-2'>{err.data}</p>
        <p className='text-2xl text-gray-500 mt-2'>Something went wrong...</p>
    </div>

  )
}

export default Error