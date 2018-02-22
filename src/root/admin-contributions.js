import m from 'mithril';
import h from '../h';
import contributionListVM from '../vms/contribution-list-vm';
import contributionFilterVM from '../vms/contribution-filter-vm';
import adminList from '../c/admin-list';
import adminFilter from '../c/admin-filter';
import adminContributionItem from '../c/admin-contribution-item';
import adminContributionDetail from '../c/admin-contribution-detail';
import filterMain from '../c/filter-main';
import filterDropdown from '../c/filter-dropdown';
import filterNumberRange from '../c/filter-number-range';
import filterDateRange from '../c/filter-date-range';

const adminContributions = {
    controller() {
        let listVM = contributionListVM,
            filterVM = contributionFilterVM,
            error = m.prop(''),
            filterBuilder = [{ // full_text_index
                component: filterMain,
                data: {
                    vm: filterVM.full_text_index,
                    placeholder: '디자인, 이메일, 사용자 및 지원 ID 별로 검색...'
                }
            }, { // delivery_status
                component: filterDropdown,
                data: {
                    label: '배송 상태',
                    name: 'delivery_status',
                    vm: filterVM.delivery_status,
                    options: [{
                        value: '',
                        option: '누구나'
                    }, {
                        value: 'delivered',
                        option: '배송완료'
                    }, {
                        value: 'undelivered',
                        option: '배송안됨'
                    }, {
                        value: 'error',
                        option: '오류'
                    }, {
                        value: 'received',
                        option: '받음'
                    }]
                }
            }, { // state
                component: filterDropdown,
                data: {
                    label: 'Com o estado',
                    name: 'state',
                    vm: filterVM.state,
                    options: [{
                        value: '',
                        option: '누구나'
                    }, {
                        value: 'paid',
                        option: 'paid'
                    }, {
                        value: 'refused',
                        option: 'refused'
                    }, {
                        value: 'pending',
                        option: 'pending'
                    }, {
                        value: 'pending_refund',
                        option: 'pending_refund'
                    }, {
                        value: 'refunded',
                        option: 'refunded'
                    }, {
                        value: 'chargeback',
                        option: 'chargeback'
                    }, {
                        value: 'deleted',
                        option: 'deleted'
                    }]
                }
            }, { // gateway
                component: filterDropdown,
                data: {
                    label: 'gateway',
                    name: 'gateway',
                    vm: filterVM.gateway,
                    options: [{
                        value: '',
                        option: '누구나'
                    }, {
                        value: 'Pagarme',
                        option: 'Pagarme'
                    }, {
                        value: 'MoIP',
                        option: 'MoIP'
                    }, {
                        value: 'PayPal',
                        option: 'PayPal'
                    }, {
                        value: 'Credits',
                        option: 'Créditos'
                    }]
                }
            }, { // value
                component: filterNumberRange,
                data: {
                    label: '사이의 값',
                    first: filterVM.value.gte,
                    last: filterVM.value.lte
                }
            }, { // created_at
                component: filterDateRange,
                data: {
                    label: '지원 기간',
                    first: filterVM.created_at.gte,
                    last: filterVM.created_at.lte
                }
            }],
            submit = () => {
                error(false);
                listVM.firstPage(filterVM.parameters()).then(null, (serverError) => {
                    error(serverError.message);
                });
                return false;
            };

        return {
            filterVM,
            filterBuilder,
            listVM: {
                list: listVM,
                error
            },
            data: {
                label: '후원'
            },
            submit
        };
    },

    view(ctrl) {
        return m('#admin-root-contributions', [
            m.component(adminFilter, {
                form: ctrl.filterVM.formDescriber,
                filterBuilder: ctrl.filterBuilder,
                submit: ctrl.submit
            }),
            m.component(adminList, {
                vm: ctrl.listVM,
                listItem: adminContributionItem,
                listDetail: adminContributionDetail
            })
        ]);
    }
};

export default adminContributions;
