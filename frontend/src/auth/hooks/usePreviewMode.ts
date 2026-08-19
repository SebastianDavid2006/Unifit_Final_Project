import { useState } from 'react'
import { useIsMobile } from '@/shared/components/ui/use-mobile'
import { getPreviewMode, setPreviewMode as persistPreviewMode, type PreviewMode } from '@/shared/previewMode'

interface UsePreviewModeOptions {
  autoDesktopVideo?: boolean
}

export function usePreviewMode({ autoDesktopVideo = false }: UsePreviewModeOptions = {}) {
  const isMobile = useIsMobile()
  const [previewMode, setPreviewMode] = useState<PreviewMode>(getPreviewMode)
  const changePreviewMode = (v: PreviewMode) => {
    persistPreviewMode(v)
    setPreviewMode(v)
  }
  const isDesktopVideo = previewMode === 'desktop' || (autoDesktopVideo && !isMobile)
  const isPhonePreview = previewMode === 'celular' || (previewMode === 'auto' && isMobile)
  return { previewMode, changePreviewMode, isDesktopVideo, isPhonePreview, isMobile }
}
