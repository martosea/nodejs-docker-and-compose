import { join } from 'path';

export default () => ({
  port: parseInt(process.env.PORT) || 3001,
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    database: process.env.DATABASE_NAME || 'kupipodariday',
    entities: [join(__dirname, '/../**/*.entity.{js,ts}')],
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE) || true,
  },
  jwt: {
    key: process.env.JWT_KEY || 'defaultKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
});
