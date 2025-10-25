"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Eye, EyeClosed, EyeIcon, EyeOffIcon, LetterText, Loader, User } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function AdminSignup() {
    const [name, setname] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [password, setpassword] = useState<string>("");
    const [confirmPassword, setconfirmPassword] = useState<string>("");
    const [showConfirmPassword, setshowConfirmPassword] = useState<boolean>(false);
    const [showPassword, setshowPassword] = useState<boolean>(false);
    const [isloading, setisloading] = useState<boolean>(false);
    const router = useRouter();

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setisloading(true);


        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setisloading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            setisloading(false);
            return;
        }

        try {
            const result = await authClient.signUp.email({
                name,
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to create account. Please try again.");
            }
            else {
                toast.success("Welcome to getOkay! Account created successfully!");
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            }
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
        } finally {
            setisloading(false);

        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen">

            <Card className="max-w-2xl p-4">
                <CardHeader className="flex justify-center items-center flex-col">
                    Login bro hehe

                    <CardDescription>
                        Century login here hehe
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 min-w-sm">



                    <form onSubmit={handleEmailSignUp}>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground mb-1" />
                            <Input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                className="p-2 pl-10 h-9 text-sm"
                                required />
                        </div>

                        <div className="relative mt-4">
                            <LetterText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground mb-1" />
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                className="p-2 pl-10 h-9 text-sm"
                                required />
                        </div>

                        <div className="relative mt-4">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                className="p-2 pl-3 h-9 text-sm"
                                required />

                            <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground mb-1"
                                onClick={() => setshowPassword(!showPassword)}>
                                {showPassword ? <Eye /> : <EyeClosed />}

                            </Button>
                        </div>

                        <div className="relative mt-4">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="write the matching password"
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                                className="p-2 pl-3 h-9 text-sm"
                                required />

                            <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground mb-1"
                                onClick={() => setshowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <Eye /> : <EyeClosed />}

                            </Button>
                        </div>

                        <Button type="submit" className="w-full text-sm h-10 font-medium mt-5"
                            disabled={isloading || !name || !email || !password || !confirmPassword}>
                            {isloading ? <Loader className="mr-2 h-4 animate-spin" /> + "Loading..." : "Sign Up"}

                        </Button>

                    </form>



                </CardContent>

            </Card>

        </div>
    )

}