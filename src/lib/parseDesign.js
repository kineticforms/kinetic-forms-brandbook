// Parses a Stitch-compatible DESIGN.md (pure markdown, no YAML frontmatter)
// into structured data for the app to render.

function splitSections(raw) {
  const sections = {};
  const parts = raw.split(/^## /m);
  for (const part of parts.slice(1)) {
    const newlineIdx = part.indexOf("\n");
    const heading = part.slice(0, newlineIdx).trim();
    const body = part.slice(newlineIdx + 1).trim();
    sections[heading] = body;
  }
  return sections;
}

function parseColorLine(line) {
  const match = line.match(
    /^- \*\*(.+?)\*\* \(#([A-Fa-f0-9]{3,8})\):\s*(.+)/,
  );
  if (!match) return null;
  return { token: match[1], hex: `#${match[2]}`, description: match[3] };
}

function parseColors(body) {
  // Split by ### sub-headings
  const subSections = {};
  const parts = body.split(/^### /m);
  let preamble = parts[0].trim();
  for (const part of parts.slice(1)) {
    const newlineIdx = part.indexOf("\n");
    const heading = part.slice(0, newlineIdx).trim().toLowerCase();
    subSections[heading] = part.slice(newlineIdx + 1).trim();
  }

  function extractColors(text) {
    const colors = [];
    for (const line of (text || "").split("\n")) {
      const color = parseColorLine(line.trim());
      if (color) colors.push(color);
    }
    return colors;
  }

  function extractProse(text) {
    return (text || "")
      .split("\n")
      .filter((l) => l.trim().length > 0 && !l.trim().startsWith("- "))
      .join(" ")
      .trim();
  }

  // If no sub-headings, fall back to old heuristic
  const light = extractColors(subSections["light mode"] || preamble);
  const dark = extractColors(subSections["dark mode"] || "");
  const darkDescription = extractProse(subSections["dark mode"] || "");
  const pairingRules = extractProse(subSections["pairing rules"] || "");

  // Note: combine pairing rules with any preamble prose
  const preambleProse = extractProse(preamble);
  const note = [preambleProse, pairingRules].filter(Boolean).join(" ");

  return { light, dark, darkDescription, note };
}

function parseTypography(body) {
  const fonts = {};
  const fontPattern = /- \*\*(.+?)\*\*:\s*(.+)/g;
  let match;
  while ((match = fontPattern.exec(body)) !== null) {
    const key = match[1].toLowerCase().replace(/ font$/i, "");
    fonts[key] = match[2].trim();
  }

  // Extract source URL
  const sourceMatch = body.match(/\[.*?\]\((https?:\/\/[^\)]+)\)/);
  const source = sourceMatch ? sourceMatch[1] : "";

  // Extract fallback
  const fallbackMatch = body.match(/Fallback:\s*`([^`]+)`/);
  const fallback = fallbackMatch ? fallbackMatch[1] : "";

  // Parse table rows
  const hierarchy = [];
  const tablePattern =
    /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
  let row;
  while ((row = tablePattern.exec(body)) !== null) {
    const level = row[1].trim();
    if (level === "Level" || level.startsWith("-")) continue;
    hierarchy.push({
      level,
      weight: row[2].trim(),
      size: row[3].trim(),
      tracking: row[4].trim().toLowerCase(),
      leading: row[5].trim().toLowerCase(),
    });
  }

  // Extract prose paragraphs
  const paragraphs = body
    .split("\n\n")
    .filter(
      (p) =>
        !p.startsWith("- ") &&
        !p.startsWith("|") &&
        !p.startsWith("Source:") &&
        !p.startsWith("Fallback:") &&
        p.trim().length > 20,
    );
  const description = paragraphs.join(" ").trim();

  return { fonts, source, fallback, description, hierarchy };
}

function parseComponentsList(body) {
  const components = [];
  const pattern = /- \*\*(.+?)\*\*:\s*(.+)/g;
  let match;
  while ((match = pattern.exec(body)) !== null) {
    components.push({ name: match[1], description: match[2] });
  }
  return components;
}

function parseDosAndDonts(body) {
  const dos = [];
  const donts = [];
  const lines = body.split("\n");
  for (const line of lines) {
    const trimmed = line.replace(/^- /, "").trim();
    if (trimmed.startsWith("Do ") || trimmed.startsWith("Do:")) {
      dos.push(trimmed.replace(/^Do:?\s*/, ""));
    } else if (trimmed.startsWith("Don't ") || trimmed.startsWith("Don't:")) {
      donts.push(trimmed.replace(/^Don't:?\s*/, ""));
    }
  }
  return { dos, donts };
}

export function parseDesign(raw) {
  const sections = splitSections(raw);

  return {
    overview: {
      description: sections["Overview"] || "",
    },
    colors: parseColors(sections["Colors"] || ""),
    typography: parseTypography(sections["Typography"] || ""),
    elevation: {
      description: sections["Elevation"] || "",
    },
    components: parseComponentsList(sections["Components"] || ""),
    dosAndDonts: parseDosAndDonts(sections["Do's and Don'ts"] || ""),
  };
}
