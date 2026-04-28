import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="flex justify-center mb-8">
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
