import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ProfileMenu(){
    return(
    <Popover>
        <PopoverTrigger render={
            <Button 
              type="button"
              variant="ghost"
              size="icon"
              className="size-10 rounded-full cursor-pointer bg-[#ffffff]
               dark:bg-[#0a0a0a] shrink-0"
               aria-label="Profile menu">
              A
            </Button>
        } />
        <PopoverContent 
           align="end"
           sideOffset={8}
           className="w-54 bg-[#ffffff] border border-[#e5e7eb] dark:border-[#27272a] text-[#222222] dark:bg-[#0a0a0a] dark:text-[#f9fafb]">
               abebe
           </PopoverContent>
    </Popover>
    )
}