import m from 'mithril';
import I18n from 'i18n-js';
import h from '../h';
import inlineError from './inline-error';

const I18nScope = _.partial(h.i18nScope, 'projects.contributions.edit.errors');

const paymentSlip = {
    controller(args) {
        const vm = args.vm,
            slipPaymentDate = vm.getSlipPaymentDate(args.contribution_id),
            loading = m.prop(false),
            error = m.prop(false),
            completed = m.prop(false);

        const buildSlip = () => {
            loading(true);
            m.redraw();
            vm.paySlip(args.contribution_id, args.project_id, error, loading, completed);

            return false;
        };

        return {
            buildSlip,
            slipPaymentDate,
            loading,
            completed,
            error
        };
    },
    view(ctrl, args) {
        return m('.w-row',
                    m('.w-col.w-col-12',
                        m('.u-margintop-30.u-marginbottom-60.u-radius.card-big.card', [
                            m('.fontsize-small.u-marginbottom-20',
                                ctrl.slipPaymentDate() ? `이 은행 전표는 ${h.momentify(ctrl.slipPaymentDate().slip_expiration_date)}에 만료됩니다.` : '로딩...'
                                //coffee ctrl.slipPaymentDate() ? `Esse boleto bancário vence no dia ${h.momentify(ctrl.slipPaymentDate().slip_expiration_date)}.` : 'carregando...'
                            ),
                            m('.fontsize-small.u-marginbottom-40',
                                'Ao gerar o boleto, o realizador já está contando com o seu apoio. Pague até a data de vencimento pela internet, casas lotéricas, caixas eletrônicos ou agência bancária.'
                            ),
                            m('.w-row',
                                m('.w-col.w-col-8.w-col-push-2', [
                                    ctrl.loading() ? h.loader() : ctrl.completed() ? '' : m('input.btn.btn-large.u-marginbottom-20', {
                                        onclick: ctrl.buildSlip,
                                        value: '티켓 인쇄',
                                        //coffee value: 'Imprimir Boleto',
                                        type: 'submit'
                                    }),
                                    ctrl.error() ? m.component(inlineError, { message: ctrl.error() }) : '',
                                    m('.fontsize-smallest.u-text-center.u-marginbottom-30', [
                                        '지원함으로써 귀하는 ',
                                        //coffee 'Ao apoiar, você concorda com os ',
                                        m('a.alt-link[href=\'/pt/terms-of-use\']',
                                    '이용 약관'
                                            //coffee 'Termos de Uso'
                                ),
                                        'e ',
                                        m('a.alt-link[href=\'/pt/privacy-policy\']',
                                    '개인 정보 보호 정책'
                                            //coffee 'Política de Privacidade'
                                )
                                    ])
                                ])
                    )
                        ])
            )
        );
    }
};

export default paymentSlip;
