
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#A99AE8',
        tabBarInactiveTintColor: '#827F91',

        tabBarStyle: {
          backgroundColor: '#1C1C25',
          height: 68,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#343342',
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="skin-analysis"
        options={{
          title: 'Skin',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="face-woman-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="hair-analysis"
        options={{
          title: 'Hair',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="hair-dryer"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="history"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
