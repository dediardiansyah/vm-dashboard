"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateMachineSchema, IUpdateMachine } from "@/schemas/machineSchema"
import { IMachine } from "@/types/machine"
import { useParfumesSelect } from "@/app/_hooks/api/parfumes/use-parfumes-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

interface EditMachineDialogProps {
  machine: IMachine | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: number, data: IUpdateMachine) => Promise<void>
}

export function EditMachineDialog({ machine, open, onOpenChange, onSubmit }: EditMachineDialogProps) {
  const { parfumes = [], isLoading: isLoadingParfumes } = useParfumesSelect()
  
  const form = useForm<IUpdateMachine>({
    resolver: zodResolver(updateMachineSchema),
    defaultValues: {
      name: "",
      status: "DISCONNECTED",
      location: "",
      parfumeIds: [],
    }
  })

  useEffect(() => {
    if (machine) {
      form.reset({
        name: machine.name,
        status: machine.status,
        location: machine.location || "",
        parfumeIds: machine.parfumes?.map(p => p.id) || [],
      })
    }
  }, [machine, form])

  const handleSubmit = async (data: IUpdateMachine) => {
    if (!machine) return
    await onSubmit(machine.id, data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Machine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter machine name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="DISCONNECTED">Disconnected</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parfumeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parfumes</FormLabel>
                  <FormControl>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {parfumes.map((parfume) => (
                          <div key={parfume.id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={field.value?.includes(parfume.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...(field.value || []), parfume.id])
                                } else {
                                  field.onChange(field.value?.filter((id) => id !== parfume.id) || [])
                                }
                              }}
                            />
                            <label
                              htmlFor={`parfume-${parfume.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {parfume.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}