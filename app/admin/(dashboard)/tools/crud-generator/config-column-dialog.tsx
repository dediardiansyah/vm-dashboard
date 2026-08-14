"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Type, Hash, Calendar, Image as ImageIcon, Check, Code, Link, ArrowLeft, Search } from "lucide-react"
import { Column } from "./types"
import { cn } from "@/lib/utils"
import { DialogFooter } from "@/components/ui/dialog"

interface ConfigColumnDialogProps {
  column: Column | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (column: Column) => void
}

export function ConfigColumnDialog({
  column,
  open,
  onOpenChange,
  onSubmit,
}: ConfigColumnDialogProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [fieldDetail, setFieldDetail] = useState({
    name: "",
    key: "",
  })

  useEffect(() => {
    if (!open) {
      setSelectedType(null)
      setFieldDetail({ name: "", key: "" })
      setSearchQuery("")
    }
  }, [open])

  if (!column) return null

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
  }

  const handleDetailSubmit = () => {
    const updatedColumn = {
      ...column,
      key: fieldDetail.key,
      type: selectedType!,
      config: {
        ...column.config,
      },
    }
    onSubmit(updatedColumn)
    onOpenChange(false)
    // Reset states
    setSelectedType(null)
    setFieldDetail({ name: "", key: "" })
  }

  const handleBack = () => {
    setSelectedType(null)
    setFieldDetail({ name: "", key: "" })
  }

  const fieldTypes = [
    {
      id: 'wysiwyg',
      name: 'Rich text',
      description: 'Text formatting with references and media',
      icon: Type
    },
    {
      id: 'text',
      name: 'Text',
      description: 'Titles, names, paragraphs, list of names',
      icon: Type
    },
    {
      id: 'number',
      name: 'Number',
      description: 'ID, order number, rating, quantity',
      icon: Hash
    },
    {
      id: 'date',
      name: 'Date and time',
      description: 'Event dates',
      icon: Calendar
    },
    {
      id: 'image',
      name: 'Media',
      description: 'Images, videos, PDFs and other files',
      icon: ImageIcon
    },
    {
      id: 'boolean',
      name: 'Boolean',
      description: 'Yes or no, 1 or 0, true or false',
      icon: Check
    },
    {
      id: 'json',
      name: 'JSON object',
      description: 'Data in JSON format',
      icon: Code
    },
    {
      id: 'reference',
      name: 'Reference',
      description: 'For example, a blog post can reference its author(s)',
      icon: Link
    }
  ]

  const filteredFieldTypes = fieldTypes.filter(type => 
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-3 pb-2">
          <div className="flex items-center gap-3">
            {selectedType && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-xl">
              {selectedType ? 'Configure Field' : 'Add new field'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {!selectedType ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search field types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredFieldTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    className={cn(
                      "flex flex-col p-4 rounded-lg border border-border hover:border-primary transition-all duration-200",
                      "text-left space-y-3 cursor-pointer hover:shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
                    )}
                    onClick={() => handleTypeSelect(type.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 dark:bg-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Field Name</Label>
                <Input
                  id="name"
                  placeholder="Enter field name..."
                  value={fieldDetail.name}
                  onChange={(e) => setFieldDetail({ ...fieldDetail, name: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key" className="text-sm font-medium">Field ID</Label>
                <Input
                  id="key"
                  placeholder="Enter field ID..."
                  value={fieldDetail.key}
                  onChange={(e) => setFieldDetail({ ...fieldDetail, key: e.target.value })}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  This will be used as the database column name
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleDetailSubmit}>
                Save Field
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}