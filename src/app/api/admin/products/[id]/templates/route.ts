import { NextRequest, NextResponse } from "next/server";
import {
  getMessageTemplatesForProduct,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
} from "@/db/queries/message-templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const templates = await getMessageTemplatesForProduct(productId);
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, templateText, channel, isDefault } = body;

    if (!name || !templateText || !channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const template = await createMessageTemplate({
      name,
      templateText,
      channel,
      productId,
      isDefault: isDefault || false,
      createdBy: "admin", // TODO: Get from session
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, templateText, channel, isDefault } = body;

    const template = await updateMessageTemplate(parseInt(templateId), {
      name,
      templateText,
      channel,
      productId,
      isDefault,
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("id");
    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID required" },
        { status: 400 }
      );
    }

    const template = await deleteMessageTemplate(parseInt(templateId));
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
