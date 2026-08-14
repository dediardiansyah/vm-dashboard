import { IGallery } from "./gallery"
import { IBanner } from "./banner"
import { IMember } from "./member"
import { IVoucher } from "./voucher"

export interface ICampaignAnalytics {
  avgSessionDuration: string
  bounceRate: string
  returnRate: string
  voucherRedemptions: number
  galleryViews: number
  shareRate: string
}

export interface ICampaign {
    id: number
    name: string
    description?: string | null
    subdomain: string
    about?: string | null
    howToPlay?: string | null
    createdAt: Date
    updatedAt: Date
    Banner: IBanner[]
    Gallery: IGallery[]
    Members: IMember[]
    Voucher: IVoucher[]
    analytics?: ICampaignAnalytics
  }
