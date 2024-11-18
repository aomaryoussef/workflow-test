"use client";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";

export default function IndexPage() {
  return (
    <Authenticated key="home-page">
      <NavigateToResource />
    </Authenticated>
  );
}
