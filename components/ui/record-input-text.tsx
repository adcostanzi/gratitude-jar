'use client'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from 'react';

export default function RecordText() {
    const [isRecording, setIsRecording] = useState(false)
    const [contentValue, setContentValue] = useState("")
    const recognitionRef = useRef<any>(null)

    // Recording Function
    const voiceRecording = () => {
        // Init Browser Speech Recognition (Chrome/Edge)
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRecognition
        rec.lang = 'en-EN'
        rec.interimResults = false
        rec.continuous = false
        
        // If recording, stop recording
        if (isRecording){
            if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        return
        }
        
        // Define isRecording state on start/end
        rec.onstart = () => {
            setIsRecording(true)
        }
        rec.onend = () => {
            setIsRecording(false)
        }

        // When stop recording, save text to input
        rec.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript
            setContentValue(transcript)
        }

        // Persistent recording
        recognitionRef.current = rec

        // Init recording
        rec.start()
    }
    // End Recording
    return (
        <>
            <FieldSet className="mb-4">
                <FieldGroup>
                    <Field>
                        {/* <FieldLabel>Content</FieldLabel> */}
                        <Input name="content" placeholder="Put your content here" value={contentValue} onChange={(e)=>setContentValue(e.target.value)} required/>
                    </Field>
                </FieldGroup>
            </FieldSet>
             <Button variant="outline" onClick={voiceRecording} type="button">
                Record
            </Button>


        </>
)
}