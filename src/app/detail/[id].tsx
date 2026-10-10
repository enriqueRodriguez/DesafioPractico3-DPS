import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookCover from '@/components/BookCover';
import BookForm from '@/components/BookForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import StarRating from '@/components/StarRating';
import StateMessage from '@/components/StateMessage';
import StatusBadge from '@/components/StatusBadge';
import { COLORS } from '@/constants/colors';
import { getErrorMessage } from '@/services/api';
import { deleteItem, getItemById, updateItem } from '@/services/resourceService';
import type { Book, BookInput } from '@/types/Entity';

const formatDate = (iso?: string): string | null => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es-SV', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const loadBook = useCallback(async (): Promise<void> => {
    try {
      setBook(await getItemById(id));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadBook();
    }, [loadBook]),
  );

  const retry = (): void => {
    setLoading(true);
    loadBook();
  };

  const handleUpdate = async (changes: BookInput): Promise<void> => {
    setSaving(true);
    try {
      const updated = await updateItem(id, changes);
      setBook(updated);
      Alert.alert('Cambios guardados', 'El libro se actualizó correctamente.');
    } catch (err) {
      Alert.alert('No se pudo actualizar', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setDeleting(true);
    try {
      await deleteItem(id);
      router.back();
    } catch (err) {
      setDeleting(false);
      Alert.alert('No se pudo eliminar', getErrorMessage(err));
    }
  };

  const confirmDelete = (title: string): void => {
    Alert.alert(
      'Eliminar libro',
      `¿Seguro que deseas dar de baja "${title}" del inventario? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: handleDelete },
      ],
    );
  };

  if (loading) return <LoadingSpinner message="Cargando libro..." />;

  if (error || !book) {
    return (
      <StateMessage
        icon="alert-circle-outline"
        title="No se pudo cargar el libro"
        message={error ?? 'El libro no existe o fue eliminado.'}
        actionLabel="Reintentar"
        onAction={retry}
      />
    );
  }

  const registeredOn = formatDate(book.createdAt);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summary}>
          <BookCover key={book.imageUrl} uri={book.imageUrl} width={110} height={165} />
          <View style={styles.summaryInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.meta}>
              {book.category} · {book.year}
            </Text>
            <StatusBadge status={book.status} />
            <StarRating value={book.rating} size={18} />
            {registeredOn ? <Text style={styles.meta}>Registrado el {registeredOn}</Text> : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Editar libro</Text>
        <BookForm
          initialValues={book}
          submitLabel="Guardar cambios"
          submitting={saving}
          onSubmit={handleUpdate}
        />

        <Pressable
          style={styles.deleteButton}
          onPress={() => confirmDelete(book.title)}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={COLORS.danger} />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
              <Text style={styles.deleteText}>Eliminar libro</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16 },
  summary: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  summaryInfo: { flex: 1, gap: 6 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  author: { fontSize: 14, color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textMuted },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 22,
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerSoft,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  deleteText: { color: COLORS.danger, fontSize: 16, fontWeight: '700' },
});
