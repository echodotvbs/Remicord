/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, sendBotMessage } from "@api/Commands";
import { MainSettingsIcon } from "@components/Icons";
import SettingsPlugin from "@plugins/_core/settings";
import definePlugin from "@utils/types";

import HypesquadPage, { HOUSES, joinHouse, leaveHypeSquad } from "./hyperSquadPage";

export default definePlugin({
    name: "HypeSquadManager",
    description: "Join or leave HypeSquad from a popup, the toolbox menu, or /hypesquad.",
    tags: ["Activity", "Fun"],
    authors: [{ name: "echo.vbs", id: 1465212998065852447n }, { name: "Mally", id: 1473303254287913122n }],

    start() {
        SettingsPlugin.customEntries.push({
            key: "hypesquad_manager",
            title: "Hypesquad Manager",
            Component: HypesquadPage,
            Icon: MainSettingsIcon
        });
    },

    commands: [
        {
            name: "hypesquad",
            description: "Join a HypeSquad house or leave HypeSquad",
            inputType: ApplicationCommandInputType.BUILT_IN,
            options: [
                {
                    name: "house",
                    description: "Which house to join (or leave)",
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                    choices: [
                        ...HOUSES.map(h => ({ label: h.name, name: h.name, value: String(h.id) })),
                        { label: "Leave HypeSquad", name: "Leave HypeSquad", value: "leave" }
                    ]
                }
            ],
            execute: async (args, ctx) => {
                const choice = args[0].value;
                const result = choice === "leave"
                    ? await leaveHypeSquad()
                    : await joinHouse(Number(choice));

                sendBotMessage(ctx.channel.id, { content: result.message });
            }
        }
    ]
});

// hi lol
