import type { Config } from 'tailwindcss';
import config from '@soybelumont/ui/tailwind.config';

const webConfig: Config = {
  ...config,
  presets: [config],
  theme: {
    extend: {},
  },
} satisfies Config;
export default webConfig;
