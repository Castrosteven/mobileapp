import PostLists from "@/components/PostLists";
import { Box } from "@/components/ui/box";
import React from "react";
export default function Index() {
  return (
    <Box className="bg-background-0 p-4 flex flex-col gap-8 flex-1">
      <PostLists />
    </Box>
  );
}
