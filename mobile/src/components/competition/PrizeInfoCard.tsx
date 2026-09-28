import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface PrizeInfoCardProps {
  refundPolicy: string;
  paymentProvider: string;
}

export function PrizeInfoCard({ refundPolicy, paymentProvider }: PrizeInfoCardProps): React.JSX.Element {
  return (
    <View className="mx-4 mt-4 gap-3 sm:flex-row">
      <Pressable
        className="flex-row items-center gap-2 rounded-xl bg-teal-surface p-3 sm:flex-1"
        accessibilityRole="button"
        accessibilityLabel="Watch how you will receive prize money"
      >
        <View className="h-[34px] w-[34px] items-center justify-center rounded-full bg-white">
          <Ionicons name="play" size={16} color={colors.brandTeal} />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-xs font-semibold text-navy">How will you receive prize money?</Text>
          <Text className="text-[10px] text-ink-secondary">Watch video to know more</Text>
        </View>
      </Pressable>

      <View className="justify-between gap-2 rounded-xl border border-line bg-white p-3 shadow-sm sm:flex-1">
        <Pressable
          className="flex-row items-center gap-1"
          accessibilityRole="button"
          accessibilityLabel={`Refund policy: ${refundPolicy}`}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.brandTeal} />
          <Text className="flex-1 text-xs text-navy" numberOfLines={2}>
            Refund policy
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-1">
          <Ionicons name="shield-checkmark-outline" size={16} color={colors.brandTeal} />
          <Text className="flex-1 text-xs text-navy">
            Secure payments powered by <Text className="text-xs font-semibold text-brand">{paymentProvider}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}