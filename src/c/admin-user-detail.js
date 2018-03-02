/**
 * window.c.AdminUserDetail component
 * Return action inputs to be used inside AdminList component.
 *
 * Example:
 * m.component(c.AdminList, {
 *     data: {},
 *     listDetail: c.AdminUserDetail
 * })
 */
import m from 'mithril';
import _ from 'underscore';
import models from '../models';
import userVM from '../vms/user-vm';
import adminResetPassword from './admin-reset-password';
import adminInputAction from './admin-input-action';
import adminNotificationHistory from './admin-notification-history';
import adminUserBalanceTransactionsList from './admin-user-balance-transactions-list';
import h from '../h';
import postgrest from 'mithril-postgrest';

const adminUserDetail = {
    controller(args) {
        return {
            actions: {
                reset: {
                    property: '비밀번호',
                    //coffee property: 'password',
                    callToAction: '재설정',
                    //coffee callToAction: 'Redefinir',
                    innerLabel: '새 사용자 비밀번호:',
                    //coffee innerLabel: 'Nova senha de Usuário:',
                    outerLabel: '비밀번호 재설정',
                    //coffee outerLabel: 'Redefinir senha',
                    placeholder: '예: 123mud@r',
                    //coffee placeholder: 'ex: 123mud@r',
                    model: models.user
                },
                reactivate: {
                    property: 'deactivated_at',
                    updateKey: 'id',
                    callToAction: '재활성',
                    //coffee callToAction: 'Reativar',
                    innerLabel: '이 사용자를 다시 사용하시겠습니까?',
                    //coffee innerLabel: 'Tem certeza que deseja reativar esse usuário?',
                    successMessage: '사용자가 다시 활성화 되었습니다!',
                    //coffee successMessage: 'Usuário reativado com sucesso!',
                    errorMessage: '사용자를 다시 활성화 할 수 없습니다!',
                    //coffee errorMessage: 'O usuário não pôde ser reativado!',
                    outerLabel: '사용자 재 활성화',
                    //coffee outerLabel: 'Reativar usuário',
                    forceValue: null,
                    model: models.user
                }
            },
        };
    },
    view(ctrl, args) {
        const actions = ctrl.actions,
              item = args.item,
              details = args.details,
              addOptions = (builder, id) => _.extend({}, builder, {
                  requestOptions: {
                      url: (`/users/${id}/new_password`),
                      method: 'POST'
                  }
              });

        return m('#admin-contribution-detail-box', [
            m('.divider.u-margintop-20.u-marginbottom-20'),
            m('.w-row.u-marginbottom-30', [
                m.component(adminResetPassword, {
                    data: addOptions(actions.reset, item.id),
                    item
                }),
                (item.deactivated_at) ?
                    m.component(adminInputAction, { data: actions.reactivate, item }) : ''
            ]),
            m('.w-row.card.card-terciary.u-radius', [
                m(adminNotificationHistory, {
                    user: item,
                    wrapperClass: '.w-col.w-col-4'
                }),
                m(adminUserBalanceTransactionsList, {user_id: item.id})
            ])
        ]);
    }
};

export default adminUserDetail;
