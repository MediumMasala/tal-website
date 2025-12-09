import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  selectedPersona?: string;
  fullName: string;
  whatsAppNumber: string;
  currentRole: string;
  currentCompany?: string;
  experienceBand: string;
  city: string;
  primarySkill: string;
  currentCTC?: string;
  targetCTC?: string;
  noticePeriod?: string;
  linkedinUrl?: string;
  email: string;
  urgency: string;
  source?: string;
  createdAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: LeadPayload = await request.json();

    // Validate required fields
    const requiredFields = [
      "fullName",
      "whatsAppNumber",
      "currentRole",
      "experienceBand",
      "city",
      "primarySkill",
      "email",
      "urgency",
    ] as const;

    for (const field of requiredFields) {
      if (!payload[field] || payload[field].trim() === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Basic email validation
    if (!payload.email.includes("@") || !payload.email.includes(".")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Basic phone validation
    if (payload.whatsAppNumber.trim().length < 7) {
      return NextResponse.json(
        { error: "Invalid WhatsApp number" },
        { status: 400 }
      );
    }

    // Add createdAt if missing
    const finalPayload = {
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    };

    // Log the payload (in production, you'd save to database)
    console.log("Lead payload:", finalPayload);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
