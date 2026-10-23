/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

const KEYS = ["3D5eox", "MmIrpf", "7Q4eo2"]; // these keys are likely to change

const makePatch = (key: string) => ({
    find: `t["${key}"]`,
    replacement: {
        match: new RegExp(
            String.raw`\i(?:\.\i)*\(\{title:\i\.intl\.string\(\i\.t\["${key}"\]\),body:\i\.intl\.string\(\i\.t(?:\.\i|\["[^"]+"\])\),confirmText:\i\.intl\.string\(\i\.t(?:\.\i|\["[^"]+"\])\)\}\)`
        ),
        replace: "void 0"
    }
});

export default definePlugin({
    name: "JustLetMeSpamBro",
    description: "Disable the chill zone modal when you spam",
    authors: [{ name: "Mally", id: 1473303254287913122n }],
    tags: ["Appearance", "Customisation", "Utility"],
    patches: KEYS.map(makePatch)
});
