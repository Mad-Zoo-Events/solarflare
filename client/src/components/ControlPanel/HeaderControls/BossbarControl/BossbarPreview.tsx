/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { CSSProperties, ReactElement } from "react";
import { FormattingMap } from "../../../../domain/controlpanel/BossbarFormatting";
import ObfuscatedSpan from "./ObfuscatedSpan";

interface BossbarPreviewProps {
    rawText: string
}

interface PreviewPart {
    text: string
    style: CSSProperties
    obfuscated: boolean
}

const BossbarPreview = ({
    rawText
}: BossbarPreviewProps): ReactElement => {
    const getParts = (inputText: string): PreviewPart[] => {
        inputText = "START" + inputText;

        const allCodes = inputText.match(/(§.{1}|START)+/g) || [];

        let style = {};
        return allCodes.map((code, i) => {
            const startIndex = inputText.indexOf(code);
            const endIndex = allCodes[i + 1] ? inputText.indexOf(allCodes[i + 1]) : inputText.length;

            const text = inputText.substring(startIndex, endIndex).replace(code, "").replaceAll(" ", "\u00A0");

            inputText = inputText.replace(code, "\x00\x00");

            let obfuscated = false;
            code.match(/§.{1}/g)?.forEach(c => {
                switch (c) {
                case "§k":
                    obfuscated = true;
                    break;
                case "§r":
                    style = {};
                    break;
                default:
                    style = { ...style, ...FormattingMap.get(c)?.style };
                }
            });

            return { text, style, obfuscated };
        });
    };

    const parts = getParts(rawText);

    return <>
        {parts.map(({ text, style, obfuscated }, i) =>
            <span key={i} style={style}>{obfuscated
                ? <ObfuscatedSpan key={i} length={text.length}/>
                : text.endsWith("§") ? text.substring(0, text.length - 1) : text
            }</span>
        )}
    </>;
};

export default BossbarPreview;
