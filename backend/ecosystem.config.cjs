module.exports = {
    apps : [{
      name: "api",
      script: "./dist/index.js",
      env: {
        NODE_ENV: "production",
      },
      exec_mode: "cluster",
      instances: "max",
      watch: false,
      max_memory_restart: "1G",
    }]
  };