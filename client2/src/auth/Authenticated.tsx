// import React from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Progress } from "@/components/ui/progress";

/**
 * Makes sure user is authenticated before rendering children.
 *
 * If user is not authenticated, it will be redirected to login page provided
 * by Auth0.
 *
 */
// export function Authenticated({ children }: React.PropsWithChildren) {
    // const { loginWithRedirect, user, isLoading, error } = useAuth0();
    // const [progress, setProgress] = React.useState(13);

    // React.useEffect(() => {
    //     const timer = setTimeout(() => setProgress(100), 100);
    //     if (error) {
    //         return;
    //     } else if (!user && !isLoading) loginWithRedirect();
    //     return () => clearTimeout(timer);
    // }, [user, isLoading, loginWithRedirect, error]);

    // if (error) return <div>Oops... {error.message}</div>;
    // return isLoading ? (
    //     <div className="w-full flex items-center justify-center h-screen">
    //         <Progress value={progress} className="w-[60%]" />
    //     </div>
    // ) : (
    //     <>{children}</>
    // );
// }
