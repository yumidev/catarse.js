import m from 'mithril';
import h from '../h';
import postgrest from 'mithril-postgrest';
import models from '../models';

const adminReward = {
    controller(args) {
        let l;
        const loadShippingFee = () => {
            const shippingFee = m.prop({});

            if (args.contribution.shipping_fee_id) {
                const options = models.shippingFee.getRowOptions(
                    h.idVM.id(
                        args.contribution.shipping_fee_id
                    ).parameters());

                l = postgrest.loaderWithToken(options);
                l.load().then(_.compose(shippingFee, _.first));
            }

            return shippingFee;
        };

        return {
            shippingFee: loadShippingFee()
        };
    },

    view(ctrl, args) {
        const reward = args.reward(),
            contribution = args.contribution,
            available = parseInt(reward.paid_count) + parseInt(reward.waiting_payment_count),
            shippingFee = ctrl.shippingFee();

        return m('.w-col.w-col-4', [
            m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', 'Recompensa'),
            m('.fontsize-smallest.lineheight-looser', reward.id ? [
                `ID: ${reward.id}`,
                m('br'),
                `Local de entrega: ${(shippingFee.destination ? `${shippingFee.destination} R$ ${shippingFee.value}` : 'Nenhum')}`,
                m('br'),
                `Envio: ${I18n.t(`shared.shipping_options.${reward.shipping_options}`)}`,
                m('br'),
                `Valor mínimo: R$${h.formatNumber(reward.minimum_value, 2, 3)}`,
                m('br'),
                m.trust(`Disponíveis: ${available} / ${reward.maximum_contributions || '&infin;'}`),
                m('br'),
                `Aguardando confirmação: ${reward.waiting_payment_count}`,
                m('br'),
                `Estimativa da Entrega: ${h.momentify(reward.deliver_at)}`,
                m('br'),
                m('div', [
                    'Status da Entrega: ',
                    h.contributionStatusBadge(contribution)
                ]),
                (reward.title ? [`Título: ${reward.title}`,
                    m('br')
                ] : ''),
                `Descrição: ${reward.description}`
            ] : 'Apoio sem recompensa')
        ]);
    }
};

export default adminReward;
