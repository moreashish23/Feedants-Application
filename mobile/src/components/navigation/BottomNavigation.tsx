import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface NavItem {
  key: string;
  label: string;
  icon: IoniconName;
  isCenter?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'explore', label: 'Explore', icon: 'search-outline' },
  { key: 'create', label: '', icon: 'add', isCenter: true },
  { key: 'competitions', label: 'Competitions', icon: 'trophy-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

interface BottomNavigationProps {
  activeKey?: string;
}

export function BottomNavigation({ activeKey = 'competitions' }: BottomNavigationProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-end border-t border-line bg-white px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {NAV_ITEMS.map((item) => {
        if (item.isCenter) {
          return (
            <View key={item.key} className="flex-1 items-center">
              <Pressable
                className="mb-2.5 h-12 w-12 items-center justify-center rounded-full bg-brand"
                accessibilityRole="button"
                accessibilityLabel="Create"
              >
                <Ionicons name={item.icon} size={26} color={colors.white} />
              </Pressable>
            </View>
          );
        }

        const isActive = item.key === activeKey;
        return (
          <Pressable
            key={item.key}
            className="min-w-0 flex-1 items-center gap-0.5"
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons name={item.icon} size={22} color={isActive ? colors.brandTeal : colors.textMuted} />
            <Text
              numberOfLines={1}
              className={`text-[10px] ${isActive ? 'font-bold text-brand' : 'text-ink-muted'}`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}