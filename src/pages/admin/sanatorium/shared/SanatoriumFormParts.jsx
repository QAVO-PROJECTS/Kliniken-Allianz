import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BedDouble, BedSingle, ChevronDown, Crown, Plus, Trash2, X, Youtube } from "lucide-react";
import { CheckList, LangField } from "../../../../components/admin/FormKit/index.jsx";
import IconButton from "../../../../components/admin/IconButton/index.jsx";
import { useAdminT, useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { ROOM_TYPES, SAN_LANGS } from "./sanatoriumFields.js";
import "./index.scss";

const ROOM_ICONS = { standard: BedSingle, comfort: BedDouble, vip: Crown };

/**
 * One LangField per content language.
 * `values` is keyed by az|ru|en|de|ar; `onChange(langKey, value)`.
 * `placeholderKey(ph)` builds the (optional) placeholder translation key.
 * With `grid`, the fields sit in a 2-column grid and the last one spans it.
 */
export function LangInputs({ values, onChange, placeholderKey, multiline = false, rows, requiredAz = false, grid = false }) {
    const ot = useOptionalT();
    const fields = SAN_LANGS.map(({ key, lang, ph }, i) => (
        <LangField
            key={key}
            lang={lang}
            required={requiredAz && key === "az"}
            multiline={multiline}
            rows={rows}
            wide={grid && i === SAN_LANGS.length - 1}
            value={values[key]}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder={placeholderKey ? ot(placeholderKey(ph)) : undefined}
        />
    ));
    return grid ? <div className="adm-grid">{fields}</div> : fields;
}

/** Room-type checkboxes plus a multilingual description block per selected room. */
export function RoomsEditor({ rooms, selectedRooms, onToggle, onChange }) {
    const { t } = useTranslation();
    const roomLabel = (room) => t(`adminPanel.sanatoriumAdd.rooms.${room.key}`, { defaultValue: room.label });
    return (
        <>
            <CheckList
                items={ROOM_TYPES.map((room) => ({ id: room.key, label: roomLabel(room) }))}
                selected={selectedRooms}
                onToggle={onToggle}
            />
            {ROOM_TYPES.filter((room) => selectedRooms.includes(room.key)).map((room) => {
                const Icon = ROOM_ICONS[room.key];
                return (
                    <div key={room.key} className="san-room">
                        <h3 className="san-subhead">
                            <Icon size={18} aria-hidden="true" />
                            {roomLabel(room)}
                        </h3>
                        <LangInputs
                            grid
                            multiline
                            rows={3}
                            values={rooms[room.key]}
                            onChange={(lang, value) => onChange(room.key, lang, value)}
                        />
                    </div>
                );
            })}
        </>
    );
}

/** Collapsible row for one service with inputs for every language. */
function ServiceRow({ service, index, onChange, onRemove }) {
    const at = useAdminT();
    const [open, setOpen] = useState(false);
    const filled = SAN_LANGS.filter(({ suffix }) => service[`name${suffix}`]?.trim()).length;
    return (
        <li className={`san-service${open ? " is-open" : ""}`}>
            <div className="san-service__head">
                <button
                    type="button"
                    className="san-service__toggle"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="san-service__index">{index + 1}</span>
                    <span className="san-service__name">{service.name || "-"}</span>
                    <span className="san-service__langs">{filled}/{SAN_LANGS.length}</span>
                    <ChevronDown size={16} aria-hidden="true" />
                </button>
                <IconButton icon={Trash2} label={at("remove")} variant="danger" onClick={onRemove} />
            </div>
            {open && (
                <div className="san-service__body">
                    <div className="adm-grid">
                        {SAN_LANGS.map(({ key, lang, suffix }, i) => (
                            <LangField
                                key={key}
                                lang={lang}
                                wide={i === SAN_LANGS.length - 1}
                                value={service[`name${suffix}`] || ""}
                                onChange={(e) => onChange(`name${suffix}`, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </li>
    );
}

/**
 * "New service" inputs + add button, then the editable list of services.
 * `onChange(index, field, value)`, `onRemove(index)`.
 */
export function ServicesEditor({ tPrefix, form, onFormChange, onAdd, services, onChange, onRemove }) {
    const { t } = useTranslation();
    const ot = useOptionalT();
    const at = useAdminT();
    const addOnEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onAdd();
        }
    };
    return (
        <>
            <div className="san-new-service">
                <div className="adm-grid">
                    {SAN_LANGS.map(({ key, lang, suffix, ph }, i) => (
                        <LangField
                            key={key}
                            lang={lang}
                            required={key === "az"}
                            wide={i === SAN_LANGS.length - 1}
                            value={form[`name${suffix}`]}
                            onChange={(e) => onFormChange(`name${suffix}`, e.target.value)}
                            onKeyDown={addOnEnter}
                            placeholder={ot(`${tPrefix}.placeholders.service${ph}`)}
                        />
                    ))}
                </div>
                <div className="san-new-service__actions">
                    <button type="button" className="btn btn--secondary" onClick={onAdd}>
                        <Plus size={18} aria-hidden="true" />
                        {t(`${tPrefix}.buttons.addService`)}
                    </button>
                </div>
            </div>
            {services.length > 0 && (
                <div className="san-services">
                    <div className="san-services__head">
                        <span>{at("services")}</span>
                        <span className="badge badge--brand">{services.length}</span>
                    </div>
                    <ul className="san-services__list">
                        {services.map((service, index) => (
                            <ServiceRow
                                key={service.id || service._key || index}
                                service={service}
                                index={index}
                                onChange={(field, value) => onChange(index, field, value)}
                                onRemove={() => onRemove(index)}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

/** YouTube URL input with an add button and the list of added links. */
export function VideoListEditor({ tPrefix, value, onInput, onAdd, videos, onRemove }) {
    const { t } = useTranslation();
    const at = useAdminT();
    return (
        <>
            <div className="adm-inline">
                <input
                    className="adm-input"
                    type="url"
                    inputMode="url"
                    aria-label={t(`${tPrefix}.videosTitle`)}
                    placeholder={t(`${tPrefix}.placeholders.videoUrl`)}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            onAdd();
                        }
                    }}
                />
                <button type="button" className="btn btn--secondary" onClick={onAdd}>
                    <Plus size={18} aria-hidden="true" />
                    {t(`${tPrefix}.buttons.addVideo`)}
                </button>
            </div>
            {videos.length > 0 && (
                <ul className="adm-list">
                    {videos.map((url, index) => (
                        <li key={`${url}-${index}`} className="adm-list__item">
                            <Youtube size={16} aria-hidden="true" />
                            <a href={url} target="_blank" rel="noopener noreferrer" title={url}>{url}</a>
                            <IconButton icon={X} label={at("remove")} onClick={() => onRemove(index)} />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
