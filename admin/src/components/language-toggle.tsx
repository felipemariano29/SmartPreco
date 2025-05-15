'use client';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale } from "@/i18n.config";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguage } from "./language-provider";

export function LanguageToggle() {
  const t = useTranslations('common');
  const { locale, setLocale } = useLanguage();

  const handleChangeLanguage = (newLocale: Locale) => {
    // Save preference to localStorage
    localStorage.setItem('language', newLocale);
    
    // Update the context
    setLocale(newLocale);
    
    // Force reload to ensure all components get updated
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleChangeLanguage('en')}
          className={locale === 'en' ? 'font-bold bg-accent/10' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          {t('language.en')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleChangeLanguage('pt-BR')}
          className={locale === 'pt-BR' ? 'font-bold bg-accent/10' : ''}
        >
          <span className="mr-2">🇧🇷</span>
          {t('language.pt-BR')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 