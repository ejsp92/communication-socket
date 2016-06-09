var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

process.env.TZ = 'UTC';

var config = {
  development: {
    root: rootPath,
    apiEndpoint: 'http://localhost:3000',
    app: {
      name: 'communication-socket'
    },
    port: process.env.PORT || 5000,
    db: 'redis://localhost:6379/11',
    socket: {
      options:{
        'pingInterval': 5000,
        'pingTimeout': 15000
      }
    }
  },

  test: {
    root: rootPath,
    apiEndpoint: 'http://localhost:3000',
    app: {
      name: 'communication-socket'
    },
    port: process.env.PORT || 5000,
    db: 'redis://localhost:6379/11',
    socket: {
      options:{
        'pingInterval': 5000,
        'pingTimeout': 15000
      }
    }
  },

  production: {
    root: rootPath,
    apiEndpoint: 'http://localhost:3000',
    app: {
      name: 'communication-socket'
    },
    port: process.env.PORT || 5000,
    db: process.env.REDIS_URL,
    socket: {
      options:{
        'pingInterval': 5000,
        'pingTimeout': 15000
      }
    }
  }
};

module.exports = config[env];
