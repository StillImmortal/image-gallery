import Image from "next/image"
import { FC } from "react"

interface ImageWrapperProps {
  src: string
}

const ImageWrapper: FC<ImageWrapperProps> = ({src}) => {
  return (
    <div className="grid-item">
      <Image 
        className="object-cover" 
        src={`/images/${src}`}
        alt="image"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" 
        width={400}
        height={400}
      />
    </div>
  )
}

export default ImageWrapper