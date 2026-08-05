'use client';

import { MessageCircle } from 'lucide-react';
import { buildWhatsappLink } from '@/lib/whatsapp';

export default function WhatsappFloatButton() {
  const href = buildWhatsappLink('Bonjour Ladies Dress 👋, j\u2019ai une question sur vos chaussures.');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition-transform hover:scale-105 rtl:right-auto rtl:left-4"
    >
      <MessageCircle size={24} fill="white" strokeWidth={0} />
    </a>
  );
}
