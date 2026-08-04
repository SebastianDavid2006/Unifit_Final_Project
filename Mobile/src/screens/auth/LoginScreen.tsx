import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    // TODO: conectar con authService.login()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UniFit</Text>
      <Text style={styles.subtitle}>Inicia sesión</Text>

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
        placeholder="Contraseña"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Activate')}>
        <Text style={styles.link}>¿Es tu primera vez? Activa tu cuenta</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', color: Colors.primary, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', marginBottom: 32 },
  input: { backgroundColor: Colors.surface, color: Colors.text, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 14 },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { color: Colors.white, fontWeight: '600', fontSize: 15 },
  link: { color: Colors.textMuted, textAlign: 'center', fontSize: 13 },
})
