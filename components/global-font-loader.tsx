"use client";

export function GlobalFontLoader() {
  const loadGlobalFonts = async () => {
    console.log('GlobalFontLoader: Starting to load fonts...');
    
    try {
      const response = await fetch("/api/fonts");
      console.log('GlobalFontLoader: API response status:', response.status);
      
      const data = await response.json();
      console.log('GlobalFontLoader: API response data:', data);
      
      const fontMap: Record<string, string> = {
        "var(--font-playfair)": '"Playfair Display", "Playfair Display Fallback"',
        "var(--font-inter)": '"Inter", "Inter Fallback"',
        "var(--font-roboto)": '"Roboto", sans-serif',
        "var(--font-open-sans)": '"Open Sans", sans-serif',
        "var(--font-montserrat)": '"Montserrat", sans-serif',
        "var(--font-lato)": '"Lato", sans-serif',
        "var(--font-nunito)": '"Nunito", sans-serif',
        "var(--font-merriweather)": '"Merriweather", serif',
        "var(--font-crimson-text)": '"Crimson Text", serif',
        "var(--font-oswald)": '"Oswald", sans-serif',
        "var(--font-anton)": '"Anton", sans-serif',
        "var(--font-lobster)": '"Lobster", cursive',
        "var(--font-raleway)": '"Raleway", sans-serif',
        "var(--font-poppins)": '"Poppins", sans-serif',
        "var(--font-muli)": '"Muli", sans-serif',
        "var(--font-fira-sans)": '"Fira Sans", sans-serif',
        "var(--font-source-sans-pro)": '"Source Sans Pro", sans-serif',
        "var(--font-dm-sans)": '"DM Sans", sans-serif',
        "var(--font-ibm-plex-sans)": '"IBM Plex Sans", sans-serif',
        "var(--font-space-grotesk)": '"Space Grotesk", sans-serif',
        "var(--font-syne)": '"Syne", sans-serif',
        "var(--font-bodoni-moda)": '"Bodoni Moda", serif',
        "var(--font-crimson-pro)": '"Crimson Pro", serif',
        "var(--font-eb-garamond)": '"EB Garamond", serif',
        "var(--font-lora)": '"Lora", serif',
        "var(--font-pt-serif)": '"PT Serif", serif',
        "var(--font-urbanist)": '"Urbanist", sans-serif',
        "var(--font-karla)": '"Karla", sans-serif',
        "var(--font-work-sans)": '"Work Sans", sans-serif',
        "var(--font-jost)": '"Jost", sans-serif',
        "var(--font-dm-serif)": '"DM Serif Display", serif',
        "var(--font-cabin)": '"Cabin", sans-serif',
        "var(--font-vollkorn)": '"Vollkorn", serif',
        "var(--font-archivo)": '"Archivo", sans-serif',
        "var(--font-titillium-web)": '"Titillium Web", sans-serif',
        "var(--font-bebas-neue)": '"Bebas Neue", cursive',
        "var(--font-righteous)": '"Righteous", cursive',
        "var(--font-bitter)": '"Bitter", serif',
        "var(--font-courier-prime)": '"Courier Prime", monospace',
        "var(--font-josefin-sans)": '"Josefin Sans", sans-serif',
        "var(--font-libre-baskerville)": '"Libre Baskerville", serif',
        "var(--font-mukta)": '"Mukta", sans-serif',
        "var(--font-arimo)": '"Arimo", sans-serif',
        "var(--font-tahoma)": '"Tahoma", sans-serif',
        "var(--font-georgia)": '"Georgia", serif',
        "var(--font-arial)": '"Arial", sans-serif',
        "var(--font-helvetica)": '"Helvetica", sans-serif',
        "var(--font-times-new-roman)": '"Times New Roman", serif',
      };
      
      const headingFontName = fontMap[data.primary] || '"Playfair Display", "Playfair Display Fallback"';
      const bodyFontName = fontMap[data.secondary] || '"Inter", "Inter Fallback"';
      
      console.log('GlobalFontLoader: Mapped fonts:', { headingFontName, bodyFontName });
      
      // Remove existing global styles
      const existingStyles = document.querySelectorAll('style[data-global-typography]');
      existingStyles.forEach(style => style.remove());
      
      // Apply global styles with simple approach (section-based)
      const style = document.createElement('style');
      style.setAttribute('data-global-typography', 'true');
      style.textContent = `
        /* Simple section-based font application */
        .hero h1, .hero h2, .hero h3, .hero h4, .hero h5, .hero h6,
        .philosophy h1, .philosophy h2, .philosophy h3, .philosophy h4, .philosophy h5, .philosophy h6,
        .approach h1, .approach h2, .approach h3, .approach h4, .approach h5, .approach h6,
        .outcomes h1, .outcomes h2, .outcomes h3, .outcomes h4, .outcomes h5, .outcomes h6,
        .system-model h1, .system-model h2, .system-model h3, .system-model h4, .system-model h5, .system-model h6,
        .the-shift h1, .the-shift h2, .the-shift h3, .the-shift h4, .the-shift h5, .the-shift h6 {
          font-family: ${headingFontName} !important;
        }
        
        .hero p, .hero span, .hero div,
        .philosophy p, .philosophy span, .philosophy div,
        .approach p, .approach span, .approach div,
        .outcomes p, .outcomes span, .outcomes div,
        .system-model p, .system-model span, .system-model div,
        .the-shift p, .the-shift span, .the-shift div {
          font-family: ${bodyFontName} !important;
        }
        
        /* Main content areas */
        main h1, main h2, main h3, main h4, main h5, main h6 {
          font-family: ${headingFontName} !important;
        }
        
        main p, main span, main div {
          font-family: ${bodyFontName} !important;
        }
      `;
      document.head.appendChild(style);
      
      // Also apply directly to elements for immediate effect (section-based)
      setTimeout(() => {
        // Target specific sections by class or ID
        const sections = ['.hero', '.philosophy', '.approach', '.outcomes', '.system-model', '.the-shift'];
        
        sections.forEach(section => {
          const element = document.querySelector(section);
          if (element) {
            // Apply to headings in this section
            element.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
              (el as HTMLElement).style.fontFamily = headingFontName;
            });
            
            // Apply to body text in this section
            element.querySelectorAll('p, span, div').forEach(el => {
              (el as HTMLElement).style.fontFamily = bodyFontName;
            });
          }
        });
        
        console.log('GlobalFontLoader: Applied fonts to specific sections');
      }, 200);
      
      console.log('GlobalFontLoader: Global fonts applied successfully');
    } catch (error) {
      console.error("GlobalFontLoader: Failed to load global fonts:", error);
    }
  };

  // Load fonts when component mounts, but delay to avoid overriding admin
  setTimeout(() => {
    // Only run if admin is not on the page
    if (!window.location.pathname.includes('/admin')) {
      loadGlobalFonts();
    }
  }, 100);
  
  // Retry after page load (only if not admin)
  setTimeout(() => {
    if (!window.location.pathname.includes('/admin')) {
      loadGlobalFonts();
    }
  }, 500);
  
  // Retry again after DOM is ready (only if not admin)
  setTimeout(() => {
    if (!window.location.pathname.includes('/admin')) {
      loadGlobalFonts();
    }
  }, 1000);
  
  // Final retry (only if not admin)
  setTimeout(() => {
    if (!window.location.pathname.includes('/admin')) {
      loadGlobalFonts();
    }
  }, 2000);

  return null; // This component doesn't render anything
}
