import { Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Product() {
    const {prodId} = useParams()
    const [product, setProduct] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchProduct = async() => {
        setLoading(true)
        try {
          const res = await fetch(`/api/product/${prodId}`)
          const data = await res.json()
          if(res.ok){
            setProduct(data)
            setLoading(false)
          }
          else{
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          return toast.error(error.message)
        }
      }
      fetchProduct()
    }, [prodId])
  
    if(loading){
      return (
        <div className='w-full p-4 min-h-screen flex justify-center items-center'>
          <Spinner size={'xl'} />
          <p className='ml-2 text-2xl'>Loading...</p>
        </div>
      )
    }

    if(!loading && !product){
      return (
        <div className='w-full p-4 min-h-screen flex justify-center items-center'>
          <p className='mb-2 text-2xl'>No product found!</p>
        </div>
      )
    }

    return (
    <div className='min-h-screen w-full p-4 max-w-lg sm:max-w-3xl md:max-w-4xl lg:max-w-5xl'>
      <h2>{product.name}</h2>
      {product && product.images.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={product.name} />
      ))}
    </div>
  )
}
