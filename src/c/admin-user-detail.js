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
                    property: 'password',
                    callToAction: 'Redefinir',
                    innerLabel: 'Nova senha de Usuário:',
                    outerLabel: 'Redefinir senha',
                    placeholder: 'ex: 123mud@r',
                    model: models.user
                },
                reactivate: {
                    property: 'deactivated_at',
                    updateKey: 'id',
                    callToAction: 'Reativar',
                    innerLabel: 'Tem certeza que deseja reativar esse usuário?',
                    successMessage: 'Usuário reativado com sucesso!',
                    errorMessage: 'O usuário não pôde ser reativado!',
                    outerLabel: 'Reativar usuário',
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
