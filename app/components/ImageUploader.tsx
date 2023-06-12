"use client"

import { useEffect, useState, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { SlCloudUpload } from "react-icons/sl"

import { encodeImageToBlurhash } from '@/lib/ImageService'
import { Blurhash } from 'react-blurhash'

interface UploaderFields {
  src: FileWithPath | null
}

const ImageUploader = () => {
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const { handleSubmit, setValue, watch } = useForm<UploaderFields>()
  const watchSrc = watch("src", )
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    accept: {
      "image/*": ['.jpg', '.jpeg', '.png'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: FileWithPath[]) => {
      setValue("src", acceptedFiles[0] || null)
      setSelectedImage(URL.createObjectURL(acceptedFiles[0]))
      setLoading(true)
    },
  })

  // const worker = new Worker("worker.js")

  // worker.onmessage = (event) => {
  //   const blurhash = event.data;
  //   console.log(blurhash);
  // }

  const onSubmit: SubmitHandler<UploaderFields> = async (data) => {

    // worker.postMessage(data.src)

    // const res = await fetch("http://localhost:3000/api/images", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({src: data.src, url: selectedImage})
    // })
    // const resData  = await res.json()
    // console.log(resData)
  }


  // const handleDragOver = () => {
  //   setDragging(true);
  // };

  // const handleDragLeave = () => {
  //   setDragging(false);
  // };

  // const handleDrop = () => {
  //   setDragging(false);
  // };

  // useEffect(() => {
  //   if (dropzoneRef.current) {
  //     dropzoneRef.current.addEventListener("dragenter", handleDragOver)
  //     dropzoneRef.current.addEventListener("dragleave", handleDragLeave)
  //   }
  // }, [])

  return (
    <>
      {/* <div ref={dropzoneRef} className='absolute inset-0 z-0'>

      </div> */}
      <form className='relative flex flex-col w-full max-w-[600px] gap-4 items-start z-50' onSubmit={handleSubmit(onSubmit)}>
        <div 
          className='flex p-2 bg-transparent w-full max-w-[600px] min-h-[160px] outline-none border transition-colors hover:border-gray-300 border-gray-500 rounded cursor-pointer focus:ring-1 focus:ring-gray-300'
          {...getRootProps()}
        >
          <input 
            {...getInputProps()} 
          />
          <div className='relative flex justify-center w-full p-2 border-2 border-dashed border-teal-400'>
            {selectedImage ? (
              <>
                <Blurhash 
                className='!h-[300px] !w-full'
                hash='L37-=}x]00M_8^D$%N.900IT?w.9'
                resolutionX={32}
                resolutionY={32}
                punch={1}
                />
                <div className='absolute p-2 inset-0'>
                  <img 
                    className={`h-full w-full object-cover transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}
                    ref={imageRef}
                    src={selectedImage} 
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    alt="Uploaded image" 
                  />
                </div>
              </>
            ) : (
              <p className='flex justify-center items-center w-full h-full text-gray-400 text-sm text-center'>
                Перетащите файл сюда или кликните для выбора
              </p>
            )}
          </div>
        </div>
        <button className='flex justify-center items-center gap-2 h-12 hover:text-gray-300 text-gray-400 w-full border transition-colors hover:border-gray-300 border-gray-400 rounded'>
          <p className='basis-[85%] text-md'>
            Загрузить
          </p>
          <div className='basis-[15%] flex h-full justify-center items-center border-l w-f'>
            <SlCloudUpload className='text-2xl w-full' />
          </div>
        </button>
      </form>
    </>
  )
}

export default ImageUploader