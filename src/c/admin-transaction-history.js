import m from 'mithril';
import _ from 'underscore';
import h from '../h';

const adminTransactionHistory = {
    controller(args) {
        const contribution = args.contribution,
            mapEvents = _.reduce([{
                date: contribution.paid_at,
                name: '후원 확인'
                //coffee name: 'Apoio confirmado'
            }, {
                date: contribution.pending_refund_at,
                name: '환불 요청 됨'
                //coffee : 'Reembolso solicitado'
            }, {
                date: contribution.refunded_at,
                name: 'Estorno realizado'
            }, {
                date: contribution.created_at,
                name: 'Apoio criado'
            }, {
                date: contribution.refused_at,
                name: '지원 중단'
                //coffee name: 'Apoio cancelado'
            }, {
                date: contribution.deleted_at,
                name: '후원 삭제됨'
                //coffee name: 'Apoio excluído'
            }, {
                date: contribution.chargeback_at,
                name: '후원 거절'
                //coffee name: 'Chargeback(지불 거절)'
            }], (memo, item) => {
                if (item.date !== null && item.date !== undefined) {
                    item.originalDate = item.date;
                    item.date = h.momentify(item.date, 'DD/MM/YYYY, HH:mm');
                    return memo.concat(item);
                }

                return memo;
            }, []);

        return {
            orderedEvents: _.sortBy(mapEvents, 'originalDate')
        };
    },
    view(ctrl) {
        return m('.w-col.w-col-4', [
            m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', '거래 내역'),
            //coffee m('.fontweight-semibold.fontsize-smaller.lineheight-tighter.u-marginbottom-20', 'Histórico da transação'),
            ctrl.orderedEvents.map(cEvent => m('.w-row.fontsize-smallest.lineheight-looser.date-event', [
                m('.w-col.w-col-6', [
                    m('.fontcolor-secondary', cEvent.date)
                ]),
                m('.w-col.w-col-6', [
                    m('div', cEvent.name)
                ])
            ]))
        ]);
    }
};

export default adminTransactionHistory;
