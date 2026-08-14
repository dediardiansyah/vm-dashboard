import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// Define payment status constants if not imported
const PAYMENT_STATUS = {
  SUCCESS: "SUCCESS",
  PENDING: "PENDING",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED"
} as const;

export async function GET() {
  try {
    console.log("[DASHBOARD_GET] Starting to fetch dashboard data");

    // Get total revenue (from successful transactions)
    console.log("[DASHBOARD_GET] Fetching total revenue");
    const totalRevenue = await db.transaction.aggregate({
      where: {
        paymentStatus: PAYMENT_STATUS.SUCCESS,
      },
      _sum: {
        amount: true,
      },
    });
    console.log("[DASHBOARD_GET] Total revenue:", totalRevenue);

    // Get active machines count
    console.log("[DASHBOARD_GET] Fetching active machines");
    const activeMachinesCount = await db.machine.count({
      where: {
        status: "connected",
      },
    });
    console.log("[DASHBOARD_GET] Active machines:", activeMachinesCount);

    // Get parfumes needing refill
    console.log("[DASHBOARD_GET] Fetching parfumes needing refill");
    const parfumesNeedingRefill = await db.machineParfume.count({
      where: {
        sprayCount: {
          lte: 10,
        },
      },
    });
    console.log("[DASHBOARD_GET] Parfumes needing refill:", parfumesNeedingRefill);

    // Get recent transactions
    console.log("[DASHBOARD_GET] Fetching recent transactions");
    const recentTransactions = await db.transaction.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        machine: {
          select: {
            id: true,
            name: true,
          },
        },
        parfume: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log("[DASHBOARD_GET] Recent transactions count:", recentTransactions.length);

    // Get monthly revenue data for chart
    console.log("[DASHBOARD_GET] Calculating monthly revenue");
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = [];
    
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);

      const result = await db.transaction.aggregate({
        where: {
          paymentStatus: PAYMENT_STATUS.SUCCESS,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _sum: {
          amount: true,
        },
      });

      monthlyRevenue.push({
        name: new Date(currentYear, month).toLocaleString('default', { month: 'short' }),
        total: result._sum.amount || 0,
      });
    }
    console.log("[DASHBOARD_GET] Monthly revenue calculated");

    const responseData = {
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.amount || 0,
        activeMachinesCount,
        parfumesNeedingRefill,
        recentTransactions,
        monthlyRevenue,
      },
    };
    console.log("[DASHBOARD_GET] Sending response:", JSON.stringify(responseData, null, 2));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[DASHBOARD_GET] Error occurred:", error);

    let errorMessage = "Failed to fetch dashboard data";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("[DASHBOARD_GET] Prisma error code:", error.code);
      // Handle specific Prisma errors
      switch (error.code) {
        case 'P2002':
          errorMessage = "Unique constraint violation";
          break;
        case 'P2025':
          errorMessage = "Record not found";
          break;
        default:
          errorMessage = "Database error occurred";
      }
    } else if (error instanceof Error) {
      errorMessage = process.env.NODE_ENV === 'development' 
        ? `Error: ${error.message}`
        : "An unexpected error occurred";
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      }, 
      { status: 500 }
    );
  }
} 
