import * as Device from "expo-device";
import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import * as DropdownMenu from "zeego/dropdown-menu";

const ATTACHMENT_OPTIONS = [{ label: "Take Photo" }, { label: "Upload Image" }];

function ZeegoTriggerButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="h-12 min-w-40 items-center justify-center rounded-xl border border-[#30402E]/30 bg-white px-3"
    >
      <Text className="text-sm font-medium text-[#30402E]">{label}</Text>
    </TouchableOpacity>
  );
}

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const menuOptions = useMemo(() => ATTACHMENT_OPTIONS, []);

  const handleDirectMenuTriggerPress = useCallback(() => {
    // Keyboard test: triggers same flow as repro screen
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Home",
        }}
      />
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="ellipsis.circle">
          <Stack.Toolbar.MenuAction icon="pencil">
            Edit
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="square.and.arrow.up">
            Share
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Welcome to&nbsp;Expo
            </ThemedText>
          </ThemedView>

          <ThemedText type="code" style={styles.code}>
            get started
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.stepContainer}>
            <HintRow
              title="Try editing"
              hint={
                <ThemedText type="code">src/app/(home)/index.tsx</ThemedText>
              }
            />
            <HintRow title="Dev tools" hint={getDevMenuHint()} />
            <HintRow
              title="Fresh start"
              hint={<ThemedText type="code">npm run reset-project</ThemedText>}
            />
          </ThemedView>

          <View className="mt-4 flex-col items-start gap-3">
            <Text className="text-xs text-[#5F5F5F]">
              Direct Zeego (keyboard test):
            </Text>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild className="w-fit">
                <ZeegoTriggerButton
                  label="Direct Zeego"
                  onPress={handleDirectMenuTriggerPress}
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start">
                <DropdownMenu.Label>Attachments</DropdownMenu.Label>
                {menuOptions.map((option) => (
                  <DropdownMenu.Item
                    key={`direct-${option.label}`}
                    onSelect={() => {}}
                  >
                    <DropdownMenu.ItemTitle>
                      {option.label}
                    </DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </View>

          {Platform.OS === "web" && <WebBadge />}
        </SafeAreaView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
