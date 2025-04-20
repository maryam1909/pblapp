import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth-store";

export default function AppLayout() {
  const { isAuthenticated, user } = useAuthStore();

  // If the user is not authenticated, redirect to the auth screen
  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)" />;
  }

  // Return the appropriate layout based on user type
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user.type === 'owner' ? (
        <Stack.Screen name="(owner)" />
      ) : (
        <Stack.Screen name="(visitor)" />
      )}
    </Stack>
  );
}