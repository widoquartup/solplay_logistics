module.exports = {
    apps: [
        {
            name: 'auth-2',
            exec_mode: 'cluster',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: ["node_modules", "dist", ".git"],
            script: './dist/index.js',
            env: {
                ENV: 'development',
            },
            env_production: {
                ENV: 'production',
            }
        }
    ]
};
