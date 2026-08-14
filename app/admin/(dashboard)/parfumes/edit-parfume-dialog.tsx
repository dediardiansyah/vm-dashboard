"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateParfumeSchema, IUpdateParfume } from "@/schemas/parfumeSchema"
import { IParfume } from "@/types/parfume"

interface EditParfumeDialogProps {
  parfume: IParfume | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (id: number, data: IUpdateParfume) => Promise<void>
}

export function EditParfumeDialog({ parfume, open, onOpenChange, onSubmit }: EditParfumeDialogProps) {
  const form = useForm<IUpdateParfume>({
    resolver: zodResolver(updateParfumeSchema),
  })

  useEffect(() => {
    if (parfume) {
      form.reset({
        name: parfume.name,
      })
    }
  }, [parfume, form])

  const handleSubmit = async (data: IUpdateParfume) => {
    if (!parfume) return
    await onSubmit(parfume.id, data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Parfume</DialogTitle>
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
                    <Input placeholder="Enter parfume name" {...field} />
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