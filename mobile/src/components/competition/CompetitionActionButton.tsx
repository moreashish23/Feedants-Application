import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { colors } from '../../constants/theme';
import { ActionConfig } from '../../utils/competitionState';

interface CompetitionActionButtonProps {
  action: ActionConfig;
  isBusy: boolean;
  onPress: () => void;
}

export function CompetitionActionButton({
  action,
  isBusy,
  onPress,
}: CompetitionActionButtonProps): React.JSX.Element {
  const isInteractive = action.kind !== 'none' && !action.disabled;
  const isDisabled = !isInteractive || isBusy;

  return (
    <View className="px-4 pt-2">
      <Pressable
        onPress={isInteractive ? onPress : undefined}
        disabled={isDisabled}
        className={`items-center justify-center rounded-xl py-3 ${
          isDisabled ? 'bg-teal-surface-border' : 'bg-brand'
        }`}
        accessibilityRole="button"
        accessibilityLabel={action.label}
        accessibilityState={{ disabled: isDisabled }}
      >
        {isBusy ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <>
            <Text className="text-[15px] font-semibold text-white">{action.label}</Text>
            {action.sublabel ? <Text className="mt-0.5 text-xs text-white/85">{action.sublabel}</Text> : null}
          </>
        )}
      </Pressable>
    </View>
  );
}