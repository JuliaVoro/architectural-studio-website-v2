"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, RefreshCw, Eye, RotateCcw, Palette } from "lucide-react";
import { defaultTypography, typographyPresets } from "@/lib/typography";
import Link from "next/link";

interface TypographySettings {
  display: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
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

const fontFamilies = [
  { value: "var(--font-inter)", label: "Inter", category: "Sans Serif" },
  { value: "var(--font-satoshi)", label: "Satoshi", category: "Sans Serif" },
  { value: "var(--font-playfair)", label: "Playfair Display", category: "Serif" },
  { value: "var(--font-roboto)", label: "Roboto", category: "Sans Serif" },
  { value: "var(--font-open-sans)", label: "Open Sans", category: "Sans Serif" },
  { value: "var(--font-montserrat)", label: "Montserrat", category: "Sans Serif" },
  { value: "var(--font-lato)", label: "Lato", category: "Sans Serif" },
  { value: "var(--font-nunito)", label: "Nunito", category: "Sans Serif" },
  { value: "var(--font-merriweather)", label: "Merriweather", category: "Serif" },
  { value: "var(--font-crimson-text)", label: "Crimson Text", category: "Serif" },
  { value: "var(--font-oswald)", label: "Oswald", category: "Display" },
  { value: "var(--font-anton)", label: "Anton", category: "Display" },
  { value: "var(--font-lobster)", label: "Lobster", category: "Display" },
];

export function TypographyManager() {
  const [settings, setSettings] = useState<TypographySettings>(defaultTypography);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'presets'>('individual');

  // Load current settings
  useEffect(() => {
    fetch("/api/typography")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load typography settings:", error);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/typography", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save typography settings:", error);
      alert("Failed to save typography settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (preset: typeof typographyPresets[0]) => {
    setSettings({
      ...settings,
      ...preset.tokens,
    });
  };

  const resetToDefaults = () => {
    setSettings(defaultTypography);
  };

  const updateSetting = (category: keyof TypographySettings, property: string, value: string) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [property]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading typography settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Back to Admin
        </Link>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Typography Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize typography across your website. Changes are applied immediately.
          </p>
        </div>

        {saved && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Typography settings saved successfully! Refresh page to see changes.
            </AlertDescription>
          </Alert>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'individual'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Individual Styles
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Presets
          </button>
        </div>

        {activeTab === 'individual' ? (
          <div className="space-y-8">
            {/* Display / Hero Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Display / Hero Title
                </CardTitle>
                <CardDescription>
                  Main hero text and large display elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display-font">Font Family</Label>
                    <Select
                      value={settings.display.fontFamily}
                      onValueChange={(value) => updateSetting('display', 'fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{font.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="display-size">Font Size</Label>
                    <Input
                      id="display-size"
                      value={settings.display.fontSize}
                      onChange={(e) => updateSetting('display', 'fontSize', e.target.value)}
                      placeholder="e.g., clamp(2.5rem, 5vw, 4rem)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="display-weight">Font Weight</Label>
                    <Select
                      value={settings.display.fontWeight}
                      onValueChange={(value) => updateSetting('display', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">300 (Light)</SelectItem>
                        <SelectItem value="400">400 (Regular)</SelectItem>
                        <SelectItem value="500">500 (Medium)</SelectItem>
                        <SelectItem value="600">600 (Semibold)</SelectItem>
                        <SelectItem value="700">700 (Bold)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="display-line-height">Line Height</Label>
                    <Input
                      id="display-line-height"
                      value={settings.display.lineHeight}
                      onChange={(e) => updateSetting('display', 'lineHeight', e.target.value)}
                      placeholder="e.g., 1.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="display-letter-spacing">Letter Spacing</Label>
                    <Input
                      id="display-letter-spacing"
                      value={settings.display.letterSpacing}
                      onChange={(e) => updateSetting('display', 'letterSpacing', e.target.value)}
                      placeholder="e.g., -0.02em"
                    />
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div
                    style={{
                      fontFamily: settings.display.fontFamily,
                      fontSize: settings.display.fontSize,
                      fontWeight: settings.display.fontWeight,
                      lineHeight: settings.display.lineHeight,
                      letterSpacing: settings.display.letterSpacing,
                    }}
                    className="text-center"
                  >
                    Designing systems, not isolated solutions
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* H1 */}
            <Card>
              <CardHeader>
                <CardTitle>H1</CardTitle>
                <CardDescription>
                  Main page headings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="h1-font">Font Family</Label>
                    <Select
                      value={settings.h1.fontFamily}
                      onValueChange={(value) => updateSetting('h1', 'fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{font.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="h1-size">Font Size</Label>
                    <Input
                      id="h1-size"
                      value={settings.h1.fontSize}
                      onChange={(e) => updateSetting('h1', 'fontSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="h1-weight">Font Weight</Label>
                    <Select
                      value={settings.h1.fontWeight}
                      onValueChange={(value) => updateSetting('h1', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">300 (Light)</SelectItem>
                        <SelectItem value="400">400 (Regular)</SelectItem>
                        <SelectItem value="500">500 (Medium)</SelectItem>
                        <SelectItem value="600">600 (Semibold)</SelectItem>
                        <SelectItem value="700">700 (Bold)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="h1-line-height">Line Height</Label>
                    <Input
                      id="h1-line-height"
                      value={settings.h1.lineHeight}
                      onChange={(e) => updateSetting('h1', 'lineHeight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="h1-letter-spacing">Letter Spacing</Label>
                    <Input
                      id="h1-letter-spacing"
                      value={settings.h1.letterSpacing}
                      onChange={(e) => updateSetting('h1', 'letterSpacing', e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h1
                    style={{
                      fontFamily: settings.h1.fontFamily,
                      fontSize: settings.h1.fontSize,
                      fontWeight: settings.h1.fontWeight,
                      lineHeight: settings.h1.lineHeight,
                      letterSpacing: settings.h1.letterSpacing,
                    }}
                  >
                    Main Heading Example
                  </h1>
                </div>
              </CardContent>
            </Card>

            {/* Body */}
            <Card>
              <CardHeader>
                <CardTitle>Body Text</CardTitle>
                <CardDescription>
                  Regular paragraph text and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="body-font">Font Family</Label>
                    <Select
                      value={settings.body.fontFamily}
                      onValueChange={(value) => updateSetting('body', 'fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{font.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="body-size">Font Size</Label>
                    <Input
                      id="body-size"
                      value={settings.body.fontSize}
                      onChange={(e) => updateSetting('body', 'fontSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-weight">Font Weight</Label>
                    <Select
                      value={settings.body.fontWeight}
                      onValueChange={(value) => updateSetting('body', 'fontWeight', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">300 (Light)</SelectItem>
                        <SelectItem value="400">400 (Regular)</SelectItem>
                        <SelectItem value="500">500 (Medium)</SelectItem>
                        <SelectItem value="600">600 (Semibold)</SelectItem>
                        <SelectItem value="700">700 (Bold)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="body-line-height">Line Height</Label>
                    <Input
                      id="body-line-height"
                      value={settings.body.lineHeight}
                      onChange={(e) => updateSetting('body', 'lineHeight', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="body-letter-spacing">Letter Spacing</Label>
                    <Input
                      id="body-letter-spacing"
                      value={settings.body.letterSpacing}
                      onChange={(e) => updateSetting('body', 'letterSpacing', e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p
                    style={{
                      fontFamily: settings.body.fontFamily,
                      fontSize: settings.body.fontSize,
                      fontWeight: settings.body.fontWeight,
                      lineHeight: settings.body.lineHeight,
                      letterSpacing: settings.body.letterSpacing,
                    }}
                  >
                    This is example body text that demonstrates how your typography settings will appear in regular content. 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Presets Tab */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {typographyPresets.map((preset, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      {preset.name}
                    </CardTitle>
                    <CardDescription>
                      {preset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div
                        style={{
                          fontFamily: preset.tokens.display?.fontFamily || settings.display.fontFamily,
                          fontSize: preset.tokens.display?.fontSize || settings.display.fontSize,
                          fontWeight: preset.tokens.display?.fontWeight || settings.display.fontWeight,
                          lineHeight: preset.tokens.display?.lineHeight || settings.display.lineHeight,
                          letterSpacing: preset.tokens.display?.letterSpacing || settings.display.letterSpacing,
                        }}
                        className="text-center text-2xl font-bold"
                      >
                        Display
                      </div>
                      <div
                        style={{
                          fontFamily: preset.tokens.h1?.fontFamily || settings.h1.fontFamily,
                          fontSize: preset.tokens.h1?.fontSize || settings.h1.fontSize,
                          fontWeight: preset.tokens.h1?.fontWeight || settings.h1.fontWeight,
                          lineHeight: preset.tokens.h1?.lineHeight || settings.h1.lineHeight,
                          letterSpacing: preset.tokens.h1?.letterSpacing || settings.h1.letterSpacing,
                        }}
                        className="text-lg font-bold mb-2"
                      >
                        Heading Example
                      </div>
                      <div
                        style={{
                          fontFamily: preset.tokens.body?.fontFamily || settings.body.fontFamily,
                          fontSize: preset.tokens.body?.fontSize || settings.body.fontSize,
                          fontWeight: preset.tokens.body?.fontWeight || settings.body.fontWeight,
                          lineHeight: preset.tokens.body?.lineHeight || settings.body.lineHeight,
                          letterSpacing: preset.tokens.body?.letterSpacing || settings.body.letterSpacing,
                        }}
                        className="text-sm"
                      >
                        Body text preview with the {preset.name.toLowerCase()} preset applied.
                      </div>
                    </div>
                    <Button 
                      onClick={() => applyPreset(preset)}
                      className="w-full mt-4"
                    >
                      Apply {preset.name} Preset
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-border">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Save Typography Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
