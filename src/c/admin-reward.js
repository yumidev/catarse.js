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
            m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', '보상'),
            m('.fontsize-smallest.lineheight-looser', reward.id ? [
                `ID: ${reward.id}`,
                m('br'),
                `배송지: ${(shippingFee.destination ? `${shippingFee.destination} R$ ${shippingFee.value}` : 'Nenhum')}`,
                m('br'),
                `배송: ${I18n.t(`shared.shipping_options.${reward.shipping_options}`)}`,
                m('br'),
                `최소값: R$${h.formatNumber(reward.minimum_value, 2, 3)}`,
                m('br'),
                m.trust(`사용 가능: ${available} / ${reward.maximum_contributions || '&infin;'}`),
                m('br'),
                `확인을 기다리는 중입니다.: ${reward.waiting_payment_count}`,
                m('br'),
                `예상 배달: ${h.momentify(reward.deliver_at)}`,
                m('br'),
                m('div', [
                    '배송 상태: ',
                    h.contributionStatusBadge(contribution)
                ]),
                (reward.title ? [`제목: ${reward.title}`,
                    m('br')
                ] : ''),
                `상품 설명: ${reward.description}`
            ] : '보상없는 지원')
        ]);
    }
};

export default adminReward;
