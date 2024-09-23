module.exports = {
  apps : [{
    name: "backend",
    script: "npm",
    args: "start",
    cwd: "C:/Users/Almacen Lonas/app_almacen/solplay_logistics/backend",
    env: {
      NODE_ENV: "production",
    },
    exec_mode: "fork",
    instances: 1,
    watch: false,
    max_memory_restart: "1G",
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    log_file: "logs/combined.log",
    time: true
  }]
};
