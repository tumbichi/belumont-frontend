import type es from './resources/es.json';

type Messages = typeof es;

declare global {
  interface IntlMessages extends Messages {}
}
