import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = ({
  layout,
  navigation,
  options,
  route,
}: BottomTabHeaderProps) => {
  const { height, width } = layout;
  const insets = useSafeAreaInsets();
  return (
    <HStack
      className="justify-between items-center bg-background-0 p-4"
      style={{ paddingTop: insets.top }}
    >
      <VStack className="flex pt-4 ">
        <Heading size="2xl">Sonar NYC 🗽</Heading>
        <Heading size="sm">Real-Time Posts, Right Where You Are </Heading>
      </VStack>
    </HStack>
  );
};
export default Header;
