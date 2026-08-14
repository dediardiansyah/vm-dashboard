"use client"

import { useState } from "react"
import { useCopyTexts } from "@/app/_hooks/api/copy-text/use-copytexts"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddCopyTextDialog } from "./add-copy-text-dialog"
import { EditCopyTextDialog } from "./edit-copy-text-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { StateWrapper } from "@/components/state-wrapper"
import { useToastHandler } from "@/app/_hooks/ui/use-toast-handler"
import { ICreateCopyText, IUpdateCopyText } from "@/schemas/copyTextSchema"
import { ICopyText } from "@/types/copyText"
import { useDialog } from "@/app/_hooks/common/use-dialog"

export default function CopyTextPage() {
  const { copyTexts, isLoading, error, createCopyText, updateCopyText, deleteCopyText } = useCopyTexts()
  const { showSuccessToast, showErrorToast } = useToastHandler()
  
  const addDialog = useDialog()
  const editDialog = useDialog({
    onClose: () => setSelectedCopyText(null)
  })
  const deleteDialog = useDialog({
    onClose: () => setCopyTextToDelete(null)
  })

  const [selectedCopyText, setSelectedCopyText] = useState<ICopyText | null>(null)
  const [copyTextToDelete, setCopyTextToDelete] = useState<ICopyText | null>(null)

  const handleAddCopyText = async (formData: ICreateCopyText) => {
    try {
      const success = await createCopyText(formData)
      if (success) {
        addDialog.close()
        showSuccessToast(
          "Copy text created",
          "The copy text has been successfully created."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem creating the copy text."
      )
    }
  }

  const handleEditCopyText = async (id: number, formData: IUpdateCopyText) => {
    try {
      const success = await updateCopyText(id, formData)
      if (success) {
        editDialog.close()
        showSuccessToast(
          "Copy text updated",
          "The copy text has been successfully updated.",
          { action: { label: "View copy texts", altText: "View copy texts" } }
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem updating the copy text.",
        { action: { label: "Try again", altText: "Try again" } }
      )
    }
  }

  const handleDeleteCopyText = async (id: number) => {
    if (!copyTextToDelete) return

    try {
      const success = await deleteCopyText(id)
      if (success) {
        deleteDialog.close()
        showSuccessToast(
          "Copy text deleted",
          "The copy text has been successfully deleted."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem deleting the copy text."
      )
    }
  }

  const handleRowAction = (action: string, copyText: ICopyText) => {
    switch (action) {
      case 'edit':
        setSelectedCopyText(copyText)
        editDialog.open()
        break
      case 'delete':
        setCopyTextToDelete(copyText)
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
          <h1 className="text-2xl font-bold">Copy Text Management</h1>
          <Button onClick={addDialog.open}>
            <Plus className="mr-2 h-4 w-4" /> Add Copy Text
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={copyTexts}
          filterColumn="type"
          meta={{
            onRowAction: handleRowAction
          }}
        />

        <AddCopyTextDialog
          open={addDialog.isOpen}
          onOpenChange={addDialog.setIsOpen}
          onSubmit={handleAddCopyText}
        />

        <EditCopyTextDialog
          copyText={selectedCopyText}
          open={editDialog.isOpen}
          onOpenChange={editDialog.setIsOpen}
          onSubmit={handleEditCopyText}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
          onConfirm={() => copyTextToDelete && handleDeleteCopyText(copyTextToDelete.id)}
          title="Delete Copy Text"
          itemName={copyTextToDelete?.type || 'this copy text'}
          description="Are you sure you want to delete this copy text? This action cannot be undone."
        />
      </div>
    </StateWrapper>
  )
}