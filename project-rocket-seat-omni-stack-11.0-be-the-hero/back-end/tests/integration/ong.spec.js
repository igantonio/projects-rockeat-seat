const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('ONG', () => {
    //Fazer antes de cada teste
    beforeEach(async() => {
        await connection.migrate.rollback();//desfazer todas as migrations
        await connection.migrate.latest();//criar as migrations no banco
    });

    //Fazer depois de todos os testes
    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        //.set('Authorization', 'id_valido_de_uma_ong')//Inserindo valores no headers
        .send({
            name : "APAD",
            email: "contato@apad.com.br",
            whatsapp: "16000000000",
            city: "São paulo",
            uf : "SP" 
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    })
})