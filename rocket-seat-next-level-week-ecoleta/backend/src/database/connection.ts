import knex from 'knex';
import path from 'path';

/**
 * path.resolve() -> unir caminhos padronizando
 * __dirname -> retorna o caminho do arquivo que a váriavel está sendo executada
 */

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default connection;