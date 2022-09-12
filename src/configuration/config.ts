export const config = () => ({
  port: Number(process.env.PORT),
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpireIn: process.env.JWT_EXPIRES_IN,
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    autoLoadEntities: true,
  },
  cache: {
    host: process.env.CACHE_HOST,
    port: Number(process.env.CACHE_PORT),
    ttl: Number(process.env.CACHE_TTL),
  },
});
