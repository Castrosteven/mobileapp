import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useSession } from "@/context/AuthContext";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { session } = useSession();
  const router = useRouter();
  useEffect(() => {
    console.log(session);
    if (session) {
      router.push("/"); // Redirect to home if session exists
    }
  }, [session]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0 justify-center">
      <StatusBar />
      <VStack className="p-4 gap-8">
        <Box>
          <Input>
            <InputField
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
            />
          </Input>
        </Box>
        <Box>
          <Input>
            <InputField
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
            />
          </Input>
        </Box>
        <Box>
          <Button
            size="xl"
            onPress={() => signInWithEmail()}
            disabled={loading}
          >
            <ButtonText>Sign in</ButtonText>
          </Button>
        </Box>
        <Box>
          <Button
            disabled={loading}
            onPress={() => signUpWithEmail()}
            size="xl"
            variant="outline"
            action="primary"
          >
            <ButtonText>Sign up</ButtonText>
          </Button>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
