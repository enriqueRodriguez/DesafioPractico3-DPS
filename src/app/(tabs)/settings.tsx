import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import CustomInput from '@/components/CustomInput';
import { COLORS } from '@/constants/colors';
import { DEFAULT_BASE_URL, REQUEST_TIMEOUT, RESOURCE } from '@/constants/config';
import { getBaseUrl, getErrorMessage, setBaseUrl } from '@/services/api';
import { getItems } from '@/services/resourceService';

interface TestResult {
  ok: boolean;
  message: string;
}

export default function SettingsScreen() {
  const [currentUrl, setCurrentUrl] = useState<string>(getBaseUrl());
  const [url, setUrl] = useState<string>(getBaseUrl());
  const [urlError, setUrlError] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const applyUrl = (value: string): void => {
    setBaseUrl(value);
    setCurrentUrl(getBaseUrl());
    setUrl(getBaseUrl());
    setUrlError(null);
    setResult(null);
  };

  const save = (): void => {
    if (!/^https?:\/\/\S+$/i.test(url.trim())) {
      setUrlError('Ingresa una URL válida que inicie con http:// o https://');
      return;
    }
    applyUrl(url);
  };

  const testConnection = async (): Promise<void> => {
    setTesting(true);
    setResult(null);
    try {
      const books = await getItems();
      setResult({ ok: true, message: `Conexión correcta: ${books.length} libro(s) en ${RESOURCE}.` });
    } catch (error) {
      setResult({ ok: false, message: getErrorMessage(error) });
    } finally {
      setTesting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conexión actual</Text>
          <Text style={styles.rowLabel}>URL base</Text>
          <Text style={styles.rowValue} selectable>
            {currentUrl}
          </Text>
          <Text style={styles.rowLabel}>Recurso</Text>
          <Text style={styles.rowValue}>{RESOURCE}</Text>
          <Text style={styles.rowLabel}>Tiempo de espera</Text>
          <Text style={styles.rowValue}>{REQUEST_TIMEOUT / 1000} segundos</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cambiar URL base</Text>
          <CustomInput
            label="Nueva URL base"
            placeholder="https://TU_ID.mockapi.io/api/v1"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            error={urlError}
          />
          <Pressable style={styles.primaryButton} onPress={save}>
            <Text style={styles.primaryButtonText}>Guardar URL</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => applyUrl(DEFAULT_BASE_URL)}>
            <Text style={styles.secondaryButtonText}>Restaurar URL por defecto</Text>
          </Pressable>
          <Text style={styles.note}>
            El cambio dura mientras la app esté abierta. Para dejarlo fijo, edita DEFAULT_BASE_URL en
            src/constants/config.ts.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Probar conexión</Text>
          <Pressable style={styles.primaryButton} onPress={testConnection} disabled={testing}>
            {testing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Probar GET {RESOURCE}</Text>
            )}
          </Pressable>
          {result ? (
            <Text style={[styles.result, result.ok ? styles.resultOk : styles.resultError]}>
              {result.message}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 32, gap: 14 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  rowLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 6 },
  rowValue: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  primaryButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: { color: COLORS.primary, fontSize: 15, fontWeight: '700' },
  note: { fontSize: 12, color: COLORS.textMuted, marginTop: 10, lineHeight: 17 },
  result: { marginTop: 12, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: '600' },
  resultOk: { backgroundColor: COLORS.successSoft, color: COLORS.success },
  resultError: { backgroundColor: COLORS.dangerSoft, color: COLORS.danger },
});
