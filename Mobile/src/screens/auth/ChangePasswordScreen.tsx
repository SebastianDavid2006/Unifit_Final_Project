import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

export default function ChangePasswordScreen({ navigation }: any) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleChange() {
    // TODO: conectar con authService.changePassword()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva contraseña</Text>
      <Text style={styles.subtitle}>Elige una contraseña segura</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor={Colors.textMuted}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleChange}>
        <Text style={styles.btnText}>Guardar contraseña</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 28 },
  input: { backgroundColor: Colors.surface, color: Colors.text, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 14, alignItems: 'center' },
  btnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
})
