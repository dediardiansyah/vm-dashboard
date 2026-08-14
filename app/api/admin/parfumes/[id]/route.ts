import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { updateParfumeSchema } from "@/schemas/parfumeSchema"

type Params = Promise<{ id: string }>

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const parfume = await prisma.parfume.findUnique({
      where: { id: parseInt((await params).id) },
    })
 
    if (!parfume) {
      return NextResponse.json(
        { error: "Parfume not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(parfume)
  } catch (error) {
    console.error("Error fetching parfume:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const body = await req.json()
    const validatedData = updateParfumeSchema.parse(body)

    const parfume = await prisma.parfume.update({
      where: { id: parseInt((await params).id) },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      data: parfume
    })
  } catch (error) {
    console.error("Error updating parfume:", error)
    return NextResponse.json({
      success: false,
      error: {
        message: "Failed to update parfume"
      }
    }, { status: 400 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Params }
) {
  try {
    await prisma.parfume.delete({
      where: { id: parseInt((await params).id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting parfume:", error)
    return NextResponse.json(
      { error: "Failed to delete parfume" },
      { status: 400 }
    )
  }
}