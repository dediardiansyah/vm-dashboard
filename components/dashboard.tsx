'use client'

import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { AlertCircle, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircle2, RefreshCcw, Smartphone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data (replace with actual data fetching in a real application)
const machineData = [
  { id: 1, name: 'Machine 1', status: 'connected', location: 'Mall A', parfumes: [
    { name: 'Lavender', sprayCount: 20, sprayLimit: 50 },
    { name: 'Vanilla', sprayCount: 35, sprayLimit: 50 },
    { name: 'Citrus', sprayCount: 5, sprayLimit: 50 },
    { name: 'Ocean Breeze', sprayCount: 42, sprayLimit: 50 },
  ]},
  { id: 2, name: 'Machine 2', status: 'disconnected', location: 'Mall B', parfumes: [
    { name: 'Rose', sprayCount: 48, sprayLimit: 50 },
    { name: 'Sandalwood', sprayCount: 10, sprayLimit: 50 },
    { name: 'Fresh Linen', sprayCount: 25, sprayLimit: 50 },
    { name: 'Pine Forest', sprayCount: 30, sprayLimit: 50 },
  ]},
]

const recentTransactions = [
  { id: 1, machineId: 1, totalPrice: 10000, status: 'success', date: '2023-04-01' },
  { id: 2, machineId: 2, totalPrice: 10000, status: 'pending', date: '2023-04-02' },
  { id: 3, machineId: 1, totalPrice: 10000, status: 'failed', date: '2023-04-03' },
]

const refillHistory = [
  { id: 1, machineName: 'Machine 1', parfumeName: 'Lavender', refilledBy: 'John Doe', date: '2023-03-28', previousCount: 2, resetCount: 50 },
  { id: 2, machineName: 'Machine 2', parfumeName: 'Rose', refilledBy: 'Jane Smith', date: '2023-03-30', previousCount: 5, resetCount: 50 },
]

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refills">Refills</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 45.231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Machines
                </CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parfumes Needing Refill
                </CardTitle>
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+9</div>
                <p className="text-xs text-muted-foreground">
                  +2 since yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Transactions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
                    { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
                  ]}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value}`} />
                    <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Machine</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.machineId}</TableCell>
                        <TableCell>
                          {transaction.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {transaction.status === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {transaction.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </TableCell>
                        <TableCell>{transaction.totalPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="machines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machines Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Parfumes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machineData.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell>{machine.name}</TableCell>
                      <TableCell>
                        {machine.status === 'connected' ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Disconnected
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{machine.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {machine.parfumes.map((parfume, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span>{parfume.name}</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{width: `${(parfume.sprayCount / parfume.sprayLimit) * 100}%`}}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.machineId}</TableCell>
                      <TableCell>{transaction.totalPrice}</TableCell>
                      <TableCell>
                        {transaction.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                        {transaction.status === 'pending' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                        {transaction.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refill History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Machine</TableHead>
                    <TableHead>Parfume</TableHead>
                    <TableHead>Refilled By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Previous Count</TableHead>
                    <TableHead>Reset Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refillHistory.map((refill) => (
                    <TableRow key={refill.id}>
                      <TableCell>{refill.machineName}</TableCell>
                      <TableCell>{refill.parfumeName}</TableCell>
                      <TableCell>{refill.refilledBy}</TableCell>
                      <TableCell>{refill.date}</TableCell>
                      <TableCell>{refill.previousCount}</TableCell>
                      <TableCell>{refill.resetCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}