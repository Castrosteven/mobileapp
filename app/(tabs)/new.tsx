import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon } from "lucide-react-native";
import React from "react";
import { GooglePlaceData } from "react-native-google-places-autocomplete";
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
import { ChevronDownIcon, Icon } from "@/components/ui/icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AutoComplete from "@/components/AutoComplete";
import { Button, ButtonText } from "@/components/ui/button";
import { useSession } from "@/context/AuthContext";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/lib/supabase";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { Text } from "@/components/ui/text";

interface IFormValues {
  ttlValue: string;
  place: GooglePlaceData | null;
  inputValue: string;
}

export default function Index() {
  const timeOfLifeList = [
    { label: "15 Min", value: "0.25" },
    { label: "30 Min", value: "0.5" },
    { label: "1 hour", value: "1" },
  ];
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Loading state for the submit button
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const defaultFormValues = {
    ttlValue: "",
    place: null,
    inputValue: "",
  };
  const [formValues, setFormValues] =
    React.useState<IFormValues>(defaultFormValues);
  const handleClose = () => {
    setShowActionsheet(false);
  };

  const [isWhatInvalid, setIsWhatInvalid] = React.useState(false);
  const [isWhereInvalid, setIsWhereInvalid] = React.useState(false);
  const [isTtlInvalid, setIsTtlInvalid] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(""); // For error messages

  const handleSubmit = async () => {
    setIsWhereInvalid(false);
    setIsWhatInvalid(false);
    setIsTtlInvalid(false);
    setErrorMessage(""); // Reset error message on submit attempt

    if (
      formValues.inputValue.length < 10 ||
      formValues.inputValue.length > 200
    ) {
      setIsWhatInvalid(true);
    }

    if (formValues.place === null) {
      setIsWhereInvalid(true);
    }

    if (formValues.ttlValue === "") {
      setIsTtlInvalid(true);
    }

    // Only proceed if form is valid
    if (!isWhatInvalid && !isWhereInvalid && !isTtlInvalid) {
      setLoading(true); // Set loading state to true

      if (session !== null) {
        try {
          const ttl = new Date(
            Date.now() + parseFloat(formValues.ttlValue) * 60 * 60 * 1000
          ).toISOString(); // Calculate TTL

          const { data, error, status } = await supabase
            .from("posts")
            .insert({
              content: formValues.inputValue,
              ttl: ttl,
              latitude: 40.758896,
              longitude: -73.98513,
              geofence_radius: 500,
            })
            .eq("user_id", session.user.id);

          if (status === 201) {
            setFormValues(defaultFormValues); // Reset form on success
            setLoading(false); // Set loading to false
          }

          if (error) {
            setLoading(false); // Stop loading if there's an error
            setErrorMessage(error.message); // Set error message
            Alert.alert("Error", error.message); // Show error alert
          }
        } catch (err) {
          setLoading(false); // Stop loading if there's a catch error
          setErrorMessage("An unexpected error occurred.");
          Alert.alert("Error", "An unexpected error occurred.");
        }
      }
    } else {
      setLoading(false); // Stop loading if form is invalid
    }
  };

  const setPlaceHandler = (place: GooglePlaceData) => {
    setFormValues((c) => ({ ...c, place }));
    setShowActionsheet(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }} // Ensure the content is scrollable
        keyboardShouldPersistTaps="handled" // Allow taps to dismiss the keyboard
      >
        <Box className="bg-background-0 p-4 flex flex-col gap-8 flex-1">
          <VStack className="flex flex-1 gap-8">
            {/* Description input field */}
            <FormControl isInvalid={isWhatInvalid}>
              <FormControlLabel>
                <FormControlLabelText>What is happening?</FormControlLabelText>
              </FormControlLabel>
              <Textarea>
                <TextareaInput
                  placeholder="What's happening?"
                  value={formValues.inputValue}
                  onChangeText={(text) =>
                    setFormValues((c) => ({ ...c, inputValue: text }))
                  }
                />
              </Textarea>
              <FormControlHelper>
                <FormControlHelperText>
                  {formValues.inputValue.length}/200
                </FormControlHelperText>
              </FormControlHelper>
              <FormControlError>
                <FormControlErrorText>
                  Atleast 10 characters are required.
                </FormControlErrorText>
                <FormControlErrorIcon as={AlertCircleIcon} />
              </FormControlError>
            </FormControl>

            {/* Location input field */}
            <FormControl size="lg" isInvalid={isWhereInvalid}>
              <FormControlLabel>
                <FormControlLabelText>
                  Where is this happening?
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="Search For Location"
                  onPress={() => setShowActionsheet(true)}
                  value={
                    (formValues.place && formValues.place.description) || ""
                  }
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>
                  You must select a location
                </FormControlErrorText>
                <FormControlErrorIcon as={AlertCircleIcon} />
              </FormControlError>
            </FormControl>

            {/* TTL dropdown */}
            <FormControl isInvalid={isTtlInvalid}>
              <FormControlLabel>
                <FormControlLabelText>
                  How long is going on for?
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                onValueChange={(value) =>
                  setFormValues((c) => ({ ...c, ttlValue: value }))
                }
              >
                <SelectTrigger variant="outline" size="lg">
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
              <FormControlError>
                <FormControlErrorText>
                  How long should this be visible?
                </FormControlErrorText>
                <FormControlErrorIcon as={AlertCircleIcon} />
              </FormControlError>
            </FormControl>

            {/* Submit button */}
            <Button
              size="lg"
              onPress={handleSubmit}
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <ButtonText> "Submitting..."</ButtonText>
              ) : (
                <ButtonText>Blast</ButtonText>
              )}
            </Button>
          </VStack>

          {/* Actionsheet for selecting location */}
          <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
            <ActionsheetBackdrop className="bg-primary-0" />
            <ActionsheetContent
              style={{
                display: "flex",
                flex: 1,
                marginTop: insets.top + 50,
              }}
            >
              <Box className="pt-4 flex flex-1 gap-4 w-full">
                <Heading size="lg">Search for a nearby location</Heading>
                <AutoComplete setPlaceHandler={setPlaceHandler} />
              </Box>
            </ActionsheetContent>
          </Actionsheet>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
