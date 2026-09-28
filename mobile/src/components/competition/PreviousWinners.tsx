import React, { useState } from 'react';
import { FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { PreviousWinner } from '../../types/competition';

interface PreviousWinnersProps {
  winners: PreviousWinner[];
}

function WinnerCard({ winner }: { winner: PreviousWinner }): React.JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);

  const handlePress = async () => {
    if (!winner.videoUrl) return;
    const canOpen = await Linking.canOpenURL(winner.videoUrl);
    if (canOpen) await Linking.openURL(winner.videoUrl);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mr-3 w-[100px] gap-1"
      accessibilityRole={winner.videoUrl ? 'button' : undefined}
      accessibilityLabel={`${winner.name}, ${winner.position}`}
    >
      <View className="relative">
        {imageFailed || !winner.image ? (
          <View className="h-[100px] w-[100px] items-center justify-center rounded-xl bg-teal-surface">
            <Ionicons name="person" size={24} color={colors.brandTeal} />
          </View>
        ) : (
          <Image
            source={{ uri: winner.image }}
            className="h-[100px] w-[100px] rounded-xl"
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        )}
        {winner.videoUrl ? (
          <View className="absolute bottom-1.5 right-1.5 h-[22px] w-[22px] items-center justify-center rounded-full bg-brand">
            <Ionicons name="play" size={12} color={colors.white} />
          </View>
        ) : null}
      </View>
      <Text className="text-xs font-semibold text-navy" numberOfLines={1}>
        {winner.name}
      </Text>
      <Text className="text-xs text-brand" numberOfLines={1}>
        {winner.position}
      </Text>
    </Pressable>
  );
}

export function PreviousWinners({ winners }: PreviousWinnersProps): React.JSX.Element | null {
  if (winners.length === 0) return null;

  return (
    <View className="mt-5 gap-3">
      <Text className="px-4 text-[17px] font-bold text-navy">Previous Winners</Text>
      <FlatList
        data={winners}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerClassName="px-4"
        renderItem={({ item }) => <WinnerCard winner={item} />}
      />
    </View>
  );
}