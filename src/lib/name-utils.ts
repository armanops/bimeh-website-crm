// src/lib/name-utils.ts
// Utility functions for handling full names and name parsing

/**
 * Extracts first and last names from a full name string
 * Handles various formats and common Persian name patterns
 */
export function parseFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  if (!fullName || typeof fullName !== "string") {
    return { firstName: "", lastName: "" };
  }

  // Clean and normalize the full name
  const cleanedName = fullName.trim().replace(/\s+/g, " ");

  if (!cleanedName) {
    return { firstName: "", lastName: "" };
  }

  // Split by spaces
  const parts = cleanedName.split(" ");

  if (parts.length === 0) {
    return { firstName: "", lastName: "" };
  }

  if (parts.length === 1) {
    // Single name - treat as first name
    return { firstName: parts[0], lastName: "" };
  }

  if (parts.length === 2) {
    // Two parts - first and last
    return { firstName: parts[0], lastName: parts[1] };
  }

  // Three or more parts - first part is first name, rest is last name
  // This handles compound last names like "احمدی نژاد" or "محمدی راد"
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

/**
 * Constructs a full name from first and last names
 */
export function constructFullName(firstName: string, lastName: string): string {
  const cleanFirstName = (firstName || "").trim();
  const cleanLastName = (lastName || "").trim();

  if (!cleanFirstName && !cleanLastName) {
    return "";
  }

  if (!cleanFirstName) {
    return cleanLastName;
  }

  if (!cleanLastName) {
    return cleanFirstName;
  }

  return `${cleanFirstName} ${cleanLastName}`;
}

/**
 * Validates a full name string
 */
export function validateFullName(fullName: string): {
  isValid: boolean;
  error?: string;
} {
  if (!fullName || typeof fullName !== "string") {
    return { isValid: false, error: "نام کامل نمی‌تواند خالی باشد" };
  }

  const trimmed = fullName.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      error: "نام کامل باید حداقل 2 کاراکتر داشته باشد",
    };
  }

  if (trimmed.length > 500) {
    return {
      isValid: false,
      error: "نام کامل نمی‌تواند بیشتر از 500 کاراکتر باشد",
    };
  }

  // Basic validation - should contain only letters, spaces, and common Persian characters
  const validNamePattern = /^[\u0600-\u06FF\sA-Za-z\-']+$/;
  if (!validNamePattern.test(trimmed)) {
    return {
      isValid: false,
      error:
        "نام کامل فقط می‌تواند شامل حروف فارسی، انگلیسی، فاصله و خط تیره باشد",
    };
  }

  return { isValid: true };
}

/**
 * Normalizes a name by removing extra spaces and standardizing format
 */
export function normalizeName(name: string): string {
  if (!name || typeof name !== "string") {
    return "";
  }

  return name.trim().replace(/\s+/g, " ");
}
