import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Cropper from 'react-easy-crop'
import { X } from 'lucide-react'
import { BLUE, RED, BLUE_GRAD } from '../../data/constants'
import machineImg from '../../assets/illustrations/objects/machine.png'

interface ImageEditorModalProps {
  show: boolean
  imageToEdit: string
  crop: { x: number; y: number }
  zoom: number
  croppedAreaPixels: { x: number; y: number; width: number; height: number } | null
  cinematicIntensity: number
  naturalSize: { width: number; height: number }
  onCropChange: (crop: { x: number; y: number }) => void
  onZoomChange: (zoom: number) => void
  onCroppedAreaPixelsChange: (area: any) => void
  onCinematicIntensityChange: (v: number) => void
  onApply: () => void
  onClose: () => void
}

export function ImageEditorModal(props: ImageEditorModalProps) {
  function getCinematicFilter(intensity: number): string {
    const t = intensity / 100
    const contrast = 1 + t * 0.35
    const brightness = 1 - t * 0.1
    const saturate = 1 - t * 0.25
    const sepia = t * 0.12
    const hueRotate = t * 10
    return `contrast(${contrast}) brightness(${brightness}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hueRotate}deg)`
  }

  return (
    <AnimatePresence>
      {props.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}
          onClick={() => props.onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            className="rounded-3xl w-full max-w-xl flex flex-col mx-4 overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.04)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.12)',
              maxHeight: '90vh',
            }}
          >
            <div className="flex items-center justify-between p-4 pb-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 className="text-base font-bold" style={{ color: '#1A1A1E' }}>Editar imagen</h2>
              <motion.button
                whileHover={{ scale: 1.15, background: 'rgba(244,56,67,0.1)', color: RED }}
                whileTap={{ scale: 0.9 }}
                onClick={() => props.onClose()}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
              >
                <X size={15} />
              </motion.button>
            </div>

            <div className="flex" style={{ height: 380, background: '#f5f5f5' }}>
              <div className="flex-1 relative">
                <Cropper
                  image={props.imageToEdit}
                  crop={props.crop}
                  zoom={props.zoom}
                  aspect={4 / 3}
                  onCropChange={props.onCropChange}
                  onZoomChange={props.onZoomChange}
                  onCropComplete={(_: unknown, pixels) => props.onCroppedAreaPixelsChange(pixels)}
                  style={{ containerStyle: { borderRadius: 0 } }}
                  imgStyle={{ filter: getCinematicFilter(props.cinematicIntensity) }}
                />
              </div>

              {/* Live previews */}
              <div className="flex-shrink-0 w-[200px] p-3 flex flex-col gap-4 overflow-y-auto">
                {/* Card preview */}
                <div>
                  <span className="text-[9px] font-bold block mb-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>VISTA EN TARJETAS</span>
                  <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ width: 176, height: 132 }}>
                      <div className="w-full h-full overflow-hidden relative">
                        {props.croppedAreaPixels && props.naturalSize.width > 0 ? (
                          <img
                            src={props.imageToEdit}
                            alt=""
                            className="absolute"
                            style={{
                              width: props.naturalSize.width * (176 / props.croppedAreaPixels.width),
                              height: props.naturalSize.height * (176 / props.croppedAreaPixels.width),
                              transform: `translate(${-props.croppedAreaPixels.x * (176 / props.croppedAreaPixels.width)}px, ${-props.croppedAreaPixels.y * (176 / props.croppedAreaPixels.width)}px)`,
                              filter: getCinematicFilter(props.cinematicIntensity),
                              maxWidth: 'none',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[9px]" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone screen preview */}
                <div>
                  <span className="text-[9px] font-bold block mb-1.5" style={{ color: 'rgba(0,0,0,0.3)' }}>VISTA EN APP MÓVIL</span>
                  <div className="mx-auto rounded-[18px] overflow-hidden" style={{ border: '2px solid rgba(0,0,0,0.12)', background: '#fff' }}>
                    <div style={{ width: 120, height: 213 }}>
                      <div className="w-full h-full overflow-hidden relative">
                        {props.croppedAreaPixels && props.naturalSize.width > 0 ? (
                          <img
                            src={props.imageToEdit}
                            alt=""
                            className="absolute"
                            style={{
                              width: props.naturalSize.width * (120 / props.croppedAreaPixels.width),
                              height: props.naturalSize.height * (120 / props.croppedAreaPixels.width),
                              transform: `translate(${-props.croppedAreaPixels.x * (120 / props.croppedAreaPixels.width)}px, ${-props.croppedAreaPixels.y * (120 / props.croppedAreaPixels.width)}px)`,
                              filter: getCinematicFilter(props.cinematicIntensity),
                              maxWidth: 'none',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[9px]" style={{ color: 'rgba(0,0,0,0.15)' }}>—</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic intensity */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold" style={{ color: 'rgba(0,0,0,0.35)' }}>ESTILO CINEMATOGRÁFICO</span>
                <span className="text-[10px] font-bold" style={{ color: props.cinematicIntensity > 50 ? '#F43843' : BLUE }}>{props.cinematicIntensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={props.cinematicIntensity}
                onChange={e => props.onCinematicIntensityChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: props.cinematicIntensity > 50 ? '#F43843' : BLUE }}
              />
              <div className="flex justify-between text-[9px] mt-1" style={{ color: 'rgba(0,0,0,0.2)' }}>
                <span>Original</span>
                <span>Cinematográfico</span>
              </div>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.35)' }}>ZOOM</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={props.zoom}
                onChange={e => props.onZoomChange(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: BLUE }}
              />
              <span className="text-[10px] font-bold flex-shrink-0" style={{ color: 'rgba(0,0,0,0.4)' }}>{props.zoom.toFixed(1)}x</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => props.onClose()}
                className="px-4 py-2.5 rounded-xl text-xs font-medium"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)' }}
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 25px rgba(18,112,183,0.35)' }}
                whileTap={{ scale: 0.92 }}
                onClick={props.onApply}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white"
                style={{ background: BLUE_GRAD }}
              >
                Aplicar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
