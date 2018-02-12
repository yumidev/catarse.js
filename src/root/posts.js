import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import h from '../h';
import models from '../models';
import projectDashboardMenu from '../c/project-dashboard-menu';
import postsPreview from '../c/posts-preview';
import rewardVM from '../vms/reward-vm';
import popNotification from '../c/pop-notification';

const posts = {
    controller(args) {
        let deleteFormSubmit;
        const showPreview = m.prop(false),
            showSuccess = m.prop(false),
            showError = m.prop(false),
            titleHasError = m.prop(false),
            commentHasError = m.prop(false),
            projectPosts = m.prop(),
            loader = postgrest.loaderWithToken,
            errors = m.prop(''),
            fields = {
                title: m.prop(''),
                comment_html: m.prop(''),
                reward_id: m.prop('-1')
            },
            filterVM = postgrest.filtersVM({
                project_id: 'eq'
            }),
            validateTitle = () => {
                const title = String(fields.title());
                if (title.length === 0) {
                    titleHasError(true);
                }

                return !titleHasError();
            },
            validateComment = () => {
                const comment = String(fields.comment_html());
                if (comment.length === 0) {
                    commentHasError(true);
                }

                return !commentHasError();
            },
            togglePreview = () => {
                if (!validateTitle()) {
                    errors('제목은 입력해 주세요.');
                    showError(true);
                } else if (!validateComment()) {
                    errors('메시지를 입력해 주세요.');
                    showError(true);
                } else {
                    h.scrollTop();
                    showPreview(true);
                }
                return false;
            },
            project_id = args.project_id,
            projectDetails = m.prop([]),
            rewardText = (rewardId) => {
                const reward = _.find(rewardVM.rewards(), r => String(r.id) === String(rewardId));
                return `Apoiadores da recompensa R$${reward.minimum_value} - ${reward.title ? reward.title : `${reward.description.substring(0, 70)}...`}`;
            },
            showRecipientes = (post) => {
                if (post.recipients === 'public') {
                    return '모든 사람 (후원자 및 비후원자)';
                } else if (post.recipients === 'backers') {
                    return '모든 후원자들';
                }
                const reward = _.find(rewardVM.rewards(), r => r.id === post.reward_id);
                if (reward) {
                    return rewardText(reward.id);
                }
                return '...';
            },
            toDeletePost = m.prop(-1),
            deletePost = post => () => {
                toDeletePost(post.id);
                m.redraw(true);
                deleteFormSubmit();
                return false;
            },
            setPostDeletionForm = (el, isInit) => {
                if (!isInit) {
                    deleteFormSubmit = () => el.submit();
                }
            },
              openedPercentage = post => (Math.floor((post.open_count / post.delivered_count) * 100) || 0);

        models.projectPostDetail.pageSize(false);
        filterVM.project_id(project_id);
        const listVM = postgrest.loaderWithToken(models.projectPostDetail.getPageOptions(_.extend(filterVM.parameters(), { order: 'created_at.desc' }))),
            l = loader(models.projectDetail.getRowOptions(filterVM.parameters()));

        listVM.load().then(projectPosts);


        rewardVM.fetchRewards(project_id);

        l.load().then(projectDetails);

        return {
            listVM,
            l,
            projectPosts,
            showRecipientes,
            fields,
            showPreview,
            togglePreview,
            project_id,
            deletePost,
            rewardText,
            errors,
            showSuccess,
            titleHasError,
            commentHasError,
            showError,
            setPostDeletionForm,
            toDeletePost,
            projectDetails,
            openedPercentage
        };
    },
    view(ctrl) {
        const project = _.first(ctrl.projectDetails()),
            paidRewards = _.filter(rewardVM.rewards(), reward => reward.paid_count > 0);

        return (project ? m('.project-posts',
            (project.is_owner_or_admin ? m.component(projectDashboardMenu, {
                project: m.prop(project)
            }) : ''),
            ctrl.showPreview() ? m.component(postsPreview, {
                showError: ctrl.showError,
                showSuccess: ctrl.showSuccess,
                errors: ctrl.errors,
                showPreview: ctrl.showPreview,
                project_id: ctrl.project_id,
                comment_html: ctrl.fields.comment_html,
                title: ctrl.fields.title,
                reward_id: ctrl.fields.reward_id(),
                rewardText: ctrl.fields.reward_id() >= 1 ? ctrl.rewardText(ctrl.fields.reward_id()) : null
            }) : [
                m(`.w-section.section-product.${project.mode}`),
                (ctrl.showSuccess() ? m.component(popNotification, {
                    message: '메시지를 성공적으로 보냈습니다.'
                }) : ''),
                (ctrl.showError() ? m.component(popNotification, {
                    message: ctrl.errors(),
                    error: true
                }) : ''),
                m('.dashboard-header.u-text-center',
                    m('.w-container',
                        m('.w-row', [
                            m('.w-col.w-col-3'),
                            m('.w-col.w-col-6',
                                m('.fontsize-larger.fontweight-semibold.lineheight-tight',
                                    '후원자에게 뉴스 기사 제출'
                                )
                            ),
                            m('.w-col.w-col-3')
                        ])
                    )
                ), m('.section', m('.w-container',
                    m('.w-row', [
                        m('.w-col.w-col-1'),
                        m('.w-col.w-col-10', [
                            m('.u-marginbottom-60.u-text-center',
                                m('._w-inline-block.card.fontsize-small.u-radius', [
                                    m('span.fa.fa-lightbulb-o',
                                        ''
                                    ),
                                    ' Veja ótimo motivos para ',
                                    m('a.alt-link[href=\'https://catarse.attach.io/B1AHAGm1x\'][target=\'_blank\']',
                                        '지금 당신 지지자들과 이야기하십시오!'
                                    )
                                ])
                            ),
                            m('.card.card-terciary.medium.u-marginbottom-80.w-form', [
                                m('form', [
                                    m('label.field-label.fontweight-semibold',
                                        '수신자'
                                    ),
                                    m('select.positive.text-field.w-select', {
                                        onchange: m.withAttr('value', ctrl.fields.reward_id)
                                    }, [
                                        m('option[value=\'-1\']', {
                                            selected: true
                                        },
                                            '모든 사람 (후원자 및 비후원자)'
                                        ),
                                        m('option[value=\'0\']',
                                            '모든 후원자들'
                                        ),
                                        (_.map(paidRewards, reward => m(`option[value='${reward.id}']`,
                                              ctrl.rewardText(reward.id)
                                            )))
                                    ]),
                                    m('label.field-label.fontweight-semibold',
                                        '제목'
                                    ),
                                    m('input.positive.text-field.w-input[id=\'post_title\'][maxlength=\'256\'][type=\'text\']', {
                                        name: 'posts[title]',
                                        value: ctrl.fields.title(),
                                        onfocus: () => ctrl.titleHasError(false),
                                        class: ctrl.titleHasError() ? 'error' : '',
                                        onchange: m.withAttr('value', ctrl.fields.title)
                                    }),
                                    m('label.field-label.fontweight-semibold',
                                        '텍스트'
                                    ),
                                    m('.preview-container.u-marginbottom-40', {
                                        class: ctrl.commentHasError() ? '오류' : '',
                                        onclick: () => ctrl.commentHasError(false)
                                    }, h.redactor('posts[comment_html]', ctrl.fields.comment_html)),
                                    m('.u-marginbottom-20.w-row', [
                                        m('.w-col.w-col-3'),
                                        m('.w-sub-col.w-col.w-col-6',
                                            m('button.btn.btn-large', {
                                                onclick: ctrl.togglePreview
                                            },
                                                '미리보기'
                                            )
                                        ),
                                        m('.w-col.w-col-3')
                                    ])
                                ])
                            ]),
                            m('.fontsize-large.fontweight-semibold.u-marginbottom-40',
                                '뉴스가 이미 전송되었습니다.'
                            ),
                            m('.table-outer.u-marginbottom-60', [
                                m('.fontsize-smaller.fontweight-semibold.header.table-row.w-row', [
                                    m('.table-col.w-col.w-col-5',
                                        m('div',
                                            '제목'
                                        )
                                    ),
                                    m('.table-col.u-text-center.w-col.w-col-3',
                                        m('div',
                                            '전송됨'
                                        )
                                    ),
                                    m('.table-col.u-text-center.w-col.w-col-3',
                                        m('div',
                                            '열기'
                                        )
                                    ),
                                    m('.table-col.w-col.w-col-1')
                                ]),
                                (ctrl.projectPosts() ? m('.fontsize-small.table-inner', [
                                    (_.map(ctrl.projectPosts(), post => m('.table-row.w-row', [
                                        m('.table-col.w-col.w-col-5', [
                                            m(`a.alt-link.fontsize-base[href='/projects/${project.project_id}/posts/${post.id}#posts'][target='_blank']`,
                                                    post.title
                                                ),
                                            m('.fontcolor-secondary.fontsize-smallest', [
                                                m('span.fontweight-semibold',
                                                        '전송됨: '
                                                    ),
                                                h.momentify(post.created_at, 'DD/MM/YYYY, h:mm A')
                                            ]),
                                            m('.fontcolor-secondary.fontsize-smallest', [
                                                m('span.fontweight-semibold',
                                                        '수신자: '
                                                    ),
                                                ctrl.showRecipientes(post)
                                            ])
                                        ]),
                                        m('.table-col.u-text-center.w-col.w-col-3',
                                                m('.fontsize-base',
                                                    post.delivered_count
                                                )
                                            ),
                                        m('.table-col.u-text-center.w-col.w-col-3',
                                                m('.fontsize-base', [
                                                    post.open_count,
                                                    m('span.fontcolor-secondary', ` (${ctrl.openedPercentage(post)}%)`)
                                                ])
                                            ),
                                        m('.table-col.w-col.w-col-1',
                                                m('button.btn.btn-no-border.btn-small.btn-terciary.fa.fa-lg.fa-trash', {
                                                    onclick: ctrl.deletePost(post)
                                                })
                                            )
                                    ]))),
                                    m('form.w-hidden', {
                                        action: `/pt/projects/${project.project_id}/posts/${ctrl.toDeletePost()}`,
                                        method: 'POST',
                                        config: ctrl.setPostDeletionForm
                                    }, [
                                        m('input[name=\'utf8\'][type=\'hidden\'][value=\'✓\']'),
                                        m('input[name=\'_method\'][type=\'hidden\'][value=\'delete\']'),
                                        m(`input[name='authenticity_token'][type='hidden'][value='${h.authenticityToken()}']`)
                                    ])

                                ]) : h.loader())
                            ])
                        ]),
                        m('.w-col.w-col-1')
                    ])
                ))
            ]) : h.loader());
    }
};

export default posts;
