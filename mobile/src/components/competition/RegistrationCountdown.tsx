import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { useCountdown } from '../../hooks/useCountdown';
import { pad2 } from '../../utils/date';

interface RegistrationCountdownProps {
  label: string;
  targetDate: string;
  serverTime: string;
  fetchedAtMs: number;
  onExpire: () => void;
}

export function RegistrationCountdown({
  label,
  targetDate,
  serverTime,
  fetchedAtMs,
  onExpire,
}: RegistrationCountdownProps): React.JSX.Element {
  const countdown = useCountdown({ serverTime, fetchedAtMs, targetDate, onExpire });

  return (
    <View className="mx-4 mt-3 flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl bg-teal-surface px-3 py-3">
      <View className="flex-row items-center gap-1.5">
        <Ionicons name="hourglass-outline" size={16} color={colors.brandTeal} />
        <Text className="text-xs font-semibold text-brand-dark">{label}</Text>
      </View>

      <Text className="text-sm font-semibold text-brand-dark">
        {pad2(countdown.days)}d : {pad2(countdown.hours)}h : {pad2(countdown.minutes)}m :{' '}
        {pad2(countdown.seconds)}s
      </Text>

      <View className="flex-row items-center gap-1">
        <Ionicons name="alarm-outline" size={14} color={colors.brandTeal} />
        <Text className="text-xs font-semibold text-brand-dark">
          {countdown.expired ? 'Time up' : 'Hurry up!'}
        </Text>
      </View>
    </View>
  );
}