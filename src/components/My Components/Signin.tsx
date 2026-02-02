"use client";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Eye, EyeIcon, EyeOff, Loader2, Lock, LockIcon, Mail } from "lucide-react";
import { Input } from "../ui/input";
import { setPassword } from "better-auth/api";
import { motion } from "framer-motion";
import Header from "./header";
import GobackButton from "./GoBackButton";


export default function SigninPage() {
    const [Email, SetEmail] = useState<string>("");
    const [Password, SetPassword] = useState<string>("");
    const [ShowPassword, SetShowPassword] = useState<boolean>(true);
    const [isLoading, setisLoading] = useState<boolean>(false);
    const router = useRouter();

    console.log("Hi");


    const HandleEmailSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setisLoading(true);

        try {

            const result = await authClient.signIn.email({
                email: Email,
                password: Password,
            });

            if (result.error) {
                toast.error(result.error.message || "Invaid email or password. Please try again");
            }

            else {

                toast.success("Welcome back! Redirecting...");
                setTimeout(() => {

                    router.push("/Posts");

                }, 1500);

            }
        } catch (error: any) {
            toast.error(error.message || "Invaid email or password. Please try again");


        } finally {
            setisLoading(false);
        }
    };


    return (
        <>

            <div className="min-h-screen flex justify-center items-center relative overflow-hidden flex-col gap-4">

                


                <GobackButton Prop={{value : "Home Page", url:"/"} }/>
                {/* Animated background elements */}
                <motion.div
                    className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 w-full max-w-md px-4"
                >
                    <Card className="w-full backdrop-blur-sm bg-background/95 shadow-2xl border-2">

                        <CardHeader className="text-center space-y-2">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <CardTitle className="text-secondary text-xl italic">
                                    Welcome Back to <span className="pl-1 bg-linear-to-r text-xl font-serif italic from-secondary to-primary bg-clip-text text-transparent">Cenno </span>
                                </CardTitle>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <CardDescription className="text-sm text-secondary">
                                    Sign In Cenno
                                </CardDescription>
                            </motion.div>
                        </CardHeader>

                        <CardContent className="space-y-4 w-full">

                            <form onSubmit={HandleEmailSignin} >

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                >
                                    <div className="relative mb-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary font-bold" />
                                        </motion.div>
                                        <Input
                                            type="email"
                                            placeholder="Email address"
                                            value={Email}
                                            onChange={(e) => SetEmail(e.target.value)}
                                            className="pl-10 h-9 text-sm text-primary transition-all duration-300 focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                </motion.div>



                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >

                                    <div className="relative">
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <LockIcon className="absolute  left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary font-bold" />
                                        </motion.div>

                                        <Input type={ShowPassword ? "text" : "password"}
                                            placeholder="write your password"
                                            value={Password}
                                            onChange={(e) => SetPassword(e.target.value)}
                                            required
                                            className="pl-10 pr-10 h-10 text-sm transition-all duration-300 focus:scale-[1.02]" />

                                        <motion.div
                                        >
                                            <Button type="button" variant={"ghost"} className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-none bg-transparent h-7 w-7 p-0" onClick={() => SetShowPassword(!ShowPassword)}>

                                                {ShowPassword ? (<EyeOff className="h-3 w-3 bg-transparent" />) : (<EyeIcon className="h-3 w-3 bg-transparent" />)}


                                            </Button>
                                        </motion.div>



                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button type="submit" className="w-full h-10 mt-5 font-bold text-md cursor-pointer bg-secondary/40 text-primary hover:bg-primary/40 hover:text-muted-foreground transition-all duration-300" disabled={isLoading || !Email || !Password}>

                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Loader2 className="mr-2 h-4 w-4" />
                                            </motion.div>
                                        ) : "Login"}




                                    </Button>
                                </motion.div>





                            </form>

                        </CardContent>


                    </Card>
                </motion.div>

            </div >

        </>


    )
}