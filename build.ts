#!/usr/bin/env -S deno run --allow-write
import {
  type ColorFormat,
  type Colors,
  flavorEntries,
  type FlavorName,
  flavors,
} from "https://deno.land/x/catppuccin@v1.7.1/mod.ts";
import plist from "https://esm.sh/v135/plist@3.1.0";

type ITermColor = {
  "Red Component": number;
  "Green Component": number;
  "Blue Component": number;
  "Alpha Component": number;
  "Color Space": "sRGB";
};

function toItermColor(rgb: ColorFormat["rgb"]): ITermColor {
  const [red, green, blue] = [rgb.r, rgb.g, rgb.b].map((v) => v / 255);

  return {
    "Red Component": red,
    "Green Component": green,
    "Blue Component": blue,
    "Alpha Component": 1.0,
    "Color Space": "sRGB",
  };
}

const termcolors = (flavorName: FlavorName, suffix?: "Dark" | "Light") => {
  const flavor = flavors[flavorName];

  const ansiColors = Object.fromEntries(
    flavor.ansiColorEntries
      .flatMap(([_, { normal, bright }]) => [normal, bright])
      .toSorted((a, b) => a.code - b.code)
      .map(({ code, rgb }) => [`Ansi ${code} Color`, toItermColor(rgb)]),
  );

  const colors = flavor.colorEntries.reduce((acc, [colorName, color]) => {
    return {
      [colorName]: toItermColor(color.rgb),
      ...acc,
    };
  }, {} as Colors<ITermColor>);

  const mappings = {
    ...ansiColors,
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
