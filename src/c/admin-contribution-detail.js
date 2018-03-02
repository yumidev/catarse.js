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
                    //coffee   callToAction: 'Transferir',
                    innerLabel: 'Id do novo apoiador:',
                    outerLabel: 'Transferir Apoio',
                    placeholder: '예: 129908',
                    //coffee  placeholder: 'ex: 129908',
                    successMessage: 'Apoio transferido com sucesso!',
                    //coffee   successMessage: '후원이 성공적으로 이루어 졌습니다!',
                    errorMessage: '후원을 실패하였습니다!',
                    //coffee   errorMessage: 'O apoio não foi transferido!',
                    model: models.contributionDetail
                },
                reward: {
                    getKey: 'project_id',
                    updateKey: 'contribution_id',
                    selectKey: 'reward_id',
                    radios: 'rewards',
                    callToAction: '보상 변경',
                    //coffee   callToAction: 'Alterar Recompensa',
                    outerLabel: '보상',
                    //coffee   outerLabel: 'Recompensa',
                    getModel: models.rewardDetail,
                    updateModel: models.contributionDetail,
                    selectedItem: loadReward(),
                    addEmpty: { id: -1, minimum_value: 10, description: '보상 없음' },
                    //coffee   addEmpty: { id: -1, minimum_value: 10, description: 'Sem recompensa' },
                    validate(rewards, newRewardID) {
                        const reward = _.findWhere(rewards, { id: newRewardID });
                        return (args.item.value >= reward.minimum_value) ? undefined : '최소 보상 값이 기여 금액보다 큽니다.';
                        //coffee   return (args.item.value >= reward.minimum_value) ? undefined : 'Valor mínimo da recompensa é maior do que o valor da contribuição.';
                    }
                },
                refund: {
                    updateKey: 'id',
                    callToAction: '직접 상환',
                    //coffee   callToAction: 'Reembolso direto',
                    innerLabel: '이 지원금을 환급 받으시겠습니까?',
                    //coffee   innerLabel: 'Tem certeza que deseja reembolsar esse apoio?',
                    outerLabel: '환불',
                    //coffee   outerLabel: 'Reembolsar Apoio',
                    model: models.contributionDetail
                },
                remove: {
                    property: 'state',
                    updateKey: 'id',
                    callToAction: '삭제',
                    //coffee   callToAction: 'Apagar',
                    innerLabel: '이 후원을 삭제 하시겠습니까?',
                    //coffee   innerLabel: 'Tem certeza que deseja apagar esse apoio?',
                    outerLabel: '후원 삭제',
                    //coffee   outerLabel: 'Apagar Apoio',
                    forceValue: 'deleted',
                    successMessage: '후원이 성공적으로 삭제되었습니다!',
                    //coffee   successMessage: 'Apoio removido com sucesso!',
                    errorMessage: '후원이 삭제되지 않았습니다!',
                    //coffee   errorMessage: 'O apoio não foi removido!',
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
