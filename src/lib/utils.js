export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatTime = (time) =>
  new Date(`2000-01-01T${time}`).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const getInitials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "MV";

export const classNames = (...classes) => classes.filter(Boolean).join(" ");
