/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { RendererSettings } from "@main/settings";
import { app, session } from "electron";

import { SUPER_PROPERTIES_OVERRIDE } from "./shared";

const PLUGIN_NAME = "BetterNsfwBypass";
const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed/";

const CHANNEL_RE = /\/api\/v\d+\/channels\/(\d+)(?:[/?]|$)/;

type Headers = Record<string, string>;

function isPluginEnabled(name: string): boolean {
    return RendererSettings.store.plugins?.[name]?.enabled === true;
}

function spoofSuperProperties(headers: Headers): void {
    const key = Object.keys(headers).find(k => k.toLowerCase() === "x-super-properties") ?? "X-Super-Properties";

    let original: Record<string, unknown> = {};
    try {
        original = JSON.parse(Buffer.from(headers[key] ?? "", "base64").toString("utf8"));
    } catch {

    }

    headers[key] = Buffer.from(JSON.stringify({ ...original, ...SUPER_PROPERTIES_OVERRIDE }), "utf8").toString("base64");
}

app.whenReady().then(() => {
    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ["https://*.discord.com/api/*", `${YOUTUBE_EMBED_URL}*`] },
        ({ url, method, resourceType, requestHeaders }, callback) => {
            const isYoutubeEmbed = resourceType === "subFrame" && url.startsWith(YOUTUBE_EMBED_URL);
            const isMessageFetch = CHANNEL_RE.test(url);

            if (isYoutubeEmbed && isPluginEnabled("FixYoutubeEmbeds")) {
                requestHeaders.Referer = "https://media.discordapp.com/";
            } else if (isMessageFetch && isPluginEnabled(PLUGIN_NAME)) {
                console.log("[BetterNsfwBypass] spoofing", method, url);
                spoofSuperProperties(requestHeaders);
            }

            callback({ requestHeaders });
        }
    );
});
