import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

const TTLPostSelect = () => {
  const timeOfLifeList = [
    { label: "15 Min", value: "0.25" },
    { label: "30 Min", value: "0.5" },
    { label: "1 hour", value: "1" },
  ];
  return (
    <Select>
      <SelectTrigger variant="rounded" size="sm">
        <SelectInput placeholder="Visible for" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {timeOfLifeList.map((item) => (
            <SelectItem
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};
export default TTLPostSelect;
