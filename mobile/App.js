import { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { registerForPushNotificationsAsync } from './src/notifications/push';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f7ff' }}>
      <View>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Smart Study Partner AI</Text>
        <Text style={{ marginTop: 8, color: '#334155' }}>Secure mobile client starter</Text>
      </View>
    </SafeAreaView>
  );
}
