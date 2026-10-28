/*
 * Remicord, a Discord client mod
 * Copyright (c) 2026 Remicord and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Made for Remicord, however should work for any Vencord fork
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, sendBotMessage } from "@api/Commands";
import { definePluginSettings } from "@api/Settings";
import { ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import definePlugin, { OptionType } from "@utils/types";
import { Button, RestAPI, Text, UserStore, useState } from "@webpack/common";

const ENDPOINT = "/hypesquad/online";

// set house or leave
const HOUSES = [
    { id: 1, name: "Bravery", flag: 1 << 6, color: "#9c84ef" },
    { id: 2, name: "Brilliance", flag: 1 << 7, color: "#f47b67" },
    { id: 3, name: "Balance", flag: 1 << 8, color: "#45ddc0" }
] as const;

type Result = { ok: boolean; message: string; };

function errorMessage(e: any): string {
    return e?.body?.message ?? e?.message ?? "Unknown error";
}

function getCurrentHouseId(): number | null {
    const flags: number = (UserStore.getCurrentUser() as any)?.publicFlags ?? 0;
    return HOUSES.find(h => (flags & h.flag) !== 0)?.id ?? null;
}

async function joinHouse(houseId: number): Promise<Result> {
    const house = HOUSES.find(h => h.id === houseId);
    if (!house) return { ok: false, message: "Invalid house." };

    try {
        await RestAPI.post({ url: ENDPOINT, body: { house_id: house.id } });
        return { ok: true, message: `Joined House ${house.name}! The badge might take a second to update.` };
    } catch (e) {
        return { ok: false, message: `Failed to join ${house.name}: ${errorMessage(e)}` };
    }
}

async function leaveHypeSquad(): Promise<Result> {
    try {
        await RestAPI.del({ url: ENDPOINT });
        return { ok: true, message: "Left HypeSquad. The badge might take a second to disappear." };
    } catch (e) {
        return { ok: false, message: `Failed to leave HypeSquad: ${errorMessage(e)}` };
    }
}

function HypeSquadModal({ modalProps }: { modalProps: ModalProps; }) {
    const [current, setCurrent] = useState<number | null>(getCurrentHouseId());
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState<Result | null>(null);

    async function perform(action: () => Promise<Result>, onSuccess: () => void) {
        if (busy) return;
        setBusy(true);
        setStatus(null);
        const result = await action();
        setBusy(false);
        if (result.ok) onSuccess();
        setStatus(result);
    }

    return (
        <ModalRoot {...modalProps} size={ModalSize.SMALL}>
            <ModalHeader>
                <Text variant="heading-lg/semibold" style={{ flexGrow: 1 }}>HypeSquad Manager</Text>
                <ModalCloseButton onClick={modalProps.onClose} />
            </ModalHeader>

            <ModalContent>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 0" }}>
                    {HOUSES.map(house => (
                        <div key={house.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    background: house.color,
                                    flexShrink: 0
                                }}
                            />
                            <Text variant="text-md/semibold" style={{ flexGrow: 1 }}>
                                {house.name}{current === house.id ? " (current)" : ""}
                            </Text>
                            <Button
                                size={Button.Sizes.SMALL}
                                disabled={busy || current === house.id}
                                onClick={() => perform(() => joinHouse(house.id), () => setCurrent(house.id))}
                            >
                                Join
                            </Button>
                        </div>
                    ))}

                    {status && (
                        <Text
                            variant="text-sm/normal"
                            style={{ color: status.ok ? "var(--text-positive, #2dc770)" : "var(--text-danger, #f23f43)" }}
                        >
                            {status.message}
                        </Text>
                    )}
                </div>
            </ModalContent>

            <ModalFooter>
                <Button
                    color={Button.Colors.RED}
                    disabled={busy}
                    onClick={() => perform(leaveHypeSquad, () => setCurrent(null))}
                >
                    Leave HypeSquad
                </Button>
            </ModalFooter>
        </ModalRoot>
    );
}

function openHypeSquadModal() {
    openModal(props => <HypeSquadModal modalProps={props} />);
}

function SettingsPanel() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Text variant="text-md/normal">
                Join a HypeSquad house or leave HypeSquad without leaving Discord.
            </Text>
            <div>
                <Button onClick={openHypeSquadModal}>Open HypeSquad Manager</Button>
            </div>
        </div>
    );
}

const settings = definePluginSettings({
    panel: {
        type: OptionType.COMPONENT,
        component: SettingsPanel
    }
});

export default definePlugin({
    name: "HypeSquadManager",
    description: "Join or leave HypeSquad from a popup, the toolbox menu, or /hypesquad.",
    tags: ["Activity", "Fun"],
    authors: [{ name: "echod.vbs", id: 1465212998065852447n }],
    settings,

    // toolbox menu
    toolboxActions: {
        "HypeSquad Manager": openHypeSquadModal
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
