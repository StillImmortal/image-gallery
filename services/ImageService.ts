import FileSaver from "file-saver"

export const uploadImage = async (image: File) => {
  const formData = new FormData()
  formData.append("image", image)
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    })
    const responseData = await response.json()
  } catch (error) {
    console.log(error)
  }
}

export const saveImage = async (src: string, hash: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({src, hash})
    })
    const responseData  = await response.json()
    return responseData
  } catch (error) {
    console.log(error)
  }
}

export const uploadToClodinary = async (image: File) => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
  const formData = new FormData()
  formData.append("file", image)
  formData.append("upload_preset", upload_preset)
  formData.append('public_id', image.name.split('.').slice(0, -1).join('.'));
  const response = await fetch(url, {
    method: "POST",
    body: formData
  })
  const responseData = await response.json()
  return responseData
}

export const downloadImage = async (image: File, name: string) => {
  FileSaver.saveAs(image, name)
}