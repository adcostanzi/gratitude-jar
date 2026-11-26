"use client";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";

export default function RecordText() {
  const [isRecording, setIsRecording] = useState(false);
  const [contentValue, setContentValue] = useState("");
  const recognitionRef = useRef<any>(null);
  const [recordingError, setRecordingError] = useState("");

  // Recording Function
  const voiceRecording = () => {
    // Init Browser Speech Recognition (Chrome/Edge)
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "en-EN";
    rec.interimResults = false;
    rec.continuous = false;

    // If recording, stop recording
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    // Define isRecording state on start/end
    rec.onstart = () => {
      setIsRecording(true);
    };
    rec.onend = () => {
      setIsRecording(false);
    };

    // When stop recording, save text to input
    rec.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setContentValue(transcript);
    };

    // Persistent recording
    recognitionRef.current = rec;

    // Init recording
    rec.start();
  };
  // End Recording
  return (
    <>
      <div>
        <label htmlFor="gratitude-content" className="sr-only">
          What are you grateful for today? (required)
        </label>

        <textarea
          id="gratitude-content"
          name="content"
          placeholder="Write or record what you are grateful for..."
          value={contentValue}
          onChange={(event) => setContentValue(event.target.value)}
          maxLength={500}
          rows={4}
          required
          className="w-full resize-y rounded-xl border border-[#D5DDD5] bg-white p-3 text-sm text-jar-charcoal placeholder:italic placeholder:text-jar-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-jar-sage"
        />

        <p className="mt-1 text-right text-xs text-jar-gray">
          {contentValue.length} / 500
        </p>
      </div>
      <div className="space-y-4 mt-2 flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={voiceRecording}
          type="button"
          aria-pressed={isRecording}
          aria-label={
            isRecording ? "Stop listening" : "Record what you are grateful for"
          }
          title={
            isRecording ? "Stop listening" : "Record what you are grateful for"
          }
          className={
            isRecording
              ? "h-11 w-11 rounded-xl border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
              : "h-11 w-11 rounded-xl border-transparent bg-jar-sage-light text-jar-sage hover:bg-[#D9EADB]"
          }
        >
          {isRecording ? (
            <Square aria-hidden="true" className="h-4 w-4 fill-current" />
          ) : (
            <Mic aria-hidden="true" className="h-5 w-5" />
          )}
        </Button>

        {recordingError && (
          <p role="alert" className="text-sm text-red-700">
            {recordingError}
          </p>
        )}
      </div>
    </>
  );
}
