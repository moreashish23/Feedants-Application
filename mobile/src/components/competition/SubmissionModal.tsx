import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

interface SubmissionModalProps {
  visible: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  existingUrl?: string;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function SubmissionModal({
  visible,
  isSubmitting,
  submitError,
  existingUrl,
  onClose,
  onSubmit,
}: SubmissionModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [url, setUrl] = useState(existingUrl ?? '');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = url.trim();
    if (!isValidUrl(trimmed)) {
      setLocalError('Please enter a valid URL, e.g. https://drive.google.com/...');
      return;
    }
    setLocalError(null);
    onSubmit(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-[rgba(18,32,58,0.4)]"
      >
        <View
          className="gap-3 rounded-t-[20px] bg-white px-5 pt-5"
          style={{ paddingBottom: 20 + insets.bottom }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[17px] font-bold text-navy">Upload Submission</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.navy} />
            </Pressable>
          </View>

          <Text className="text-sm text-ink-secondary">
            Paste a link to your performance (e.g. a Google Drive, YouTube, or Dropbox link).
          </Text>

          <TextInput
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              if (localError) setLocalError(null);
            }}
            placeholder="https://..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            className="rounded-xl border border-line px-3 py-3 text-sm text-navy"
            accessibilityLabel="Submission URL"
          />

          {(localError || submitError) && (
            <Text className="text-xs text-danger">{localError ?? submitError}</Text>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`mt-1 items-center rounded-xl bg-brand py-3 ${isSubmitting ? 'opacity-70' : ''}`}
            accessibilityRole="button"
            accessibilityLabel="Submit"
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text className="text-sm font-semibold text-white">
                {existingUrl ? 'Update Submission' : 'Submit'}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}