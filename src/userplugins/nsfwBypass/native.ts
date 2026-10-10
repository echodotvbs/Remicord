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

const MESSAGES_URL_RE = /\/api\/v\d+\/channels\/\d+\/messages(\?|$)/;

type Headers = Record<string, string>;

function isPluginEnabled(name: string) {
    return !!RendererSettings.store.plugins?.[name]?.enabled;
}

function spoofSuperProperties(headers: Headers) {
    const key = Object.keys(headers).find(k => k.toLowerCase() === "x-super-properties") ?? "X-Super-Properties";

    let original = {};
    try {
        original = JSON.parse(Buffer.from(headers[key] ?? "", "base64").toString());
    } catch {

    }

    headers[key] = Buffer.from(JSON.stringify({ ...original, ...SUPER_PROPERTIES_OVERRIDE })).toString("base64");
}

app.whenReady().then(() => {
    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ["https://*.discord.com/api/*", `${YOUTUBE_EMBED_URL}*`] },
        ({ url, method, resourceType, requestHeaders }, callback) => {
            const isYoutubeEmbed = resourceType === "subFrame" && url.startsWith(YOUTUBE_EMBED_URL);
            const isMessageFetch = method === "GET" && MESSAGES_URL_RE.test(url);

            if (isYoutubeEmbed && isPluginEnabled("FixYoutubeEmbeds")) {
                requestHeaders.Referer = "https://media.discordapp.com/";
            } else if (isMessageFetch && isPluginEnabled(PLUGIN_NAME)) {
                spoofSuperProperties(requestHeaders);
            }

            callback({ requestHeaders });
        }
    );
});
