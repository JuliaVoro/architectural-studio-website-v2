import { supabaseServerClient } from "@/lib/supabase-client";
import { HeroSlideshow } from "./hero-slideshow";
import { HeroSplit } from "./hero-split";

interface HeroConfig {
  template_type: "slider" | "split";
  split_title?: string;
  split_subtitle?: string;
  split_description?: string;
  split_media_url?: string;
  split_media_type?: "image" | "video";
  split_layout?: "media-right" | "media-left";
}

async function getHeroConfig(): Promise<HeroConfig> {
  if (!supabaseServerClient) {
    return { template_type: "slider" };
  }

  try {
    const { data, error } = await supabaseServerClient
      .from("hero_template_config")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error || !data) {
      console.error("Error fetching hero config:", error);
      return { template_type: "slider" };
    }

    return {
      template_type: data.template_type,
      split_title: data.split_title,
      split_subtitle: data.split_subtitle,
      split_description: data.split_description,
      split_media_url: data.split_media_url,
      split_media_type: data.split_media_type,
      split_layout: data.split_layout,
    };
  } catch (error) {
    console.error("Error in getHeroConfig:", error);
    return { template_type: "slider" };
  }
}

export async function Hero() {
  const config = await getHeroConfig();

  if (config.template_type === "split") {
    return (
      <HeroSplit
        title={config.split_title}
        subtitle={config.split_subtitle}
        description={config.split_description}
        mediaUrl={config.split_media_url}
        mediaType={config.split_media_type}
        layout={config.split_layout}
      />
    );
  }

  return <HeroSlideshow />;
}

