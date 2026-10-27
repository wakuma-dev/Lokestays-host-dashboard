import { useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form"
import { Helmet } from "react-helmet-async"
import { FirebaseError } from "firebase/app";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { MyInput, useLogin, loginSchema, type LoginDataType } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
export default function Login(){
  const navigate = useNavigate();
  const loginMutation = useLogin();
    return(
        <main className="w-full bg-black min-h-screen h-auto">
        <Helmet>
        <title>Log in - Host dashboard | LokeStays</title>
        <meta
          name="description"
          content="Log in to your LokeStays host dashboard to manage your properties, reservations, and earnings."
        />
      </Helmet>
        <div className="flex items-center justify-center min-h-screen">
        
        </div>
        </main>
    );
}