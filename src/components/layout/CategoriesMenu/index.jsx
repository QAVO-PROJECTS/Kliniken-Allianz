import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import "./index.scss";
import { useGetAllCategoryQuery } from "../../../api/userApi.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import CategoryIcon from "./CategoryIcon.jsx";

const CLOSE_DELAY = 140;

/**
 * Desktop "Categories" mega dropdown: categories on the left, the hovered
 * category's services on the right. Service links go to /category/:serviceId
 * (that page expects a SERVICE id).
 *
 * Opens on hover or click, keyboard accessible (Enter/Space/ArrowDown to open,
 * arrows to move, Escape to close), closes on outside click.
 */
export default function CategoriesMenu({ className = "", onNavigate }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [requested, setRequested] = useState(false);
    const [activeId, setActiveId] = useState(null);

    // Fetch lazily on first interaction so the navbar doesn't hit the API on every page load.
    const { data, isFetching } = useGetAllCategoryQuery(undefined, { skip: !requested });
    const categories = data?.data || [];
    const active = categories.find((c) => c.id === activeId) || categories[0];

    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const closeTimer = useRef(null);
    // When the pointer opened the menu a moment ago, the click that follows must not close it again.
    const hoverOpenedAt = useRef(0);
    const panelId = useId();

    const clearTimer = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    };

    const openMenu = useCallback(() => {
        clearTimer();
        setRequested(true);
        setOpen(true);
    }, []);

    const closeMenu = useCallback((returnFocus = false) => {
        clearTimer();
        setOpen(false);
        if (returnFocus) triggerRef.current?.focus();
    }, []);

    const scheduleClose = () => {
        clearTimer();
        closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
    };

    useEffect(() => () => clearTimer(), []);

    useEffect(() => {
        if (!open) return undefined;
        const onPointerDown = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") closeMenu(true);
        };
        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open, closeMenu]);

    const focusItem = (selector, index) => {
        const items = rootRef.current?.querySelectorAll(selector);
        if (!items?.length) return;
        const i = (index + items.length) % items.length;
        items[i].focus();
    };

    const onTriggerKeyDown = (e) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openMenu();
            requestAnimationFrame(() => focusItem(".cm-cat", 0));
        }
    };

    const onCategoryKeyDown = (e, index, category) => {
        const isRtl = document.documentElement.dir === "rtl";
        const into = isRtl ? "ArrowLeft" : "ArrowRight";
        if (e.key === "ArrowDown") {
            e.preventDefault();
            focusItem(".cm-cat", index + 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusItem(".cm-cat", index - 1);
        } else if (e.key === into || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setActiveId(category.id);
            requestAnimationFrame(() => focusItem(".cm-service", 0));
        }
    };

    const onServiceKeyDown = (e, index) => {
        const isRtl = document.documentElement.dir === "rtl";
        const back = isRtl ? "ArrowRight" : "ArrowLeft";
        if (e.key === "ArrowDown") {
            e.preventDefault();
            focusItem(".cm-service", index + 1);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusItem(".cm-service", index - 1);
        } else if (e.key === back) {
            e.preventDefault();
            const cats = [...(rootRef.current?.querySelectorAll(".cm-cat") || [])];
            const current = cats.find((el) => el.dataset.id === String(active?.id));
            (current || cats[0])?.focus();
        }
    };

    const handleNavigate = () => {
        closeMenu();
        onNavigate?.();
    };

    return (
        <div
            ref={rootRef}
            className={`cm ${open ? "is-open" : ""} ${className}`.trim()}
            onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                if (!open) hoverOpenedAt.current = Date.now();
                openMenu();
            }}
            onPointerLeave={(e) => e.pointerType === "mouse" && scheduleClose()}
            onFocus={() => setRequested(true)}
        >
            <button
                ref={triggerRef}
                type="button"
                className="nb-link cm-trigger"
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                    if (open && Date.now() - hoverOpenedAt.current < 600) return;
                    if (open) closeMenu();
                    else openMenu();
                }}
                onKeyDown={onTriggerKeyDown}
            >
                <LayoutGrid size={16} strokeWidth={1.75} aria-hidden="true" />
                {t("categoriesMenu.title")}
                <ChevronDown className="cm-caret" size={15} strokeWidth={1.75} aria-hidden="true" />
            </button>

            <div id={panelId} className="cm-panel" hidden={!open}>
                {categories.length === 0 ? (
                    <div className="cm-empty">
                        {isFetching || !data ? (
                            <div className="cm-skeleton" aria-hidden="true">
                                {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
                            </div>
                        ) : (
                            t("navbar.noResults")
                        )}
                    </div>
                ) : (
                    <>
                        <ul className="cm-cats" role="list">
                            {categories.map((category, index) => {
                                const isActive = active?.id === category.id;
                                const name = getLocalizedText(category, "name");
                                return (
                                    <li key={category.id}>
                                        <button
                                            type="button"
                                            className={`cm-cat ${isActive ? "is-active" : ""}`}
                                            data-id={category.id}
                                            aria-expanded={isActive}
                                            onPointerEnter={() => setActiveId(category.id)}
                                            onFocus={() => setActiveId(category.id)}
                                            onClick={() => setActiveId(category.id)}
                                            onKeyDown={(e) => onCategoryKeyDown(e, index, category)}
                                        >
                                            <span className="cm-cat__icon" aria-hidden="true">
                                                <CategoryIcon file={category.categoryImage} />
                                            </span>
                                            <span className="cm-cat__name">{name}</span>
                                            {category.services?.length > 0 && (
                                                <ChevronRight className="cm-cat__arrow" size={16} strokeWidth={1.75} aria-hidden="true" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="cm-services">
                            <p className="cm-services__title">{getLocalizedText(active, "name")}</p>
                            {active?.services?.length > 0 ? (
                                <ul role="list">
                                    {active.services.map((service, index) => (
                                        <li key={service.id}>
                                            <Link
                                                to={`/category/${service.id}`}
                                                className="cm-service"
                                                onClick={handleNavigate}
                                                onKeyDown={(e) => onServiceKeyDown(e, index)}
                                            >
                                                {getLocalizedText(service, "name")}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="cm-services__empty">{t("navbar.noResults")}</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
