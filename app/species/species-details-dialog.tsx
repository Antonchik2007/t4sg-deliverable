import type { Database } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader} from "@/components/ui/dialog";


type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({species}: {species: Species}){

    
    const descriptionProperties = {
        "Common name": species.common_name,
        "Total population": species.total_population,
        "Kingdom": species.kingdom
    };

    return(
    <Dialog>
        <DialogTrigger>
            <Button className="mt-3 w-full">Learn More</Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
            <DialogTitle>{species.scientific_name}</DialogTitle>
                {Object.entries(descriptionProperties).map(([label, value]) => (
                    <p key={label}>{label}: {value}</p>
                ))}  
            <DialogDescription>
                <p>Description: {species.description}</p>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    )
}
//scientific_name, common_name, total_population, kingdom, and description