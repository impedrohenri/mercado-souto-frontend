export function NameAbbreviation(name: string) {
 return String(name).trim().split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}
