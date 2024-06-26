import 'dotenv/config';
import { z } from 'zod';

interface EnvVars {
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const envsSchema = z
  .object({
    DATABASE_URL: z.coerce.string(),
    NATS_SERVERS: z.array(z.coerce.string()),
  })
  .passthrough();

const envVars = envsSchema.parse({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

export const envs: EnvVars = {
  ...envVars,
};
