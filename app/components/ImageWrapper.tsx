"use client"

import Image from "next/image"
import { FC, useState, useEffect, memo } from "react"
import { Blurhash } from "react-blurhash"
import { downloadImage } from "@/services/ImageService"
import { BsDownload } from "react-icons/bs"
import { AiOutlineClose } from "react-icons/ai"

interface ImageWrapperProps {
  src: string
  hash: string
}

const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

const ImageWrapper: FC<ImageWrapperProps> = memo(({src, hash}) => { 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean | null>(false)
  const url = `https://res.cloudinary.com/${cloud_name}//image/upload/v1684923287/image-gallery/${src}`

  const lockScroll = () => {
    document.body.classList.add("overflow-hidden")
  }

  const unlockScroll = () => {
    document.body.classList.remove("overflow-hidden")
  }

  const handleDownload = async () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      if (xhr.status === 200) {
        const arrayBuffer = xhr.response;
        const blob = new Blob([arrayBuffer], { type: "image/jpeg" });
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        downloadImage(file, src)
      }
    };
  
    xhr.send();
  }

  useEffect(() => {
    setLoading(true)
  }, [])

  return (
    <>
      <div className="grid-item">
        {loading && (
          <Blurhash
            className={`!absolute block transition-opacity !w-full !h-full`}
            hash={hash}
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        )}
        <div className="relative">
          <Image 
            className={`relative object-cover transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}
            src={url}
            alt="image"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
            width={1200}
            height={1200}
            onLoadingComplete={() => {
              setLoading(false)
            }}
          />
          {!loading && (
            <>
              {/* {isModalOpen && (
                <div className="fixed overflof-hidden flex justify-center items-center top-0 left-0 h-screen max-h-screen w-screen max-w-[100vw] p-2 bg-black/80 z-50">
                  <div className="relative flex justify-center items-center w-[800px] h-[600px]">
                    <div className="relative max-h-full max-w-full">
                      <Image 
                        className={`relative object-contain max-h-full max-w-full z-50`}
                        src={url}
                        alt="image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw" 
                        width={600}
                        height={600}
                      />
                      <button
                        onClick={() => {
                          setIsModalOpen(false)
                          unlockScroll()
                        }}
                        className="absolute top-2 right-2 bg-black/50 border rounded text-gray-300 border-gray-300 lg:text-gray-400 lg:border-gray-400 lg:hover:text-gray-300 lg:hover:border-gray-300 p-2 z-50"
                      >
                        <AiOutlineClose className="text-2xl" />
                      </button>
                      <button 
                        className={`absolute z-50 top-full translate-y-4 bg-[#111111] flex justify-center items-center gap-2 h-12 w-full border transition-colors rounded text-gray-300 border-gray-300`}
                        >
                        <p className='basis-[85%] text-md'>
                          Загрузить
                        </p>
                        <div className='basis-[15%] flex h-full justify-center items-center border-l w-f'>
                          <BsDownload className='text-2xl w-full' />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )} */}
              <div 
                // onClick={() => {
                //   setIsModalOpen(true)
                //   lockScroll()
                // }}
                className={`radial-gradient transition-opacity`}>
                <button 
                  // disabled={!isModalOpen}
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4 bg-black/70 p-2 transition-colors border rounded text-gray-300 border-gray-300 lg:border-gray-400 lg:text-gray-400 lg:hover:text-gray-300 lg:hover:border-gray-300">
                  <BsDownload className="text-2xl" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
})

export default ImageWrapper