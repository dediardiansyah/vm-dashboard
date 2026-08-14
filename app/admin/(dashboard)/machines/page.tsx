"use client"

import { useState } from "react"
import { useMachines } from "@/app/_hooks/api/machines/use-machines"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddMachineDialog } from "./add-machine-dialog"
import { EditMachineDialog } from "./edit-machine-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { StateWrapper } from "@/components/state-wrapper"
import { useToastHandler } from "@/app/_hooks/ui/use-toast-handler"
import { ICreateMachine, IUpdateMachine } from "@/schemas/machineSchema"
import { IMachine } from "@/types/machine"
import { useDialog } from "@/app/_hooks/common/use-dialog"

export default function MachinePage() {
  const { machines, isLoading, error, createMachine, updateMachine, deleteMachine } = useMachines()
  const { showSuccessToast, showErrorToast } = useToastHandler()
  
  const addDialog = useDialog()
  const editDialog = useDialog({
    onClose: () => setSelectedMachine(null)
  })
  const deleteDialog = useDialog({
    onClose: () => setMachineToDelete(null)
  })

  const [selectedMachine, setSelectedMachine] = useState<IMachine | null>(null)
  const [machineToDelete, setMachineToDelete] = useState<IMachine | null>(null)

  const handleAddMachine = async (formData: ICreateMachine) => {
    try {
      const success = await createMachine(formData)
      if (success) {
        addDialog.close()
        showSuccessToast(
          "Machine created",
          "The machine has been successfully created."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem creating the machine."
      )
    }
  }

  const handleEditMachine = async (id: number, formData: IUpdateMachine) => {
    try {
      const success = await updateMachine(id, formData)
      if (success) {
        editDialog.close()
        showSuccessToast(
          "Machine updated",
          "The machine has been successfully updated."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem updating the machine."
      )
    }
  }

  const handleDeleteMachine = async (id: number) => {
    if (!machineToDelete) return

    try {
      const success = await deleteMachine(id)
      if (success) {
        deleteDialog.close()
        showSuccessToast(
          "Machine deleted",
          "The machine has been successfully deleted."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem deleting the machine."
      )
    }
  }

  const handleRowAction = (action: string, machine: IMachine) => {
    switch (action) {
      case 'edit':
        setSelectedMachine(machine)
        editDialog.open()
        break
      case 'delete':
        setMachineToDelete(machine)
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
          <h1 className="text-2xl font-bold">Machine Management</h1>
          <Button onClick={addDialog.open}>
            <Plus className="mr-2 h-4 w-4" /> Add Machine
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={machines}
          filterColumn="name"
          meta={{
            onRowAction: handleRowAction
          }}
        />

        <AddMachineDialog
          open={addDialog.isOpen}
          onOpenChange={addDialog.setIsOpen}
          onSubmit={handleAddMachine}
        />

        <EditMachineDialog
          machine={selectedMachine}
          open={editDialog.isOpen}
          onOpenChange={editDialog.setIsOpen}
          onSubmit={handleEditMachine}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
          onConfirm={() => machineToDelete && handleDeleteMachine(machineToDelete.id)}
          title="Delete Machine"
          itemName={machineToDelete?.name || 'this machine'}
          description="Are you sure you want to delete this machine? This action cannot be undone."
        />
      </div>
    </StateWrapper>
  )
}