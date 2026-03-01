import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // Use the requested locale or fallback to 'es'
  const locale = (await requestLocale) || 'es';

  return {
    locale,
    messages: (await import(`./resources/${locale}.json`)).default,
  };
});
