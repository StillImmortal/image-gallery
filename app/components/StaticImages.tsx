"use client"

import { FC, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid";

import ImageWrapper from "./ImageWrapper"
import ImageUploader from "./ImageUploader"
import { Image } from "../api/images/route"

interface StaticImagesProps {
  data: Image[]
}

const StaticImages: FC<StaticImagesProps> = ({ data }) => {
  const [images, setImages] = useState<Image[]>([])
  const [urls, setUrls] = useState<Image[]>(data)

  useEffect(() => {
    const loadImages = async () => {
      const res = await fetch("http://localhost:3000/api/images", {cache: "reload"})
      const imageData: Image[] = await res.json()
      imageData.sort((a, b) => a.id < b.id ? 1 : -1)
      setImages(imageData)
    }
    loadImages()
  }, [urls])

  return (
    <>
      <div className="mb-12">
        <ImageUploader setUrls={setUrls} />
      </div>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {images && images.map((image) => (
          <ImageWrapper 
            key={uuidv4()} 
            src={image.src} 
            hash={image.hash}
          />
        ))}
      </div>
    </>
  )
}

export default StaticImages