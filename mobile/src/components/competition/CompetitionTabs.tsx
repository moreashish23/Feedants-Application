import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import { Competition } from '../../types/competition';

interface CompetitionTabsProps {
  competition: Competition;
}

type TabKey = 'about' | 'judging' | 'rules';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'about', label: 'About Competition' },
  { key: 'judging', label: 'Judging Parameters' },
  { key: 'rules', label: 'Rules & Eligibility' },
];

const ABOUT_PREVIEW_LENGTH = 160;

function BulletList({ items }: { items: string[] }): React.JSX.Element {
  return (
    <View className="gap-1">
      {items.map((item, index) => (
        <View key={`${index}-${item.slice(0, 12)}`} className="flex-row items-start gap-2">
          <View className="mt-[7px] h-[5px] w-[5px] rounded-full bg-brand" />
          <Text className="flex-1 text-sm leading-5 text-ink-secondary">{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function CompetitionTabs({ competition }: CompetitionTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [aboutExpanded, setAboutExpanded] = useState(false);

  const aboutText = competition.aboutLong || competition.description;
  const isLongAbout = aboutText.length > ABOUT_PREVIEW_LENGTH;
  const displayedAboutText =
    !aboutExpanded && isLongAbout ? `${aboutText.slice(0, ABOUT_PREVIEW_LENGTH).trim()}...` : aboutText;

  return (
    <View className="mx-4 mt-5 rounded-2xl border border-line bg-white p-4 shadow-sm">
      {/* Equal-width tabs; labels wrap onto two lines on narrow phones instead of overlapping. */}
      <View className="flex-row border-b border-line">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className="flex-1 items-center justify-between px-0.5 pb-2"
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
            >
              <Text
                className={`text-center text-[11px] font-semibold sm:text-xs ${
                  isActive ? 'text-brand' : 'text-ink-secondary'
                }`}
              >
                {tab.label}
              </Text>
              <View className={`mt-2 h-0.5 w-4/5 rounded-full ${isActive ? 'bg-brand' : 'bg-transparent'}`} />
            </Pressable>
          );
        })}
      </View>

      <View className="pt-4">
        {activeTab === 'about' && (
          <View>
            <Text className="text-sm leading-5 text-ink-secondary">{displayedAboutText}</Text>
            {isLongAbout && (
              <Pressable
                onPress={() => setAboutExpanded((prev) => !prev)}
                className="mt-2 flex-row items-center justify-center gap-1"
                accessibilityRole="button"
                accessibilityLabel={aboutExpanded ? 'View less' : 'View more'}
              >
                <Text className="text-xs font-semibold text-brand">
                  {aboutExpanded ? 'View less' : 'View more'}
                </Text>
                <Ionicons name={aboutExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.brandTeal} />
              </Pressable>
            )}
          </View>
        )}

        {activeTab === 'judging' &&
          (competition.judgingParameters.length > 0 ? (
            <BulletList items={competition.judgingParameters} />
          ) : (
            <Text className="text-sm text-ink-muted">No judging parameters listed yet.</Text>
          ))}

        {activeTab === 'rules' && (
          <View className="gap-3">
            {competition.rules.length > 0 && (
              <View>
                <Text className="mb-1 text-sm font-semibold text-navy">Rules</Text>
                <BulletList items={competition.rules} />
              </View>
            )}
            {competition.eligibility.length > 0 && (
              <View>
                <Text className="mb-1 text-sm font-semibold text-navy">Eligibility</Text>
                <BulletList items={competition.eligibility} />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}