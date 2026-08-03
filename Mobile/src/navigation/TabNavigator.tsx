import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from '../constants/colors'

import HomeScreen from '../screens/tabs/HomeScreen'
import RutinasScreen from '../screens/tabs/RutinasScreen'
import ValoracionesScreen from '../screens/tabs/ValoracionesScreen'
import AgendaScreen from '../screens/tabs/AgendaScreen'
import PerfilScreen from '../screens/tabs/PerfilScreen'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Rutinas" component={RutinasScreen} />
      <Tab.Screen name="Valoraciones" component={ValoracionesScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  )
}
