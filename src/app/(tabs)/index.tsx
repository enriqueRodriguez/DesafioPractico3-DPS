import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import StateMessage from '@/components/StateMessage';
import { COLORS } from '@/constants/colors';
import { getErrorMessage } from '@/services/api';
import { getItems } from '@/services/resourceService';
import type { Book } from '@/types/Entity';

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function CatalogScreen() {
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  const loadBooks = useCallback(async (): Promise<void> => {
    try {
      const data = await getItems();
      setBooks([...data].reverse());
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks]),
  );

  const retry = (): void => {
    setLoading(true);
    loadBooks();
  };

  const refresh = (): void => {
    setRefreshing(true);
    loadBooks();
  };

  const search = normalize(query.trim());
  const filteredBooks = books.filter(
    (book) => normalize(book.title).includes(search) || normalize(book.author).includes(search),
  );

  if (loading) return <LoadingSpinner message="Cargando catálogo..." />;

  if (error) {
    return (
      <StateMessage
        icon="cloud-offline-outline"
        title="No se pudo cargar el catálogo"
        message={error}
        actionLabel="Reintentar"
        onAction={retry}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o autor"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
        />
        {query !== '' ? (
          <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Limpiar búsqueda">
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.count}>
        {search === ''
          ? `${books.length} libro(s) en el catálogo`
          : `${filteredBooks.length} de ${books.length} libro(s)`}
      </Text>

      <FlatList<Book>
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            book={item}
            onPress={() => router.push({ pathname: '/detail/[id]', params: { id: item.id } })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          search === '' ? (
            <StateMessage
              icon="library-outline"
              title="El catálogo está vacío"
              message='Agrega tu primer libro desde la pestaña "Agregar".'
            />
          ) : (
            <StateMessage
              icon="search-outline"
              title="Sin resultados"
              message={`Ningún libro coincide con "${query.trim()}".`}
            />
          )
        }
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 14, paddingTop: 12 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: COLORS.text },
  count: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600', marginVertical: 10 },
  list: { flexGrow: 1, paddingBottom: 16 },
});
