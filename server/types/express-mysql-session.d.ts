declare module 'express-mysql-session' {
  import session from 'express-session';
  
  interface MySQLStoreOptions {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    createDatabaseTable?: boolean;
    schema?: {
      tableName: string;
      columnNames: {
        session_id: string;
        expires: string;
        data: string;
      }
    };
    [key: string]: any;
  }
  
  interface MySQLStore extends session.Store {
    new (options: MySQLStoreOptions, connection?: any): session.Store;
  }
  
  function expressMySession(session: any): {
    new (options: MySQLStoreOptions, connection?: any): session.Store;
  };
  
  export = expressMySession;
} 