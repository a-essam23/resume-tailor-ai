import Handlebars from "handlebars";

// Date formatting helper (ISO → "MMM YYYY" format)
Handlebars.registerHelper("date", (isoDate) => {
  if (!isoDate) return "Present";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
});
