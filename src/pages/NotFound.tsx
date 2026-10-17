import { Helmet } from "react-helmet-async";
export default function NotFound(){
  
    return(
    <main
     aria-labelledby="not-found-title"
     className="flex flex-col items-start md:items-center justify-center gap-2 md:gap-3 p-4 min-h-screen">
    <Helmet>
    <title>404 Page Not Found - Lokestays Host</title>
    <meta name="description"
     content="Sorry, the page you're looking for couldn't be found. Return to the Lokestays Host Dashboard to manage your properties and rental listings."
          />
    <meta name="robots" content="noindex, follow" />
   </Helmet>
     <h1 id="not-found-title" 
     className="font-extrabold text-[60px] leading-[72px] md:text-[140px] tracking-normal md:tracking-tight lg:tracking-tighter md:leading-[160px] text-[#484848]">OOPS!</h1>
     <h2 className="text-[#484848] text-[28px] leading-[28px] md:text-[32px] md:tracking-normal md:tracking-tight lg:tracking-tighter leading-[35px] font-normal">We can't seem to find the page you're looking for.</h2>
     <p className="text-[#484848] text-[14px] leading-[15px] font-semibold">Error code: 404</p>
    </main>
    )
}