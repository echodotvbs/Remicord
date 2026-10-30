/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Button } from "@components/Button";
import { Text } from "@components/Text";
import { RestAPI, UserStore, useState } from "@webpack/common";

const ENDPOINT = "/hypesquad/online";

// set house or leave
export const HOUSES = [
    { id: 1, name: "Bravery", flag: 1 << 6, color: "#9c84ef" },
    { id: 2, name: "Brilliance", flag: 1 << 7, color: "#f47b67" },
    { id: 3, name: "Balance", flag: 1 << 8, color: "#45ddc0" }
] as const;

export type Result = { ok: boolean; message: string; };

function errorMessage(e: any): string {
    return e?.body?.message ?? e?.message ?? "Unknown error";
}

function getCurrentHouseId(): number | null {
    const flags: number = (UserStore.getCurrentUser() as any)?.publicFlags ?? 0;
    return HOUSES.find(h => (flags & h.flag) !== 0)?.id ?? null;
}

export async function joinHouse(houseId: number): Promise<Result> {
    const house = HOUSES.find(h => h.id === houseId);
    if (!house) return { ok: false, message: "Invalid house." };

    try {
        await RestAPI.post({ url: ENDPOINT, body: { house_id: house.id } });
        return { ok: true, message: `Joined House ${house.name}! The badge might take a second to update.` };
    } catch (e) {
        return { ok: false, message: `Failed to join ${house.name}: ${errorMessage(e)}` };
    }
}

export async function leaveHypeSquad(): Promise<Result> {
    try {
        await RestAPI.del({ url: ENDPOINT });
        return { ok: true, message: "Left HypeSquad. The badge might take a second to disappear." };
    } catch (e) {
        return { ok: false, message: `Failed to leave HypeSquad: ${errorMessage(e)}` };
    }
}

export default function HypesquadPage() {
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
        <section>
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
                        <Text size="md" weight="semibold" style={{ flexGrow: 1 }}>
                            {house.name}{current === house.id ? " (current)" : ""}
                        </Text>
                        <Button
                            size="small"
                            disabled={busy || current === house.id}
                            onClick={() => perform(() => joinHouse(house.id), () => setCurrent(house.id))}
                        >
                            Join
                        </Button>
                    </div>
                ))}

                <div>
                    <Button
                        variant="dangerPrimary"
                        disabled={busy || current === null}
                        onClick={() => perform(leaveHypeSquad, () => setCurrent(null))}
                    >
                        Leave HypeSquad
                    </Button>
                </div>

                {status && (
                    <Text
                        size="sm"
                        style={{ color: status.ok ? "var(--text-positive, #2dc770)" : "var(--text-danger, #f23f43)" }}
                    >
                        {status.message}
                    </Text>
                )}
            </div>
        </section>
    );
}
