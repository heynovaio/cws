// Helper functions for masking Prismic media URLs

/**
 * Converts a Prismic CDN URL to a custom /files/ URL
 * @param {string} prismicUrl - Original Prismic URL
 * @param {string} customFilename - Optional custom filename
 * @returns {string} Custom URL
 */
export function maskPrismicUrl(
  prismicUrl: string | URL,
  customFilename = null
) {
  try {
    const url = new URL(prismicUrl);

    // Extract the path after the repo name
    // Example: /canadian-women-in-sports/abc123/document.pdf -> abc123/document.pdf
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts.length < 2) {
      throw new Error("Invalid Prismic URL structure");
    }

    // Remove repo name (first part) and keep the rest
    const filePathParts = pathParts.slice(1);

    // Use custom filename if provided, otherwise keep original
    if (customFilename) {
      filePathParts[filePathParts.length - 1] = customFilename;
    }

    return `/files/${filePathParts.join("/")}${url.search || ""}`;
  } catch (error) {
    console.error("Error masking Prismic URL:", error);
    return prismicUrl; // Return original URL as fallback
  }
}

/**
 * Extracts the hash/ID from a Prismic URL for use in custom URLs
 * @param {string} prismicUrl - Original Prismic URL
 * @returns {string} Hash/ID portion
 */
export function extractPrismicHash(prismicUrl: string | URL) {
  try {
    const url = new URL(prismicUrl);
    const pathParts = url.pathname.split("/").filter(Boolean);

    // Return the hash (typically the second path segment after repo name)
    return pathParts.length >= 2 ? pathParts[1] : "";
  } catch (error) {
    console.error("Error extracting Prismic hash:", error);
    return "";
  }
}

// Example usage:
// Original: https://canadian-women-in-sports.cdn.prismic.io/canadian-women-in-sports/aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf
// Masked:   /files/aLsTBmGNHVfTOt-k_WinningPlays-2022-FR-WEB.pdf
// Clean:    WinningPlays-2022-FR-WEB.pdf (shown to users)
// Or with custom name: /files/custom-name.pdf
