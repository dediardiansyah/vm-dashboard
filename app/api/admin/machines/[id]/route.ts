import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { updateMachineSchema } from "@/schemas/machineSchema"
import { createApiResponse, handleApiError, ApiError } from "@/lib/api-response"

type Params = Promise<{ id: string }>

export async function GET(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        machineParfumes: {
          include: {
            parfume: true
          }
        }
      }
    })

    if (!machine) {
      throw new ApiError(
        'NOT_FOUND',
        'Machine not found'
      )
    }

    const formattedMachine = {
      ...machine,
      parfumes: machine.machineParfumes.map(mp => mp.parfume)
    }

    return NextResponse.json(createApiResponse(formattedMachine))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  try {
    const body = await req.json()
    const validatedData = updateMachineSchema.parse(body)
    const { parfumeIds, ...machineData } = validatedData

    // Check if parfumes exist if parfumeIds are provided
    if (parfumeIds?.length) {
      const parfumes = await prisma.parfume.findMany({
        where: {
          id: {
            in: parfumeIds
          }
        }
      })

      if (parfumes.length !== parfumeIds.length) {
        throw new ApiError(
          'VALIDATION_ERROR',
          'One or more parfumes do not exist'
        )
      }
    }

    // Update machine and parfume relationships
    const machine = await prisma.$transaction(async (tx) => {
      // Delete existing parfume relationships if parfumeIds is provided
      if (parfumeIds !== undefined) {
        await tx.machineParfume.deleteMany({
          where: { machineId: parseInt((await params).id) }
        })
      }

      // Update the machine with new data
      const updatedMachine = await tx.machine.update({
        where: { id: parseInt((await params).id) },
        data: {
          ...machineData,
          ...(parfumeIds?.length && {
            machineParfumes: {
              create: parfumeIds.map(parfumeId => ({
                parfumeId
              }))
            }
          })
        },
        include: {
          machineParfumes: {
            include: {
              parfume: true
            }
          }
        }
      })

      return updatedMachine
    })

    const formattedMachine = {
      ...machine,
      parfumes: machine.machineParfumes.map(mp => mp.parfume)
    }

    return NextResponse.json(createApiResponse(formattedMachine))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Params }
) {
  try {
    await prisma.machine.delete({
      where: { id: parseInt((await params).id) },
    })

    return NextResponse.json(createApiResponse({ message: 'Machine deleted successfully' }))
  } catch (error) {
    return handleApiError(error)
  }
}