"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createParfumeSchema, ICreateParfume } from "@/schemas/parfumeSchema"

interface AddParfumeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ICreateParfume) => Promise<void>
}

export function AddParfumeDialog({ open, onOpenChange, onSubmit }: AddParfumeDialogProps) {
  const form = useForm<ICreateParfume>({
    resolver: zodResolver(createParfumeSchema),
    defaultValues: {
      name: ""
    },
  })

  const handleSubmit = async (data: ICreateParfume) => {
    await onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Parfume</DialogTitle>
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
              <Button type="submit">Add Parfume</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}