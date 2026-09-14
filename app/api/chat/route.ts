import { generateResponse, SpeciesChatError } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";
import { z } from "zod";


const requestSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty.").max(1000, "Message is too long (1000 character max)."),
});

export async function POST(request: Request) {

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

 
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request body." },
      { status: 400 },
    );
  }

  
  try {
    
    const response = await generateResponse(parsed.data.message);

    
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    
    if (error instanceof SpeciesChatError) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    console.error("[api/chat] unexpected error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
