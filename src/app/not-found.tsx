import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative h-[calc(100vh-168px)] w-full animate-fade-in">
      <div className="absolute -z-50 size-full overflow-hidden">
        <Image
          src="https://cdn.arstechnica.net/wp-content/uploads/2021/08/Ghost-of-Tsushima-PS4-1.jpg"
          alt="404"
          width={1920}
          height={1080}
          className="absolute z-0 size-full scale-105 object-cover blur-sm transition-transform duration-1000 hover:scale-100 hover:blur-none"
          priority
        />
        <div className="absolute z-10 size-full bg-background/90 backdrop-blur-sm" />

        <div className="absolute z-10 size-full bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 p-4">
        <div className="group flex items-center gap-5">
          <Image
            src="/icon-broken.png"
            alt="404"
            width={300}
            height={300}
            className="size-32 animate-bounce-slow object-contain object-center transition-transform duration-300 group-hover:scale-110 sm:size-52"
            draggable={false}
            priority
          />
        </div>

        <div className="mt-2 flex w-full flex-col items-center justify-center gap-4">
          <p className="animate-fade-up text-4xl font-bold text-primary drop-shadow-glow sm:text-5xl">
            Level Not Found
          </p>
          <h1 className="animate-fade-up text-center text-lg font-medium text-muted-foreground [animation-delay:200ms]">
            Oops! It looks like you&#39;ve ventured into uncharted territory.
            <br />
            The page you&#39;re looking for is hidden in a different castle
          </h1>
          <Link
            className={buttonVariants({
              variant: "ghost",
              className:
                "animate-fade-up gap-2 transition-colors hover:bg-primary hover:text-primary-foreground [animation-delay:400ms]",
            })}
            href="/"
          >
            <ChevronLeft className="transition-transform group-hover:-translate-x-1" />
            Return to Start
          </Link>
        </div>
      </div>
    </div>
  );
}
