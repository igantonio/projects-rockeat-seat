import path from 'path';

/**
 * path.resolve() -> unir caminhos padronizando
 * __dirname -> retorna o caminho do arquivo que a váriavel está sendo executada
 */

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
};