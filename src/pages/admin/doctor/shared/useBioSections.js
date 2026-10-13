import { useState } from "react";
import { newBioSection } from "./doctorForm.js";

/** State + handlers for the repeatable bio sections. */
export function useBioSections() {
    const [sections, setSections] = useState(() => [newBioSection()]);

    const isFilled = (section) => section.inputs.every((x) => x.trim() !== "");
    const canAdd = sections.length > 0 && isFilled(sections[sections.length - 1]);

    const change = (sectionId, index, value) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, inputs: s.inputs.map((v, i) => (i === index ? value : v)) } : s,
            ),
        );
    };

    // A new section can only be added once the previous one is fully filled in.
    const add = () => {
        if (!canAdd) return;
        setSections((prev) => prev.map((s) => ({ ...s, expanded: false })).concat(newBioSection()));
    };

    const toggle = (id) => {
        setSections((prev) => prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)));
    };

    const remove = (id) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
    };

    return { sections, setSections, change, add, toggle, remove, canAdd };
}
