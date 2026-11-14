import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { 
    logout,
    createGratitudeEntry,
    readGratitudeEntry,
    updateContentGratitudeEntry,
    deleteGratitudeEntry
} from "@/lib/jar-entry/crud"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export const instant = false;

export default async function JarCRUDPage() {
    const supabase = await createClient()

    const { data: authData, error: authError} = await supabase.auth.getClaims()

    if (authError || !authData?.claims?.sub) {
        redirect("/auth/login")
    }

    const userId = authData.claims.sub

    const entries = await readGratitudeEntry()

    return (
        <main className="p-8">
            {/* LOGOUT */}
            <div className="mb-4">
                <Button onClick={logout}>
                    Logout
                </Button>
            </div>

            {/* READ */}
            <div className="mb-4">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries?.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell >{entry.id}</TableCell>
                            <TableCell>{entry.title}</TableCell>
                            <TableCell>{entry.content}</TableCell>
                            <TableCell>{entry.created}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            
            {/* CREATE */}
            <div className="mb-4">
                <Card>
                    <CardHeader>
                        <CardTitle>CREATE</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={createGratitudeEntry}>
                            <FieldSet className="mb-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <Input name="title" placeholder="Title"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Content</FieldLabel>
                                        <Input name="content" placeholder="Put your content here"/>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                
                            <Button type="submit">
                                Create an Entry
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

             {/* UPDATE */}
            <div className="mb-4">
                <Card>
                    <CardHeader>
                        <CardTitle>UPDATE</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={updateContentGratitudeEntry}>
                            <FieldSet className="mb-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>ID</FieldLabel>
                                        <Input name="id" placeholder="ID"/>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Content</FieldLabel>
                                        <Input name="content" placeholder="Put new content here"/>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <Button type="submit">
                                Update Content
                            </Button>                    
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* DELETE */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>DELETE</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={deleteGratitudeEntry}>
                            <FieldSet className="mb-4">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>ID</FieldLabel>
                                        <Input name="id" placeholder="ID"/>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <Button type="submit" variant="destructive">
                                Delete Entry
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}