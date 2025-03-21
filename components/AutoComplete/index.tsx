import "react-native-get-random-values";
import React from "react";
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";

const API_KEY = "AIzaSyBiLLlBdmaUJRpDhDtOcCd30uyK1HAxWn8";

const AutoComplete = ({
  setPlaceHandler,
}: {
  setPlaceHandler: (place: GooglePlaceData) => void;
}) => {
  return (
    <GooglePlacesAutocomplete
      styles={{
        textInput: {
          backgroundColor: "transparent",
          borderRadius: 10,
          padding: 10,
          borderColor: "white",
          borderWidth: 1,
          color: "white",
          width: "100%",
        },
        listView: {
          backgroundColor: "transparent",
          borderRadius: 10,
          padding: 10,
          height: 50,
        },
        textInputContainer: {
          backgroundColor: "transparent",
        },
        row: {
          backgroundColor: "transparent",
        },
        container: {
          backgroundColor: "transparent",
          borderColor: "white",
        },
        separator: {},
        description: {
          color: "white",
        },
      }}
      placeholder="Search"
      query={{
        key: API_KEY,
        language: "en",
      }}
      fetchDetails={true}
      onPress={(data, details = null) => {
        setPlaceHandler(data);
      }}
      onFail={(error) => console.log(error)}
      enablePoweredByContainer={false}
    />
  );
};

export default AutoComplete;
