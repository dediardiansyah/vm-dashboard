"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, GripVertical } from "lucide-react"
import { ConfigColumnDialog } from "./config-column-dialog"

export interface Column {
  key: string
  type: string
  selected: boolean
  config?: {
    isSortable?: boolean
    isFilterable?: boolean
    min?: number
    max?: number
    imageWidth?: number
    imageHeight?: number
    imageClassName?: string
    options?: string[]
    // Add any other configuration options you need
  }
}

export default function CrudGeneratorPage() {
  const [endpoint, setEndpoint] = useState("")
  const [columns, setColumns] = useState<Column[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<Column | null>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  const fetchEndpoint = async () => {
    if (!endpoint) {
      setError("Please enter an endpoint")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(endpoint)
      const data = await response.json()

      console.log("Data:", data)

      // Get first item from array or use the data object itself
      const sample = Array.isArray(data.data) ? data.data[0] : data.data

      if (!sample) {
        throw new Error("No data found in response")
      }

      // Extract columns from the sample data
      const extractedColumns = Object.entries(sample).map(([key, value]) => ({
        key,
        type: typeof value,
        selected: true
      }))

      setColumns(extractedColumns)
    } catch (err) {
      setError("Failed to fetch endpoint data. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(columns)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setColumns(items)
  }

  const toggleColumn = (index: number) => {
    const newColumns = [...columns]
    newColumns[index].selected = !newColumns[index].selected
    setColumns(newColumns)
  }

  const generateCrud = async () => {
    const selectedColumns = columns.filter(col => col.selected)
    
    // TODO: Implement the CRUD generation logic
    console.log("Selected columns:", selectedColumns)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CRUD Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure CRUD</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Endpoint Input */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  placeholder="Enter API endpoint URL..."
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={fetchEndpoint}
                  disabled={loading}
                >
                  {loading ? "Fetching..." : "Fetch Columns"}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Columns Configuration */}
          {columns.length > 0 && (
            <div className="space-y-4">
              <Label>Configure Columns</Label>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="columns">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {columns.map((column, index) => (
                        <Draggable
                          key={column.key}
                          draggableId={column.key}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-4 p-2 bg-muted/50 rounded-md"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Checkbox
                                checked={column.selected}
                                onCheckedChange={() => toggleColumn(index)}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{column.key}</p>
                                <p className="text-sm text-muted-foreground">
                                  Type: {column.type}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedColumn(column)
                                  setConfigDialogOpen(true)
                                }}
                              >
                                Configure
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="flex justify-end">
                <Button onClick={generateCrud}>
                  Generate CRUD
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfigColumnDialog
        column={selectedColumn}
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        onSubmit={(updatedColumn) => {
          setColumns(columns.map(col => 
            col.key === updatedColumn.key ? updatedColumn : col
          ))
        }}
      />
    </div>
  )
}