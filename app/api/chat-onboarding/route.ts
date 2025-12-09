import { NextRequest, NextResponse } from "next/server";

interface ChatOnboardingPayload {
  name: string;
  phone: string;
  company?: string;
  createdAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload: ChatOnboardingPayload = await request.json();

    // Validate required fields
    if (!payload.name || payload.name.trim() === "") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!payload.phone || payload.phone.trim() === "") {
      return NextResponse.json(
        { error: "Phone is required" },
        { status: 400 }
      );
    }

    // Add createdAt if missing
    const finalPayload = {
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    };

    // Log the payload (in production, you'd save to database)
    console.log("Chat onboarding payload:", finalPayload);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing chat onboarding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
