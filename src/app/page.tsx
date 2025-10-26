"use client";
import Frontpage from "@/components/My Components/frontpage";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Home() {

  const [click, setclicked] = useState(0);

  const buttonclicked = () => {
    setclicked(prev => prev + 1);
  }
  return (
    <div >
      <Frontpage />

    </div>
  );
}
