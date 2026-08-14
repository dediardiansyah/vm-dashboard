import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createParfumeSchema } from "@/schemas/parfumeSchema"

export async function GET() {
  try {
    const parfumes = await prisma.parfume.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    
    return NextResponse.json({
      success: true,
      data: parfumes
    })
  } catch (error) {
    console.error("Error fetching copy texts:", error)
    return NextResponse.json(
      { 
        success: false,
        error: {
          message: "Failed to fetch copy texts"
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = createParfumeSchema.parse(body)

    const parfume = await prisma.parfume.create({
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: parfume
    })
  } catch (error) {
    console.error("Error creating parfume:", error)
    return NextResponse.json(
      { 
        success: false,
        error: {
          message: "Failed to create parfume"
        }
      },
      { status: 400 }
    )
  }
}