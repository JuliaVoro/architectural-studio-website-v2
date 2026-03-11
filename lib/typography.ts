// Typography token system for centralized font management
export interface TypographyTokens {
  display: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform?: string;
  };
  
  h1: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  h2: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  h3: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  h4: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  bodyLarge: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  body: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  small: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
  };
  
  caption: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform?: string;
  };
  
  label: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform?: string;
  };
  
  button: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textTransform?: string;
  };
}

export const defaultTypography: TypographyTokens = {
  display: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "400",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  
  h1: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: "400",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
  },
  
  h2: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: "400",
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
  },
  
  h3: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    fontWeight: "400",
    lineHeight: "1.3",
    letterSpacing: "0",
  },
  
  h4: {
    fontFamily: "var(--font-satoshi)",
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
    fontWeight: "400",
    lineHeight: "1.4",
    letterSpacing: "0",
  },
  
  bodyLarge: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
    fontWeight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  
  body: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(1rem, 2vw, 1.125rem)",
    fontWeight: "400",
    lineHeight: "1.6",
    letterSpacing: "0",
  },
  
  small: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0",
  },
  
  caption: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.75rem, 1.25vw, 0.875rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  
  label: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.6875rem, 1.125vw, 0.75rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  
  button: {
    fontFamily: "var(--font-inter)",
    fontSize: "clamp(0.6875rem, 1.125vw, 0.75rem)",
    fontWeight: "500",
    lineHeight: "1.4",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
};

export interface TypographyPreset {
  name: string;
  description: string;
  tokens: Partial<TypographyTokens>;
}

export const typographyPresets: TypographyPreset[] = [
  {
    name: "Minimal",
    description: "Clean, modern sans-serif with tight spacing",
    tokens: {
      display: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(2.5rem, 5vw, 4rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "-0.03em"
      },
      h1: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "-0.02em"
      },
      h2: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: "400",
        lineHeight: "1.2",
        letterSpacing: "-0.01em"
      },
      body: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(1rem, 2vw, 1.125rem)",
        fontWeight: "400",
        lineHeight: "1.5",
        letterSpacing: "0"
      },
    },
  },
  {
    name: "Editorial",
    description: "Classic serif fonts for reading comfort",
    tokens: {
      display: { 
        fontFamily: "var(--font-playfair)", 
        fontSize: "clamp(2.5rem, 5vw, 4rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "0"
      },
      h1: { 
        fontFamily: "var(--font-playfair)", 
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "0"
      },
      h2: { 
        fontFamily: "var(--font-playfair)", 
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: "400",
        lineHeight: "1.2",
        letterSpacing: "0"
      },
      body: { 
        fontFamily: "var(--font-playfair)", 
        fontSize: "clamp(1rem, 2vw, 1.125rem)",
        fontWeight: "400",
        lineHeight: "1.7",
        letterSpacing: "0"
      },
    },
  },
  {
    name: "Modern",
    description: "Contemporary fonts with balanced hierarchy",
    tokens: {
      display: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(2.5rem, 5vw, 4rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "-0.02em"
      },
      h1: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: "400",
        lineHeight: "1.1",
        letterSpacing: "-0.02em"
      },
      h2: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: "400",
        lineHeight: "1.2",
        letterSpacing: "-0.01em"
      },
      body: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(1rem, 2vw, 1.125rem)",
        fontWeight: "400",
        lineHeight: "1.6",
        letterSpacing: "0"
      },
    },
  },
  {
    name: "Architectural",
    description: "Strong, professional typography for design work",
    tokens: {
      display: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(2.5rem, 5vw, 4rem)",
        fontWeight: "300",
        lineHeight: "1.1",
        letterSpacing: "-0.03em"
      },
      h1: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(2rem, 4vw, 3rem)",
        fontWeight: "300",
        lineHeight: "1.1",
        letterSpacing: "-0.02em"
      },
      h2: { 
        fontFamily: "var(--font-satoshi)", 
        fontSize: "clamp(1.5rem, 3vw, 2rem)",
        fontWeight: "300",
        lineHeight: "1.2",
        letterSpacing: "-0.01em"
      },
      body: { 
        fontFamily: "var(--font-inter)", 
        fontSize: "clamp(1rem, 2vw, 1.125rem)",
        fontWeight: "400",
        lineHeight: "1.65",
        letterSpacing: "0"
      },
    },
  },
];
