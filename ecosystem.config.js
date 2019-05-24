module.exports = {
  apps : [{
    name: 'napi',
    cwd: 'notary-api',
    script: 'dist/index.js',
    post_update: [
      'npm i',
      'npm run build'
    ],

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'noss',
    cwd: 'notary-signing-service',
    script: 'dist/index.js',
    post_update: [
      'npm i',
      'npm run build'
    ],

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    staging: {
      user: 'ubuntu',
      host: 'staging',
      ref: 'origin/na-test-deployments',
      repo: 'git@github.com:wibsonorg/buyer-sdk.git',
      path: '/opt/test/notary-sdk',
      'post-deploy': 'pm2 reload ecosystem.config.js --env production'
    }
  }
};
