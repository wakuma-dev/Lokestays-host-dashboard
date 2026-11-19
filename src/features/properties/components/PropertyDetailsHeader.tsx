import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft} from "lucide-react";
import { Button } from "@/components/ui/button";
export default function PropertyDetailsHeader(){
    const navigate = useNavigate();
    function handleBack(){
        navigate({
            to: "/properties"
        });
    }
    return(
    <header className="w-full flex flex-col gap-2">
        <div className="flex flex-col md:flex-row items-start gap-2.5">
       <Button 
         type="button"
         variant="ghost"
         onClick={handleBack}
         className="inline-flex cursor-pointer items-center gap-2 text-[14px] leading-[20px] font-normal tracking-normal">
            <ArrowLeft className="shrink-0 size-4" />
            Back to Properties
         </Button>
         <div className="flex flex-col items-start space-y-0.5">
            <h1 className="text-[18px] leading-[24px] text-[#111111] dark:text-[#ffffff]
            tracking-tight font-medium">Property Details</h1>
            <p className="text-[14px] leading-[20px]
             tracking-normal font-normal text-[#3e3529] dark:text-[#cec8b2]">Complete information submitted by the host.</p>
         </div>
         </div>
         <div className="w-full border-b border-b-muted-foreground" />
    </header>
    )
}