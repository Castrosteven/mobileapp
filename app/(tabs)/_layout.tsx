import { Tabs, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomTabBar from "@/components/BottomNav";
import Header from "@/components/Header";
import { useSession } from "@/context/AuthContext";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: (BottomTabHeaderProps) => {
          return <Header {...BottomTabHeaderProps} />;
        },
      }}
      tabBar={CustomTabBar}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "New",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="plus" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

const StackLaoyt = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default function TabLayout() {
  const session = useSession();
  if (!session) {
    return <StackLaoyt />;
  }
  return <TabsLayout />;
}
