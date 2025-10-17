
import "dotenv/config";

export default {
  expo: {
    name: "Turno Enlace",
    slug: "turno-enlace",
    extra: {
      OPENWEATHER_API_KEY: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY,
    },
  },
};
 
