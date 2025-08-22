import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Changed from 768 to 640 for better mobile detection

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      const screenWidth = window.innerWidth
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // Consider mobile if screen is small AND has touch capability OR is a mobile device
      const mobile = screenWidth < MOBILE_BREAKPOINT && (hasTouch || isMobileDevice)
      
      setIsMobile(mobile)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      checkIsMobile()
    }
    
    mql.addEventListener("change", onChange)
    checkIsMobile() // Initial check
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
