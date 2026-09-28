import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { Availability, Competition, UserState } from '../../types/competition';

interface CompetitionStatsProps {
  competition: Competition;
  availability: Availability;
  userState: UserState;
}

export function CompetitionStats({
  competition,
  availability,
  userState,
}: CompetitionStatsProps): React.JSX.Element {
  const progress =
    availability.capacity > 0 ? Math.min(availability.registeredCount / availability.capacity, 1) : 0;

  return (
    <View className="mx-4 gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between gap-2">
        <Text className="flex-1 text-[22px] font-bold text-navy">{competition.title}</Text>
        {userState.isRegistered && (
          <View className="flex-row items-center gap-1 rounded-full bg-teal-surface px-2 py-[5px]">
            <Ionicons name="checkmark-circle" size={14} color={colors.brandTeal} />
            <Text className="text-xs font-semibold text-brand">Registered</Text>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap items-center gap-2">
        {competition.category ? (
          <View className="rounded-lg bg-surface px-2 py-1">
            <Text className="text-xs font-semibold text-navy-muted">{competition.category}</Text>
          </View>
        ) : null}
        {competition.tags.map((tag) => (
          <View key={tag} className="rounded-lg bg-surface px-2 py-1">
            <Text className="text-xs font-semibold text-navy-muted">{tag}</Text>
          </View>
        ))}
        {competition.certificateAvailable && (
          <View className="flex-row items-center gap-1">
            <Ionicons name="trophy-outline" size={14} color={colors.brandTeal} />
            <Text className="text-xs font-semibold text-brand">Winners get certificate</Text>
          </View>
        )}
      </View>
      
      <View className="flex-row flex-wrap items-start gap-x-6 gap-y-3">
        <View className="gap-0.5">
          <Text className="text-xs text-ink-secondary">Prize Pool</Text>
          <Text className="text-xl font-bold text-brand">₹ {competition.prizePool.toLocaleString('en-IN')}</Text>
        </View>
        <View className="gap-0.5">
          <Text className="text-xs text-ink-secondary">Entry Fee</Text>
          <Text className="text-xl font-bold text-brand">₹ {competition.entryFee.toLocaleString('en-IN')}</Text>
        </View>
        <View className="min-w-[150px] flex-1 gap-1.5">
          <View className="flex-row items-center gap-1 sm:justify-end">
            <Ionicons name="people-outline" size={14} color={colors.brandTeal} />
            <Text className="shrink text-xs font-semibold text-navy">
              {availability.remainingSpots > 0
                ? `Only ${availability.remainingSpots} spots left`
                : 'Fully booked'}
            </Text>
          </View>
          <View className="h-1 overflow-hidden rounded-full bg-teal-surface-strong">
            <View className="h-full rounded-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </View>
          <Text className="text-xs text-ink-secondary sm:text-right">
            {availability.registeredCount} / {availability.capacity} Booked
          </Text>
        </View>
      </View>
    </View>
  );
}