"use client";

import { useState, useTransition } from "react";

export type Status = "PUBLISHED" | "DRAFT" | "UNPUBLISHED";

type Props = {
    id: string;
    intialSatus: Status;
};


export default function SatusCell({ id, intialSatus }: Props) {
    const [value, setValue] = useState<Status>(intialSatus);
    const [saved, setSaved] = useState<Status>(intialSatus);
    const [isPending, startTransition] = useTransition();

    



} 
