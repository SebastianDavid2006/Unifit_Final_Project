import { useCallback } from 'react'

const meshInputBg = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
const meshInputHover = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'

export function useMeshInput() {
  const enterMesh = useCallback((el: HTMLElement) => {
    if (el !== document.activeElement) {
      el.style.background = meshInputHover
      el.style.borderColor = 'rgba(0,0,0,0.06)'
    }
  }, [])

  const leaveMesh = useCallback((el: HTMLElement) => {
    if (el !== document.activeElement) {
      el.style.background = meshInputBg
      el.style.borderColor = 'transparent'
    }
  }, [])

  const focusMesh = useCallback((el: HTMLElement) => {
    el.style.borderColor = '#1270B7'
    el.style.background = meshInputHover
    el.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
  }, [])

  const blurMesh = useCallback((el: HTMLElement) => {
    el.style.borderColor = 'transparent'
    el.style.background = meshInputBg
    el.style.boxShadow = 'none'
  }, [])

  return { enterMesh, leaveMesh, focusMesh, blurMesh }
}