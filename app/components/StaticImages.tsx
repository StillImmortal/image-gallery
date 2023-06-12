"use client"

import { FC, useEffect, useState } from "react"
import ImageWrapper from "./ImageWrapper"
import ImageUploader from "./ImageUploader"
import { Image } from "../api/images/route"
import { v4 as uuidv4 } from "uuid";

interface StaticImagesProps {
  data: Image[]
}

const StaticImages: FC<StaticImagesProps> = ({ data }) => {
  const [images, setImages] = useState<Image[]>(data)

  useEffect(() => {
    const getImages = async () => {
      const res = await fetch("http://localhost:3000/api/images")
      const imageData = await res.json()
      console.log(imageData)
      setImages(imageData)
    }
    getImages()
  }, [])

  return (
    <>
      <div className="mb-12">
        <ImageUploader />
      </div>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {images && images.map((image, index) => (
          <ImageWrapper 
            key={uuidv4()} 
            src={image.src} 
          />
        ))}
      </div>
    </>
  )
}

export default StaticImages