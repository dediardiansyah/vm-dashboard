'use client'

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Search, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { XENDIT_PAYMENT_STATUS } from "@/lib/xendit"
import { Pagination } from "@/components/ui/pagination"

interface Transaction {
  id: number
  transactionId: string
  amount: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  paidAt: string | null
  machine: {
    name: string
  }
  parfume: {
    name: string
  }
}

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function TransactionsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<Meta>()
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  
  const debouncedSearch = useDebounce(search, 500)

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(debouncedSearch && { search: debouncedSearch }),
      })

      const response = await fetch(`/api/admin/transactions?${searchParams}`)
      const json = await response.json()

      setTransactions(json.data)
      setMeta(json.meta)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [page, selectedStatus, debouncedSearch])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case XENDIT_PAYMENT_STATUS.COMPLETED:
        return "default"
      case XENDIT_PAYMENT_STATUS.ACTIVE:
        return "secondary"
      case XENDIT_PAYMENT_STATUS.FAILED:
        return "destructive"
      case XENDIT_PAYMENT_STATUS.EXPIRED:
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      // Fetch all transactions for export
      const response = await fetch('/api/admin/transactions?limit=1000')
      const json = await response.json()
      const data = json.data

      // Transform data for Excel
      const excelData = data.map((item: Transaction) => ({
        'Transaction ID': item.transactionId,
        'Machine': item.machine.name,
        'Parfume': item.parfume.name,
        'Payment Method': item.paymentMethod,
        'Amount': item.amount,
        'Status': item.paymentStatus,
        'Created At': format(new Date(item.createdAt), "dd MMM yyyy HH:mm"),
        'Paid At': item.paidAt ? format(new Date(item.paidAt), "dd MMM yyyy HH:mm") : '-'
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

      // Generate Excel file
      XLSX.writeFile(wb, `transactions-${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
    } catch (error) {
      console.error('Failed to export transactions:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center gap-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={XENDIT_PAYMENT_STATUS.ACTIVE}>Active</SelectItem>
              <SelectItem value={XENDIT_PAYMENT_STATUS.COMPLETED}>Completed</SelectItem>
              <SelectItem value={XENDIT_PAYMENT_STATUS.FAILED}>Failed</SelectItem>
              <SelectItem value={XENDIT_PAYMENT_STATUS.EXPIRED}>Expired</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="border-none p-0 outline-none">
          <Card>
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
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell>{transaction.machine.name}</TableCell>
                        <TableCell>{transaction.parfume.name}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(transaction.paymentStatus)}>
                            {transaction.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(transaction.createdAt),
                            "dd MMM yyyy HH:mm"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {meta && meta.totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}