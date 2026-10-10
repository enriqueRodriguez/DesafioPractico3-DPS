import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { Book, BookInput, BookStatus } from '@/types/Entity';

import CustomInput from './CustomInput';
import StarRating from './StarRating';

interface Props {
  initialValues?: Book;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (book: BookInput) => void;
}

interface FormState {
  title: string;
  author: string;
  category: string;
  year: string;
  imageUrl: string;
  status: BookStatus;
  rating: number;
}

type TextField = 'title' | 'author' | 'category' | 'year' | 'imageUrl';
type FormErrors = Record<TextField, string | null>;

const STATUSES: BookStatus[] = ['Disponible', 'Prestado'];

const NO_ERRORS: FormErrors = {
  title: null,
  author: null,
  category: null,
  year: null,
  imageUrl: null,
};

const toFormState = (book?: Book): FormState => ({
  title: book?.title ?? '',
  author: book?.author ?? '',
  category: book?.category ?? '',
  year: book ? String(book.year) : '',
  imageUrl: book?.imageUrl ?? '',
  status: book?.status ?? 'Disponible',
  rating: book?.rating ?? 0,
});

const validate = (form: FormState): FormErrors => {
  const currentYear = new Date().getFullYear();
  const year = Number(form.year.trim());

  return {
    title: form.title.trim().length < 2 ? 'Ingresa el título del libro.' : null,
    author: form.author.trim().length < 2 ? 'Ingresa el nombre del autor.' : null,
    category: form.category.trim() === '' ? 'Ingresa el género del libro.' : null,
    year:
      !/^\d{1,4}$/.test(form.year.trim()) || year < 1 || year > currentYear
        ? `Ingresa un año válido (entre 1 y ${currentYear}).`
        : null,
    imageUrl: !/^https:\/\/\S+$/i.test(form.imageUrl.trim())
      ? 'La portada debe ser una URL que inicie con https://'
      : null,
  };
};

export default function BookForm({ initialValues, submitLabel, submitting, onSubmit }: Props) {
  const [form, setForm] = useState<FormState>(() => toFormState(initialValues));
  const [errors, setErrors] = useState<FormErrors>(NO_ERRORS);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (): void => {
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== null)) return;

    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      year: Number(form.year.trim()),
      imageUrl: form.imageUrl.trim(),
      status: form.status,
      rating: form.rating,
      createdAt: initialValues?.createdAt,
    });
  };

  return (
    <View>
      <CustomInput
        label="Título"
        placeholder="Ej. Cien años de soledad"
        value={form.title}
        onChangeText={(text) => updateField('title', text)}
        error={errors.title}
      />
      <CustomInput
        label="Autor"
        placeholder="Ej. Gabriel García Márquez"
        value={form.author}
        onChangeText={(text) => updateField('author', text)}
        error={errors.author}
      />
      <CustomInput
        label="Género"
        placeholder="Ej. Novela"
        value={form.category}
        onChangeText={(text) => updateField('category', text)}
        error={errors.category}
      />
      <CustomInput
        label="Año de publicación"
        placeholder="Ej. 1967"
        value={form.year}
        onChangeText={(text) => updateField('year', text)}
        keyboardType="number-pad"
        maxLength={4}
        error={errors.year}
      />
      <CustomInput
        label="URL de la portada"
        placeholder="https://..."
        value={form.imageUrl}
        onChangeText={(text) => updateField('imageUrl', text)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        error={errors.imageUrl}
      />

      <Text style={styles.label}>Estado</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((status) => {
          const selected = form.status === status;
          return (
            <Pressable
              key={status}
              style={[styles.statusOption, selected ? styles.statusSelected : null]}
              onPress={() => updateField('status', status)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.statusText, selected ? styles.statusTextSelected : null]}>
                {status}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Calificación</Text>
      <View style={styles.ratingRow}>
        <StarRating
          value={form.rating}
          size={30}
          onChange={(value) => updateField('rating', value)}
        />
        <Text style={styles.ratingText}>
          {form.rating > 0 ? `${form.rating} de 5` : 'Sin calificar'}
        </Text>
      </View>

      <Pressable
        style={[styles.submit, submitting ? styles.submitDisabled : null]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  statusRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  statusSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  statusText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  statusTextSelected: { color: '#fff' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  ratingText: { fontSize: 13, color: COLORS.textMuted },
  submit: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.7 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
