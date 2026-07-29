import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUser } from "../../store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, passkey } = body;

    if (!username || !passkey) {
      return NextResponse.json(
        { success: false, message: "Username and passkey are required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminUser(username, passkey);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "INVALID USERNAME OR PASSKEY // ACCESS DENIED" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      username,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
