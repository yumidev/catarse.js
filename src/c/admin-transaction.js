import m from 'mithril';
import h from '../h';

const adminTransaction = {
    view(ctrl, args) {
        const contribution = args.contribution;
        return m('.w-col.w-col-4', [
            m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', '지원 세부 정보'),
            //coffee m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', 'Detalhes do apoio'),
            m('.fontsize-smallest.lineheight-looser', [
                `가치: R$${h.formatNumber(contribution.value, 2, 3)}`,
                //coffee `Valor: R$${h.formatNumber(contribution.value, 2, 3)}`,
                m('br'),
                `분류군: R$${h.formatNumber(contribution.gateway_fee, 2, 3)}`,
                //coffee `Taxa: R$${h.formatNumber(contribution.gateway_fee, 2, 3)}`,
                m('br'),
                `확인 대기중: ${contribution.waiting_payment ? '예' : '아니요'}`,
                //coffee `Aguardando Confirmação: ${contribution.waiting_payment ? '예' : '아니요'}`,
                m('br'),
                `익명: ${contribution.anonymous ? '예' : '아니요'}`,
                //coffee `Anônimo: ${contribution.anonymous ? '예' : '아니요'}`,
                m('br'),
                `지불 Id: ${contribution.gateway_id}`,
                //coffee `pagamento Id: ${contribution.gateway_id}`,
                m('br'),
                `후원: ${contribution.contribution_id}`,
                //coffee `Apoio: ${contribution.contribution_id}`,
                m('br'),
                '열쇠: \n',
                //coffee '열쇠: \n',
                m('br'),
                contribution.key,
                m('br'),
                `매체: ${contribution.gateway}`,
                //coffee `Meio: ${contribution.gateway}`,
                m('br'),
                `연산자: ${contribution.gateway_data && contribution.gateway_data.acquirer_name}`,
                //coffee `Operadora: ${contribution.gateway_data && contribution.gateway_data.acquirer_name}`,
                m('br'),
                contribution.is_second_slip ? [m('a.link-hidden[href="#"]', 'Boleto bancário'), ' ', m('span.badge', '2차 노선')] : ''
                //coffee contribution.is_second_slip ? [m('a.link-hidden[href="#"]', 'Boleto bancário'), ' ', m('span.badge', '2a via')] : ''
            ])
        ]);
    }
};

export default adminTransaction;
