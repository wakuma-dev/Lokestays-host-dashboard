import { Outlet } from "@tanstack/react-router";
import bgBanner from "../assets/21623311c7ad4b1db37c519b394f0eeb.jpg";

const bgStyle: React.CSSProperties = {
   backgroundImage: `
  linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.8) 60%,
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
export default function AuthLayout(){
    return(
        <>
        <main style={bgStyle}>
            <Outlet />
        </main>
        </>
    )
}