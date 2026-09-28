import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export function Testimonials(): React.JSX.Element {
  return (
    <Pressable
      className="mx-4 mt-5 flex-row items-center gap-2 rounded-2xl border border-line bg-white p-4"
      accessibilityRole="button"
      accessibilityLabel="See what participants say about Feedants"
    >
      <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.navy} />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-sm font-semibold text-navy">Hear From Our Users</Text>
        <Text className="text-xs text-ink-secondary">See what participants say about Feedants</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}