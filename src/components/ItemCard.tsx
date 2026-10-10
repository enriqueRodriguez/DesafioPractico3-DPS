import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { Book } from '@/types/Entity';

import BookCover from './BookCover';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';

interface Props {
  book: Book;
  onPress: () => void;
}

export default function ItemCard({ book, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}, ${book.author}, ${book.status}`}
    >
      <BookCover key={book.imageUrl} uri={book.imageUrl} width={64} height={96} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {book.category} · {book.year}
        </Text>
        <View style={styles.footer}>
          <StatusBadge status={book.status} />
          <StarRating value={book.rating} size={14} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 10,
  },
  cardPressed: { opacity: 0.7 },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  author: { fontSize: 13, color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textMuted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
});
