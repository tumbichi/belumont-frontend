import type es from './resources/es.json';

type Messages = typeof es;

declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
