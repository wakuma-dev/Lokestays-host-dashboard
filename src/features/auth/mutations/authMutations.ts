import { useMutation } from "@tanstack/react-query"
import { type LoginDataType, type RegisterDataType, useAuthStore, login, signup} from "@/features/auth"
import type { User } from "firebase/auth"

export function useSignup(){
    return useMutation<void, Error, RegisterDataType>({
    mutationKey: ["users", "signup"],
    mutationFn: (data) => signup(data),
    onSuccess: () => useAuthStore.getState().setUser(null)
    })
}
export function useLogin(){
    return useMutation<User, Error, LoginDataType>({
    mutationKey: ["users", "login"],
    mutationFn: (data) => login(data),
    onSuccess: (user) => useAuthStore.getState().setUser(user)
    })
}