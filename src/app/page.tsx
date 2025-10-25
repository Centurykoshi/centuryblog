"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {

  const [click, setclicked] = useState(0);

  const buttonclicked = () => {
    setclicked(prev => prev + 1);
  }
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <div className="flex justify-center items-center flex-col">
        <Button onClick={buttonclicked}>Click me</Button>
      </div>
      {click > 0 && <p>Button was clicked {click} times!</p>}
    </div>
  );
}
