/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { SUPER_PROPERTIES_OVERRIDE } from "./shared";

const CHANNEL_RE = /\/api\/v\d+\/channels\/\d+(?:[/?]|$)/;

let unhookWeb: (() => void) | undefined;

function hookWebSuperProperties() {
    const { open, setRequestHeader } = XMLHttpRequest.prototype;
    const urls = new WeakMap<XMLHttpRequest, string>();

    XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, ...rest: any[]) {
        urls.set(this, String(url));
        return (open as any).call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.setRequestHeader = function (this: XMLHttpRequest, name: string, value: string) {
        if (name.toLowerCase() === "x-super-properties" && CHANNEL_RE.test(urls.get(this) ?? "")) {
            try {
                value = btoa(JSON.stringify({ ...JSON.parse(atob(value)), ...SUPER_PROPERTIES_OVERRIDE }));
            } catch {

            }
        }
        return setRequestHeader.call(this, name, value);
    };

    unhookWeb = () => {
        XMLHttpRequest.prototype.open = open;
        XMLHttpRequest.prototype.setRequestHeader = setRequestHeader;
    };
}

const settings = definePluginSettings({
    showAttachment: {
        type: OptionType.BOOLEAN,
        description: "Show NSFW attachments"
    }
});

export default definePlugin({
    name: "BetterNsfwBypass",
    description: "Allows you to access NSFW channels without setting/verifying your age",
    authors: [{ name: "Mally", id: 1473303254287913122n }, Devs.Ven],
    tags: ["Appearance", "Media", "Customisation"],
    start() {
        if (IS_WEB) hookWebSuperProperties();
    },
    stop() {
        unhookWeb?.();
    },
    settings: settings,
    patches: [
        {
            find: ".obscureReason)}",
            replacement: [
                {
                    // blur reasons list (attachments + embeds)
                    match: /(function \i\(\i,\i\)\{)if\(\i===\i\.\i\.NONE\)return\[\];(?=let \i=\i\(\i\);return 0===)/,
                    replace: "$1return[];"
                },
                {
                    // pending-scan redaction check
                    match: /\i===\i\.\i\.NONE\|\|(?=\i\.\i\.get\("explicit_media_redaction_ignore_pending_scan"\))/,
                    replace: "true||"
                }
            ]
        },
        {
            find: "this.nsfwAllowed=",
            replacement: [
                {
                    match: /(?<=this\.nsfwAllowed=)\i\.nsfw_allowed\?\?\i\.nsfwAllowed/,
                    replace: "true",
                },
                {
                    match: /(?<=this\.ageVerificationStatus=)\i\.age_verification_status\?\?\i\.ageVerificationStatus/,
                    replace: "3", // VERIFIED_ADULT
                }
            ],
        }
    ],
});
