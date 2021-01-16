import { CSSProperties } from "react";

interface Formatting {
    kind: "color" | "decoration"
    style: CSSProperties
    name: string
}

export const FormattingMap: Map<string, Formatting> = new Map([
    ["§0", { kind: "color", style: { color: "#000000" }, name: "Black" }],
    ["§1", { kind: "color", style: { color: "#0000AA" }, name: "Dark Blue" }],
    ["§2", { kind: "color", style: { color: "#00AA00" }, name: "Dark Green" }],
    ["§3", { kind: "color", style: { color: "#00AAAA" }, name: "Dark Aqua" }],
    ["§4", { kind: "color", style: { color: "#AA0000" }, name: "Dark Red" }],
    ["§5", { kind: "color", style: { color: "#AA00AA" }, name: "Dark Purple" }],
    ["§6", { kind: "color", style: { color: "#FFAA00" }, name: "Gold" }],
    ["§7", { kind: "color", style: { color: "#AAAAAA" }, name: "Gray" }],
    ["§8", { kind: "color", style: { color: "#555555" }, name: "Dark Gray" }],
    ["§9", { kind: "color", style: { color: "#5555DD" }, name: "Blue" }],
    ["§a", { kind: "color", style: { color: "#55FF55" }, name: "Green" }],
    ["§b", { kind: "color", style: { color: "#55FFFF" }, name: "Aqua" }],
    ["§c", { kind: "color", style: { color: "#FF5555" }, name: "Red" }],
    ["§d", { kind: "color", style: { color: "#FF55FF" }, name: "Light Purple" }],
    ["§e", { kind: "color", style: { color: "#FFFF55" }, name: "Yellow" }],
    ["§f", { kind: "color", style: { color: "#FFFFFF" }, name: "White" }],

    ["§k", { kind: "decoration", style: {}, name: "ö1%~#n" }],
    ["§l", { kind: "decoration", style: { fontWeight: "bold" }, name: "Bold" }],
    ["§m", { kind: "decoration", style: { textDecoration: "line-through" }, name: "Strikethrough" }],
    ["§n", { kind: "decoration", style: { textDecoration: "underline" }, name: "Underline" }],
    ["§o", { kind: "decoration", style: { fontStyle: "italic" }, name: "Italic" }],
    ["§r", { kind: "decoration", style: {}, name: "Reset" }]
]);
