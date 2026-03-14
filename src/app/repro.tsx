import { useCallback, useMemo, useState } from "react";
import {
  ActionSheetIOS,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

export default function ZeegoKeyboardFocusDebugScreen() {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const [lastAction, setLastAction] = useState("None");
  const [isFocused, setIsFocused] = useState(false);

  const menuOptions = useMemo(() => ATTACHMENT_OPTIONS, []);

  const handleDirectMenuTriggerPress = useCallback(() => {
    setLastAction("Direct Zeego trigger tapped");
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setLastAction("Input focused");
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setLastAction("Input blurred");
  }, []);

  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
    setLastAction("Keyboard dismissed");
  }, []);

  const handleActionSheetPress = useCallback(() => {
    if (Platform.OS !== "ios") {
      setLastAction("ActionSheet test is iOS only");
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Take Photo", "Upload Image"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          setLastAction("ActionSheet select: Take Photo");
          return;
        }

        if (buttonIndex === 2) {
          setLastAction("ActionSheet select: Upload Image");
          return;
        }

        setLastAction("ActionSheet dismissed");
      },
    );
  }, []);

  return (
    <View
      className="flex-1 bg-[#F8F8F8] px-5 pt-6"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }}
    >
      <Text className="text-lg font-semibold text-[#111111]">
        Keyboard Opening Bug Repro:
      </Text>
      <Text className="mt-2 text-sm text-[#5F5F5F]">
        Minimal repro: one TextInput + Direct Zeego + ActionSheetIOS (iOS only).
      </Text>

      <View className="mt-8 flex-row items-center gap-3">
        <TextInput
          value={value}
          onChangeText={setValue}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Type and dismiss keyboard, then test buttons"
          className="h-12 flex-1 text-sm placeholder:text-sm rounded-2xl border border-[#D9D9D9] bg-white px-4  text-[#111111]"
        />
      </View>

      <View className="mt-4 flex-col items-start gap-3">
        <Text className="text-xs text-[#5F5F5F]">This is problematic:</Text>
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
                onSelect={() =>
                  setLastAction(`Direct menu select: ${option.label}`)
                }
              >
                <DropdownMenu.ItemTitle>{option.label}</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>

      <View className="mt-4 flex-col items-start gap-3">
        <Text className="text-xs text-[#5F5F5F]">Action Sheets are fine:</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleActionSheetPress}
          className="h-12 min-w-40 items-center justify-center rounded-xl border border-[#30402E]/30 bg-white px-3"
        >
          <Text className="text-sm font-medium text-[#30402E]">
            Native ActionSheetIOS
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleDismissKeyboard}
        className="mt-10 h-11 items-center justify-center rounded-xl border border-[#D9D9D9] bg-white"
      >
        <Text className="text-sm font-medium text-[#111111]">
          Dismiss Keyboard
        </Text>
      </TouchableOpacity>

      <View className="mt-6 rounded-xl border border-[#E6E6E6] bg-white px-4 py-3">
        <Text className="text-sm text-[#444444]">
          Input focused: {`${isFocused}`}
        </Text>
        <Text className="mt-1 text-sm text-[#444444]">
          Last action: {lastAction}
        </Text>
      </View>
    </View>
  );
}
