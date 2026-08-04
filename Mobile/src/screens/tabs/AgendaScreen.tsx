import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '../../constants/colors'

export default function AgendaScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      {/* TODO: citas del usuario */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginTop: 50 },
})
