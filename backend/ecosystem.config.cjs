module.exports = {
    apps : [{
      name: "backend",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
      },
      exec_mode: "fork",
      instances: 1,
      watch: false,
      max_memory_restart: "1G",
    }]
  };