import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "@tanstack/react-form";
import { Helmet } from "react-helmet-async"
import { useToast } from "@/components/ui/toast";
import { FirebaseError } from "firebase/app";
import { Card, CardContent, CardFooter, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useSignup, MyInput, MyCheckbox, registerSchema, type RegisterDataType } from "@/features/auth";
const AUTO_COMPLETE: Record<keyof RegisterDataType, string> = {
     fullName: "name",
     email: "email",
     password: "new-password",
     confirmPassword: "new-password",
     agreeTerms: "off"
}
import bgBanner from "../assets/21623311c7ad4b1db37c519b394f0eeb.jpg";

const bgStyle: React.CSSProperties = {
   backgroundImage: `
  linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.6) 60%,
    rgba(0, 0, 0, 0.4) 85%,
    rgba(0, 0, 0, 0.2) 100%
  ),
  url(${bgBanner})
`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh"
}
function getFirebaseRegisterError(error: FirebaseError): string {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "Your password is too weak.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    case "auth/operation-not-allowed":
      return "Email registration is currently disabled.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    default:
      console.error("Firebase registration error:", {
        code: error.code,
        message: error.message,
      });

      return "Something went wrong. Please try again.";
  }
}
export default function Signup(){
    const navigate = useNavigate();
    const { add } = useToast();
    const signupMutation = useSignup();
    const [registerError, setRegisterError] = useState("");
    const form = useForm({
        defaultValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: false
        } as RegisterDataType,
        validators: {
            onBlur: registerSchema,
            onSubmit: registerSchema
        },
        onSubmit: async ({value}) => {
             setRegisterError("");
            try {
             await signupMutation.mutateAsync(value);
             add({
                type: "success",
                title: "Success",
                description: "User Login successfully"
             });
             await navigate({
                 to: "/login",
                 replace: true
             });
             
            } catch(error: unknown){
               add({
                type: "error",
                title: "Error",
                description: "User couldn't login"
               });
               if(error instanceof FirebaseError){
                setRegisterError(getFirebaseRegisterError(error));
                }else{
                    setRegisterError("Something went wrong. Please try again");
                    console.error("Unexpected error occurred", error);
                }
            }
        }
    })
    return(
        <main className="fixed inset-0 w-full flex items-center justify-center h-dvh
                          overscroll-none overflow-hidden"
                          style={bgStyle}>
            <Helmet>
                <title></title>
                <meta name="description"
                       content=""
                       />
            </Helmet>
            <div className="flex items-center justify-center min-h-screen p-4 w-full">
                <Card aria-labelledby="register-form-title"
                       className="backdrop-blur-md bg-white/80 shadow-xl w-full max-w-lg mx-auto flex flex-col space-y-2">
                <CardHeader className="flex flex-col items-center justify-center text-center -space-y-1.5">
                    <CardTitle id="register-form-title"
                               className="text-black text-[24px] leading-[32px] lg:text-[40px] font-semibold lg:leading-[44px] tracking-tight">
                                 Join as a Host
                               </CardTitle>
                    <CardDescription className="font-normal text-[#222222] tracking-normal text-[13px] leading-[17px] md:text-[15px] md:leading-[20px]">
                          Create your host account to list your property, manage reservations, and start welcoming guests with Lokestays.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form 
                      id="register-form"
                      noValidate
                      onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        void form.handleSubmit()
                      }}
                      className="flex flex-col space-y-2.5">
                        <form.Field name="fullName">
                            {(field) => (
                                <MyInput
                                 field={field}
                                 autoComplete={AUTO_COMPLETE.fullName}
                                 placeholder="Full name"
                                 />
                         )}
                        </form.Field>
                        <form.Field name="email">
                            {(field) => (
                                <MyInput
                                  field={field}
                                  autoComplete={AUTO_COMPLETE.email}
                                  placeholder="Email address"
                                  />
                            )}
                        </form.Field>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         <form.Field name="password">
                            {(field) => (
                                <MyInput
                                  field={field}
                                  autoComplete={AUTO_COMPLETE.password}
                                  isPasswordField
                                  placeholder="Password"
                                  />
                            )}
                        </form.Field>
                         <form.Field name="confirmPassword">
                            {(field) => (
                                <MyInput
                                  field={field}
                                  isPasswordField
                                  autoComplete={AUTO_COMPLETE.confirmPassword}
                                  placeholder="Confirm password"
                                  />
                            )}
                        </form.Field>
                         </div>
                        <form.Field name="agreeTerms">
                         {(field) => (
                            <MyCheckbox
                              field={field}
                              />
                         )}
                        </form.Field>
                        {registerError && (
                            <p role="alert"
                               aria-live="assertive"
                               className="text-red-400 text-xs">
                            {registerError}
                            </p>
                        )}
                      </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-1.5 -mt-3">
                 <form.Subscribe
                   selector={(state) => [
                    state.isSubmitting, state.isValidating, signupMutation.isPending
                   ] as const}>
                    {([isSubmitting, isValidating]) => (
                        <Button 
                          type="submit"
                          form="register-form"
                          variant="default"
                          disabled={isSubmitting || isValidating || signupMutation.isPending}
                          className="cursor-pointer w-full tracking-normal text-[15px] leading-[21px] bg-[#0f766e] font-sans font-semibold">
                            {isSubmitting ? <Spinner /> : "Create an account"}
                          </Button>
                    )}
                   </form.Subscribe>
                   <span className="text-[13px] text-[#222222] font-normal tracking-normal leading-[17px]">
                            Already have an account? 
                            <Link to="/login" className="ml-1.5 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 rounded-sm transition-colors font-semibold text-[#0f766e]">
                            Log in
                            </Link>
                         </span>
                </CardFooter>
                </Card>
                   
            </div>
        </main>
    )
}