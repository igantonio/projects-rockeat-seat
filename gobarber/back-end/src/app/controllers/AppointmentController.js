import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import Notication from '../schemas/Notification';
import User from '../models/User';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController{
    //listando todos os usuários
    async index(req, res){
        const { page = 1} = req.query;

        const appointments = await Appointment.findAll({
            where: {provider_id: req.userId, canceled_at: null},
            order: ['date'],
            attributes: ['id', 'date', 'past', 'cancelable'],
            limit: 20,
            offset: (page -1) * 20,
            include:[
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path','url'],
                        },
                    ],
                },
            ],
        });

        return res.json(appointments);
    }

    async store(req, res){
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if(! (await schema.isValid(req.body))){
            console.log('ERRO - Se os campos não forem passados');
            return res.status(400).json({error: 'Validation fails.'})
        }

        const {provider_id, date} = req.body;

        /**
         * Checar se o provider_id é mesmo um usuário provider
         */
        const isProvider = await User.findOne({
            where: {id: provider_id, provider: true},
        });

        if(!isProvider){
            return res
                    .status(401)
                    .json({error: 'You can only create appointments with providers'});
        }

        //Validando se a data passada é anterior a data atual
        const hourStart = startOfHour(parseISO(date));

        if(isBefore(hourStart, new Date())){
            return res.status(400).json({error: 'Past date are not permitted!'});
        }

        //Validando se o Provider não possui um agendamento na mesma hora e mesmo dia
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if(checkAvailability){
            return res.status(400).json({error: 'Appointment date is not available'});
        }

        //criando o agendamento
        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date,
        });
        /**
         * Notificar o provedor sobre o agendamento
         */
        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
        );

        await Notication.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        
        });
        return res.json(appointment);
    }

    async delete(req, res){
        const appointment = await Appointment.findByPk(req.params.id, 
            {
                include: [
                    {
                        model: User,
                        as: 'provider',
                        attributes: ['name', 'email'],
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['name'],
                    },  
                ],
            });

        //validando se o usuário que está tentando cancelar é o mesmo que esta logado
        if(appointment.user_id !== req.userId){
            return res
                    .status(401)
                    .json({error: "You don't have permission to cancel this appointment.",
            });
        }

        const maxHourToCancel = subHours(appointment.date, 2);

        if(isBefore(maxHourToCancel, new Date())){
            return res
                    .status(401)
                    .json({error: 'You can only cancel appointments 2 hours in advance.'});
        }


        appointment.canceled_at = new Date();

        await appointment.save();

        await Queue.add(CancellationMail.key, {
            appointment,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();