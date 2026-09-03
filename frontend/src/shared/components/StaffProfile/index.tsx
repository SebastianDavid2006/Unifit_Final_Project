import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Save, Key, User, Mail, Briefcase, Building2, Phone, Shield, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getUsuario, cerrarSesion } from '@/lib/auth'
import { actualizarPerfil } from '@/services/usuario.service'
import { api, mensajeError } from '@/lib/api'

interface StaffProfileProps {
  open: boolean
  onClose: () => void
}

const BLUE_GRAD = 'linear-gradient(135deg, #1270B7, #7ec8e3)'
const GREEN_GRAD = 'linear-gradient(135deg, #00fb64, #009b95)'

export default function StaffProfile({ open, onClose }: StaffProfileProps) {
  const usuarioRef = useRef(getUsuario())
  const usuario = usuarioRef.current
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cargo, setCargo] = useState('')
  const [area, setArea] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  useEffect(() => {
    if (open && usuario) {
      setLoading(true)
      setError('')
      setSuccess('')
      api.get(`/usuarios/${usuario.id_usuario}`)
        .then(res => {
          const u = res.data
          setPrimerNombre(u.primer_nombre ?? '')
          setSegundoNombre(u.segundo_nombre ?? '')
          setPrimerApellido(u.primer_apellido ?? '')
          setSegundoApellido(u.segundo_apellido ?? '')
          setEmail(u.email_contacto ?? '')
          setTelefono(u.telefono_contacto ?? '')
          if (u.profesor) {
            setCargo(u.profesor.cargo?.nombre_cargo ?? '')
            setArea(u.profesor.area?.nombre_area ?? '')
          } else if (u.administrativo) {
            setCargo(u.administrativo.cargo?.nombre_cargo ?? '')
            setArea(u.administrativo.area?.nombre_area ?? '')
          }
        })
        .catch(err => setError(mensajeError(err)))
        .finally(() => setLoading(false))
    }
  }, [open, usuario])

  useEffect(() => {
    if (open) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordError('')
      setPasswordSuccess('')
    }
  }, [open])

  if (!usuario) return null

  const handleSaveProfile = async () => {
    if (!primerNombre.trim() || !primerApellido.trim() || !email.trim()) {
      setError('Nombre, apellido y email son obligatorios')
      return
    }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await actualizarPerfil(usuario.id_usuario, {
        primer_nombre: primerNombre.trim(),
        segundo_nombre: segundoNombre.trim() || undefined,
        primer_apellido: primerApellido.trim(),
        segundo_apellido: segundoApellido.trim() || undefined,
        email_contacto: email.trim(),
        telefono_contacto: telefono.trim() || undefined,
      })
      setSuccess('Perfil actualizado correctamente')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }
    setChangingPassword(true)
    try {
      await api.put('/auth/cambiar-password', {
        password_actual: currentPassword,
        password_nueva: newPassword,
        confirmar_password: confirmPassword,
      })
      setPasswordSuccess('Contraseña cambiada correctamente. Serás redirigido al login...')
      setTimeout(() => {
        cerrarSesion()
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setPasswordError(mensajeError(err))
    } finally {
      setChangingPassword(false)
    }
  }

  const inputStyle = {
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: 500 as const,
    color: '#1A1A1E',
    outline: 'none',
    width: '100%',
    transition: 'all 0.2s',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl w-full max-w-lg mx-4 max-h-[85vh] overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 className="text-lg font-extrabold" style={{ color: '#1A1A1E' }}>Mi perfil</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                style={{ background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.3)' }}
              >
                <X size={15} />
              </motion.button>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-72px)] px-6 py-5">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>Cargando perfil...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.15)' }}>
                      <AlertCircle size={14} style={{ color: '#F43843' }} />
                      <p className="text-xs font-medium" style={{ color: '#F43843' }}>{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                      <CheckCircle2 size={14} style={{ color: '#22C55E' }} />
                      <p className="text-xs font-medium" style={{ color: '#22C55E' }}>{success}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl" style={{ background: 'rgba(18,112,183,0.04)', border: '1px solid rgba(18,112,183,0.08)' }}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: BLUE_GRAD }}>
                      {primerNombre[0]}{primerApellido[0]}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold" style={{ color: '#1A1A1E' }}>{primerNombre} {primerApellido}</p>
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: 'rgba(0,0,0,0.4)' }}>
                        <Shield size={10} className="inline mr-1" style={{ verticalAlign: 'middle' }} />
                        {usuario.rol === 'admin' ? 'Administrador' : 'Entrenador'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-bold mb-3" style={{ color: 'rgba(0,0,0,0.5)' }}>DATOS PERSONALES</p>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Primer nombre *</label>
                      <input value={primerNombre} onChange={e => setPrimerNombre(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Segundo nombre</label>
                      <input value={segundoNombre} onChange={e => setSegundoNombre(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Primer apellido *</label>
                      <input value={primerApellido} onChange={e => setPrimerApellido(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 block" style={{ color: 'rgba(0,0,0,0.45)' }}>Segundo apellido</label>
                      <input value={segundoApellido} onChange={e => setSegundoApellido(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 flex items-center gap-1" style={{ color: 'rgba(0,0,0,0.45)' }}>
                        <Mail size={10} /> Email *
                      </label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[10.5px] font-semibold mb-1 flex items-center gap-1" style={{ color: 'rgba(0,0,0,0.45)' }}>
                        <Phone size={10} /> Teléfono
                      </label>
                      <input value={telefono} onChange={e => setTelefono(e.target.value)} style={inputStyle} />
                    </div>
                  </div>

                  {(cargo || area) && (
                    <>
                      <p className="text-xs font-bold mb-3" style={{ color: 'rgba(0,0,0,0.5)' }}>CARGO Y ÁREA</p>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div>
                          <label className="text-[10.5px] font-semibold mb-1 flex items-center gap-1" style={{ color: 'rgba(0,0,0,0.45)' }}>
                            <Briefcase size={10} /> Cargo
                          </label>
                          <input value={cargo} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                        </div>
                        <div>
                          <label className="text-[10.5px] font-semibold mb-1 flex items-center gap-1" style={{ color: 'rgba(0,0,0,0.45)' }}>
                            <Building2 size={10} /> Área
                          </label>
                          <input value={area} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
                        </div>
                      </div>
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white mb-6 cursor-pointer"
                    style={{ background: saving ? 'rgba(18,112,183,0.5)' : BLUE_GRAD }}
                  >
                    <Save size={14} />
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </motion.button>

                  <div className="h-px mb-5" style={{ background: 'rgba(0,0,0,0.06)' }} />

                  <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'rgba(0,0,0,0.5)' }}>
                    <Key size={12} /> CAMBIAR CONTRASEÑA
                  </p>
                  {passwordError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3" style={{ background: 'rgba(244,56,67,0.08)', border: '1px solid rgba(244,56,67,0.15)' }}>
                      <AlertCircle size={14} style={{ color: '#F43843' }} />
                      <p className="text-xs font-medium" style={{ color: '#F43843' }}>{passwordError}</p>
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                      <CheckCircle2 size={14} style={{ color: '#22C55E' }} />
                      <p className="text-xs font-medium" style={{ color: '#22C55E' }}>{passwordSuccess}</p>
                    </div>
                  )}
                  <div className="flex flex-col gap-3 mb-4">
                    <input
                      type="password"
                      placeholder="Contraseña actual"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="Nueva contraseña (mín. 8 caracteres)"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      style={inputStyle}
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChangePassword}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-white cursor-pointer"
                    style={{
                      background: changingPassword || !currentPassword || !newPassword || !confirmPassword
                        ? 'rgba(0,155,149,0.3)'
                        : GREEN_GRAD,
                    }}
                  >
                    <Key size={14} />
                    {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
