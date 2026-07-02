import en from './en';
import es from './es';
import pt from './pt';

interface langKeys {
  [key: string]: string;
}

export default {
  en,
  es,
  pt
} as Record<'es' | 'en' | 'pt', langKeys>