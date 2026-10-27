import { useNavigate, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { Helmet } from "react-helmet-async"
import { FirebaseError } from "firebase/app";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useSignup, MyInput, MyCheckbox, registerSchema, type RegisterDataType } from "@/features/auth";
export default function Signup(){
    const navigate = useNavigate();
    const signupMutation = useSignup();
    return(
        <main>
            <Helmet>
                <title></title>
                <meta name="description"
                       content=""
                       />
            </Helmet>
            <h1>sign up</h1>
        </main>
    )
}