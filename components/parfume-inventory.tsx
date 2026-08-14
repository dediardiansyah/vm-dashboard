'use client'

import { useState } from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

// Mock data
const parfumes = [
  { 
    id: 'PF-001', 
    name: 'Lavender Dreams', 
    currentStock: 750, 
    maxStock: 1000,
    machinesUsing: 5,
    lastRefill: '2023-06-15',
    status: 'success'
  },
  { 
    id: 'PF-002', 
    name: 'Ocean Breeze', 
    currentStock: 600, 
    maxStock: 800,
    machinesUsing: 4,
    lastRefill: '2023-06-14',
    status: 'success'
  },
  { 
    id: 'PF-003', 
    name: 'Citrus Burst', 
    currentStock: 1100, 
    maxStock: 1200,
    machinesUsing: 6,
    lastRefill: '2023-06-16',
    status: 'success'
  },
  { 
    id: 'PF-004', 
    name: 'Vanilla Comfort', 
    currentStock: 450, 
    maxStock: 900,
    machinesUsing: 3,
    lastRefill: '2023-06-13',
    status: 'warning'
  },
  { 
    id: 'PF-005', 
    name: 'Pine Forest', 
    currentStock: 650, 
    maxStock: 700,
    machinesUsing: 2,
    lastRefill: '2023-06-17',
    status: 'success'
  },
]

export function ParfumeInventoryComponent() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredParfumes = parfumes.filter(parfume =>
    parfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parfume.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockPercentage = (current: number, max: number) => (current / max) * 100

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Parfume Inventory</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by parfume name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Machines</TableHead>
              <TableHead>Last Refill</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParfumes.map((parfume) => (
              <TableRow key={parfume.id}>
                <TableCell className="font-medium">{parfume.id}</TableCell>
                <TableCell>{parfume.name}</TableCell>
                <TableCell className="w-[300px]">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{parfume.currentStock}</span>
                      <span className="text-muted-foreground">{parfume.maxStock}</span>
                    </div>
                    <Progress 
                      value={getStockPercentage(parfume.currentStock, parfume.maxStock)} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className={getStatusColor(parfume.status)}>
                    {parfume.status === 'success' ? 'Adequate' : 'Low Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{parfume.machinesUsing}</Badge>
                </TableCell>
                <TableCell>{new Date(parfume.lastRefill).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Refill</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Refill {parfume.name}</DialogTitle>
                        <DialogDescription>
                          Current stock: {parfume.currentStock}/{parfume.maxStock}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Refill Amount</Label>
                          <Input type="number" placeholder="Enter amount to add" />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Input placeholder="Add refill notes (optional)" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Confirm Refill</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}