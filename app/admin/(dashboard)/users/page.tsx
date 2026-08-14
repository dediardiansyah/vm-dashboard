"use client"

import { useState } from "react"
import { useUsers } from "@/app/_hooks/api/user/use-users"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { AddUserDialog } from "./add-user-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { StateWrapper } from "@/components/state-wrapper"
import { useToastHandler } from "@/app/_hooks/ui/use-toast-handler"
import { ICreateUser, IUpdateUser } from "@/schemas/userSchema"
import { IUser } from "@/types/user"
import { useDialog } from "@/app/_hooks/common/use-dialog"

export default function UsersPage() {
  const { users, isLoading, error, createUser, updateUser, deleteUser } = useUsers()
  const { showSuccessToast, showErrorToast } = useToastHandler()

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null)

  const addDialog = useDialog()
  const editDialog = useDialog({
    onClose: () => setSelectedUser(null)
  })
  const deleteDialog = useDialog({
    onClose: () => setUserToDelete(null)
  })

  const handleAddUser = async (formData: ICreateUser) => {
    try {
      const success = await createUser(formData)
      if (success) {
        addDialog.close()
        showSuccessToast(
          "User created",
          "The user has been successfully created."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem creating the user."
      )
    }
  }

  const handleEditUser = async (id: number, formData: IUpdateUser) => {
    try {
      const success = await updateUser(id, formData)
      if (success) {
        editDialog.close()
        showSuccessToast(
          "User updated",
          "The user has been successfully updated."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem updating the user."
      )
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!userToDelete) return

    try {
      const success = await deleteUser(id)
      if (success) {
        deleteDialog.close()
        showSuccessToast(
          "User deleted",
          "The user has been successfully deleted."
        )
      }
    } catch (error) {
      console.error(error)
      showErrorToast(
        "Error",
        "There was a problem deleting the user."
      )
    }
  }

  const handleRowAction = (action: string, user: IUser) => {
    switch (action) {
      case 'edit':
        setSelectedUser(user)
        editDialog.open()
        break
      case 'delete':
        setUserToDelete(user)
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
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={addDialog.open}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={users}
          filterColumn="email"
          meta={{
            onRowAction: handleRowAction
          }}
        />

        <AddUserDialog
          open={addDialog.isOpen}
          onOpenChange={addDialog.setIsOpen}
          onSubmit={handleAddUser}
        />

        <EditUserDialog
          user={selectedUser}
          open={editDialog.isOpen}
          onOpenChange={editDialog.setIsOpen}
          onSubmit={handleEditUser}
        />

        <DeleteConfirmationDialog
          open={deleteDialog.isOpen}
          onOpenChange={deleteDialog.setIsOpen}
          onConfirm={() => userToDelete && handleDeleteUser(userToDelete.id)}
          title="Delete User"
          itemName={userToDelete?.email || 'this user'}
        />
      </div>
    </StateWrapper>
  )
}