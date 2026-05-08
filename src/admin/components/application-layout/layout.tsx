import {
  Home,
  SlidersHorizontal,
  LucideIcon
} from "lucide-react";
import { useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Outlet, useLocation, Link } from "react-router-dom";
import Logo from "../../icons/Logo";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
/*  { name: "Settings", href: "/settings", icon: SlidersHorizontal },*/
];

export default function ApplicationLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const menuRight = useRef<Menu>(null);

  const { userInfo, organization, dashboardUrl, apiUrl } = catcher24Connector;

  const baseUrl = dashboardUrl.replace(/\/$/, "");

  const userMenuItems: MenuItem[] = [
    {
      label: userInfo?.email || 'Account',
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-power-off',
          command: async () => {
            const cleanApiUrl = apiUrl ? apiUrl.replace(/\/+$/, "") : "";
            window.location.href = `${cleanApiUrl}/accounts/disconnect`;
          }
        }
      ]
    }
  ];

  const getInitials = () => {
    if (userInfo?.first_name && userInfo?.last_name) {
      return `${userInfo.first_name[0]}${userInfo.last_name[0]}`.toUpperCase();
    }
    return userInfo?.email ? userInfo.email.slice(0, 2).toUpperCase() : "U";
  };

  // If no user is logged in, just render the content without the shell
  if (!userInfo) return <main>{children || <Outlet />}</main>;

  return (
    <div className="w-full flex flex-col">
      <header className="flex h-16 items-center gap-4 border-b bg-background px-8 shrink-0">
        <div className="flex items-center gap-2 pr-4 border-r">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <Logo />
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium h-full">
          {navigation.map((item) => {
            const isActive = location.pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2 transition-colors hover:text-primary ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          {organization && (
            <div className="flex gap-2">
              <span className="tracking-wider text-muted-foreground font-bold">Organization:</span>
              <a href={`${baseUrl}/org/${organization.identifier}`} className="font-medium text-foreground">
                 {organization.displayName || organization.name}
               </a>
            </div>
          )}

          <Menu
            model={userMenuItems}
            popup
            ref={menuRight}
            id="popup_menu_right"
            popupAlignment="right"
          />

          <Button
            outlined={true}
            severity={"secondary"}
            size={"small"}
            className={'px-1'}
            onClick={(event) => menuRight.current?.toggle(event)}
          >
                <span className="font-bold uppercase">
                    {getInitials()}
                </span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex-1 p-8 bg-muted/10">
        {children || <Outlet />}
      </main>

      <footer className="p-8 border-t bg-background">
        <div className="container mx-auto flex justify-between items-center text-xs">
          <div className="flex gap-6">
            <a
              href="https://catcher24.com/terms-and-conditions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-dark hover:text-primary transition-colors font-medium"
            >
              Terms and Conditions
            </a>
            <a
              href="https://catcher24.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-dark hover:text-primary transition-colors font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="https://catcher24.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-dark hover:text-primary transition-colors font-medium"
            >
              Contact
            </a>
          </div>
          <div className="text-secondary-dark font-medium">
            &copy; {new RegExp(/\d{4}/).test(new Date().getFullYear().toString()) ? new Date().getFullYear() : "2024"} Catcher24. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
