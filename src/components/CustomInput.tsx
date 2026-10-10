import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { COLORS } from '@/constants/colors';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

export default function CustomInput({ label, error, style, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={COLORS.textMuted}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger },
  error: { fontSize: 12, color: COLORS.danger, marginTop: 4 },
});
