import m from 'mithril';
import _ from 'underscore';
import postgrest from 'mithril-postgrest';
import h from '../h';
import models from '../models';
import adminInputAction from './admin-input-action';
import adminRadioAction from './admin-radio-action';
import adminExternalAction from './admin-external-action';
import adminTransaction from './admin-transaction';
import adminTransactionHistory from './admin-transaction-history';
import adminReward from './admin-reward';

const adminContributionDetail = {
    controller(args) {
        let l;
        const loadReward = () => {
            const model = models.rewardDetail,
                reward_id = args.item.reward_id,
                opts = model.getRowOptions(h.idVM.id(reward_id).parameters()),
                reward = m.prop({});

            l = postgrest.loaderWithToken(opts);

            if (reward_id) {
                l.load().then(_.compose(reward, _.first));
            }

            return reward;
        };

        return {
            reward: loadReward(),
            actions: {
                transfer: {
                    property: 'user_id',
                    updateKey: 'id',
                    callToAction: '다운로드',
                    innerLabel: 'Id do novo apoiador:',
                    outerLabel: 'Transferir Apoio',
                    placeholder: '예: 129908',
                    successMessage: '후원이 성공적으로 이루어 졌습니다!',
                    errorMessage: '후원을 실패하였습니다!',
                    model: models.contributionDetail
                },
                reward: {
                    getKey: 'project_id',
                    updateKey: 'contribution_id',
                    selectKey: 'reward_id',
                    radios: 'rewards',
                    callToAction: 'Alterar Recompensa',
                    outerLabel: '보상',
                    getModel: models.rewardDetail,
                    updateModel: models.contributionDetail,
                    selectedItem: loadReward(),
                    addEmpty: { id: -1, minimum_value: 10, description: '보상 없음' },
                    validate(rewards, newRewardID) {
                        const reward = _.findWhere(rewards, { id: newRewardID });
                        return (args.item.value >= reward.minimum_value) ? undefined : '최소 보상 값이 기여 금액보다 큽니다.';
                    }
                },
                refund: {
                    updateKey: 'id',
                    callToAction: '직접 상환',
                    innerLabel: '이 지원금을 환급 받으시겠습니까?',
                    outerLabel: '환불',
                    model: models.contributionDetail
                },
                remove: {
                    property: 'state',
                    updateKey: 'id',
                    callToAction: '삭제',
                    innerLabel: '이 지원을 삭제 하시겠습니까?',
                    outerLabel: '지원 삭제',
                    forceValue: 'deleted',
                    successMessage: '지원이 성공적으로 삭제되었습니다!',
                    errorMessage: '지원이 삭제되지 않았습니다!',
                    model: models.contributionDetail
                }
            },
            l
        };
    },
    view(ctrl, args) {
        const actions = ctrl.actions,
            item = args.item,
            reward = ctrl.reward,
            addOptions = (builder, id) => _.extend({}, builder, {
                requestOptions: {
                    url: (`/admin/contributions/${id}/gateway_refund`),
                    method: 'PUT'
                }
            });

        return m('#admin-contribution-detail-box', [
            m('.divider.u-margintop-20.u-marginbottom-20'),
            m('.w-row.u-marginbottom-30', [
                m.component(adminInputAction, {
                    data: actions.transfer,
                    item
                }),
                (ctrl.l()) ? h.loader :
                m.component(adminRadioAction, {
                    data: actions.reward,
                    item: reward,
                    getKeyValue: item.project_id,
                    updateKeyValue: item.contribution_id
                }),
                m.component(adminExternalAction, {
                    data: addOptions(actions.refund, item.id),
                    item
                }),
                m.component(adminInputAction, {
                    data: actions.remove,
                    item
                })
            ]),
            m('.w-row.card.card-terciary.u-radius', [
                m.component(adminTransaction, {
                    contribution: item
                }),
                m.component(adminTransactionHistory, {
                    contribution: item
                }),
                (ctrl.l()) ? h.loader :
                m.component(adminReward, {
                    reward,
                    contribution: item,
                    key: item.key
                })
            ])
        ]);
    }
};

export default adminContributionDetail;
