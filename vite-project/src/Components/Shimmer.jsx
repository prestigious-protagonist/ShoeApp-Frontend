import React from 'react'
const Card = () => {
    return (
        <div className="animate-pulse p-4 w-[300px]  rounded-lg bg-white">
      {/* Gray shimmer for the image */}
      <div className="h-[250px] w-[260px] bg-gray-300 rounded-lg"></div>

      {/* Shimmer lines for text */}
      <div className="mt-4 px-2">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>

      {/* Shimmer for price */}
      <div className="mt-3 px-2">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
      );
}
const Shimmer = () => {
  return (<div className='flex flex-wrap  '>
    <Card />
    <Card />
    
    <Card />
    <Card />
    
    <Card />
    <Card />
    
    <Card />
    <Card />
    <Card />
    <Card />
    </div>
  )
}

export default Shimmer