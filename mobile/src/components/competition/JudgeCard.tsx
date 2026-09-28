import React, { useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { Judge } from '../../types/competition';

interface JudgeCardProps {
  judge: Judge;
}

export function JudgeCard({ judge }: JudgeCardProps): React.JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);

  const handlePlayIntro = async () => {
    if (!judge.introVideoUrl) return;
    const canOpen = await Linking.canOpenURL(judge.introVideoUrl);
    if (canOpen) {
      await Linking.openURL(judge.introVideoUrl);
    }
  };

  return (
    <View className="mx-4 mt-3 flex-row items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
      {imageFailed || !judge.image ? (
        <View className="h-14 w-14 items-center justify-center rounded-full bg-teal-surface">
          <Ionicons name="person" size={22} color={colors.brandTeal} />
        </View>
      ) : (
        <Image
          source={{ uri: judge.image }}
          className="h-14 w-14 rounded-full"
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          accessibilityLabel={`Photo of judge ${judge.name}`}
        />
      )}

      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-xs text-ink-secondary">Judge</Text>
        <Text className="text-[15px] font-semibold text-navy">{judge.name}</Text>
        <Text className="text-xs text-ink-secondary">{judge.profession}</Text>
        <Text className="text-xs text-ink-secondary">{judge.experience}</Text>
      </View>

      <Pressable
        onPress={handlePlayIntro}
        className="items-center gap-1"
        accessibilityRole="button"
        accessibilityLabel={`Play ${judge.name}'s intro video`}
        disabled={!judge.introVideoUrl}
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-teal-surface">
          <Ionicons name="play" size={16} color={colors.brandTeal} />
        </View>
        <Text className="text-xs text-ink-secondary">Intro Video</Text>
      </Pressable>
    </View>
  );
}