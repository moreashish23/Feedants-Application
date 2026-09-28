import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { colors } from '../../constants/theme';
import { Competition } from '../../types/competition';
import { formatShortDate, formatShortTime } from '../../utils/date';

interface ImportantDatesProps {
  competition: Competition;
}

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface DateItem {
  icon: IoniconName;
  label: string;
  date: string;
}

export function ImportantDates({ competition }: ImportantDatesProps): React.JSX.Element {
  const items: DateItem[] = [
    { icon: 'calendar-outline', label: 'Register Before', date: competition.registrationEnd },
    { icon: 'paper-plane-outline', label: 'Submission Starts', date: competition.submissionStart },
    { icon: 'cloud-upload-outline', label: 'Submission Ends', date: competition.submissionEnd },
    { icon: 'trophy-outline', label: 'Result Date', date: competition.resultDate },
  ];

  return (
    <View className="mx-4 mt-3 gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
      <Text className="text-[17px] font-bold text-navy">Important Dates</Text>
      {/* One column on very narrow phones, two columns from `sm` (380px) up. */}
      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <View key={item.label} className="w-full flex-row gap-2 py-2 pr-2 sm:w-1/2">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-teal-surface">
              <Ionicons name={item.icon} size={16} color={colors.brandTeal} />
            </View>
            <View className="min-w-0 flex-1 gap-px">
              <Text className="text-xs text-ink-secondary">{item.label}</Text>
              <Text className="text-sm font-semibold text-navy">{formatShortDate(item.date)}</Text>
              <Text className="text-xs text-ink-secondary">{formatShortTime(item.date)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}