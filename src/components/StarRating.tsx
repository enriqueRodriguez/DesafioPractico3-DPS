import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Props {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
}

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({ value, onChange, size = 16 }: Props) {
  return (
    <View style={styles.row} accessibilityLabel={`Calificación: ${value} de 5`}>
      {STARS.map((star) => {
        const icon = (
          <Ionicons name={star <= value ? 'star' : 'star-outline'} size={size} color={COLORS.star} />
        );
        if (!onChange) return <View key={star}>{icon}</View>;

        return (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={`Calificar con ${star} de 5`}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
