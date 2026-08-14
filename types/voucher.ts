export interface IVoucher {
  id: number
  code: string
  maxUses: number
  usedCount: number
  createdAt: Date
}