import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { BookStatus } from '@/types/Entity';

interface Props {
  status: BookStatus;
}

export default function StatusBadge({ status }: Props) {
  const available = status === 'Disponible';
  const color = available ? COLORS.success : COLORS.warning;

  return (
    <View
      style={[styles.badge, { backgroundColor: available ? COLORS.successSoft : COLORS.warningSoft }]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '700' },
});
