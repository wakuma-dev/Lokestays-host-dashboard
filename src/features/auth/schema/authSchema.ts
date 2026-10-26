import { z } from "zod";

export const registerSchema = z.object({
    fullName: z.string().trim().min(1, {message: "Full name is required"}),
    email: z.string().trim().superRefine((value, context) => {
     if(!value){
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Email is required"
        });
        return
     }
     if(!z.string().email()){
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid email address"
        })
     }
    }),
    password: z.string().trim().superRefine((value, context) => {
        if(!value){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password is required"
            });
            return
        }
        if(value.length < 8){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least 8 characters"
            })
        }
    }),
    confirmPassword: z.string().trim().min(1, {message: "Please confirm password"}),
    agreeTerms: z.boolean().refine((val) => val === true, {
        message: "You must accept terms and policy"
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match"
});
export const loginSchema = z.object({
     email: z.string().trim().superRefine((value, context) => {
        if(!value){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Email is required"
            });
            return
        }
        if(!z.string().email()){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Invalid email address"
            })
        }
     }),
     password: z.string().trim().superRefine((value, context) => {
        if(!value){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password is required"
            });
            return
        }
        if(value.length < 8){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Password must contain at least 8 characters"
            });
        }
     })
});