import './index.scss';
import { useState } from "react";
import filterIcon from '/src/assets/filterIcon.svg';

function FilterDropdown({ selected, onChange }) {
    const [open, setOpen] = useState(false);

    const filters = [
        'Ümumi',
        'Klinik',
        'Xidmət',
        'Tur'
    ];

    const handleSelect = (filter) => {
        onChange(filter); // 🔹 parent-ə göndər
        setOpen(false);
    };

    return (
        <div className="filterDropdown">
            <div className="filterTrigger" onClick={() => setOpen(!open)}>
                <img src={filterIcon} alt="filter" />
                <span>Filter</span>
            </div>

            {open && (
                <div className="filterMenu">
                    {filters.map(item => (
                        <div
                            key={item}
                            className={`filterOption ${selected === item ? "active" : ""}`}
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FilterDropdown;
