import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export function Footer(): JSX.Element {
  return (
    <footer className="bg-[#1A2F4B] text-white pt-8 lg:pt-10 pb-3">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
          {/* Coluna 1 */}
          <div>
            <Link href="/" className="block mb-3">
              <img
                src="/logo-vivant.png"
                alt="Vivant"
                className="h-8 w-auto object-contain brightness-0 invert opacity-90"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Multipropriedade inteligente com gestão profissional e segurança jurídica.
            </p>
          </div>

          {/* Coluna 2 */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Navegação</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/modelo"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  O Modelo Vivant
                </Link>
              </li>
              <li>
                <Link
                  href="/destinos"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Destinos
                </Link>
              </li>
              <li>
                <Link
                  href="/casas"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Nossas Casas
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Ecossistema</h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/parceiros"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Vivant Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/capital"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Vivant Capital
                </Link>
              </li>
              <li>
                <Link
                  href="/care"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Vivant Care
                </Link>
              </li>
              <li>
                <Link
                  href="/portal-cotista"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Portal do Cotista
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4 */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Contato</h4>
            <ul className="space-y-1.5 text-sm text-white/60">
              <li>
                <a
                  href="mailto:contato@vivantresidences.com.br"
                  className="hover:text-white transition-colors"
                >
                  contato@vivantresidences.com.br
                </a>
              </li>
              <li>
                <a
                  href="tel:+5544988097007"
                  className="hover:text-white transition-colors"
                >
                  (44) 98809-7007
                </a>
              </li>
              <li>Maringá, PR - Brasil</li>
            </ul>
            
            {/* Redes Sociais */}
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/vivantresidences"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/vivantresidences"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/company/vivantresidences"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@vivantresidences"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-2 text-center text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Vivant Residences. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
