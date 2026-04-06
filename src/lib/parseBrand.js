import yaml from "js-yaml";

export function parseBrand(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("BRAND.md: missing YAML frontmatter");

  const data = yaml.load(match[1]);
  const markdown = match[2].trim();

  return { data, markdown };
}
