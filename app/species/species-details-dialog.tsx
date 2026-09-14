import type { Database } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { toast } from "@/components/ui/use-toast";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type Species = Database["public"]["Tables"]["species"]["Row"];

const KINGDOMS: Species["kingdom"][] = ["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"];

export default function SpeciesDetailsDialog({localSpecies, setLocalSpecies, userId}: {localSpecies: Species; setLocalSpecies: Dispatch<SetStateAction<Species>>;userId: string}){

    
    const fieldConfig = [
    { label: "Common name", name: "common_name" as const, value: localSpecies.common_name },
    { label: "Total population", name: "total_population" as const, value: localSpecies.total_population },
    { label: "Kingdom", name: "kingdom" as const, value: localSpecies.kingdom },
    { label: "Description", name: "description" as const, value: localSpecies.description}
    ];
    const [editMode, setEditMode] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createBrowserSupabaseClient();

    // Check that population is a number
    const totalPopulation = Number(formData.get("total_population"));
    if (Number.isNaN(totalPopulation)) {
        toast({ title: "Invalid total population", description: "Please enter a number.", variant: "destructive" });
        return;
    }

    const updated = {
        common_name: formData.get("common_name") as string,
        total_population: totalPopulation,
        kingdom: formData.get("kingdom") as Species["kingdom"],
        description: formData.get("description") as string, 
    };

    const previousSpecies = localSpecies;
    setLocalSpecies({ ...localSpecies, ...updated });
    setEditMode(false);

    // .select() to avoid success with 0 rows edited
    const { data, error } = await supabase
        .from("species")
        .update(updated)
        .eq("id", localSpecies.id)
        .select();

    if (error ?? (!data || data.length === 0)) {
        setLocalSpecies(previousSpecies);
        setEditMode(true);
        toast({
            title: "Failed to update species",
            description: error?.message ?? "The update was not applied.",
            variant: "destructive",
        });
    } else {
        router.refresh();
    }
    };

    return(

    editMode ?

    (
        <Dialog>
    <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
    </DialogTrigger>
    <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
        <DialogTitle>{localSpecies.scientific_name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)}>
            {fieldConfig.map(({ label, name, value }) => (
            value !== null && (
            <div key={name} className="mb-2">
                <label htmlFor={name} className="text-sm font-medium">{label}</label>
                {name === "kingdom" ? (
                    // Dropdown for kingdom, so only selected values can be allowed
                    <select id={name} name={name} defaultValue={value} className="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                        {KINGDOMS.map((kingdom) => (
                            <option key={kingdom} value={kingdom}>{kingdom}</option>
                        ))}
                    </select>
                ) : name === "description" ? (
                    // Textarea instead of Input so the description has room for multiple lines
                    <Textarea id={name} name={name} defaultValue={value} rows={4} />
                ) : (
                    <Input id={name} name={name} defaultValue={value} />
                )}
            </div>
            )
            ))}
            <div className="flex justify-between">
                <Button type="submit">Save</Button>
                <Button type="button" onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
        </form>
    </DialogContent>
    </Dialog>
    )


    :
        (
        <Dialog>
        {/* asChild here too - DialogTrigger renders its own <button>, and wrapping <Button> without asChild nests two buttons (invalid HTML, breaks hydration) */}
        <DialogTrigger asChild>
            <Button className="mt-3 w-full">Learn More</Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>{localSpecies.scientific_name}</DialogTitle>
                {fieldConfig.map(({label, value}) => (
                    value !== null && <p key={label}>{label}: {value}</p>
                ))}
            </DialogHeader>
            {(userId === localSpecies.author) && <Button onClick={() => setEditMode(true)}>Edit The Specie</Button>}
        </DialogContent>
    </Dialog>
    )
    )

}
