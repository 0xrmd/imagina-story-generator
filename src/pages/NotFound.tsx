import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AnimatedTransition from "@/components/AnimatedTransition";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedTransition>
        <DotLottieReact
          src="https://lottie.host/2c451611-cde8-4e57-96e7-e78de782594d/PJeU9gMfVL.lottie"
          loop
          autoplay
          className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </AnimatedTransition>
      <AnimatedTransition>
        <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
      </AnimatedTransition>

      <AnimatedTransition delay={200}>
        <h2 className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Page Not Found</h2>
      </AnimatedTransition>

      <AnimatedTransition delay={400}>
        <p className="text-muted-foreground text-center mb-8">
          The page you're looking for at <span className="font-mono">{location.pathname}</span> doesn't exist.
        </p>
      </AnimatedTransition>

      <AnimatedTransition delay={600}>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          RETURN HOME
        </a>
      </AnimatedTransition>
    </div>
  );
};

export default NotFound;
