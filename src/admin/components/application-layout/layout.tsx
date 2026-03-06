import {
  CircleUser,
  Home,
  SlidersHorizontal,
  LucideIcon
} from "lucide-react"
import { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../icons/Logo";


interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "dashboard",
    icon: Home,
    current: true,
  },
  {
    name: "Settings",
    href: "settings",
    icon: SlidersHorizontal,
    current: false,
  }
];

export default function ApplicationLayout() {
  let showApplicationLayout = catcher24WordpressConnector.userInfo;
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = location.pathname.split("/")[1];

  const menuRight = useRef<Menu>(null);

  const userMenuItems: MenuItem[] = [
    {
      label: 'My Account',
      items: [
        { label: 'Logout' }
      ]
    }
  ];

  useEffect(() => {
    if (pageTitle) {
      navigate(pageTitle);
    } else {
      navigate(navigation[0].href);
    }
  }, [navigate, pageTitle]);

  return (
    <div className={`min-h-screen w-full`}>
      <div className="flex flex-col">
        {showApplicationLayout && (
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 lg:h-[60px] p-8">
            <div className="flex h-14 items-center lg:h-[60px]">
              <a href="#/dashboard" className="flex items-center gap-2 font-semibold">
                <Logo />
              </a>
            </div>

            <div className="w-full flex items-center h-full">
            </div>

            <Menu
              model={userMenuItems}
              popup
              ref={menuRight}
              id="popup_menu_right"
              popupAlignment="right"
            />
            <Button
              text
              rounded
              className="p-2 text-foreground"
              onClick={(event) => menuRight.current?.toggle(event)}
              aria-controls="popup_menu_right"
              aria-haspopup
            >
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </header>
        )}
        <main className={'p-8'}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
