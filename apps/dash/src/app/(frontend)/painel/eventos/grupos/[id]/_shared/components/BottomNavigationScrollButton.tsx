"use client";

import { Text } from "odinkit";

export function BottomNavigationScrollButton() {
  return (
    <>
      <Text>
        O evento ainda não pode ser publicado.{" "}
        <span
          className="cursor-pointer underline"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          Por que?
        </span>
      </Text>
    </>
  );
}
