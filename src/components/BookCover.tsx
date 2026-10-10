import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Props {
  uri: string;
  width: number;
  height: number;
}

export default function BookCover({ uri, width, height }: Props) {
  const [failed, setFailed] = useState<boolean>(false);

  if (!uri || failed) {
    return (
      <View style={[styles.cover, styles.placeholder, { width, height }]}>
        <Ionicons name="book-outline" size={width * 0.4} color={COLORS.textMuted} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.cover, { width, height }]}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

const styles = StyleSheet.create({
  cover: { borderRadius: 6, backgroundColor: COLORS.border },
  placeholder: { justifyContent: 'center', alignItems: 'center' },
});
