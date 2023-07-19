#!/usr/bin/env -S deno run --allow-write --allow-env
import { variants } from "https://esm.sh/@catppuccin/palette@0.1.5";
import Handlebars from "https://esm.sh/handlebars@4.7.7";

const template = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  {{#each color}}
  <key>{{key}}</key>
  <dict>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Red Component</key>
    <real>{{col.red}}</real>
    <key>Green Component</key>
    <real>{{col.green}}</real>
    <key>Blue Component</key>
    <real>{{col.blue}}</real>
    <key>Alpha Component</key>
    <real>{{col.alpha}}</real>
  </dict>
  {{/each}}
</dict>
</plist>`;

for (let [flavour, colors] of Object.entries(variants)) {
  const isLatte = flavour === "latte";

  colors = Object.fromEntries(
    Object.entries(colors).map(([key, value]) => {
      const [red, green, blue] = [
        value.hex.slice(1, 3),
        value.hex.slice(3, 5),
        value.hex.slice(5, 7),
      ].map((v) => parseInt(v, 16) / 255);
      return [key, { red, green, blue, alpha: 1 }];
    }),
  );
  const termcolor = [
    {
      key: "Ansi 0 Color",
      col: isLatte ? colors.subtext1 : colors.surface1,
    },
    {
      key: "Ansi 1 Color",
      col: colors.red,
    },
    {
      key: "Ansi 2 Color",
      col: colors.green,
    },
    {
      key: "Ansi 3 Color",
      col: colors.yellow,
    },
    {
      key: "Ansi 4 Color",
      col: colors.blue,
    },
    {
      key: "Ansi 5 Color",
      col: colors.pink,
    },
    {
      key: "Ansi 6 Color",
      col: colors.teal,
    },
    {
      key: "Ansi 7 Color",
      col: isLatte ? colors.surface2 : colors.subtext1,
    },
    {
      key: "Ansi 8 Color",
      col: isLatte ? colors.subtext0 : colors.surface2,
    },
    {
      key: "Ansi 9 Color",
      col: colors.red,
    },
    {
      key: "Ansi 10 Color",
      col: colors.green,
    },
    {
      key: "Ansi 11 Color",
      col: colors.yellow,
    },
    {
      key: "Ansi 12 Color",
      col: colors.blue,
    },
    {
      key: "Ansi 13 Color",
      col: colors.pink,
    },
    {
      key: "Ansi 14 Color",
      col: colors.teal,
    },
    {
      key: "Ansi 15 Color",
      col: isLatte ? colors.surface1 : colors.subtext0,
    },
    {
      key: "Background Color",
      col: colors.base,
    },
    {
      key: "Foreground Color",
      col: colors.text,
    },
    {
      key: "Link Color",
      col: colors.sky,
    },
    {
      key: "Bold Color",
      col: colors.text,
    },
    {
      key: "Cursor Color",
      col: colors.rosewater,
    },
    {
      key: "Cursor Text Color",
      col: colors.base,
    },
    {
      key: "Cursor Guide Color",
      col: { ...colors.text, alpha: 0.07 },
    },
    {
      key: "Selection Color",
      col: colors.surface2,
    },
    {
      key: "Selected Text Color",
      col: colors.text,
    },
  ];
  const compiled = Handlebars.compile(template);
  Deno.writeTextFileSync(
    `./colors/catppuccin-${flavour}.itermcolors`,
    compiled({ color: termcolor }),
  );
}
