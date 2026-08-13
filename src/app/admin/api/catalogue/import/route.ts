import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { modelToImageKey } from "@/lib/iphone-image-provider";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "SUPER_ADMIN" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { data } = body;

    if (!data || typeof data !== 'string') {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    console.log("=== IMPORT DEBUG ===");
    console.log("Raw data length:", data.length);
    console.log("Raw data sample:", data.substring(0, 200));

    // Parse the text data
    const lines = data.split('\n').filter(line => line.trim());
    console.log("Total lines:", lines.length);

    const items: any[] = [];
    let currentSeries = '';
    let parsedLines = 0;
    let skippedLines = 0;
    const debugInfo: any[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // More aggressive emoji and symbol removal
      const cleanedLine = trimmed
        .replace(/[^\x00-\x7F]/g, '') // Remove all non-ASCII characters (emojis, unicode)
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      debugInfo.push({
        lineNum: i + 1,
        original: trimmed,
        cleaned: cleanedLine,
        length: cleanedLine.length,
        hasDollar: cleanedLine.includes('$'),
        hasEnDash: cleanedLine.includes('–'),
        hasHyphen: cleanedLine.includes('-'),
        hasSeries: cleanedLine.toLowerCase().includes('series'),
      });
      
      console.log(`Line ${i + 1}:`, cleanedLine);

      // Skip lines that are too short
      if (cleanedLine.length < 2) {
        console.log(`  Skipped (too short)`);
        skippedLines++;
        continue;
      }

      // Check if this is a series header (contains "Series" but no $)
      if (cleanedLine.toLowerCase().includes('series') && !cleanedLine.includes('$')) {
        currentSeries = cleanedLine.trim();
        console.log(`  Series header:`, currentSeries);
        continue;
      }

      // Only skip obvious contact info
      if (cleanedLine.includes('+263') || cleanedLine.includes('MEIKLES') || 
          cleanedLine.match(/^\d{10,}$/)) { // Phone numbers
        console.log(`  Skipped (contact info)`);
        skippedLines++;
        continue;
      }

      // Try to parse product line
      let parsed = null;

      // Strategy 1: en-dash separator
      if (cleanedLine.includes('–')) {
        const parts = cleanedLine.split('–');
        if (parts.length >= 2) {
          parsed = parseItemLine(parts[0].trim(), parts[1].trim(), currentSeries);
          console.log(`  Tried en-dash parse:`, parsed);
        }
      }
      
      // Strategy 2: hyphen separator
      if (!parsed && cleanedLine.includes('-')) {
        const parts = cleanedLine.split('-');
        if (parts.length >= 2) {
          parsed = parseItemLine(parts[0].trim(), parts[1].trim(), currentSeries);
          console.log(`  Tried hyphen parse:`, parsed);
        }
      }

      // Strategy 3: colon separator
      if (!parsed && cleanedLine.includes(':')) {
        const parts = cleanedLine.split(':');
        if (parts.length >= 2) {
          parsed = parseItemLine(parts[0].trim(), parts[1].trim(), currentSeries);
          console.log(`  Tried colon parse:`, parsed);
        }
      }

      // Strategy 4: tab separator
      if (!parsed && cleanedLine.includes('\t')) {
        const parts = cleanedLine.split('\t');
        if (parts.length >= 2) {
          parsed = parseItemLine(parts[0].trim(), parts[1].trim(), currentSeries);
          console.log(`  Tried tab parse:`, parsed);
        }
      }

      // Strategy 5: space separator (for "iPhone 15 256GB $500")
      if (!parsed && cleanedLine.includes('$')) {
        const parts = cleanedLine.split('$');
        if (parts.length >= 2) {
          parsed = parseItemLine(parts[0].trim(), '$' + parts[1].trim(), currentSeries);
          console.log(`  Tried space/dollar parse:`, parsed);
        }
      }

      if (parsed && parsed.price > 0) {
        items.push(parsed);
        parsedLines++;
        console.log(`  SUCCESS: Parsed item:`, parsed.model, parsed.storage, parsed.price);
      } else {
        skippedLines++;
        console.log(`  Skipped (no valid price or parse failed)`);
      }
    }

    console.log(`=== PARSE RESULTS ===`);
    console.log(`Parsed: ${parsedLines}, Skipped: ${skippedLines}`);
    console.log(`Items to import:`, items);

    if (items.length === 0) {
      return NextResponse.json({ 
        error: "No valid items found to import",
        debug: debugInfo,
        message: "Please check your data format. Each item should have a model name and price separated by -, :, or $"
      }, { status: 400 });
    }

    // Try to create items in database
    const createdItems = [];
    for (const item of items) {
      try {
        const created = await prisma.priceCatalogue.create({
          data: {
            title: item.title,
            series: item.series,
            model: item.model,
            storage: item.storage,
            price: item.price,
            description: item.description,
            imageKey: item.imageKey,
            imageOverride: item.imageOverride,
            order: item.order,
            isActive: item.isActive,
          },
        });
        createdItems.push(created);
        console.log("Created item:", created.model);
      } catch (error: any) {
        console.error("Failed to create item:", item, error);
        // Continue with other items even if one fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      imported: createdItems.length,
      total: items.length,
      parsed: parsedLines,
      skipped: skippedLines,
      debug: debugInfo,
      parsedItems: items,
      items: createdItems 
    });
  } catch (error: any) {
    console.error("Failed to import catalogue:", error);
    
    // Check if table doesn't exist
    if (error.code === 'P2021') {
      return NextResponse.json({ 
        error: "PriceCatalogue table doesn't exist yet. Please create it first using the migrate endpoint.",
        needsMigration: true 
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: "Failed to import catalogue", details: String(error) }, { status: 500 });
  }
}

function parseItemLine(modelPart: string, pricePart: string, currentSeries: string) {
  // Remove any remaining non-ASCII characters from model part
  const cleanedModel = modelPart
    .replace(/[^\x00-\x7F]/g, '') // Remove all non-ASCII
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  console.log(`    parseItemLine - modelPart: "${modelPart}" -> "${cleanedModel}"`);
  console.log(`    parseItemLine - pricePart: "${pricePart}"`);
  
  // Extract price (remove $, currency symbols, and convert to number)
  const priceMatch = pricePart.match(/[\$£€]?([\d,]+\.?\d*)/);
  const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  
  console.log(`    parseItemLine - priceMatch:`, priceMatch, `price:`, price);

  // Extract storage from model (e.g., "256GB", "128GB")
  const storageMatch = cleanedModel.match(/(\d+GB)/i);
  const storage = storageMatch ? storageMatch[1] : 'Unknown';
  
  console.log(`    parseItemLine - storageMatch:`, storageMatch, `storage:`, storage);

  const result = {
    series: currentSeries || 'Other',
    model: cleanedModel,
    storage,
    price,
    title: cleanedModel,
    description: `${currentSeries} - ${cleanedModel}`,
    imageKey: modelToImageKey(cleanedModel),
    imageOverride: null,
    order: 0,
    isActive: true,
  };
  
  console.log(`    parseItemLine - result:`, result);
  return result;
}
