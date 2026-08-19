import { useIsMobile } from '@/shared/components/ui/use-mobile'

export function useAuthLayout({ autoDesktopVideo = false }: { autoDesktopVideo?: boolean } = {}) {
  const isMobile = useIsMobile()
  const isPhonePreview = isMobile
  const isDesktopVideo = autoDesktopVideo ? !isMobile : !isMobile

  return { isPhonePreview, isDesktopVideo, isMobile }
}