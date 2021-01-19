import React, { ReactElement, useEffect, useState } from "react";
import { getRandomString } from "../../../../utils/utils";

interface ObfuscatedSpanProps {
    length: number
}

const ObfuscatedSpan = ({
    length
}: ObfuscatedSpanProps): ReactElement => {
    const [text, setText] = useState(getRandomString(length));
    let stopCycle = false;

    const cycle = () => {
        if (stopCycle) return;

        setTimeout(() => {
            cycle();
        }, 80);

        setText(getRandomString(length));
    };

    useEffect(() => {
        cycle();
        return function cleanup () {
            stopCycle = true;
        };
    }, [length]);

    return <span>{text}</span>;
};

export default ObfuscatedSpan;
