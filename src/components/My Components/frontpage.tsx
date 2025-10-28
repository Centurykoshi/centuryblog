"use client";

import Link from "next/link";

import { Search, XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./header";
import Blogging from "./Blogging";
import Model from "./model";


export default function Frontpage() {





    return (
        <>

            <Header />
            <Model />
            <Blogging />






        </>
    )
}