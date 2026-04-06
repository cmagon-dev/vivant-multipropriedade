"use client";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <section className="pt-28 sm:pt-32 lg:pt-36 pb-10 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3">
              Conecte-se Conosco
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-[#1A2F4B]/80 text-base sm:text-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-vivant-gold" />
                <a
                  href="mailto:contato@vivantresidences.com.br"
                  className="hover:text-vivant-gold transition-colors"
                >
                  contato@vivantresidences.com.br
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-vivant-gold" />
                <a
                  href="tel:+5544999691196"
                  className="hover:text-vivant-gold transition-colors"
                >
                  (44) 99969-1196
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-vivant-gold" />
                <span>Maringá, PR - Brasil</span>
              </div>
            </div>
          </ScrollReveal>

          <div className="-mx-4 sm:-mx-6">
            <div className="relative w-full h-[72vh] min-h-[560px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29582.096789434486!2d-51.95827604999999!3d-23.425269599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd0a40bc00f43%3A0x8cb91a5b371bd7b4!2zTWFyaW5nw6EsIFBSLCBCcmFzaWw!5e0!3m2!1sen!2sus!4v1676543210123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Vivant Residences"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
