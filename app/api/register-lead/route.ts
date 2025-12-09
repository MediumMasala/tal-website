import { NextRequest, NextResponse } from "next/server";
import { LeadPayload, AISummary } from "@/lib/companyConfig";

type RegisterLeadRequest = LeadPayload;

interface RegisterLeadResponse {
  ok: boolean;
  aiSummary?: AISummary;
  error?: string;
}

async function getAISummary(
  basicAsk: string,
  userWorkplace: string
): Promise<AISummary | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("OPENAI_API_KEY not set, skipping AI analysis");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that summarizes a job seeker's ask into a short title and up to 3 tags. Return JSON only with format: {\"title\": \"...\", \"tags\": [\"...\", \"...\", \"...\"]}",
          },
          {
            role: "user",
            content: `Job seeker's ask: "${basicAsk}"\nCurrent workplace: "${userWorkplace}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      try {
        return JSON.parse(content) as AISummary;
      } catch {
        console.error("Failed to parse AI response:", content);
        return null;
      }
    }

    return null;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return null;
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<RegisterLeadResponse>> {
  try {
    const body: RegisterLeadRequest = await request.json();

    const {
      companySlug,
      companyName,
      whatsAppNumber,
      userName,
      userWorkplace,
      basicAsk,
      pageUrl,
      utm,
    } = body;

    // Basic validation
    if (!whatsAppNumber || whatsAppNumber.length < 7) {
      return NextResponse.json(
        { ok: false, error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    if (!basicAsk || basicAsk.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Basic ask is required" },
        { status: 400 }
      );
    }

    // Log the payload
    console.log("=== NEW LEAD REGISTRATION ===");
    console.log("Company:", companyName, `(${companySlug})`);
    console.log("WhatsApp:", whatsAppNumber);
    console.log("Name:", userName);
    console.log("Workplace:", userWorkplace);
    console.log("Basic Ask:", basicAsk);
    console.log("Page URL:", pageUrl);
    console.log("UTM:", utm);

    // Get AI summary if OpenAI key is available
    const aiSummary = await getAISummary(basicAsk, userWorkplace);

    if (aiSummary) {
      console.log("AI Summary:", aiSummary);
    }

    console.log("=============================");

    // TODO: Add database integration here (Prisma, Supabase, etc.)
    // Example:
    // await prisma.lead.create({
    //   data: {
    //     companySlug,
    //     companyName,
    //     whatsAppNumber,
    //     userName,
    //     userWorkplace,
    //     basicAsk,
    //     pageUrl,
    //     utmRaw: utm.raw,
    //     aiTitle: aiSummary?.title,
    //     aiTags: aiSummary?.tags,
    //   },
    // });

    return NextResponse.json({
      ok: true,
      aiSummary: aiSummary || undefined,
    });
  } catch (error) {
    console.error("Error processing lead registration:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
