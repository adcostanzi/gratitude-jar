import {   
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger, } from "@/components/ui/dialog"
import RecordText from "./record-input-text"
import { 
    createGratitudeEntry,
} from "@/lib/jar-entry/crud"
import { Button } from "@/components/ui/button";

interface AddEntryDialogProps {
    content: string;
}

export default function AddEntryDialog ({content}:AddEntryDialogProps) {
    return (
        <>
            <Dialog>
                <DialogTrigger
                className="mt-6 rounded-full bg-jar-sage px-6 py-3 font-semibold text-white hover:bg-jar-sage-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jar-sage w-full max-w-sm md:w-auto"
                >
                    {/* Add your first Gratitude */}
                    {content}
                </DialogTrigger>
                
                <DialogContent>
                    <form action={createGratitudeEntry}>
                    <DialogHeader>
                        <DialogTitle>Add Gratitude</DialogTitle>
                        <DialogDescription>
                            Capture a moment, feeling, or experience you're grateful for.
                        </DialogDescription>
                        <RecordText />
                        <Button type="submit">
                            Create an Entry
                        </Button>           
                    </DialogHeader>
                    </form>    
                </DialogContent>
            </Dialog>
        </>
    )
}