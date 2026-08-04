import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

export default function ActivateScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [documento, setDocumento] = useState('')

  function handleActivate() {
    // TODO: conectar con authService.activate()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activar cuenta</Text>
      <Text style={styles.subtitle}>Ingresa tu correo y número de documento</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={Colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Número de documento"
        placeholderTextColor={Colors.textMuted}
        value={documento}
        onChangeText={setDocumento}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.btn} onPress={handleActivate}>
        <Text style={styles.btnText}>Enviar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 28 },
  input: { backgroundColor: Colors.surface, color: Colors.text, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
  link: { color: Colors.textMuted, textAlign: 'center', fontSize: 13 },
})
