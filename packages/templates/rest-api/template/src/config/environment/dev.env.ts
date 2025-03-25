import { AppEnum } from "src/common/enums/app.enum";

export default () => ({
    isProduction: false,
    debug: true,
    baseUrl: process.env.BASE_URL || AppEnum.BASE_URL,
    apiUrl: process.env.API_URL || `${AppEnum.BASE_URL}/${AppEnum.API_PREFIX}`,
    clientUrl: process.env.CLIENT_URL || AppEnum.CLIENT_URL,
  });
  