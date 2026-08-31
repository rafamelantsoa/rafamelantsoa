import { useEffect, useState } from "react";

import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaBehance,
  FaWhatsapp,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

import { Globe } from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface FooterData {
  _id?: string;
  title: string;
  paragraph: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
}

/* =========================================================
   ICONS
========================================================= */

const socialIcons: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  facebook: FaFacebook,
  behance: FaBehance,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  globe: Globe,
};

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  const [footer, setFooter] =
    useState<FooterData | null>(null);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     LOAD FOOTER
  ======================================================= */

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const response = await fetch(
          `${API_URL}/footer`
        );

        if (!response.ok) {
          throw new Error(
            "Impossible de récupérer le Footer."
          );
        }

        const data: FooterData =
          await response.json();

        setFooter(data);
      } catch (error) {
        console.error(
          "LOAD FOOTER ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadFooter();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <footer className="relative mt-32 overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-zinc-400"
          />
        </div>
      </footer>
    );
  }

  /* =======================================================
     FALLBACK
  ======================================================= */

  if (!footer) {
    return null;
  }

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-zinc-200 dark:border-zinc-800">

      {/* =====================================================
          BACKGROUND GRADIENT — ABSTRACT STYLE
      ===================================================== */}

      <div className="absolute inset-0 bg-[#0a0a1f]">

        {/* Orange glow */}
        <div
          className="
            absolute
            -top-[20%]
            -left-[10%]
            h-[70%]
            w-[55%]
            rounded-full
            bg-orange-500/25
            blur-[130px]
          "
        />

        {/* Violet / Blue glow */}
        <div
          className="
            absolute
            top-[5%]
            right-[0%]
            h-[80%]
            w-[60%]
            rounded-full
            bg-indigo-600/30
            blur-[140px]
          "
        />

        {/* Blue lower glow */}
        <div
          className="
            absolute
            bottom-[-25%]
            left-[10%]
            h-[65%]
            w-[55%]
            rounded-full
            bg-blue-700/25
            blur-[120px]
          "
        />

        {/* Violet center glow */}
        <div
          className="
            absolute
            top-[30%]
            left-[35%]
            h-[45%]
            w-[35%]
            rounded-full
            bg-violet-500/15
            blur-[120px]
          "
        />

        {/* Subtle radial vignette */}
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_center,transparent_25%,rgba(0,0,0,0.25)_70%,rgba(0,0,0,0.55)_100%)]
          "
        />

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl md:px-16 px-8 py-24">

        <div className="grid gap-20 lg:grid-cols-3">

          {/* ================= LEFT ================= */}

          <div>
            <h2 className="text-5xl font-title font-semibold leading-tight text-white/90">
              {footer.title}
            </h2>

            <p className="mt-6 max-w-sm leading-8 text-white/80">
              {footer.paragraph}
            </p>
          </div>

          {/* ================= CONTACT ================= */}

          <div>
            <h3 className="mb-8 text-xl font-semibold text-white/90">
              Contact
            </h3>

            <div className="space-y-7">

              {/* ADDRESS */}

              <div className="flex gap-4">
                <MapPin
                  className="mt-1 text-white/70"
                  size={20}
                />

                <div>
                  <p className="text-sm text-white/70">
                    Adresse
                  </p>

                  <p className="mt-1 whitespace-pre-line text-white/90">
                    {footer.address}
                  </p>
                </div>
              </div>

              {/* PHONE */}

              <div className="flex gap-4">
                <Phone
                  className="text-white/70"
                  size={20}
                />

                <div>
                  <p className="text-sm text-white/70">
                    Téléphone
                  </p>

                  <a
                    href={`tel:${footer.phone}`}
                    className="text-white/80 transition hover:text-white/90"
                  >
                    {footer.phone}
                  </a>
                </div>
              </div>

              {/* EMAIL */}

              <div className="flex gap-4">
                <Mail
                  className="text-white/70"
                  size={20}
                />

                <div>
                  <p className="text-sm text-white/70">
                    Email
                  </p>

                  <a
                    href={`mailto:${footer.email}`}
                    className="text-white/80 transition hover:text-white/90"
                  >
                    {footer.email}
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* ================= SOCIAL ================= */}

          <div>
            <h3 className="mb-8 text-xl font-semibold text-white/90">
              Réseaux sociaux
            </h3>

            <div className="space-y-1">

              {footer.socialLinks?.map(
                (social) => {
                  const Icon =
                    socialIcons[
                      social.icon?.toLowerCase()
                    ] || Globe;

                  return (
                    <a
                      key={`${social.name}-${social.url}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border-b border-white/30 py-4"
                    >
                      <div className="flex items-center gap-4">

                        <Icon
                          size={20}
                          className="text-white/80 transition group-hover:scale-110 group-hover:text-white dark:group-hover:text-white"
                        />

                        <span className="text-white/60 transition group-hover:text-white dark:group-hover:text-white">
                          {social.name}
                        </span>

                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-white/70 transition group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </a>
                  );
                }
              )}

            </div>
          </div>

        </div>

        {/* ================= BOTTOM ================= */}

        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:flex-row dark:border-white/40">

          <p className="text-sm text-white/35">
            © {new Date().getFullYear()}{" "}
            {footer.title}.
            Tous droits réservés.
          </p>

          <p className="text-sm text-white/30">
          Design · Code · Image
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
