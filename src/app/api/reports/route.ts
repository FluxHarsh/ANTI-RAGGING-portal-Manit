import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generatePublicReportId, generateSecretCode, hashSecretCode } from "@/lib/ids";

const CATEGORIES = ["Ragging", "Harassment", "Intimidation / Threat", "Forced Activity", "Verbal Abuse", "Other"];
const MAX_FILES = 2;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const category = formData.get("category")?.toString() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const location = formData.get("location")?.toString().trim() || null;
    const incidentDate = formData.get("incidentDate")?.toString() || null;
    const files = formData.getAll("evidence").filter((f): f is File => f instanceof File && f.size > 0);

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid concern category." }, { status: 400 });
    }
    if (!description || description.length < 10) {
      return NextResponse.json({ error: "Please provide a description (min 10 characters)." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `You can upload at most ${MAX_FILES} files.` }, { status: 400 });
    }
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        return NextResponse.json({ error: "Only JPG, PNG or WEBP files are allowed." }, { status: 400 });
      }
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Each file must be under 5MB." }, { status: 400 });
      }
    }

    const db = supabaseAdmin();

    // Generate a unique public report id, retry on collision
    let publicId = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generatePublicReportId();
      const { data: existing } = await db.from("reports").select("id").eq("public_report_id", candidate).maybeSingle();
      if (!existing) {
        publicId = candidate;
        break;
      }
    }
    if (!publicId) {
      return NextResponse.json({ error: "Could not generate report ID, please try again." }, { status: 500 });
    }

    const secretCode = generateSecretCode();
    const secretHash = await hashSecretCode(secretCode);

    const { data: report, error: insertErr } = await db
      .from("reports")
      .insert({
        public_report_id: publicId,
        secret_code_hash: secretHash,
        category,
        description,
        location,
        incident_date: incidentDate || null,
        status: "submitted",
      })
      .select()
      .single();

    if (insertErr || !report) {
      console.error(insertErr);
      return NextResponse.json({ error: "Failed to submit report. Please try again." }, { status: 500 });
    }

    // Seed the first timeline entry
    await db.from("report_updates").insert({
      report_id: report.id,
      status: "submitted",
      message: "Your concern was successfully received.",
    });

    // Upload evidence (max 2 files, run in parallel — independent uploads, no reason to serialize)
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${report.id}/${crypto.randomUUID()}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const { error: uploadErr } = await db.storage
          .from("report-evidence")
          .upload(path, buffer, { contentType: file.type, upsert: false });
        return { path, uploadErr };
      })
    );

    const evidenceRows = uploadResults
      .filter((r) => !r.uploadErr)
      .map((r) => ({ report_id: report.id, file_path: r.path }));

    for (const r of uploadResults) {
      if (r.uploadErr) console.error("evidence upload failed", r.uploadErr);
    }

    if (evidenceRows.length > 0) {
      const { error: evidenceInsertErr } = await db.from("report_evidence").insert(evidenceRows);
      if (evidenceInsertErr) console.error("evidence row insert failed", evidenceInsertErr);
    }

    return NextResponse.json({ reportId: publicId, secretCode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
