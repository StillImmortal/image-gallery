"use client"

import { useState, useRef, FC, Dispatch, SetStateAction } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { SlCloudUpload } from "react-icons/sl"
import { Blurhash } from 'react-blurhash'

import { uploadImage, saveImage, uploadToClodinary } from '@/services/ImageService'
import { Image } from '../api/images/route'

interface UploaderProps {
  setUrls: Dispatch<SetStateAction<Image[]>>
}

interface UploaderFields {
  src: FileWithPath | null
  hash: string
}

const ImageUploader: FC<UploaderProps> = ({setUrls}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { handleSubmit, setValue, getValues, reset } = useForm<UploaderFields>()
  const { getRootProps, getInputProps } = useDropzone({
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

  const encodeBlurhash = async (image: File) => {
    const worker = new Worker(new URL("../../lib/blurhash.worker", import.meta.url))
    worker.postMessage(image)
  
    worker.onmessage = async (event) => {
      setValue("hash", event.data)
      const {src, hash} = getValues()
      if (src) {
        const newImage = await saveImage(src.name, hash)
        setSelectedImage(null)
        reset()
        setSubmitting(false)
        setUrls((prev) => {
          return [
            ...prev,
            newImage
          ]
        })
      }
    }
  }

  const onSubmit: SubmitHandler<UploaderFields> = async (data) => {
    try {
      setSubmitting(true)
      if (data.src) {
        await uploadImage(data.src)
        await uploadToClodinary(data.src)
        await encodeBlurhash(data.src)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
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
                {submitting && (
                  <div className='absolute flex justify-center bg-black/75 items-center z-50 inset-0'>
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"></div>
                  </div>
                )}
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
        <button 
          disabled={submitting ? true : false}
          className={`flex justify-center items-center gap-2 h-12 w-full border transition-colors rounded ${submitting ? "text-gray-500 border-gray-500" : "hover:text-gray-300 text-gray-400 group hover:border-gray-300 border-gray-400"}`}
          >
          <p className='basis-[85%] text-md transition-colors '>
            {submitting ? "Загрузка..." : "Загрузить"}
          </p>
          <div className='basis-[15%] flex h-full justify-center items-center transition-colors border-l group-hover:border-gray-300 border-gray-400 w-f'>
            <SlCloudUpload className='text-2xl w-full' />
          </div>
        </button>
      </form>
    </>
  )
}

export default ImageUploader