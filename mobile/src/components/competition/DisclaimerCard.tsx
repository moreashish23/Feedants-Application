import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface DisclaimerCardProps {
  text: string;
}

export function DisclaimerCard({ text }: DisclaimerCardProps): React.JSX.Element | null {
  if (!text) return null;

  return (
    <View className="mx-4 mt-5 flex-row items-start gap-2 rounded-xl bg-teal-surface p-3">
      <Ionicons name="information-circle-outline" size={16} color={colors.brandTeal} />
      <Text className="flex-1 text-xs leading-[17px] text-brand-dark">
        <Text className="font-bold">Disclaimer: </Text>
        {text}
      </Text>
    </View>
  );
}