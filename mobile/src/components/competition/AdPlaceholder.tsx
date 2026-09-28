import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export function AdPlaceholder(): React.JSX.Element {
  return (
    <View className="mx-4 mt-5 flex-row items-center justify-center gap-1 rounded-xl border border-dashed border-line py-3">
      <Ionicons name="megaphone-outline" size={16} color={colors.textMuted} />
      <Text className="text-xs text-ink-muted">Ad Here</Text>
    </View>
  );
}