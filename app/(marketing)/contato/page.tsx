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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24 pb-16 lg:pb-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
              Entre em Contato
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Nossa equipe está pronta para esclarecer suas dúvidas e ajudá-lo a realizar o sonho da casa de férias.
            </p>
          </div>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-16 lg:py-20 bg-white">
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
                      <option value="Investir em Multipropriedade">Investir em Multipropriedade</option>
                      <option value="Cadastrar Meu Imóvel (Vivant Partners)">Cadastrar Meu Imóvel (Vivant Partners)</option>
                      <option value="Conhecer Vivant Capital">Conhecer Vivant Capital</option>
                      <option value="Informações sobre Vivant Care">Informações sobre Vivant Care</option>
                      <option value="Agendar Visita às Propriedades">Agendar Visita às Propriedades</option>
                      <option value="Trabalhe Conosco">Trabalhe Conosco</option>
                      <option value="Parcerias Comerciais">Parcerias Comerciais</option>
                      <option value="Dúvidas Gerais">Dúvidas Gerais</option>
                      <option value="Outro">Outro</option>
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
      <section className="py-16 lg:py-20 bg-gray-50">
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
