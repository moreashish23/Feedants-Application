import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompetitionHeader } from '../components/competition/CompetitionHeader';
import { CompetitionStats } from '../components/competition/CompetitionStats';
import { JudgeCard } from '../components/competition/JudgeCard';
import { RegistrationCountdown } from '../components/competition/RegistrationCountdown';
import { ImportantDates } from '../components/competition/ImportantDates';
import { PreviousWinners } from '../components/competition/PreviousWinners';
import { CompetitionTabs } from '../components/competition/CompetitionTabs';
import { RewardsSection } from '../components/competition/RewardsSection';
import { DisclaimerCard } from '../components/competition/DisclaimerCard';
import { PrizeInfoCard } from '../components/competition/PrizeInfoCard';
import { ReferralCard } from '../components/competition/ReferralCard';
import { Testimonials } from '../components/competition/Testimonials';
import { AdPlaceholder } from '../components/competition/AdPlaceholder';
import { CompetitionActionButton } from '../components/competition/CompetitionActionButton';
import { SubmissionModal } from '../components/competition/SubmissionModal';
import { BottomNavigation } from '../components/navigation/BottomNavigation';

import { useAuth } from '../hooks/useAuth';
import { useCompetition } from '../hooks/useCompetition';
import { colors } from '../constants/theme';
import { COMPETITION_ID } from '../constants/config';
import { getActionConfig, getCountdownTarget } from '../utils/competitionState';

interface CompetitionDetailsScreenProps {
  competitionId?: string;
  onBack?: () => void;
}

export function CompetitionDetailsScreen({
  competitionId = COMPETITION_ID,
  onBack,
}: CompetitionDetailsScreenProps): React.JSX.Element {
  const { token, isLoading: isAuthLoading, error: authError, reauthenticate } = useAuth();
  const [isSubmissionModalVisible, setSubmissionModalVisible] = useState(false);

  const {
    data,
    fetchedAtMs,
    isLoading,
    isRefreshing,
    error,
    notFound,
    refetch,
    onPullToRefresh,
    isRegistering,
    registerError,
    register,
    isSubmitting,
    submitError,
    submit,
  } = useCompetition(competitionId, token, { onUnauthorized: reauthenticate });

  const action = useMemo(() => {
    if (!data) return null;
    return getActionConfig(data.lifecycle, data.userState);
  }, [data]);

  const countdownTarget = useMemo(() => {
    if (!data) return null;
    return getCountdownTarget(data.competition, data.lifecycle.state);
  }, [data]);

  const handleActionPress = useCallback(async () => {
    if (!action) return;

    if (action.kind === 'register') {
      await register();
      return;
    }

    if (action.kind === 'submit' || action.kind === 'update-submission') {
      setSubmissionModalVisible(true);
    }
  }, [action, register]);

  useEffect(() => {
    if (registerError) {
      Alert.alert('Registration failed', registerError);
    }
  }, [registerError]);

  const handleSubmitUrl = useCallback(
    async (url: string) => {
      const success = await submit(url);
      if (success) {
        setSubmissionModalVisible(false);
      }
    },
    [submit]
  );

  const isInitialLoading = isLoading || (isAuthLoading && !data);

  if (!competitionId) {
    return (
      <ScreenContainer>
        <CenterMessage
          icon="alert-circle-outline"
          title="Missing configuration"
          message="EXPO_PUBLIC_COMPETITION_ID is not set. Add the seeded competition's ID to your .env file."
        />
      </ScreenContainer>
    );
  }

  if (isInitialLoading) {
    return (
      <ScreenContainer>
        <CompetitionHeader onBack={onBack} />
        <View className="flex-1 items-center justify-center gap-2 px-6">
          <ActivityIndicator size="large" color={colors.brandTeal} />
          <Text className="text-sm text-ink-secondary">Loading competition…</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (notFound) {
    return (
      <ScreenContainer>
        <CompetitionHeader onBack={onBack} />
        <CenterMessage
          icon="search-outline"
          title="Competition not found"
          message="This competition doesn't exist or may have been removed."
        />
      </ScreenContainer>
    );
  }

  if (error && !data) {
    return (
      <ScreenContainer>
        <CompetitionHeader onBack={onBack} />
        <CenterMessage
          icon="cloud-offline-outline"
          title="Something went wrong"
          message={error.message}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  if (!data || !action || !countdownTarget) {
    // Defensive fallback - should be unreachable given the states above.
    return (
      <ScreenContainer>
        <CompetitionHeader onBack={onBack} />
        <CenterMessage icon="alert-circle-outline" title="No data available" message="Please try again." onRetry={refetch} />
      </ScreenContainer>
    );
  }

  const { competition, availability, userState, serverTime } = data;

  return (
    <ScreenContainer>
      <CompetitionHeader onBack={onBack} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 pb-5"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onPullToRefresh}
            tintColor={colors.brandTeal}
            colors={[colors.brandTeal]}
          />
        }
      >
        {authError && !token && (
          <View className="mx-4 flex-row items-center gap-1 rounded-[10px] bg-danger-surface p-2">
            <Ionicons name="warning-outline" size={14} color={colors.danger} />
            <Text className="flex-1 text-xs text-danger">
              Couldn&apos;t sign you in automatically. Registration/submission will be unavailable
              until this is resolved.
            </Text>
          </View>
        )}

        <CompetitionStats competition={competition} availability={availability} userState={userState} />

        <JudgeCard judge={competition.judge} />

        {countdownTarget.show && (
          <RegistrationCountdown
            label={countdownTarget.label}
            targetDate={countdownTarget.targetDate}
            serverTime={serverTime}
            fetchedAtMs={fetchedAtMs}
            onExpire={refetch}
          />
        )}

        <ImportantDates competition={competition} />

        <PreviousWinners winners={competition.previousWinners} />

        <CompetitionTabs competition={competition} />

        <RewardsSection rewards={competition.rewards} />

        <DisclaimerCard text={competition.rules[0] ?? ''} />

        <PrizeInfoCard refundPolicy={competition.refundPolicy} paymentProvider={competition.paymentProvider} />

        <ReferralCard referral={competition.referral} />

        <Testimonials />

        <AdPlaceholder />

        <View className="h-5" />
      </ScrollView>

      <View className="border-t border-line bg-white">
        <CompetitionActionButton
          action={action}
          isBusy={isRegistering || isSubmitting}
          onPress={handleActionPress}
        />
        <BottomNavigation activeKey="competitions" />
      </View>

      <SubmissionModal
        visible={isSubmissionModalVisible}
        isSubmitting={isSubmitting}
        submitError={submitError}
        existingUrl={userState.submissionUrl}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={handleSubmitUrl}
      />
    </ScreenContainer>
  );
}

function ScreenContainer({ children }: { children: React.ReactNode }): React.JSX.Element {
  // Top safe-area inset applied as padding (dynamic value); the bottom inset is
  // handled by BottomNavigation so it can sit flush with the screen edge.
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
}

interface CenterMessageProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
  onRetry?: () => void;
}

function CenterMessage({ icon, title, message, onRetry }: CenterMessageProps): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-6">
      <Ionicons name={icon} size={40} color={colors.textMuted} />
      <Text className="mt-2 text-[17px] font-bold text-navy">{title}</Text>
      <Text className="text-center text-sm text-ink-secondary">{message}</Text>
      {onRetry ? (
        <Text onPress={onRetry} className="mt-3 text-sm font-semibold text-brand" accessibilityRole="button">
          Retry
        </Text>
      ) : null}
    </View>
  );
}