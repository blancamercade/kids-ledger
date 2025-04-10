import { KidProvider } from '@/context/KidContext'; // adjust if your alias differs

export default function RootLayout() {
  ...
  return (
    <KidProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </KidProvider>
  );
}
