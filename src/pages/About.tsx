import { type ReactElement, memo } from "react";
import { Helmet } from "react-helmet-async";
import image from "../assets/image.png";

export interface AboutProps {
    readonly stepNumber?: number;
    readonly title?: string;
    readonly description?: string;
}

const DEFAULT_STEP = 1;
const DEFAULT_TITLE = "Tell us about your place";
const DEFAULT_DESCRIPTION =
    "In this step, we’ll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.";

function AboutComponent({
    stepNumber = DEFAULT_STEP,
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
}: AboutProps): ReactElement {
    
    const stepLabel = `Step ${stepNumber}`;
    const metaTitle = `Step ${stepNumber}: ${title}`;

    return (
        <main className="min-h-screen w-full overflow-y-auto p-4 pb-36 text-[#201b15] bg-[#FDFDFD] dark:text-[#ffffff] dark:bg-[#0A0A0A] md:h-full md:min-h-0 md:overflow-hidden md:pb-4 flex flex-col justify-between">
            <Helmet>
                <title>{metaTitle}</title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center justify-center gap-6 md:h-full md:flex-row md:justify-between md:gap-12 my-auto">
                <div className="flex w-full flex-1 flex-col items-start justify-center gap-2.5 md:gap-4">
                    <span className="font-medium text-[16px] leading-[24px] tracking-normal md:text-[18px] md:leading-[28px]">
                        {stepLabel}
                    </span>
                    <h1 className="font-medium text-[32px] leading-[36px] lg:text-[48px] lg:leading-[54px] tracking-tight">
                        {title}
                    </h1>
                    <p className="font-normal text-[16px] leading-[24px] md:text-[18px] md:leading-[28px] tracking-normal">
                        {description}
                    </p>
                </div>
                <div className="flex w-full max-w-[450px] flex-1 justify-center md:max-w-[500px] md:justify-end">
                    <img 
                        src={image} 
                        alt="about-image"
                        width={500}
                        height={500}
                        loading="eager"
                        decoding="async"
                        className="h-auto w-full aspect-square select-none object-contain md:max-h-[calc(100dvh-12rem)]"
                    />
                </div>
            </div>
        </main>
    );
}

export const About = memo(AboutComponent);
export default About;