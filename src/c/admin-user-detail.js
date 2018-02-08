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
                    callToAction: '재설정',
                    innerLabel: '새 사용자 비밀번호:',
                    outerLabel: '비밀번호 재설정',
                    placeholder: '예: 123mud@r',
                    model: models.user
                },
                reactivate: {
                    property: 'deactivated_at',
                    updateKey: 'id',
                    callToAction: 'Reativar',
                    innerLabel: '이 사용자를 다시 사용하시겠습니까?',
                    successMessage: '사용자가 다시 활성화 되었습니다!',
                    errorMessage: '사용자를 다시 활성화 할 수 없습니다!',
                    outerLabel: '사용자 재 활성화',
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
