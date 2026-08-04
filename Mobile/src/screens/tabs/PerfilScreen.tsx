import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'

export default function PerfilScreen() {
  const { user, logout } = useAuth()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.name}>{user?.primer_nombre} {user?.primer_apellido}</Text>
      <Text style={styles.email}>{user?.email_contacto}</Text>
      {/* TODO: editar datos, cambiar contraseña, subir documentos */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 50 },
  name: { fontSize: 18, color: Colors.text, marginTop: 12 },
  email: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  logoutBtn: { marginTop: 40, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.error, borderRadius: 10, padding: 14, alignItems: 'center' },
  logoutText: { color: Colors.error, fontWeight: '600' },
})
