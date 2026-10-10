/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";

import { SUPER_PROPERTIES_OVERRIDE } from "./shared";

const SuperProperties = findByPropsLazy("getSuperPropertiesBase64");

function setWebSuperProperties(enabled: boolean) {
    let value: string | null = null;

    if (enabled) {
        const original = JSON.parse(atob(SuperProperties.getSuperPropertiesBase64()));
        value = btoa(JSON.stringify({ ...original, ...SUPER_PROPERTIES_OVERRIDE }));
    }

    window.postMessage({ type: "equicord:setSuperProperties", value });
}

function fuckSensorship(m: any) {
    if (settings.store.showAttachment) {
        for (const a of m?.attachments ?? []) {
            delete a.content_scan_version;
            a.flags &= ~16;
        }
        for (const s of m?.message_snapshots ?? []) fuckSensorship(s.message);
    }
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
        if (IS_WEB) setWebSuperProperties(true);
    },
    stop() {
        if (IS_WEB) setWebSuperProperties(false);
    },
    settings: settings,
    patches: [
        {
            find: ".nsfwAllowed=null",
            replacement: [
                {
                    match: /(?<=\.nsfwAllowed=)null!=.+?(?=[,;])/,
                    replace: "true",
                },
                {
                    match: /(?<=\.ageVerificationStatus=)null!=.+?(?=[,;])/,
                    replace: "3", // VERIFIED_ADULT
                }
            ],
        },
        {
            find: "isNSFW(){",
            replacement: {
                match: /isNSFW\(\)\s*\{\i\s*\i\.\i\}/,
                replace: "isNSFW(){return false}"
            }
        } // i wanted to make it to remove the age check thing but doesnt seem to find it sooo this is currently the way
    ],

    flux: {
        MESSAGE_CREATE: ({ message }) => fuckSensorship(message),
        MESSAGE_UPDATE: ({ message }) => fuckSensorship(message),
        LOAD_MESSAGES_SUCCESS: ({ messages }) => messages.forEach(fuckSensorship),
    }
});
