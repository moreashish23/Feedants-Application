import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface CompetitionHeaderProps {
  onBack?: () => void;
}

type Language = 'ENG' | 'हिंदी';

export function CompetitionHeader({ onBack }: CompetitionHeaderProps): React.JSX.Element {
  const [language, setLanguage] = useState<Language>('ENG');

  return (
    <View className="flex-row items-center justify-between gap-2 px-4 py-3">
      <Pressable
        onPress={onBack}
        className="shrink flex-row items-center gap-1"
        accessible
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
      >
        <Ionicons name="arrow-back" size={20} color={colors.navy} />
        <Text className="text-sm font-semibold text-navy">Go back</Text>
      </Pressable>

      <View className="flex-row items-center gap-0.5 rounded-full bg-teal-surface p-[3px]">
        <Pressable
          onPress={() => setLanguage('ENG')}
          className={`rounded-full px-3 py-1.5 ${language === 'ENG' ? 'bg-brand' : ''}`}
          accessibilityRole="button"
          accessibilityLabel="Switch to English"
        >
          <Text className={`text-xs font-semibold ${language === 'ENG' ? 'text-white' : 'text-brand'}`}>
            ENG
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setLanguage('हिंदी')}
          className={`rounded-full px-3 py-1.5 ${language === 'हिंदी' ? 'bg-brand' : ''}`}
          accessibilityRole="button"
          accessibilityLabel="Switch to Hindi"
        >
          <Text className={`text-xs font-semibold ${language === 'हिंदी' ? 'text-white' : 'text-brand'}`}>
            हिंदी
          </Text>
        </Pressable>
      </View>
    </View>
  );
}