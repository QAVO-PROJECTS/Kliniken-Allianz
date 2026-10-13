import { Inbox } from "lucide-react";

function EmptyState({ icon: Icon = Inbox, title, description, children }) {
    return (
        <div className="adm-empty">
            <span className="adm-empty__icon" aria-hidden="true">
                <Icon size={24} strokeWidth={1.75} />
            </span>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
            {children}
        </div>
    );
}

export default EmptyState;
