import type { MouseEvent, FocusEvent, CSSProperties } from 'react'

export const BLUE = '#1270B7'
export const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
export const PAGE_SIZE = 6
export const MESH_BG = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.05) 0%, transparent 50%), rgba(0,0,0,0.03)'
export const MESH_HOVER = 'radial-gradient(ellipse at 30% 20%, rgba(18,112,183,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(18,112,183,0.08) 0%, transparent 50%), rgba(0,0,0,0.04)'
export const INSTITUTION_COLORS = ['#1270B7', '#F43843', '#F5A623', '#30D158', '#BF5AF2', '#FF9500', '#00C7BE', '#5E5CE6']

export const FIELD_STYLE: CSSProperties = {
  background: MESH_BG,
  color: '#1A1A1E',
  border: '1px solid transparent',
}

export function enterField(e: MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  if (e.currentTarget !== document.activeElement) {
    e.currentTarget.style.background = MESH_HOVER
    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
  }
}

export function leaveField(e: MouseEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  if (e.currentTarget !== document.activeElement) {
    e.currentTarget.style.background = MESH_BG
    e.currentTarget.style.borderColor = 'transparent'
  }
}

export function focusField(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = BLUE
  e.currentTarget.style.background = MESH_HOVER
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(18,112,183,0.08)'
}

export function blurField(e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'transparent'
  e.currentTarget.style.background = MESH_BG
  e.currentTarget.style.boxShadow = 'none'
}
