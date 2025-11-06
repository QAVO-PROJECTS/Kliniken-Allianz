import './index.scss';
import { useState } from "react";
import filterIcon from '/src/assets/filterIcon.svg';

function FilterDropdown() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('Ümumi');

    const filters = [
        'Ümumi',
        'Klinik',
        'Xidmət',
        'Tur'
    ];

    const handleSelect = (filter) => {
        setSelected(filter);
        setOpen(false);
        // buraya filtrə funksiyasını əlavə edə bilərsən
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
