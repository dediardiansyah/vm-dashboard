"use client"

import { useState } from "react"
import { useParfumes } from "@/app/_hooks/api/parfumes/use-parfumes"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddParfumeDialog } from "./add-parfume-dialog"
import { EditParfumeDialog } from "./edit-parfume-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { StateWrapper } from "@/components/state-wrapper"
import { useToastHandler } from "@/app/_hooks/ui/use-toast-handler"
import { ICreateParfume, IUpdateParfume } from "@/schemas/parfumeSchema"
import { IParfume } from "@/types/parfume"
import { useDialog } from "@/app/_hooks/common/use-dialog"

export default function ParfumePage() {
  const { parfumes, isLoading, error, createParfume, updateParfume, deleteParfume } = useParfumes()
  const { showSuccessToast, showErrorToast } = useToastHandler()
  
  const addDialog = useDialog()
  const editDialog = useDialog({
    onClose: () => setSelectedParfume(null)
  })
  const deleteDialog = useDialog({
    onClose: () => setParfumeToDelete(null)
  })

  const [selectedParfume, setSelectedParfume] = useState<IParfume | null>(null)
  const [parfumeToDelete, setParfumeToDelete] = useState<IParfume | null>(null)

  const handleAddParfume = async (formData: ICreateParfume) => {
    try {
      const success = await createParfume(formData)
      if (success) {
        addDialog.close()
        showSuccessToast(
          "Parfume created",
          "The parfume has been successfully created."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem creating the parfume."
      )
    }
  }

  const handleEditParfume = async (id: number, formData: IUpdateParfume) => {
    try {
      const success = await updateParfume(id, formData)
      if (success) {
        editDialog.close()
        showSuccessToast(
          "Parfume updated",
          "The parfume has been successfully updated."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem updating the parfume."
      )
    }
  }

  const handleDeleteParfume = async (id: number) => {
    if (!parfumeToDelete) return

    try {
      const success = await deleteParfume(id)
      if (success) {
        deleteDialog.close()
        showSuccessToast(
          "Parfume deleted",
          "The parfume has been successfully deleted."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem deleting the parfume."
      )
    }
  }

  const handleRowAction = (action: string, parfume: IParfume) => {
    switch (action) {
      case 'edit':
        setSelectedParfume(parfume)
        editDialog.open()
        break
      case 'delete':
        setParfumeToDelete(parfume)
        deleteDialog.open()
        break
      default:
        break
    }
  }

  return (
    <StateWrapper isLoading={isLoading} error={error}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Parfume Management</h1>
          <Button onClick={addDialog.open}>
            <Plus className="mr-2 h-4 w-4" /> Add Parfume
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={parfumes}
          filterColumn="name"
          meta={{
            onRowAction: handleRowAction
          }}
        />

        <AddParfumeDialog
          open={addDialog.isOpen}
          onOpenChange={addDialog.setIsOpen}
          onSubmit={handleAddParfume}
        />

        <EditParfumeDialog
          parfume={selectedParfume}
          open={editDialog.isOpen}
          onOpenChange={editDialog.setIsOpen}
          onSubmit={handleEditParfume}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
          onConfirm={() => parfumeToDelete && handleDeleteParfume(parfumeToDelete.id)}
          title="Delete Parfume"
          itemName={parfumeToDelete?.name || 'this parfume'}
          description="Are you sure you want to delete this parfume? This action cannot be undone."
        />
      </div>
    </StateWrapper>
  )
}