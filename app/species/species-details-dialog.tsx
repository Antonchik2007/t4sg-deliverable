import type { Database } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader} from "@/components/ui/dialog";
import { useState } from "react";


type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({species, userId}: {species: Species; userId: string}){

    
    const descriptionProperties = {
        "Common name": species.common_name,
        "Total population": species.total_population,
        "Kingdom": species.kingdom
    };
    const [editMode, setEditMode] = useState(false);
    return(

    editMode ? 
    
    ("Edit Functionality") 
    
    
    : 
        (
        <Dialog>
        <DialogTrigger>
            <Button className="mt-3 w-full">Learn More</Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>{species.scientific_name}</DialogTitle>
                {Object.entries(descriptionProperties).map(([label, value]) => (
                    value && <p key={label}>{label}: {value}</p>
                ))}  
            <DialogDescription>
                <p>Description: {species.description}</p>
            </DialogDescription>
            </DialogHeader>
            {(userId == species.author) && <Button onClick={() => setEditMode(true)}>Edit The Specie</Button>}
        </DialogContent>
    </Dialog>
    )
    )
    
}
//scientific_name, common_name, total_population, kingdom, and description