import QRCode from "qrcode";

/**
 * Generates a base64 Data URL for a QR Code image.
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#17221D", // Main text dark
      light: "#FFFFFF", // White background
    },
    ...options,
  };

  return QRCode.toDataURL(text, defaultOptions);
}

/**
 * Generates an SVG string for a QR Code.
 */
export async function generateQRCodeSVG(
  text: string,
  options?: QRCode.QRCodeToStringOptions
): Promise<string> {
  const defaultOptions: QRCode.QRCodeToStringOptions = {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#17221D",
      light: "#FFFFFF",
    },
    ...options,
  };

  return QRCode.toString(text, defaultOptions);
}

/**
 * Encodes a member code for standard QR scanning.
 */
export function formatMemberQRPayload(memberCode: string): string {
  return JSON.stringify({
    prefix: "GYM_MEMBER",
    code: memberCode,
    ts: Date.now(),
  });
}

/**
 * Parses and verifies raw scanned QR data into a valid member code.
 */
export function parseMemberQRPayload(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.prefix === "GYM_MEMBER" && typeof parsed.code === "string") {
      return parsed.code;
    }
  } catch {
    // If raw string is directly the member code
    if (typeof raw === "string" && raw.trim().length > 0) {
      return raw.trim();
    }
  }
  return null;
}
