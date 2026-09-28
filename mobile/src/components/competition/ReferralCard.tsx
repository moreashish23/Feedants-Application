import React, { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { Referral } from '../../types/competition';

interface ReferralCardProps {
  referral: Referral;
}

export function ReferralCard({ referral }: ReferralCardProps): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(referral.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferNow = async () => {
    try {
      await Share.share({ message: `Join me on Feedants! ${referral.link}` });
    } catch {
    }
  };

  return (
    <View className="mx-4 mt-5 gap-3 rounded-2xl border border-teal-surface-border bg-teal-surface p-4">
      <View className="flex-row items-center gap-2">
        <Ionicons name="megaphone-outline" size={20} color={colors.brandTealDark} />
        <Text className="flex-1 text-sm font-semibold text-navy">Refer &amp; Earn more discount</Text>
      </View>

      <View className="flex-row gap-2">
        <View className="min-w-0 flex-1 justify-center rounded-lg border border-teal-surface-border bg-white px-2 py-2.5">
          <Text className="text-xs text-navy-muted" numberOfLines={1}>
            {referral.link}
          </Text>
        </View>
        <Pressable
          onPress={handleCopy}
          className="justify-center rounded-lg border border-brand px-3"
          accessibilityRole="button"
          accessibilityLabel="Copy referral link"
        >
          <Text className="text-xs font-semibold text-brand">{copied ? 'Copied' : 'Copy Link'}</Text>
        </Pressable>
      </View>

      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Pressable
          onPress={handleReferNow}
          className="rounded-lg bg-brand px-4 py-2"
          accessibilityRole="button"
          accessibilityLabel="Refer now"
        >
          <Text className="text-xs font-semibold text-white">Refer Now</Text>
        </Pressable>
        <Text className="shrink text-xs text-brand-dark">
          You earn <Text className="font-bold">₹{referral.rewardPerSignup}</Text> for every signup
        </Text>
      </View>
    </View>
  );
}