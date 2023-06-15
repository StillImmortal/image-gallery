import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export interface Image {
  id: number
  src: string
  hash: string
}

export async function GET() {
  const prisma = new PrismaClient()
  try {
    const allImages = await prisma.image.findMany()
    return NextResponse.json(allImages)
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient()
  const {src, hash} = await req.json() as Image
  try {
    const image = await prisma.image.upsert({
      where: { src: src },
      create: {src: src, hash: hash || "L37-=}x]00M_8^D$%N.900IT?w.9"},
      update: {hash: hash}
    })
    return NextResponse.json(image)
  } catch (error) {
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }

}
