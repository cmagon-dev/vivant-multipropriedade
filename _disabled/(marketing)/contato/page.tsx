"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    interesse: "",
    mensagem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de envio do formulário
    const message = encodeURIComponent(
      `Olá! Meu nome é ${formData.nome}.\n\nEmail: ${formData.email}\nTelefone: ${formData.telefone}\nInteresse: ${formData.interesse}\n\nMensagem: ${formData.mensagem}`
    );
    window.open(
      `https://wa.me/5544988097007?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-start justify-center overflow-hidden pt-28 sm:pt-32 lg:pt-40">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/80 via-[#1A2F4B]/70 to-white" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8 sm:pt-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 px-2">
              Entre em Contato
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto px-4 mb-12">
              Nossa equipe está pronta para esclarecer suas dúvidas e ajudá-lo a realizar o sonho da casa de férias.
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-16 lg:py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
                Envie sua Mensagem
              </h2>
              <p className="text-lg text-[#1A2F4B]/70">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <Card className="border-none shadow-xl">
              <CardContent className="p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-semibold text-[#1A2F4B] mb-2"
                    >
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vivant-gold focus:ring-2 focus:ring-vivant-gold/20 outline-none transition-all"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-[#1A2F4B] mb-2"
                      >
                        E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vivant-gold focus:ring-2 focus:ring-vivant-gold/20 outline-none transition-all"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="telefone"
                        className="block text-sm font-semibold text-[#1A2F4B] mb-2"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        required
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vivant-gold focus:ring-2 focus:ring-vivant-gold/20 outline-none transition-all"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="interesse"
                      className="block text-sm font-semibold text-[#1A2F4B] mb-2"
                    >
                      Qual seu interesse?
                    </label>
                    <select
                      id="interesse"
                      required
                      value={formData.interesse}
                      onChange={(e) =>
                        setFormData({ ...formData, interesse: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vivant-gold focus:ring-2 focus:ring-vivant-gold/20 outline-none transition-all bg-white"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Quero ser um Cliente Cotista">Quero ser um Cliente Cotista</option>
                      <option value="Quero vender/fracionar meu imóvel">Quero vender/fracionar meu imóvel</option>
                      <option value="Quero ser um Investidor Vivant">Quero ser um Investidor Vivant</option>
                      <option value="Quero conhecer o modelo melhor">Quero conhecer o modelo melhor</option>
                      <option value="Quero trabalhar com a Vivant">Quero trabalhar com a Vivant</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-semibold text-[#1A2F4B] mb-2"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      required
                      rows={6}
                      value={formData.mensagem}
                      onChange={(e) =>
                        setFormData({ ...formData, mensagem: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-vivant-gold focus:ring-2 focus:ring-vivant-gold/20 outline-none transition-all resize-none"
                      placeholder="Como podemos ajudá-lo?"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-vivant-gold hover:bg-vivant-gold/90 text-white font-semibold text-lg min-h-[52px]"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Mensagem via WhatsApp
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Direto */}
            <div className="mt-8 text-center">
              <p className="text-[#1A2F4B]/70 mb-4">Ou fale conosco diretamente:</p>
              <Button
                asChild
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                <a
                  href="https://wa.me/5544988097007?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Vivant%20Multipropriedade."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
              Conecte-se Conosco
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-[#1A2F4B]/80 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-vivant-gold" />
                <a
                  href="mailto:contato@vivantresidences.com.br"
                  className="hover:text-vivant-gold transition-colors text-base"
                >
                  contato@vivantresidences.com.br
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-vivant-gold" />
                <a
                  href="tel:+5544988097007"
                  className="hover:text-vivant-gold transition-colors text-base"
                >
                  (44) 98809-7007
                </a>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-vivant-gold" />
                <span className="text-base">Maringá, PR - Brasil</span>
              </div>
            </div>
          </div>

          {/* Mapa de Localização */}
          <div className="mt-12 -mx-4 sm:-mx-6">
            <div className="relative w-full h-[300px]">
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
            
            <div className="mt-6 text-center px-4 sm:px-6">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-vivant-gold text-vivant-gold hover:bg-vivant-gold hover:text-white font-semibold"
              >
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Maringá,PR,Brasil"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Abrir no Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
