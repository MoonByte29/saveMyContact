import { useState } from "react";

// Icon components
const ContactScanIcon = () => (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
    </svg>
);

const DashboardIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
);

const UploadsIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const AdminIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const MenuIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);
const LogoutIcon = () => (
    <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3-3H9m0 0 3-3m-3 3 3 3"
        />
    </svg>
);

function Header({ activePage = "dashboard", onNavigate }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            href: "/",
            icon: <DashboardIcon />,
        },
        {
            id: "uploads",
            label: "All Uploads",
            href: "/uploads",
            icon: <UploadsIcon />,
        },
        {
            id: "admin",
            label: "Admin",
            href: "/admin",
            icon: <AdminIcon />,
        },
        {
            id: "logout",
            label: "Logout",
            icon: <LogoutIcon />,
        },
    ];

    const handleNav = (item) => {
        setMobileOpen(false);

        if (item.id === "logout") {
            // Remove token and user data
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirect to login page
            window.location.href = "/";
            return;
        }

        if (onNavigate) {
            onNavigate(item.id);
        } else {
            window.location.href = item.href;
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

                {/* ── Brand ── */}
                <button
                    onClick={() => handleNav(navItems[0])}
                    className="flex items-center gap-2.5 flex-shrink-0 group"
                >
                    <div className="w-8 h-8 bg-teal-500 group-hover:bg-teal-400 rounded-lg flex items-center justify-center transition-colors duration-200">
                        <ContactScanIcon />
                    </div>
                    <span className="text-slate-800 font-semibold text-sm tracking-tight">
                        ContactScan
                    </span>
                </button>

                {/* ── Desktop Nav ── */}
                <nav className="hidden sm:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activePage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item)}
                                className={`
                                    flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold
                                    transition-all duration-150
                                    ${isActive
                                        ? item.id === "admin"
                                            ? "bg-slate-900 text-white"
                                            : "bg-teal-500 text-white"
                                        : item.id === "logout"
                                            ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                    }
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* ── Mobile hamburger ── */}
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="sm:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* ── Mobile Dropdown ── */}
            {mobileOpen && (
                <div className="sm:hidden border-t border-slate-100 bg-white px-4 pb-3 pt-2 space-y-1">
                    {navItems.map((item) => {
                        const isActive = activePage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item)}
                                className={`
                                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold
                                    transition-all duration-150
                                    ${isActive
                                        ? item.id === "admin"
                                            ? "bg-slate-900 text-white"
                                            : "bg-teal-500 text-white"
                                        : item.id === "logout"
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }
                                `}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default Header;