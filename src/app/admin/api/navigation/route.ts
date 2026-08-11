import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/permissions";

// Helper function to create audit log
async function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  changes: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        changes
      }
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

// Helper function to validate URL
function isValidUrl(url: string): boolean {
  try {
    // Allow relative URLs (starting with /)
    if (url.startsWith('/')) {
      return true;
    }
    // Validate absolute URLs
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

// Helper function to check for circular parent relationships
async function wouldCreateCircularReference(itemId: string, newParentId: string): Promise<boolean> {
  if (!newParentId) return false;
  
  // If setting parent to itself, that's a circular reference
  if (itemId === newParentId) return true;
  
  // Check if newParentId is a descendant of itemId
  let currentId = newParentId;
  const visited = new Set<string>();
  
  while (currentId) {
    if (visited.has(currentId)) {
      return true; // Cycle detected
    }
    visited.add(currentId);
    
    if (currentId === itemId) {
      return true; // itemId is an ancestor of newParentId
    }
    
    const item = await prisma.navigationItem.findUnique({
      where: { id: currentId },
      select: { parentId: true }
    });
    
    if (!item) break;
    currentId = item.parentId || '';
  }
  
  return false;
}

// Helper function to build navigation tree
function buildNavigationTree(items: any[]): any[] {
  const itemMap = new Map();
  const rootItems: any[] = [];
  
  // Create a map of all items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  
  // Build the tree structure
  items.forEach(item => {
    const node = itemMap.get(item.id);
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId).children.push(node);
    } else {
      rootItems.push(node);
    }
  });
  
  return rootItems;
}

// GET - Fetch all navigation items with hierarchy
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "NAVIGATION_VIEW");

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const flat = searchParams.get("flat") === "true";

    const where: any = {};
    
    if (search) {
      where.OR = [
        { label: { contains: search, mode: "insensitive" } },
        { url: { contains: search, mode: "insensitive" } }
      ];
    }

    const items = await prisma.navigationItem.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        parent: {
          select: {
            id: true,
            label: true
          }
        }
      }
    });

    if (flat) {
      return NextResponse.json(items);
    }

    // Return tree structure
    const tree = buildNavigationTree(items);
    return NextResponse.json(tree);
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to fetch navigation items" },
      { status: 500 }
    );
  }
}

// POST - Create new navigation item
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "NAVIGATION_EDIT");

    const data = await request.json();
    const userId = (session.user as any).id;

    // Validate required fields
    if (!data.label || !data.url) {
      return NextResponse.json(
        { error: "Label and URL are required" },
        { status: 400 }
      );
    }

    // Validate URL
    if (!isValidUrl(data.url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check for circular reference if parentId is provided
    if (data.parentId) {
      const wouldCreateCycle = await wouldCreateCircularReference("new", data.parentId);
      if (wouldCreateCycle) {
        return NextResponse.json(
          { error: "Cannot create circular parent relationship" },
          { status: 400 }
        );
      }
    }

    // Get the highest order value for root items or items with same parent
    const orderWhere = data.parentId 
      ? { parentId: data.parentId }
      : { parentId: null };
    
    const maxOrder = await prisma.navigationItem.findFirst({
      where: orderWhere,
      orderBy: { order: "desc" },
      select: { order: true }
    });

    const order = data.order !== undefined ? data.order : (maxOrder?.order ?? -1) + 1;

    const navigationItem = await prisma.navigationItem.create({
      data: {
        label: data.label,
        url: data.url,
        order,
        isExternal: data.isExternal || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        parentId: data.parentId || null
      }
    });

    // Create audit log
    await createAuditLog(
      userId,
      "CREATE",
      "NavigationItem",
      navigationItem.id,
      { newData: navigationItem }
    );

    // Revalidate cache
    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return NextResponse.json(navigationItem, { status: 201 });
  } catch (error) {
    console.error("Error creating navigation item:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to create navigation item" },
      { status: 500 }
    );
  }
}

// PUT - Update navigation item
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "NAVIGATION_EDIT");

    const { id, ...data } = await request.json();
    const userId = (session.user as any).id;

    if (!id) {
      return NextResponse.json(
        { error: "Navigation item ID is required" },
        { status: 400 }
      );
    }

    // Get existing item
    const existingItem = await prisma.navigationItem.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Navigation item not found" },
        { status: 404 }
      );
    }

    // Validate URL if provided
    if (data.url && !isValidUrl(data.url)) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check for circular reference if parentId is being changed
    if (data.parentId !== undefined && data.parentId !== existingItem.parentId) {
      const wouldCreateCycle = await wouldCreateCircularReference(id, data.parentId);
      if (wouldCreateCycle) {
        return NextResponse.json(
          { error: "Cannot create circular parent relationship" },
          { status: 400 }
        );
      }
    }

    // Check if item has children when trying to delete parent relationship
    if (data.parentId === null && existingItem.parentId !== null) {
      const hasChildren = await prisma.navigationItem.count({
        where: { parentId: id }
      });
      
      if (hasChildren > 0) {
        return NextResponse.json(
          { error: "Cannot remove parent relationship - this item has child items. Please reassign or delete children first." },
          { status: 400 }
        );
      }
    }

    const navigationItem = await prisma.navigationItem.update({
      where: { id },
      data: {
        ...(data.label && { label: data.label }),
        ...(data.url && { url: data.url }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isExternal !== undefined && { isExternal: data.isExternal }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.parentId !== undefined && { parentId: data.parentId })
      }
    });

    // Create audit log
    await createAuditLog(
      userId,
      "UPDATE",
      "NavigationItem",
      id,
      { 
        oldData: existingItem,
        newData: navigationItem
      }
    );

    // Revalidate cache
    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return NextResponse.json(navigationItem);
  } catch (error) {
    console.error("Error updating navigation item:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to update navigation item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete navigation item
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    requirePermission((session.user as any).role, "NAVIGATION_EDIT");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = (session.user as any).id;

    if (!id) {
      return NextResponse.json(
        { error: "Navigation item ID is required" },
        { status: 400 }
      );
    }

    // Check if item exists
    const existingItem = await prisma.navigationItem.findUnique({
      where: { id },
      include: {
        children: true
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Navigation item not found" },
        { status: 404 }
      );
    }

    // Safety check: prevent deletion if item has children
    if (existingItem.children.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete navigation item with child items. Please delete or reassign children first." },
        { status: 400 }
      );
    }

    await prisma.navigationItem.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      userId,
      "DELETE",
      "NavigationItem",
      id,
      { oldData: existingItem }
    );

    // Revalidate cache
    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting navigation item:", error);
    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}
