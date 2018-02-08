import m from 'mithril';
import _ from 'underscore';
import I18n from 'i18n-js';
import h from '../h';
// Add translations to payment state.
const I18nScope = _.partial(h.i18nScope, 'projects.payment');

const paymentStatus = {
    controller(args) {
        const payment = args.item;
        let card = null,
            displayPaymentMethod,
            paymentMethodClass,
            stateClass;

        card = () => {
            if (payment.gateway_data) {
                switch (payment.gateway.toLowerCase()) {
                case 'moip':
                    return {
                        first_digits: payment.gateway_data.cartao_bin,
                        last_digits: payment.gateway_data.cartao_final,
                        brand: payment.gateway_data.cartao_bandeira
                    };
                case 'pagarme':
                    return {
                        first_digits: payment.gateway_data.card_first_digits,
                        last_digits: payment.gateway_data.card_last_digits,
                        brand: payment.gateway_data.card_brand
                    };
                }
            }
        };

        displayPaymentMethod = () => {
            switch (payment.payment_method.toLowerCase()) {
            case 'boletobancario':
                return m('span#boleto-detail', '');
            case 'cartaodecredito':
                var cardData = card();
                if (cardData) {
                    return m('#creditcard-detail.fontsize-smallest.fontcolor-secondary.lineheight-tight', [
                        `${cardData.first_digits}******${cardData.last_digits}`,
                        m('br'),
                        `${cardData.brand} ${payment.installments}x`
                    ]);
                }
                return '';
            }
        };

        paymentMethodClass = () => {
            switch (payment.payment_method.toLowerCase()) {
            case 'boletobancario':
                return '.fa-barcode';
            case 'cartaodecredito':
                return '.fa-credit-card';
            default:
                return '.fa-question';
            }
        };

        stateClass = () => {
            switch (payment.state) {
            case 'paid':
                return '.text-success';
            case 'refunded':
                return '.text-refunded';
            case 'pending':
            case 'pending_refund':
                return '.text-waiting';
            default:
                return '.text-error';
            }
        };

        return {
            displayPaymentMethod,
            paymentMethodClass,
            stateClass
        };
    },
    view(ctrl, args) {
        const payment = args.item;

        return m('.w-row.payment-status', [
            m('.fontsize-smallest.lineheight-looser.fontweight-semibold', [
                m(`span.fa.fa-circle${ctrl.stateClass()}`), ` ${I18n.t(payment.state, I18nScope())}`
            ]),
            m('.fontsize-smallest.fontweight-semibold', [
                m(`span.fa${ctrl.paymentMethodClass()}`), ' ', m('a.link-hidden[href="#"]', payment.payment_method)
            ]),
            m('.fontsize-smallest.fontcolor-secondary.lineheight-tight', [
                ctrl.displayPaymentMethod()
            ])
        ]);
    }
};

export default paymentStatus;
