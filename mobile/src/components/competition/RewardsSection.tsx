import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors } from '../../constants/theme';
import { Reward } from '../../types/competition';

interface RewardsSectionProps {
  rewards: Reward[];
}

type IoniconName = ComponentProps<typeof Ionicons>['name'];

function iconForRank(index: number): { name: IoniconName; color: string } {
  if (index === 0) return { name: 'trophy', color: colors.gold };
  if (index === 1) return { name: 'medal', color: colors.silver };
  if (index === 2) return { name: 'medal', color: colors.bronze };
  return { name: 'star', color: colors.star };
}

export function RewardsSection({ rewards }: RewardsSectionProps): React.JSX.Element | null {
  if (rewards.length === 0) return null;

  return (
    <View className="mx-4 mt-5 gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <View className="flex-row items-baseline gap-1">
        <Text className="text-[17px] font-bold text-navy">Rewards</Text>
        <Text className="text-xs text-ink-secondary">(All Positions)</Text>
      </View>

      <View className="gap-2">
        {rewards.map((reward, index) => {
          const icon = iconForRank(index);
          return (
            <View key={`${reward.position}-${index}`} className="flex-row items-center justify-between gap-2 py-1">
              <View className="flex-1 flex-row items-center gap-2">
                <Ionicons name={icon.name} size={18} color={icon.color} />
                <Text className="shrink text-sm text-navy">{reward.position}</Text>
              </View>
              <Text className="shrink-0 text-sm font-semibold text-navy">
                ₹ {reward.amount.toLocaleString('en-IN')}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}