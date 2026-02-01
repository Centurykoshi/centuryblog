"use client";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { Input } from "../ui/input";

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

            <div className="min-h-screen flex justify-center items-center">

                <Card className="min-w-md flex justify-center items-center flex-col ">

                    <CardTitle className="text-secondary text-md italic">
                        Welcome Back to <span className="pl-1 bg-linear-to-r text-md font-serif italic from-secondary to-primary bg-clip-text text-transparent">Cenno </span>
                    </CardTitle>

                    <CardDescription className="text-sm text-secondary -mt-5">

                        Sign In Cenno

                    </CardDescription>

                    <CardContent className="space-y-4 w-full">

                        <form onSubmit={HandleEmailSignin}>

                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={Email}
                                        onChange={(e) => SetEmail(e.target.value)}
                                        className="pl-10 h-9 text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </form>

                    </CardContent>


                </Card>

            </div >

        </>


    )
}