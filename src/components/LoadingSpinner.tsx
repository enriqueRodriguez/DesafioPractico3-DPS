import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Props {
  message?: string;
}

export default function LoadingSpinner({ message = 'Cargando...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.background,
  },
  message: { fontSize: 14, color: COLORS.textMuted },
});
