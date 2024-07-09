#!/usr/bin/env -S deno run --allow-write
import {
  Colors,
  flavorEntries,
  FlavorName,
  flavors,
} from "https://deno.land/x/catppuccin@v1.1.1/mod.ts";
import plist from "https://esm.sh/v135/plist@3.1.0";

type ITermColor = {
  "Red Component": number;
  "Green Component": number;
  "Blue Component": number;
  "Alpha Component": number;
  "Color Space": "sRGB";
};

const termcolors = (flavorName: FlavorName, suffix?: "Dark" | "Light") => {
  const { dark, ...flavor } = flavors[flavorName];

  const colors = flavor.colorEntries.reduce((acc, [colorName, color]) => {
    // iTerm needs rgb colors between 0.0 and 1.0
    const [red, green, blue] = [color.rgb.r, color.rgb.g, color.rgb.b]
      .map((v) => v / 255);

    return {
      [colorName]: {
        "Red Component": red,
        "Green Component": green,
        "Blue Component": blue,
        "Alpha Component": 1.0,
        "Color Space": "sRGB",
      },
      ...acc,
    };
  }, {} as Colors<ITermColor>);

  const mappings = {
    "Ansi 0 Color": dark ? colors.surface1 : colors.subtext1,
    "Ansi 1 Color": colors.red,
    "Ansi 2 Color": colors.green,
    "Ansi 3 Color": colors.yellow,
    "Ansi 4 Color": colors.blue,
    "Ansi 5 Color": colors.pink,
    "Ansi 6 Color": colors.teal,
    "Ansi 7 Color": dark ? colors.subtext1 : colors.surface2,
    "Ansi 8 Color": dark ? colors.surface2 : colors.subtext0,
    "Ansi 9 Color": colors.red,
    "Ansi 10 Color": colors.green,
    "Ansi 11 Color": colors.yellow,
    "Ansi 12 Color": colors.blue,
    "Ansi 13 Color": colors.pink,
    "Ansi 14 Color": colors.teal,
    "Ansi 15 Color": dark ? colors.subtext0 : colors.surface1,
    "Background Color": colors.base,
    "Foreground Color": colors.text,
    "Link Color": colors.sky,
    "Bold Color": colors.text,
    "Cursor Color": colors.rosewater,
    "Cursor Text Color": colors.base,
    "Cursor Guide Color": { ...colors.text, "Alpha Component": 0.07 },
    "Selection Color": colors.surface2,
    "Selected Text Color": colors.text,
  };

  return Object.entries(mappings).reduce(
    (acc, [k, v]) => ({
      [suffix ? `${k} (${suffix})` : k]: v,
      ...acc,
    }),
    {} as Record<string, ITermColor>,
  );
};

flavorEntries.map(([flavorName]) => {
  const combined = {
    ...termcolors(flavorName),
    ...termcolors("latte", "Light"),
    ...termcolors(flavorName, "Dark"),
  };

  Deno.writeTextFileSync(
    `./colors/catppuccin-${flavorName}.itermcolors`,
    plist.build(combined),
  );
});
