// components/navigation/DesktopNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

const NavLink = ({
  href,
  children,
  className = "",
  isActive,
}: NavLinkProps) => {
  const pathname = usePathname();
  const active = isActive !== undefined ? isActive : pathname === href;

  return (
    <Link
      href={href}
      className={`relative font-normal font-lato transition-colors duration-300 cursor-pointer rounded-none
      focus:bg-transparent active:bg-transparent focus:outline-none
      ${active
          ? "text-orange-500 focus:text-orange-500"
          : "text-white dark:text-gray-900 hover:text-orange-500 focus:text-orange-500"
        }
      after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full
      after:bg-gradient-to-r after:from-transparent after:via-orange-500 after:to-transparent
      after:origin-center after:transition-transform after:duration-300
      ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
      ${className}`}
    >
      {children}
    </Link>
  );
};

interface DesktopNavProps {
  activeDropdown: string | null;
  onMouseEnter: (dropdown: string) => void;
  onMouseLeave: () => void;
}

const DesktopNav = ({
  activeDropdown,
  onMouseEnter,
  onMouseLeave,
}: DesktopNavProps) => {
  const navItems = [
    { id: "specialized", label: "SPECIALIZED", href: "/specialized" },
    { id: "offers", label: "OFFERS", href: "/offers" },
  ];

  return (
    <ul className="menu menu-horizontal px-1 [&>li>a]:rounded-none">
      <li>
        <NavLink href="/shop">SHOP</NavLink>
      </li>

      {navItems.map((item) => (
        <li
          key={item.id}
          className="relative"
          onMouseEnter={() => onMouseEnter(item.id)}
          onMouseLeave={onMouseLeave}
        >
          <NavLink href={item.href} className="flex items-center">
            {item.label}
            <svg
              className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === item.id ? "rotate-180" : ""
                }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </NavLink>
        </li>
      ))}

      <li>
        <NavLink href="/contact">CONTACT</NavLink>
      </li>

      <li>
        <NavLink href="/news">NEWS</NavLink>
      </li>
    </ul>
  );
};

export default DesktopNav;