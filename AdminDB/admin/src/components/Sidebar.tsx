import {
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  BriefcaseBusiness,
  Braces,
  Rocket,
  AtSign,
  ExternalLink,
  Home,
  type LucideIcon,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

interface MenuItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu: MenuItem[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      label: "Hero",
      icon: Home,
      path: "/HeroManagement",
    },
    {
      label: "Caroussel",
      icon: ChevronRight,
      path: "/abstract",
    },
    {
      label: "Competence",
      icon: Braces,
      path: "/AboutManagement",
    },
    {
      label: "Stats",
      icon: TrendingUp,
      path: "/stats",
    },
    {
      label: "Experiences",
      icon:  BriefcaseBusiness,
      path: "/Experiences",
    },
    {
      label: "Réalisations",
      icon: Rocket,
      path: "/realisations",
    },
    {
      label: "Contact",
      icon: AtSign,
      path: "/Contact",
    },
    {
      label: "Footer",
      icon: ExternalLink,
      path: "/footer",
    },
  ];

  return (
    <aside
      className="
        flex
        h-full
        w-[72px]
        flex-col
        border-r
        border-zinc-200
        bg-white
        px-3
        py-6

        md:w-[80px]
        md:px-3
        md:py-8

        lg:w-[280px]
        lg:px-6
        lg:py-8
      "
    >

      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start">
        <h1
          className="
            hidden
            text-xl
            font-semibold
            text-primary

            lg:block
          "
        >
          Portfolio Admin
        </h1>

        {/* Logo mobile/tablette */}
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-primary
            text-sm
            font-bold
            text-white

            lg:hidden
          "
        >
          PA
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="
          mt-10
          flex
          flex-col
          gap-2

          lg:mt-10
        "
      >

        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              title={item.label}
              onClick={() => navigate(item.path)}
              className={`
                group
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                px-3
                text-sm
                transition-all
                duration-200

                lg:justify-start
                lg:px-4

                ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }
              `}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                className="
                  shrink-0
                  transition-transform
                  duration-200
                  group-hover:scale-105
                "
              />

              {/* Texte uniquement desktop */}
              <span className="hidden lg:block">
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>

    </aside>
  );
}