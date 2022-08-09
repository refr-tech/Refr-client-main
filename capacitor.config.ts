import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'club.refr.app',
  appName: 'Refr Club',
  webDir: 'dist/client',
  bundledWebRuntime: true,
  plugins:{

    GoogleAuth: {
      scopes: [ "profile", "email" ],
      serverClientId: "471641178783-poa1lb0fjdv7amnvh5ntftepaskgohh2.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }

  }
};

export default config;
