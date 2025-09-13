module.exports = {
  apps: [
    {
      name: "kupipodariday-backend",
      script: "./dist/main.js",   
      exec_mode: "fork",
      instances: 1,
      env: {
        PORT: process.env.PORT || 3001,
        JWT_KEY: process.env.JWT_KEY,

        DATABASE_HOST: process.env.DATABASE_HOST || "database",
        DATABASE_PORT: process.env.DATABASE_PORT || "5432",
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME || process.env.POSTGRES_DB,
      },
    },
  ],
};
