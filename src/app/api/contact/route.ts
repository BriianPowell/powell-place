import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "Contact form is not configured (WEB3FORMS_ACCESS_KEY missing)" },
      { status: 503 },
    );
  }

  let body: { fullname?: string; email?: string; message?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fullname, email, message } = body;

  if (!fullname?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "New Submission from Portfolio Website",
      from_name: fullname,
      email,
      message,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
