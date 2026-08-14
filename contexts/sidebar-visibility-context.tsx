import { createContext, useContext, useState } from 'react'

interface SidebarVisibilityContextType {
  isMainSidebarVisible: boolean
  setMainSidebarVisible: (visible: boolean) => void
}

const SidebarVisibilityContext = createContext<SidebarVisibilityContextType | undefined>(undefined)

export function SidebarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isMainSidebarVisible, setMainSidebarVisible] = useState(true)

  return (
    <SidebarVisibilityContext.Provider value={{ isMainSidebarVisible, setMainSidebarVisible }}>
      {children}
    </SidebarVisibilityContext.Provider>
  )
}

export function useSidebarVisibility() {
  const context = useContext(SidebarVisibilityContext)
  if (!context) {
    throw new Error('useSidebarVisibility must be used within a SidebarVisibilityProvider')
  }
  return context
}