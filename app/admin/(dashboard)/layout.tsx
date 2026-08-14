'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Bell, LogOut, Settings, User, Users, Search, LayoutDashboard, Moon, Sun, Package, ArrowLeft, Image, Gift, Globe, Copy, Database, Sprout, Factory, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { PERMISSIONS } from '@/lib/rbac/permissions'
import { PermissionGate } from '@/components/permission-gate'

const sidebarItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/admin/dashboard',
    permission: PERMISSIONS.USER_READ 
  },
  {
    icon: Sprout,
    label: 'Parfumes',
    href: '/admin/parfumes',
    permission: PERMISSIONS.USER_READ
  },
  {
    icon: Factory,
    label: 'Machines',
    href: '/admin/machines',
    permission: PERMISSIONS.USER_READ
  },
  // {
  //   icon: Package,
  //   label: 'Inventories',
  //   href: '/admin/inventories',
  //   permission: PERMISSIONS.USER_READ
  // },
  {
    icon: History,
    label: 'Transactions',
    href: '/admin/transactions',
    permission: PERMISSIONS.USER_READ
  },
  { 
    icon: Users,
    label: 'Users', 
    href: '/admin/users',
    permission: PERMISSIONS.USER_READ 
  },
]

function getCampaignSidebarItems(campaignId: string) {
  return [
    { icon: LayoutDashboard, label: 'Dashboard', href: `/admin/campaigns/${campaignId}`, permission: PERMISSIONS.CAMPAIGN_READ },
    { icon: Image, label: 'Banners', href: `/admin/campaigns/${campaignId}/banner`, permission: PERMISSIONS.CAMPAIGN_READ },
    { icon: Image, label: 'Gallery', href: `/admin/campaigns/${campaignId}/gallery`, permission: PERMISSIONS.CAMPAIGN_READ },
    { icon: Gift, label: 'Vouchers', href: `/admin/campaigns/${campaignId}/voucher`, permission: PERMISSIONS.CAMPAIGN_READ },
    { icon: Users, label: 'Members', href: `/admin/campaigns/${campaignId}/members`, permission: PERMISSIONS.CAMPAIGN_READ },
  ]
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}

// Create a client-side wrapper component
function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const campaignMatch = pathname.match(/^\/admin\/campaigns\/(\d+)/)
  const campaignId = campaignMatch ? campaignMatch[1] : null

  const currentSidebarItems = campaignId ? getCampaignSidebarItems(campaignId) : sidebarItems

  // Get user's name initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar className="border-r">
          <SidebarHeader className="py-4">
            {campaignId ? (
              <Button
                variant="ghost"
                className="mb-2 w-full justify-start px-4"
                asChild
              >
                <Link href="/admin/campaigns">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
                </Link>
              </Button>
            ) : null}

            {!campaignId && (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" className="w-full justify-start px-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xl">HMNS</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarHeader>
          <SidebarContent className="flex flex-col justify-between">
            <SidebarMenu className="px-4 py-2">
              {currentSidebarItems.map((item) => (
                <PermissionGate key={item.href} permission={item.permission as keyof typeof PERMISSIONS}>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href} 
                      className="w-full justify-start gap-4"
                    >
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </PermissionGate>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <div className="flex flex-col flex-1 w-full">
          <header className="sticky top-0 z-10 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="md:w-[300px] lg:w-[400px]"
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Search className="h-5 w-5" />
                      <span className="sr-only">Search</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <VisuallyHidden asChild>
                      <DialogTitle>Search</DialogTitle>
                    </VisuallyHidden>
                    <div className="grid gap-4 py-4">
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <nav className="flex items-center space-x-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${session?.user?.name || 'U'}`} 
                          alt={session?.user?.name || 'User'} 
                        />
                        <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session?.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/admin/login' })} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto p-6 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Export the server component as default
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}