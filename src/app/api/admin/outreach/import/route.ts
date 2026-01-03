import { NextRequest, NextResponse } from "next/server";
import { read, utils } from "xlsx";
import { db } from "@/db";
import { leadsTable, productsTable, customersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { validatePhoneNumber } from "@/lib/phone-validation";
import { parseFullName, constructFullName } from "@/lib/name-utils";

function mapColumns(row: Record<string, unknown>): {
  firstName: string;
  lastName: string;
  phone: string;
  fullName?: string;
  productName?: string;
  source?: string;
} {
  // Map common column names
  const mappings: { [key: string]: string } = {
    // firstName
    نام: "firstName",
    اسم: "firstName",
    name: "firstName",
    firstName: "firstName",
    first_name: "firstName",
    // lastName
    "نام خانوادگی": "lastName",
    فامیلی: "lastName",
    surname: "lastName",
    lastName: "lastName",
    last_name: "lastName",
    // fullName
    "نام و نام خانوادگی": "fullName",
    "نام کامل": "fullName",
    "نام نام خانوادگی": "fullName",
    fullName: "fullName",
    full_name: "fullName",
    // phone
    تلفن: "phone",
    شماره: "phone",
    phone: "phone",
    موبایل: "phone",
    "شماره تلفن": "phone",
    phone_number: "phone",
    // source
    منبع: "source",
    source: "source",
    // productName removed - products selected manually in preview
  };

  const mapped: Record<string, unknown> = {};
  for (const key in row) {
    const lowerKey = key.toLowerCase();
    const mappedKey = mappings[key] || mappings[lowerKey] || key;
    mapped[mappedKey] = row[key];
  }

  return {
    firstName: (mapped.firstName as string) || "",
    lastName: (mapped.lastName as string) || "",
    fullName: (mapped.fullName as string) || "",
    phone: (mapped.phone as string) || "",
    source: (mapped.source as string) || "",
    productName: mapped.productName as string,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "File must have at least header and one row" },
        { status: 400 }
      );
    }

    const allHeaders = jsonData[0] as string[];
    const rows = jsonData.slice(1) as Record<string, unknown>[];

    // Only include relevant columns
    const allowedColumns = [
      "نام",
      "اسم",
      "name",
      "firstName",
      "first_name",
      "نام خانوادگی",
      "فامیلی",
      "surname",
      "lastName",
      "last_name",
      "نام و نام خانوادگی",
      "نام کامل",
      "نام نام خانوادگی",
      "fullName",
      "full_name",
      "تلفن",
      "شماره",
      "phone",
      "موبایل",
      "شماره تلفن",
      "phone_number",
      "منبع",
      "source",
    ];
    const headers = allHeaders.filter((h) => allowedColumns.includes(h));

    const leads = rows.map((row) => {
      const rowObj: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const headerIndex = allHeaders.indexOf(header);
        rowObj[header] = row[headerIndex] || "";
      });
      return rowObj;
    });

    // Add product column for manual selection
    headers.push("محصول");
    leads.forEach((lead) => {
      lead["محصول"] = "";
    });

    return NextResponse.json({ leads, columns: headers });
  } catch (error) {
    console.error("Error parsing file:", error);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leads, source } = await request.json();

    if (!Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Fetch all products for matching
    const products = await db.select().from(productsTable);

    const validLeads = [];
    const errors = [];

    for (const lead of leads) {
      try {
        const mappedLead = mapColumns(lead);

        // Convert phone number to string to handle Excel numeric values
        const phoneString = String(mappedLead.phone);
        const normalizedPhone = normalizePhoneNumber(phoneString);

        // For validation, try both original and normalized formats
        const validationOriginal = validatePhoneNumber(phoneString);
        const validationNormalized = validatePhoneNumber(normalizedPhone);

        // Use the successful validation, or the original if both fail
        const validation = validationNormalized.success
          ? validationNormalized
          : validationOriginal;

        // Debug logging
        console.log("Phone validation debug:", {
          original: mappedLead.phone,
          phoneString: phoneString,
          normalized: normalizedPhone,
          validationOriginal: validationOriginal,
          validationNormalized: validationNormalized,
          finalValidation: validation,
        });

        // Handle name logic: if fullName is provided, extract first/last names
        // If separate names are provided, construct fullName
        let firstName = mappedLead.firstName;
        let lastName = mappedLead.lastName;
        let fullName = mappedLead.fullName;

        // For validation, we need at least one of: fullName OR (firstName AND lastName)
        // But if fullName is provided, we should extract firstName and lastName from it
        let hasValidName = false;

        if (fullName) {
          // If fullName is provided, extract firstName and lastName from it
          const nameParts = parseFullName(fullName);
          firstName = nameParts.firstName;
          lastName = nameParts.lastName;
          hasValidName = true;
        } else if (firstName && lastName) {
          // If both firstName and lastName are provided, construct fullName
          fullName = constructFullName(firstName, lastName);
          hasValidName = true;
        }

        // Create more descriptive error messages in Persian
        let validationError = "";
        if (!validation.success) {
          validationError = validation.error || "شماره تلفن نامعتبر است";
        } else if (!hasValidName) {
          validationError = "نام کامل یا نام و نام خانوادگی الزامی است";
        }

        if (!validation.success || !hasValidName) {
          errors.push({
            lead,
            error: validationError,
          });
          continue;
        }

        // Additional validation checks
        if (!firstName && !lastName && !fullName) {
          errors.push({
            lead,
            error: "هیچ اطلاعات نامی یافت نشد",
          });
          continue;
        }

        if (!normalizedPhone || normalizedPhone.length === 0) {
          errors.push({
            lead,
            error: "شماره تلفن الزامی است",
          });
          continue;
        }

        // Check for duplicate phone in leads and customers
        let existingLead = [];
        let existingCustomer = [];

        try {
          existingLead = await db
            .select()
            .from(leadsTable)
            .where(eq(leadsTable.phone, normalizedPhone))
            .limit(1);
        } catch (dbError) {
          console.error("Database error checking leads:", dbError);
          errors.push({
            lead,
            error: "خطا در بررسی تکراری بودن شماره تلفن (لیدها)",
          });
          continue;
        }

        try {
          existingCustomer = await db
            .select()
            .from(customersTable)
            .where(eq(customersTable.phone, normalizedPhone))
            .limit(1);
        } catch (dbError) {
          console.error("Database error checking customers:", dbError);
          errors.push({
            lead,
            error: "خطا در بررسی تکراری بودن شماره تلفن (مشتریان)",
          });
          continue;
        }

        if (existingLead.length > 0 || existingCustomer.length > 0) {
          errors.push({ lead, error: "شماره تلفن تکراری است" });
          continue;
        }

        // Find product by name or keywords
        let productId = null;
        if (mappedLead.productName) {
          const product = products.find((p) => {
            // Exact match by name
            if (p.name === mappedLead.productName) return true;
            // Match by keywords (comma-separated)
            if (p.keywords) {
              const keywords = p.keywords
                .split(",")
                .map((k) => k.trim().toLowerCase());
              const searchTerm = mappedLead.productName!.toLowerCase();
              return keywords.some(
                (keyword) =>
                  searchTerm.includes(keyword) || keyword.includes(searchTerm)
              );
            }
            return false;
          });
          if (product) {
            productId = product.id;
          }
        }

        validLeads.push({
          firstName: firstName || null,
          lastName: lastName || null,
          fullName: fullName || null,
          phone: normalizedPhone,
          productId,
          source: source || "Excel import", // Use manually provided source from UI
          importedBy: "admin", // TODO: get from session
        });
      } catch (err) {
        console.error("Import validation error:", err);
        errors.push({
          lead,
          error: `خطای اعتبارسنجی: ${
            err instanceof Error ? err.message : "خطای نامشخص"
          }`,
        });
      }
    }

    if (validLeads.length > 0) {
      try {
        await db.insert(leadsTable).values(validLeads);
      } catch (insertError) {
        console.error("Database insert error:", insertError);
        return NextResponse.json({
          success: false,
          inserted: 0,
          errors: validLeads.length,
          errorDetails: validLeads.map((lead) => ({
            lead,
            error: "خطا در ذخیره لیدها در پایگاه داده",
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      inserted: validLeads.length,
      errors: errors.length,
      errorDetails: errors,
    });
  } catch (error) {
    console.error("Error inserting leads:", error);
    return NextResponse.json(
      { error: "Failed to insert leads" },
      { status: 500 }
    );
  }
}
