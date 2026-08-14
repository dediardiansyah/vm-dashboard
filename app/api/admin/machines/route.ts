import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createMachineSchema } from "@/schemas/machineSchema"
import { createApiResponse, handleApiError } from "@/lib/api-response"

export async function GET() {
  try {
    const machines = await prisma.machine.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        machineParfumes: {
          include: {
            parfume: true
          }
        }
      }
    })
    
    const formattedMachines = machines.map(machine => ({
      ...machine,
      parfumes: machine.machineParfumes.map(mp => mp.parfume)
    }))
    
    return NextResponse.json(createApiResponse(formattedMachines))
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = createMachineSchema.parse(body)

    const { parfumeIds, ...machineData } = validatedData

    const machine = await prisma.machine.create({
      data: {
        ...machineData,
        machineParfumes: {
          create: parfumeIds?.map(parfumeId => ({
            parfumeId
          })) || []
        }
      },
      include: {
        machineParfumes: {
          include: {
            parfume: true
          }
        }
      }
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