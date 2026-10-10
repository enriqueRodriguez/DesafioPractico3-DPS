import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import BookForm from '@/components/BookForm';
import { COLORS } from '@/constants/colors';
import { getErrorMessage } from '@/services/api';
import { createItem } from '@/services/resourceService';
import type { BookInput } from '@/types/Entity';

export default function CreateScreen() {
  const router = useRouter();

  const [saving, setSaving] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);

  const handleCreate = async (book: BookInput): Promise<void> => {
    setSaving(true);
    try {
      const created = await createItem(book);
      setFormKey((key) => key + 1);
      Alert.alert('Libro agregado', `"${created.title}" ya forma parte del catálogo.`);
      router.navigate('/');
    } catch (error) {
      Alert.alert('No se pudo agregar el libro', getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>Completa los datos para registrar un libro nuevo.</Text>
        <BookForm
          key={formKey}
          submitLabel="Agregar al catálogo"
          submitting={saving}
          onSubmit={handleCreate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 32 },
  intro: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
});
