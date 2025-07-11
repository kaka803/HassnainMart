import React from 'react'

const ProductCard = ({price, name, image}) => {
  return (
    <div className='w-45 h-62 group flex flex-col items-start justify-center cursor-pointer'>
      <div className=' w-[100%] h-45 bg-[rgb(245,245,245)] rounded-[3px] relative overflow-hidden'>
        <div className='flex justify-center items-center w-full h-full'>
          <img src={image} alt="keyboard" width={'70%'} />
        </div>
        <div className='absolute bottom-[-100%] w-full bg-black text-white h-8 flex justify-center items-center group-hover:bottom-0 transition-all duration-500'>
          Delete
        </div>
      </div>
      <div>
       <p className='text-[14px] font-medium font-[system-ui] mt-1'>{name}</p>
      </div>
      <div>
        <p className='text-[15px] font-medium font-[system-ui] text-[#db4444]'>{`${price}Rs`}</p>
      </div>
    </div>
  )
}

export default ProductCard
