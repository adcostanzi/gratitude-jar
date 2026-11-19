import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import AddEntryDialog from "@/components/ui/add-entry-dialog"
import { readGratitudeEntry, deleteEntry } from "@/lib/jar-entry/crud"
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"

// This should be temporal
// export const instant = false;





export default async function MemoriesPage () {
    const memories = await readGratitudeEntry()

    const deleteMemory = async (id:string) => (
    await deleteEntry(id)
)
    
    return (
        <>
            <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8 m-8">Your Memories</h1>
            <h2 className="mt-3 text-jar-gray m-8">A collection of the little things you're grateful for.</h2>

            {/* Button Add Gratitude */}
                <AddEntryDialog content="+ Add Gratitude" />

            {/* Memories Filter */}
            {memories?.map((memory) =>(
                <Card
                className="m-8 p-4"
                key={memory.id}
                >
                    <CardTitle>
                        <p>{memory.created}</p>
                    </CardTitle>
                    <CardContent>
                        <p>{memory.content}</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="secondary">
                            <PencilIcon />
                            Edit
                        </Button>
                        <Button variant="destructive" >
                            <TrashIcon />
                            Delete
                        </Button>
                    </CardFooter>
                </Card>
                
                
            ))}

        </>
    )
}