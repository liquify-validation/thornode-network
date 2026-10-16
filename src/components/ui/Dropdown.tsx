import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { DownOutlined } from "./icons";
import { useDropdown } from "./useDropdown";

interface DropdownButtonProps {
  label: string;
  items: { key: string; content: ReactNode }[];
  buttonStyle?: CSSProperties;
}

/** antd v4 Dropdown + Menu (click trigger) rendered from a default button. */
export function DropdownButton({ label, items, buttonStyle }: DropdownButtonProps) {
  const { open, setOpen, triggerRef, menuRef, style, placement } = useDropdown<HTMLButtonElement>();
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`ant-btn ant-btn-default ant-dropdown-trigger${open ? " ant-dropdown-open" : ""}`}
        style={buttonStyle}
        onClick={() => setOpen(!open)}
      >
        <span>{label} </span>
        <DownOutlined />
      </button>
      {open &&
        createPortal(
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
            <div>
              <div
                ref={menuRef}
                className={`ant-dropdown ant-dropdown-placement-${placement} ant-slide-up-appear ant-slide-up-appear-active`}
                style={style}
              >
                <ul className="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light" role="menu">
                  {items.map((item) => (
                    <li key={item.key} className="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem">
                      <span className="ant-dropdown-menu-title-content">{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
