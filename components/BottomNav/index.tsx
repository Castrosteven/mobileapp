import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { HStack } from "@/components/ui/hstack";
import { TouchableOpacity, useColorScheme } from "react-native";
import { Icon } from "@/components/ui/icon";

import { Nfc, Radar, Settings } from "lucide-react-native";

const CustomTabBar = (props: BottomTabBarProps) => {
  const icons: Record<string, any> = {
    index: Nfc,
    new: Radar,
    settings: Settings,
  };

  return (
    <HStack space="md" className=" p-8 bg-background-0 ">
      {props.state.routes.map((route, index) => {
        const { options } = props.descriptors[route.key];
        const isFocused = props.state.index === index;
        const onPress = () => {
          const event = props.navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            props.navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              opacity: isFocused ? 1 : 0.6,
            }}
          >
            <Icon className="" size="xl" as={icons[route.name]} />
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};
export default CustomTabBar;
