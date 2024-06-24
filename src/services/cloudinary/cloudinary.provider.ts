// src/cloudinary/cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    console.log('Cloudinary Config:', {
      cloud_name: "dbdfy2iui",
      api_key: "484699392528313",
      api_secret: "f-vBECtkBOAwPeNjqmNoz-r2_ss",
    });

    return cloudinary.config({
      cloud_name: "dbdfy2iui",
      api_key: "484699392528313",
      api_secret: "f-vBECtkBOAwPeNjqmNoz-r2_ss",
    });
  },
  inject: [ConfigService],
};
