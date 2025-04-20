import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Only redirect if both isAuthenticated and user are truthy
    if (isAuthenticated && user) {
      // Use a timeout to ensure router is ready
      const timer = setTimeout(() => {
        // Redirect to the appropriate dashboard based on user type
        if (user.type === 'owner') {
          router.replace('/(app)/(owner)/dashboard');
        } else {
          router.replace('/(app)/(visitor)/dashboard');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}