import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '../../constants/colors'
import { useAuth } from '../../context/AuthContext'

export default function HomeScreen() {
  const { user } = useAuth()

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>
        Hola, {user?.primer_nombre ?? 'Usuario'} 👋
      </Text>
      <Text style={styles.subtitle}>Bienvenido a UniFit</Text>
      {/* TODO: cards de resumen (próxima cita, rutina activa, última valoración) */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.text, marginTop: 50 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
})
