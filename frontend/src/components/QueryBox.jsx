import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2, Search } from "lucide-react";
const QueryBox = ({
  query,
  onQueryChange,
  onAnalyze,
  isLoading,
  isVisible
}) => {
  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef(null);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = event => {
        const transcript = event.results[0][0].transcript;
        onQueryChange(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [onQueryChange]);
  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  return <div className={`transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 max-h-[400px]" : "opacity-0 max-h-0 overflow-hidden"}`}>
      <div className="space-y-4">
        <div className="relative">
          <textarea value={query} onChange={e => onQueryChange(e.target.value)} placeholder="Describe your issue here or use voice input..." rows={4} className="w-full resize-none rounded-sm border border-border bg-background p-4 pr-14 font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
          <button type="button" onClick={toggleListening} aria-label={isListening ? "Stop voice input" : "Start voice input"} className={`absolute right-3 top-3 p-2 transition-colors ${isListening ? "text-destructive" : "text-muted-foreground hover:text-foreground"}`}>
            {isListening ? <MicOff size={20} strokeWidth={1.5} /> : <Mic size={20} strokeWidth={1.5} />}
          </button>
        </div>

        <button onClick={onAnalyze} disabled={!query.trim() || isLoading} className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} strokeWidth={1.5} />}
          {isLoading ? "Analyzing..." : "Analyze Query"}
        </button>
      </div>
    </div>;
};
export default QueryBox;