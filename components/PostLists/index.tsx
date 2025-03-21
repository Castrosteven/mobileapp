import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { supabase } from "@/lib/supabase";
import { FlatList } from "react-native";
import { Box } from "../ui/box";

const PostLists = () => {
  const [posts, setPosts] = useState<
    { content: string; id: string; ttl: string | null }[]
  >([]);

  const [remainingTimes, setRemainingTimes] = useState<{
    [key: string]: string;
  }>({});

  const fetchPosts = async () => {
    const { count, data, error, status, statusText } = await supabase
      .from("posts")
      .select("content,id,ttl")
      .eq("hidden", false);
    if (error && status !== 406) {
      throw error;
    }
    if (data) {
      setPosts(data);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTimes((prevRemainingTimes) => {
        const updatedTimes = { ...prevRemainingTimes };
        posts.forEach((item) => {
          const ttlDate = new Date(item.ttl!);
          const currentTime = new Date();
          const diffInMilliseconds = ttlDate.getTime() - currentTime.getTime();

          // Calculate minutes and seconds
          const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
          const diffInSeconds = Math.floor((diffInMilliseconds % 60000) / 1000);

          // Format as "X minutes Y seconds"
          updatedTimes[
            item.id
          ] = `${diffInMinutes} minutes ${diffInSeconds} seconds`;
        });
        return updatedTimes;
      });
    }, 1000); // Update every second for more accuracy

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [posts]);

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
          filter: "hidden=eq.false",
        },
        (payload) => {
          console.log("Change received!", payload);
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            setPosts((prev) => {
              return [
                ...prev,
                {
                  content: payload.new.content,
                  id: payload.new.id,
                  ttl: payload.new.ttl,
                },
              ];
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (posts.length === 0) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>No posts found</Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => {
        const timeRemaining = remainingTimes[item.id];

        return (
          <Card size={"lg"} variant={"filled"} className="mb-8">
            <Heading size="md" className={"mb-1"}>
              {item.content}
            </Heading>
            <Text>Expiring in {timeRemaining}</Text>
          </Card>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
};
export default PostLists;
