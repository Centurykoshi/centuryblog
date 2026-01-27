import GobackButton from "@/components/My Components/GoBackButton";
import Header from "@/components/My Components/header";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 text-center max-w-md">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>

                <GobackButton Prop={{ value: "Home ", url: "/" }} />

                

            </div>
        </>
    )
}
