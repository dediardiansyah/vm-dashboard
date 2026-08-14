'use client'

import { Bell, CreditCard, LayoutDashboard, Package, Search, Settings, Sprout, Users } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TransactionsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package className="h-6 w-6" />
              <span>Vending Machine</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href="#"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href="#"
              >
                <Sprout className="h-4 w-4" />
                Parfumes
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href="#"
              >
                <Package className="h-4 w-4" />
                Machines
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary"
                href="#"
              >
                <CreditCard className="h-4 w-4" />
                Transactions
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href="#"
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6">
          <form className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full bg-background shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3"
                placeholder="Search transactions..."
                type="search"
              />
            </div>
          </form>
          <Button size="icon" variant="ghost">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Button size="icon" variant="ghost">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Toggle settings</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full border border-border bg-background h-8 w-8"
                size="icon"
                variant="ghost"
              >
                <span className="sr-only">Toggle user menu</span>
                <span className="font-semibold">AU</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
            <div className="flex items-center gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button>Export</Button>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:gap-8">
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="border-none p-0 outline-none">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>A list of all transactions from your vending machines.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Machine</TableHead>
                          <TableHead>Parfume</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">#TRX-001</TableCell>
                          <TableCell>Machine A</TableCell>
                          <TableCell>Lavender Dreams</TableCell>
                          <TableCell>QRIS</TableCell>
                          <TableCell>$5.00</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Success</Badge>
                          </TableCell>
                          <TableCell>2024-01-13 09:45 AM</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#TRX-002</TableCell>
                          <TableCell>Machine B</TableCell>
                          <TableCell>Ocean Breeze</TableCell>
                          <TableCell>Virtual Account</TableCell>
                          <TableCell>$5.00</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Pending</Badge>
                          </TableCell>
                          <TableCell>2024-01-13 09:30 AM</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#TRX-003</TableCell>
                          <TableCell>Machine A</TableCell>
                          <TableCell>Citrus Burst</TableCell>
                          <TableCell>QRIS</TableCell>
                          <TableCell>$5.00</TableCell>
                          <TableCell>
                            <Badge variant="destructive">Failed</Badge>
                          </TableCell>
                          <TableCell>2024-01-13 09:15 AM</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">#TRX-004</TableCell>
                          <TableCell>Machine C</TableCell>
                          <TableCell>Pine Forest</TableCell>
                          <TableCell>Virtual Account</TableCell>
                          <TableCell>$5.00</TableCell>
                          <TableCell>
                            <Badge variant="outline">Expired</Badge>
                          </TableCell>
                          <TableCell>2024-01-13 09:00 AM</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}