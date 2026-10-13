import { FormSection, LangField } from "../../../../components/admin/FormKit/index.jsx";
import { useOptionalT } from "../../../../components/admin/shared/adminStrings.js";
import { LANG_ORDER, PLACEHOLDER_SUFFIX } from "./doctorForm.js";

/**
 * Form section with one text input per content language.
 * `values` = {az, ru, en, de, ar}; `onChange(lang, value)`.
 * `placeholderKey` = e.g. "name" → adminPanel.doctorAdd.placeholders.nameAz ...
 */
function LocalizedSection({ title, description, values, onChange, placeholderKey }) {
    const ot = useOptionalT();
    return (
        <FormSection title={title} description={description}>
            {LANG_ORDER.map((lang) => (
                <LangField
                    key={lang}
                    lang={lang}
                    value={values[lang]}
                    onChange={(e) => onChange(lang, e.target.value)}
                    placeholder={ot(`adminPanel.doctorAdd.placeholders.${placeholderKey}${PLACEHOLDER_SUFFIX[lang]}`)}
                />
            ))}
        </FormSection>
    );
}

export default LocalizedSection;
