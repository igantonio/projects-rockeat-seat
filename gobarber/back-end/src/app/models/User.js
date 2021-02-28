import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model{
    static init(sequelize){
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );

        //Esse trecho de código será executando antes de qualquer save
        this.addHook('beforeSave', async user => {
            if(user.password){
                user.password_hash = await bcrypt.hash(user.password, 8);
            } 
        });

        return this;
    }


    static associate(models){
        /*
        belongsTo
            Esse model de usuário pertence a um model de arquivo, ou seja, 
            vai ter um Id de arquivo sendo armazenado dentro de usuário.
        
        hasOne
            Teria o id do usuário dentro da tabela de arquivo.
        */

        this.belongsTo(models.File, {foreignKey: 'avatar_id', as: 'avatar' });
    }

    //Metodo que compara a senha criptografada
    checkPassword(password){
        return bcrypt.compare(password, this.password_hash);
    }

}

export default User;