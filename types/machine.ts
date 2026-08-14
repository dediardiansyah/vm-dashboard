export interface IMachine {
  id: number
  name: string
  status: "ACTIVE" | "DISCONNECTED"
  location?: string | null
  parfumes: {
    id: number
    name: string
  }[]
  createdAt: Date
  updatedAt: Date
}