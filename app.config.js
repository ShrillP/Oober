module.exports = {
    name: "Oober",
    slug: "Oober",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/appicon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/s.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/appicon.png",
        backgroundColor: "#ffffff"
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      softwareKeyboardLayoutMode: "pan"
    },
    web: {
      favicon: "./assets/appicon.png"
    }
};