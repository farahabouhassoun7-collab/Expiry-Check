import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../../src/theme';
import { Platform } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function tabIcon(focused: boolean, name: IconName, focusedName: IconName, color: string) {
  return <Ionicons name={focused ? focusedName : name} size={24} color={color} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown:           false,
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.outline,
        tabBarStyle: {
          backgroundColor:  Colors.backgroundPure,
          borderTopColor:   Colors.borderSubtle,
          borderTopWidth:   1,
          paddingBottom:    Platform.OS === 'ios' ? 20 : 8,
          paddingTop:       8,
          height:           Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: { ...Typography.caption, marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home',
          tabBarIcon: ({ focused, color }) => tabIcon(focused, 'home-outline', 'home', color) }}
      />
      <Tabs.Screen
        name="inventory"
        options={{ title: 'Inventory',
          tabBarIcon: ({ focused, color }) => tabIcon(focused, 'cube-outline', 'cube', color) }}
      />
      <Tabs.Screen
        name="alerts"
        options={{ title: 'Alerts',
          tabBarIcon: ({ focused, color }) => tabIcon(focused, 'alert-circle-outline', 'alert-circle', color),
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: Colors.error, fontSize: 10, minWidth: 16, height: 16 } }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile',
          tabBarIcon: ({ focused, color }) => tabIcon(focused, 'person-circle-outline', 'person-circle', color) }}
      />
    </Tabs>
  );
}
