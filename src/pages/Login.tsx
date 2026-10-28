import { useState } from "react"
import { useNavigate, Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form"
import { Helmet } from "react-helmet-async"
import { FirebaseError } from "firebase/app";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { MyInput, useLogin, loginSchema, type LoginDataType } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";

const AUTO_COMPLETE: Record<keyof LoginDataType, string> = {
  email: "email",
  password: "current-password"
};

function getFirebaseLoginError(error: FirebaseError): string {
  switch(error.code){
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "User not found.";
    case "auth/wrong-password":
      return "Wrong password.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/operation-not-allowed":
      return "Email login is currently disabled.";
    default:
      console.error(
        "Firebase Login Error:",
        error.code,
        error.message
      );
      return "Something went wrong. Please try again.";
  }
}

export default function Login(){
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { add } = useToast();
  const [loginError, setLoginError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    } satisfies LoginDataType,
    validators: {
      onBlur: loginSchema,
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      setLoginError("");
      try {
        await loginMutation.mutateAsync(value);
        add({
          type: "success",
          title: "Success",
          description: "User login successfully"
        });
        await navigate({
          to: "/",
          replace: true
        });
      } catch (error) {
        add({
          type: "error",
          title: "Error",
          description: "User could login"
        });
        if(error instanceof FirebaseError){
          setLoginError(getFirebaseLoginError(error));
        } else {
          setLoginError("Something went wrong. Please try again");
          console.error("Unexpected error occurred", error);
        }
      }
    }
  });

  return (
    <main className="w-full min-h-screen h-auto">
      <Helmet>
        <title>Log in - Host dashboard | LokeStays</title>
        <meta
          name="description"
          content="Log in to your LokeStays host dashboard to manage your properties, reservations, and earnings."
        />
      </Helmet>
      <div className="w-full flex items-center justify-center min-h-screen p-4">
        <Card aria-labelledby="login-form-title"
             className="bg-white/80 backdrop-blur-sm shadow-xl w-full max-w-lg mx-auto flex flex-col space-y-2">
          <CardHeader className="flex flex-col items-center justify-center text-center -space-y-1.5">
            <CardTitle id="login-form-title" className="text-black text-[24px] leading-[32px] lg:text-[40px] font-semibold lg:leading-[44px] tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="font-normal text-[#222222] tracking-normal text-[13px] leading-[17px] md:text-[15px] md:leading-[20px]">
              Sign in to your host account to manage your properties, track bookings, and grow your rental business with Lokestays.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              id="login-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
              className="flex flex-col space-y-3">
              <form.Field name="email">
                {(field) => (
                  <MyInput 
                    field={field}
                    label="Email address"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete={AUTO_COMPLETE.email}
                  />
                )}
              </form.Field>
              <form.Field name="password">
                {(field) => (
                  <MyInput 
                    field={field}
                    label="Password"
                    isPasswordField
                    placeholder="Enter your password"
                    autoComplete={AUTO_COMPLETE.password}
                  />
                )}
              </form.Field>
              {loginError && (
                <p role="alert"
                   aria-live="assertive"
                   className="text-red-500 text-xs font-medium">
                   {loginError}
                </p>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-1.5">
            <form.Subscribe selector={(state) => [state.isSubmitting, state.isValidating] as const}>
              {([isSubmitting, isValidating]) => (
                <Button 
                  form="login-form"
                  variant="default"
                  type="submit"
                  disabled={isSubmitting || loginMutation.isPending || isValidating}
                  className="text-[15px] leading-[20px] w-full bg-[#0f766e] hover:bg-[#0d645d] text-white font-semibold cursor-pointer">
                  {isSubmitting || loginMutation.isPending ? <Spinner className="w-5 h-5 text-white" /> : "Log in"}
                </Button>
              )}
            </form.Subscribe>
              <span aria-label="Already account"
                     className="text-[13px] text-[#222222] font-normal tracking-normal leading-[17px]">
                Don't have an account?<Link to="/signup"
                 className="ml-1.5 font-semibold text-[#0f766e]">Sign up</Link>
               </span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}