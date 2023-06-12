import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { encodeImageToBlurhash } from '@/lib/ImageService'

const prisma = new PrismaClient()

export interface Image {
  src: string
  hash: string
}

export async function GET() {
  const allImages = await prisma.image.findMany()
  return NextResponse.json(allImages)
}

export async function POST(req: NextRequest) {
  const {src, hash} = await req.json() as Image
  const image = await prisma.image.create({
    data: {
      src,
      hash,
    }
  })
  return NextResponse.json(image)
}
