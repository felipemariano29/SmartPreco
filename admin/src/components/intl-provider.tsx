'use client';

import { type Locale } from '@/i18n.config';
import { NextIntlClientProvider } from 'next-intl';
import { type ReactNode, useEffect, useState } from 'react';

type Props = {
  children: ReactNode;
  locale: Locale;
  messages: Record<string, unknown>;
};

export function IntlProvider({ children, locale, messages }: Props) {
  // We're setting up client-side time zone detection
  const [timeZone, setTimeZone] = useState<string | undefined>();
  
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
      formats={{
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
          long: {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          },
        },
        number: {
          currency: {
            style: 'currency',
            currency: locale === 'pt-BR' ? 'BRL' : 'USD',
          },
          percent: {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          },
        },
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
} 