import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StateMessage({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={COLORS.textMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 8,
    backgroundColor: COLORS.background,
  },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  message: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
