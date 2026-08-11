import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// GET - List all admin users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ADMIN_USERS_VIEW");

    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ admins });
  } catch (error: any) {
    console.error("Error fetching admin users:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ADMIN_USERS_CREATE");

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_USER_CREATED",
        entity: "User",
        entityId: admin.id,
        changes: { name, email, role },
      },
    });

    revalidatePath("/admin/admin-users");
    revalidatePath("/admin");

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ADMIN_USERS_EDIT");

    const body = await request.json();
    const { id, name, email, role, password } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) {
      const validRoles = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updateData.role = role;
    }
    if (password !== undefined) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_USER_UPDATED",
        entity: "User",
        entityId: id,
        changes: updateData,
      },
    });

    revalidatePath("/admin/admin-users");
    revalidatePath("/admin");

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Error updating admin user:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete admin user
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await requirePermission(session.user.id, "ADMIN_USERS_DELETE");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent self-deletion
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "ADMIN_USER_DELETED",
        entity: "User",
        entityId: id,
      },
    });

    revalidatePath("/admin/admin-users");
    revalidatePath("/admin");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting admin user:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete admin user" },
      { status: 500 }
    );
  }
}
