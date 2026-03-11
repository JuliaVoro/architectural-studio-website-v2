"use client";

export function CleanTypographyAdmin() {
  let currentSettings = {
    headingFont: "var(--font-playfair)",
    bodyFont: "var(--font-inter)"
  };

  const loadSettings = async () => {
    console.log('Admin: Loading settings from API...');
    try {
      const response = await fetch("/api/fonts");
      const data = await response.json();
      console.log('Admin: API response:', data);
      
      currentSettings = {
        headingFont: data.primary || "var(--font-playfair)",
        bodyFont: data.secondary || "var(--font-inter)"
      };
      console.log('Admin: Loaded settings:', currentSettings);
      
      updateDropdowns();
      applyCurrentFonts();
    } catch (error) {
      console.error("Admin: Failed to load settings:", error);
    }
  };

  const updateDropdowns = () => {
    const headingSelect = document.getElementById("heading-select") as HTMLSelectElement;
    const bodySelect = document.getElementById("body-select") as HTMLSelectElement;
    
    if (headingSelect) headingSelect.value = currentSettings.headingFont;
    if (bodySelect) bodySelect.value = currentSettings.bodyFont;
  };

  const applyCurrentFonts = () => {
    console.log('Admin: Applying fonts with settings:', currentSettings);
    
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
    
    const headingFontName = fontMap[currentSettings.headingFont] || currentSettings.headingFont;
    const bodyFontName = fontMap[currentSettings.bodyFont] || currentSettings.bodyFont;
    
    console.log('Admin: Mapped fonts:', { headingFontName, bodyFontName });
    
    // Remove ALL existing styles (both admin and global)
    const existingAdminStyles = document.querySelectorAll('style[data-typography-admin]');
    const existingGlobalStyles = document.querySelectorAll('style[data-global-typography]');
    [...existingAdminStyles, ...existingGlobalStyles].forEach(style => style.remove());
    
    // Apply admin styles - SIMPLE DIRECT APPROACH
    const style = document.createElement('style');
    style.setAttribute('data-typography-admin', 'true');
    style.textContent = `
      /* Simple direct font application */
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
    
    // Apply directly to specific sections for immediate effect
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
      
      console.log('Admin: Applied fonts to specific sections');
    }, 100);
    
    console.log('Admin: CSS applied:', style.textContent);
  };

  const saveSettings = async () => {
    const saveButton = document.getElementById("save-button") as HTMLButtonElement;
    const statusMessage = document.getElementById("status-message") as HTMLDivElement;
    
    if (saveButton) saveButton.disabled = true;
    if (saveButton) saveButton.textContent = "Saving...";
    
    try {
      const response = await fetch("/api/fonts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          primary: currentSettings.headingFont,
          secondary: currentSettings.bodyFont,
          accent: currentSettings.headingFont,
        }),
      });

      if (response.ok) {
        if (statusMessage) {
          statusMessage.textContent = "Typography settings saved successfully!";
          statusMessage.className = "mt-3 text-sm text-green-600";
        }
        setTimeout(() => {
          if (statusMessage) {
            statusMessage.textContent = "";
            statusMessage.className = "mt-3 text-sm text-gray-500";
          }
        }, 3000);
      } else {
        if (statusMessage) {
          statusMessage.textContent = "Failed to save settings";
          statusMessage.className = "mt-3 text-sm text-red-600";
        }
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      if (statusMessage) {
        statusMessage.textContent = "Failed to save settings";
        statusMessage.className = "mt-3 text-sm text-red-600";
      }
    } finally {
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save Settings";
      }
    }
  };

  const onFontChange = (type: 'heading' | 'body', value: string) => {
    console.log(`Admin: Font change: ${type} = ${value}`);
    currentSettings[type === 'heading' ? 'headingFont' : 'bodyFont'] = value;
    console.log('Admin: Updated settings:', currentSettings);
    
    // Apply immediately
    applyCurrentFonts();
    
    const statusMessage = document.getElementById("status-message") as HTMLDivElement;
    if (statusMessage) {
      statusMessage.textContent = "Changes applied. Save to persist.";
      statusMessage.className = "mt-3 text-sm text-blue-600";
    }
  };

  // Load settings on mount
  setTimeout(() => {
    loadSettings();
  }, 100);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Typography Settings</h2>
        <p className="text-sm text-gray-600">
          Customize fonts for headings and body text. Changes apply immediately.
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="heading-select" className="block text-sm font-medium text-gray-700 mb-2">
              Heading Font
            </label>
            <select
              id="heading-select"
              onChange={(e) => onFontChange('heading', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="var(--font-playfair)">Playfair Display</option>
              <option value="var(--font-inter)">Inter</option>
              <option value="var(--font-roboto)">Roboto</option>
              <option value="var(--font-montserrat)">Montserrat</option>
              <option value="var(--font-poppins)">Poppins</option>
              <option value="var(--font-raleway)">Raleway</option>
              <option value="var(--font-oswald)">Oswald</option>
              <option value="var(--font-anton)">Anton</option>
              <option value="var(--font-merriweather)">Merriweather</option>
              <option value="var(--font-crimson-text)">Crimson Text</option>
              <option value="var(--font-lobster)">Lobster</option>
              <option value="var(--font-bodoni-moda)">Bodoni Moda</option>
              <option value="var(--font-crimson-pro)">Crimson Pro</option>
              <option value="var(--font-eb-garamond)">EB Garamond</option>
              <option value="var(--font-lora)">Lora</option>
              <option value="var(--font-pt-serif)">PT Serif</option>
              <option value="var(--font-bebas-neue)">Bebas Neue</option>
              <option value="var(--font-righteous)">Righteous</option>
              <option value="var(--font-bitter)">Bitter</option>
              <option value="var(--font-libre-baskerville)">Libre Baskerville</option>
              <option value="var(--font-vollkorn)">Vollkorn</option>
              <option value="var(--font-dm-serif)">DM Serif Display</option>
              <option value="var(--font-times-new-roman)">Times New Roman</option>
              <option value="var(--font-georgia)">Georgia</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Used for titles, headings, and display text</p>
          </div>
          
          <div>
            <label htmlFor="body-select" className="block text-sm font-medium text-gray-700 mb-2">
              Body Font
            </label>
            <select
              id="body-select"
              onChange={(e) => onFontChange('body', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="var(--font-inter)">Inter</option>
              <option value="var(--font-playfair)">Playfair Display</option>
              <option value="var(--font-roboto)">Roboto</option>
              <option value="var(--font-open-sans)">Open Sans</option>
              <option value="var(--font-montserrat)">Montserrat</option>
              <option value="var(--font-lato)">Lato</option>
              <option value="var(--font-nunito)">Nunito</option>
              <option value="var(--font-poppins)">Poppins</option>
              <option value="var(--font-raleway)">Raleway</option>
              <option value="var(--font-source-sans-pro)">Source Sans Pro</option>
              <option value="var(--font-fira-sans)">Fira Sans</option>
              <option value="var(--font-muli)">Muli</option>
              <option value="var(--font-dm-sans)">DM Sans</option>
              <option value="var(--font-ibm-plex-sans)">IBM Plex Sans</option>
              <option value="var(--font-space-grotesk)">Space Grotesk</option>
              <option value="var(--font-syne)">Syne</option>
              <option value="var(--font-urbanist)">Urbanist</option>
              <option value="var(--font-karla)">Karla</option>
              <option value="var(--font-work-sans)">Work Sans</option>
              <option value="var(--font-jost)">Jost</option>
              <option value="var(--font-cabin)">Cabin</option>
              <option value="var(--font-archivo)">Archivo</option>
              <option value="var(--font-titillium-web)">Titillium Web</option>
              <option value="var(--font-josefin-sans)">Josefin Sans</option>
              <option value="var(--font-mukta)">Mukta</option>
              <option value="var(--font-arimo)">Arimo</option>
              <option value="var(--font-tahoma)">Tahoma</option>
              <option value="var(--font-arial)">Arial</option>
              <option value="var(--font-helvetica)">Helvetica</option>
              <option value="var(--font-courier-prime)">Courier Prime</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Used for paragraphs and body text</p>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <button
            id="save-button"
            onClick={saveSettings}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Settings
          </button>
          <div id="status-message" className="mt-3 text-sm text-gray-500"></div>
        </div>
      </div>
    </div>
  );
}
