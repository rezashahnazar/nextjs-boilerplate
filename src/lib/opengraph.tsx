import { ImageResponse } from "next/og";
import { ReactNode } from "react";
import Image from "next/image";



/**
 * Renders Persian text properly for Open Graph image generation.
 *
 * This function handles several complexities specific to Persian text rendering:
 * 1. Reverses the word order to handle RTL text correctly in OG images
 * 2. Preserves the internal character order within each word
 * 3. Handles ZWNJ (Zero Width Non-Joiner) characters (‌) properly
 * 4. Adds proper spacing around English text segments
 *
 * @example
 * ```tsx
 * const persianText = renderPersianTextForOpenGraphImage("سلام به Next.js خوش آمدید");
 * // Will render with proper spacing: "سلام به Next.js خوش آمدید"
 * ```
 *
 * @param text - The Persian text to be rendered in the OG image
 * @param style - Optional CSS styles to override default text styling
 * @returns ReactNode with properly formatted Persian text and styling
 */
export function renderPersianTextForOpenGraphImage(
  text: string,
  style?: React.CSSProperties
): ReactNode {
  // Function to check if a string contains English characters
  const hasEnglish = (str: string) => /[a-zA-Z]/.test(str);

  // Split text into words and process each word
  const words = text.split(" ");
  const processedWords = words.map((word) => {
    if (hasEnglish(word)) {
      // Add spaces around English text
      return ` ${word} `;
    }
    return word;
  });

  const reversedText = processedWords.reverse().join(" ");
  const reversedTextParts = reversedText.split(" ");

  // For each part, split by ZWNJ, reverse sub-parts and rejoin with ZWNJ
  const parts = reversedTextParts.map((part) => {
    // Skip processing if it's an English word (to preserve its direction)
    if (hasEnglish(part)) {
      return part.trim();
    }
    return part.split("‌").reverse().join("‌");
  });

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        direction: "rtl",
        fontSize: 36,
        lineHeight: 1.8,
        fontWeight: 500,
        fontFamily: "IRANYekan",
        textAlign: "center",
        letterSpacing: "0",
        ...style,
      }}
    >
      {parts.map((part, index) =>
        part === "‌" ? (
          <div key={index} />
        ) : hasEnglish(part) ? (
          <div
            key={index}
            style={{
              display: "flex",
              direction: "ltr",
              margin: "0 0.15em",
              letterSpacing: "0.05em",
            }}
          >
            {part}
          </div>
        ) : (
          <div key={index}>{part}</div>
        )
      )}
    </div>
  );
}

/**
 * Configuration options for OpenGraph image generation
 */
interface OpenGraphImageOptions {
  /** The logo component to be displayed at the top of the image */
  logo: React.ReactNode;
  /** The main title text in Persian */
  title: string;
  /** The first line of Persian text below the title */
  line1: string;
  /** The second line of Persian text below line2 */
  line2: string;
  /** Width of the generated image in pixels (default: 1200) */
  width?: number;
  /** Height of the generated image in pixels (default: 630) */
  height?: number;
  /** Optional background image URL or component to use instead of the default gradient */
  background?: string | React.ReactNode;
  /** Optional alt text for the OpenGraph image (default: "Next.js RTL Boilerplate") */
  alt?: string;
}

/**
 * Creates a beautiful OpenGraph image with Persian text support.
 *
 * This function generates a professional-looking OpenGraph image with:
 * - Dark theme with blue accents
 * - Gradient background with subtle grid pattern
 * - Decorative circles for visual interest
 * - Custom logo in a glowing blue container
 * - Title and two lines of Persian text
 * - Proper RTL text handling
 * - IRANYekan font with multiple weights
 *
 * @example
 * ```tsx
 * const ogImage = await createOpenGraphImage({
 *   logo: <YourLogoComponent />,
 *   title: "عنوان به فارسی",
 *   line1: "خط اول به فارسی",
 *   line2: "خط دوم به فارسی",
 * });
 * ```
 *
 * @param options - Configuration options for the OpenGraph image
 * @returns Promise<ImageResponse> - The generated image response
 */
export async function createOpenGraphImage({
  logo,
  title,
  line1,
  line2,
  width = 1200,
  height = 630,
  background,
  alt = "Next.js RTL Boilerplate",
}: OpenGraphImageOptions): Promise<ImageResponse> {
  // Load IRANYekan font files with different weights
  const [fontData, fontDataBold, fontDataBlack] = await Promise.all([
    fetch(
      new URL("../fonts/IranYekan/iranyekan_medium.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("../fonts/IranYekan/iranyekan_extrabold.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("../fonts/IranYekan/iranyekan_black.woff", import.meta.url)
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background */}
        {background ? (
          typeof background === "string" ? (
            <Image
              src={background}
              alt={alt}
              width={1200}
              height={630}
              priority
              className="w-full h-auto"
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                display: "flex",
              }}
            >
              {background}
            </div>
          )
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Default Background Gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(0, 112, 243, 0.15), transparent 50%)",
              }}
            />

            {/* Background Grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
        )}

        {/* Decorative Circles */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "600px",
            height: "600px",
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "300px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "400px",
            height: "400px",
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "200px",
          }}
        />

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "48px",
            zIndex: 1,
            padding: "0 64px",
          }}
        >
          {/* Logo Container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0070F3",
              padding: "28px",
              borderRadius: "28px",
              boxShadow: "0 0 60px rgba(0, 112, 243, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {logo}
          </div>

          {/* Text Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "32px",
              textAlign: "center",
            }}
          >
            {/* Title */}
            {renderPersianTextForOpenGraphImage(title, {
              fontSize: 80,
              lineHeight: 1.1,
              fontWeight: 900,
              color: "white",
              textShadow: "0 4px 16px rgba(0, 112, 243, 0.2)",
            })}

            {/* Description */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "24px 40px",
                background: "rgba(255, 255, 255, 0.03)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  color: "#fff",
                  fontWeight: 500,
                  textAlign: "center",
                  fontFamily: "IRANYekan",
                  opacity: 0.9,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderPersianTextForOpenGraphImage(line1, {
                  fontSize: 36,
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#fff",
                  fontWeight: 500,
                  textAlign: "center",
                  fontFamily: "IRANYekan",
                  opacity: 0.7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {renderPersianTextForOpenGraphImage(line2, {
                  fontSize: 32,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "#0070F3",
          }}
        />
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "IRANYekan",
          data: fontData,
          weight: 500,
          style: "normal",
        },
        {
          name: "IRANYekan",
          data: fontDataBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "IRANYekan",
          data: fontDataBlack,
          weight: 900,
          style: "normal",
        },
      ],
    }
  );
}
