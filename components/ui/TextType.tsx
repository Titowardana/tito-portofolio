"use client";

/* eslint-disable react-hooks/refs */

import {
  createElement,
  type ElementType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import "./TextType.css";

type VariableSpeed = {
  min: number;
  max: number;
};

type TextTypeProps = {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: VariableSpeed;
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
};

export default function TextType({
  text,
  as: Component = "span",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 1800,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [hasStarted, setHasStarted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]).filter(Boolean),
    [text],
  );

  const currentText = textArray[currentTextIndex] ?? "";

  const processedText = useMemo(
    () =>
      reverseMode
        ? currentText.split("").reverse().join("")
        : currentText,
    [currentText, reverseMode],
  );

  const getTypingSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;

    return (
      Math.random() * (variableSpeed.max - variableSpeed.min) +
      variableSpeed.min
    );
  }, [typingSpeed, variableSpeed]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const updatePreference = () => {
      setReduceMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;

    if (reduceMotion) {
      gsap.set(cursorRef.current, { opacity: 1 });
      return;
    }

    const animation = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      animation.kill();
    };
  }, [showCursor, cursorBlinkDuration, reduceMotion]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0) return;

    if (reduceMotion) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!hasStarted) {
      timeout = setTimeout(() => {
        setHasStarted(true);
      }, initialDelay);

      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText((previous) => previous.slice(0, -1));
        }, deletingSpeed);
      } else {
        onSentenceComplete?.(currentText, currentTextIndex);

        const isLastSentence =
          currentTextIndex === textArray.length - 1;

        if (!loop && isLastSentence) return;

        timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentCharIndex(0);
          setCurrentTextIndex(
            (previous) => (previous + 1) % textArray.length,
          );
        }, 0);
      }
    } else if (currentCharIndex < processedText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(
          (previous) => previous + processedText[currentCharIndex],
        );
        setCurrentCharIndex((previous) => previous + 1);
      }, getTypingSpeed());
    } else {
      const isLastSentence =
        currentTextIndex === textArray.length - 1;

      if (!loop && isLastSentence) return;

      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    currentText,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getTypingSpeed,
    hasStarted,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    processedText,
    reduceMotion,
    textArray,
  ]);

  const isTyping =
    currentCharIndex < processedText.length || isDeleting;

  const shouldHideCursor =
    hideCursorWhileTyping && isTyping;

  const currentColor =
    textColors.length > 0
      ? textColors[currentTextIndex % textColors.length]
      : undefined;

  return createElement(
    Component,
    { ref: containerRef, className: `text-type ${className}`, ...props },
    createElement(
      "span",
      { className: "text-type__content", style: { color: currentColor } },
      reduceMotion ? (textArray[0] ?? "") : displayedText,
    ),
    showCursor &&
      createElement(
        "span",
        {
          ref: cursorRef,
          "aria-hidden": "true",
          className: [
            "text-type__cursor",
            cursorClassName,
            shouldHideCursor ? "text-type__cursor--hidden" : "",
          ]
            .filter(Boolean)
            .join(" "),
        },
        cursorCharacter,
      ),
  );
}
