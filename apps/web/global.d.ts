import es from './src/core/i18n/resources/es.json';

type Messages = typeof es;

declare global {
  type IntlMessages = Messages;
}
