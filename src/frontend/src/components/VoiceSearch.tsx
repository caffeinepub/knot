import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface VoiceSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  lang?: string;
  listenLabel?: string;
  heardLabel?: string;
  failedLabel?: string;
  chromeLabel?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function VoiceSearch({
  value,
  onChange,
  placeholder = "Search by skill or name...",
  lang = "en-IN",
  listenLabel = "Listening... say a skill name",
  heardLabel = "Heard",
  failedLabel = "Voice search failed. Please try again.",
  chromeLabel = "Voice search requires Chrome or Edge browser.",
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Keep all callback refs up-to-date so closures always read latest values
  const onChangeRef = useRef(onChange);
  const langRef = useRef(lang);
  const listenLabelRef = useRef(listenLabel);
  const heardLabelRef = useRef(heardLabel);
  const failedLabelRef = useRef(failedLabel);
  const chromeLabelRef = useRef(chromeLabel);
  onChangeRef.current = onChange;
  langRef.current = lang;
  listenLabelRef.current = listenLabel;
  heardLabelRef.current = heardLabel;
  failedLabelRef.current = failedLabel;
  chromeLabelRef.current = chromeLabel;

  // Update recognition lang whenever prop changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = langRef.current;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onChangeRef.current(transcript);
        setIsListening(false);
        toast.success(`${heardLabelRef.current}: "${transcript}"`, {
          duration: 2000,
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error !== "no-speech") {
          toast.error(failedLabelRef.current);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function handleMicClick() {
    if (!recognitionRef.current) return;
    // Always sync lang before starting
    recognitionRef.current.lang = langRef.current;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast.info(listenLabelRef.current, { duration: 3000 });
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-8 h-11 text-sm font-body bg-card border-border focus-visible:ring-primary"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <Button
        type="button"
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={() => {
          if (!isSupported) {
            toast.error(chromeLabelRef.current);
            return;
          }
          handleMicClick();
        }}
        className={`h-11 w-11 shrink-0 transition-all ${
          isListening
            ? "bg-accent text-accent-foreground animate-mic-pulse"
            : isSupported
              ? "border-border hover:bg-muted hover:border-foreground/30 hover:text-foreground"
              : "border-border opacity-60 hover:bg-muted"
        }`}
        aria-label={isListening ? "Stop listening" : "Voice search"}
        title={
          isSupported
            ? isListening
              ? "Click to stop"
              : "Voice search"
            : chromeLabel
        }
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
