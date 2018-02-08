import m from 'mithril';
import postgrest from 'mithril-postgrest';
import _ from 'underscore';
import models from '../models';
import h from '../h';
import I18n from 'i18n-js';
import startVM from '../vms/start-vm';
import youtubeLightbox from '../c/youtube-lightbox';
import slider from '../c/slider';
import landingQA from '../c/landing-qa';
import inlineError from '../c/inline-error';

const I18nScope = _.partial(h.i18nScope, 'pages.start');

const start = {
    controller() {
        h.analytics.windowScroll({ cat: 'project_start', act: 'start_page_scroll' });
        const stats = m.prop([]),
            categories = m.prop([]),
            selectedPane = m.prop(0),
            selectedCategory = m.prop([]),
            featuredProjects = m.prop([]),
            selectedCategoryIdx = m.prop(-1),
            startvm = startVM(I18n),
            filters = postgrest.filtersVM,
            paneImages = startvm.panes,
            categoryvm = filters({
                category_id: 'eq'
            }),
            projectvm = filters({
                project_id: 'eq'
            }),
            uservm = filters({
                id: 'eq'
            }),
            loader = postgrest.loader,
            statsLoader = loader(models.statistic.getRowOptions()),
            loadCategories = () => models.category.getPage(filters({}).order({
                name: 'asc'
            }).parameters()).then(categories),
            selectPane = idx => () => {
                selectedPane(idx);
            },
            lCategory = () => loader(models.categoryTotals.getRowOptions(categoryvm.parameters())),
            lProject = () => loader(models.projectDetail.getRowOptions(projectvm.parameters())),
            lUser = () => loader(models.userDetail.getRowOptions(uservm.parameters())),
            linkToExternal = (category) => {
                const externalLinkCategories = I18n.translations[I18n.currentLocale()].projects.index.explore_categories;
                return _.isUndefined(externalLinkCategories[category.id])
                    ? null
                    : `${externalLinkCategories[category.id].link}?ref=ctrse_start`;
            },
            loadCategoryProjects = (category) => {
                selectedCategory(category);
                const categoryProjects = _.findWhere(startvm.categoryProjects, {
                    categoryId: _.first(category).category_id
                });
                featuredProjects([]);
                if (!_.isUndefined(categoryProjects)) {
                    _.map(categoryProjects.sampleProjects, (project_id, idx) => {
                        if (!_.isUndefined(project_id)) {
                            projectvm.project_id(project_id);
                            lProject().load().then(project => setProject(project, idx));
                        }
                    });
                }
            },
            selectCategory = category => () => {
                const externalLink = linkToExternal(category);
                if (externalLink) {
                    window.location = externalLink;
                    return;
                }
                selectedCategoryIdx(category.id);
                categoryvm.category_id(category.id);
                selectedCategory([category]);
                m.redraw();
                lCategory().load().then(loadCategoryProjects);
            },
            setUser = (user, idx) => {
                featuredProjects()[idx] = _.extend({}, featuredProjects()[idx], {
                    userThumb: _.first(user).profile_img_thumbnail
                });
            },
            setProject = (project, idx) => {
                featuredProjects()[idx] = _.first(project);
                uservm.id(_.first(project).user.id);
                lUser().load().then(user => setUser(user, idx));
            },
            projectCategory = m.prop('-1'),
            projectName = m.prop(''),
            projectNameError = m.prop(false),
            projectCategoryError = m.prop(false),
            validateProjectForm = () => {
                projectCategoryError(projectCategory() == -1);
                projectNameError(projectName().trim() === '');

                return (!projectCategoryError() && !projectNameError());
            };

        statsLoader.load().then(stats);
        loadCategories();

        return {
            stats,
            categories,
            paneImages,
            selectCategory,
            selectedCategory,
            selectedCategoryIdx,
            selectPane,
            selectedPane,
            featuredProjects,
            linkToExternal,
            testimonials: startvm.testimonials,
            questions: startvm.questions,
            projectCategory,
            projectName,
            projectNameError,
            projectCategoryError,
            validateProjectForm
        };
    },
    view(ctrl, args) {
        const stats = _.first(ctrl.stats());
        const testimonials = () => _.map(ctrl.testimonials, (testimonial) => {
            const content = m('.card.u-radius.card-big.card-terciary', [
                m('.u-text-center.u-marginbottom-20', [
                    m(`img.thumb-testimonial.u-round.u-marginbottom-20[src="${testimonial.thumbUrl}"]`)
                ]),
                m('p.fontsize-large.u-marginbottom-30', `"${testimonial.content}"`),
                m('.u-text-center', [
                    m('.fontsize-large.fontweight-semibold', testimonial.name),
                    m('.fontsize-base', testimonial.totals)
                ])
            ]);

            return {
                content
            };
        });

        return m('#start', { config: h.setPageTitle(I18n.t('header_html', I18nScope())) }, [
            m('.w-section.hero-full.hero-start', [
                m('.w-container.u-text-center', [
                    m('.fontsize-megajumbo.fontweight-semibold.u-marginbottom-40', I18n.t('slogan', I18nScope())),
                    m('.w-row.u-marginbottom-40', [
                        m('.w-col.w-col-4.w-col-push-4', [
                            m('a.btn.btn-large.u-marginbottom-10[href="#start-form"]', {
                                config: h.scrollTo(),
                                onclick: h.analytics.event({ cat: 'project_start', act: 'start_btnstart_click' })
                            }, I18n.t('submit', I18nScope()))
                        ])
                    ]),
                    m('.w-row', _.isEmpty(stats) ? '' : [
                        m('.w-col.w-col-4', [
                            m('.fontsize-largest.lineheight-loose', h.formatNumber(stats.total_contributors, 0, 3)),
                            m('p.fontsize-small.start-stats', I18n.t('header.people', I18nScope()))
                        ]),
                        m('.w-col.w-col-4', [
                            m('.fontsize-largest.lineheight-loose', `${stats.total_contributed.toString().slice(0, 2)} milhões`),
                            m('p.fontsize-small.start-stats', I18n.t('header.money', I18nScope()))
                        ]),
                        m('.w-col.w-col-4', [
                            m('.fontsize-largest.lineheight-loose', h.formatNumber(stats.total_projects_success, 0, 3)),
                            m('p.fontsize-small.start-stats', I18n.t('header.success', I18nScope()))
                        ])
                    ])
                ])
            ]),
            m('.w-section.section', [
                m('.w-container', [
                    m('.w-row', [
                        m('.w-col.w-col-10.w-col-push-1.u-text-center', [
                            m('.fontsize-larger.u-marginbottom-10.fontweight-semibold', I18n.t('page-title', I18nScope())),
                            m('.fontsize-small', I18n.t('page-subtitle', I18nScope()))
                        ])
                    ]),
                    m('.w-clearfix.how-row', [
                        m('.w-hidden-small.w-hidden-tiny.how-col-01', [
                            m('.info-howworks-backers', [
                                m('.fontweight-semibold.fontsize-large', I18n.t('banner.1', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.2', I18nScope()))
                            ]),
                            m('.info-howworks-backers', [
                                m('.fontweight-semibold.fontsize-large', I18n.t('banner.3', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.4', I18nScope()))
                            ])
                        ]),
                        m('.how-col-02'),
                        m('.how-col-03', [
                            m('.fontweight-semibold.fontsize-large', I18n.t('banner.5', I18nScope())),
                            m('.fontsize-base', I18n.t('banner.6', I18nScope())),
                            m('.fontweight-semibold.fontsize-large.u-margintop-30', I18n.t('banner.7', I18nScope())),
                            m('.fontsize-base', I18n.t('banner.8', I18nScope()))
                        ]),
                        m('.w-hidden-main.w-hidden-medium.how-col-01', [
                            m('.info-howworks-backers', [
                                m('.fontweight-semibold.fontsize-large', I18n.t('banner.1', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.2', I18nScope()))
                            ]),
                            m('.info-howworks-backers', [
                                m('.fontweight-semibold.fontsize-large', I18n.t('banner.3', I18nScope())),
                                m('.fontsize-base', I18n.t('banner.4', I18nScope()))
                            ])
                        ])
                    ])
                ])
            ]),
            m('.w-section.divider'),
            m('.w-section.section-large', [
                m('.w-container.u-text-center.u-marginbottom-60', [
                    m('div', [
                        m('span.fontsize-largest.fontweight-semibold', I18n.t('features.title', I18nScope()))
                    ]),
                    m('.w-hidden-small.w-hidden-tiny.fontsize-large.u-marginbottom-20', I18n.t('features.subtitle', I18nScope())),
                    m('.w-hidden-main.w-hidden-medium.u-margintop-30', [
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_1', I18nScope())),
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_2', I18nScope())),
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_3', I18nScope())),
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_4', I18nScope())),
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_5', I18nScope())),
                        m('.fontsize-large.u-marginbottom-30', I18n.t('features.feature_6', I18nScope()))
                    ])
                ]),
                m('.w-container', [
                    m('.w-tabs.w-hidden-small.w-hidden-tiny', [
                        m('.w-tab-menu.w-col.w-col-4', _.map(ctrl.paneImages, (pane, idx) => m(`btn.w-tab-link.w-inline-block.tab-list-item${(idx === ctrl.selectedPane()) ? '.selected' : ''}`, {
                            onclick: h.analytics.event({ cat: 'project_start', act: 'start_solution_click', lbl: pane.label }, ctrl.selectPane(idx))
                        }, pane.label))),
                        m('.w-tab-content.w-col.w-col-8', _.map(ctrl.paneImages, (pane, idx) => m('.w-tab-pane', [
                            m(`img[src="${pane.src}"].pane-image${(idx === ctrl.selectedPane()) ? '.selected' : ''}`)
                        ])))
                    ])
                ])
            ]),

            m('.w-section.section-large.card-terciary',
                m('.w-container',
                    [
                        m('.u-text-center.u-marginbottom-40',
                            [
                                m('div',
                                    m('span.fontsize-largest.fontweight-semibold',
                                        I18n.t('mode.title', I18nScope())
                                    )
                                ),
                                m('.w-row',
                                    [
                                        m('.w-col.w-col-1'),
                                        m('.w-col.w-col-10',
                                            m('.fontsize-large.u-marginbottom-20',
                                                I18n.t('mode.subtitle', I18nScope())
                                            )
                                        ),
                                        m('.w-col.w-col-1')
                                    ]
                                )
                            ]
                        ),
                        m('div',
                            m('.flex-row.u-marginbottom-40',
                                [
                                    m('.flex-column.card.u-radius.u-marginbottom-30',
                                        [
                                            m('.u-text-center.u-marginbottom-30',
                                                m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/5632f334ec8a367d341b4bba_badge-aon.png\']')
                                            ),
                                            m('.fontsize-large.flex-column.u-marginbottom-20',
                                                [
                                                    I18n.t('mode.aon.info', I18nScope()),
                                                    m.trust('&nbsp;')
                                                ]
                                            ),
                                            m('.fontsize-base.flex-column.fontcolor-secondary',
                                                I18n.t('mode.aon.info_2', I18nScope())
                                            )
                                        ]
                                    ),
                                    m('.flex-column.card.u-radius.u-marginbottom-30',
                                        [
                                            m('.u-text-center.u-marginbottom-30',
                                                m('img[src=\'https://daks2k3a4ib2z.cloudfront.net/54b440b85608e3f4389db387/5632ebacd092957f34eaea9c_badge-flex.png\']')
                                            ),
                                            m('.fontsize-large.flex-column.u-marginbottom-20',
                                                I18n.t('mode.flex.info', I18nScope())
                                            ),
                                            m('.fontsize-base.flex-column.fontcolor-secondary',
                                                I18n.t('mode.flex.info_2', I18nScope())
                                            )
                                        ]
                                    )
                                ]
                            )
                        ),
                        m('.u-text-center.u-marginbottom-30',
                            [
                                m('.fontsize-large.fontweight-semibold',
                                    I18n.t('mode.tax_info', I18nScope())
                                ),
                                m('.fontsize-smallest.fontcolor-secondary',
                                    [
                                        I18n.t('mode.failed_info', I18nScope()),
                                        m.trust(I18n.t('mode.more_link', I18nScope()))
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ),

            m('.w-section.section-large.bg-blue-one', [
                m('.w-container.u-text-center', [
                    m('.fontsize-larger.lineheight-tight.fontcolor-negative.u-marginbottom-20', [
                        I18n.t('video.title', I18nScope()),
                        m('br'),
                        I18n.t('video.subtitle', I18nScope())
                    ]),
                    m.component(youtubeLightbox, {
                        src: I18n.t('video.src', I18nScope()),
                        onclick: h.analytics.event({ cat: 'project_start', act: 'start_video_play' })
                    })
                ])
            ]),
            m('.w-hidden-small.w-hidden-tiny.section-categories', [
                m('.w-container', [
                    m('.u-text-center', [
                        m('.w-row', [
                            m('.w-col.w-col-10.w-col-push-1', [
                                m('.fontsize-large.u-marginbottom-40.fontcolor-negative', I18n.t('categories.title', I18nScope()))
                            ])
                        ])
                    ]),
                    m('.w-tabs', [
                        m('.w-tab-menu.u-text-center', _.map(ctrl.categories(), category => m(`a.w-tab-link.w-inline-block.btn-category.small.btn-inline${(ctrl.selectedCategoryIdx() === category.id) ? '.w--current' : ''}`, {
                            onclick: h.analytics.event({ cat: 'project_start', act: 'start_category_click', lbl: category.name }, ctrl.selectCategory(category))
                        }, [
                            m('div', category.name)
                        ]))),
                        m('.w-tab-content.u-margintop-40', [
                            m('.w-tab-pane.w--tab-active', [
                                m('.w-row', (ctrl.selectedCategoryIdx() !== -1) ? _.map(ctrl.selectedCategory(), category => [
                                    m('.w-col.w-col-5', [
                                        m('.fontsize-jumbo.u-marginbottom-20', category.name),
                                        m('a.w-button.btn.btn-medium.btn-inline.btn-dark[href="#start-form"]', {
                                            config: h.scrollTo()
                                        }, I18n.t('submit', I18nScope()))
                                    ]),
                                    m('.w-col.w-col-7', [
                                        m('.fontsize-megajumbo.fontcolor-negative', `R$ ${category.total_successful_value ? h.formatNumber(category.total_successful_value, 2, 3) : '...'}`),
                                        m('.fontsize-large.u-marginbottom-20', 'Doados para projetos'),
                                        m('.fontsize-megajumbo.fontcolor-negative', (category.successful_projects) ? category.successful_projects : '...'),
                                        m('.fontsize-large.u-marginbottom-30', 'Projetos financiados'),
                                        !_.isEmpty(ctrl.featuredProjects()) ? _.map(ctrl.featuredProjects(), project => !_.isUndefined(project) ? m('.w-row.u-marginbottom-10', [
                                            m('.w-col.w-col-1', [
                                                m(`img.user-avatar[src="${h.useAvatarOrDefault(project.userThumb)}"]`)
                                            ]),
                                            m('.w-col.w-col-11', [
                                                m('.fontsize-base.fontweight-semibold', project.user.public_name || project.user.name),
                                                m('.fontsize-smallest', [
                                                    I18n.t('categories.pledged', I18nScope({ pledged: h.formatNumber(project.pledged), contributors: project.total_contributors })),
                                                    m(`a.link-hidden[href="/${project.permalink}"]`, project.name)
                                                ])
                                            ])
                                        ]) : m('.fontsize-base', I18n.t('categories.loading_featured', I18nScope()))) : ''
                                    ])
                                ]) : '')
                            ])
                        ])
                    ])
                ])
            ]),
            m.component(slider, {
                slides: testimonials(),
                title: I18n.t('testimonials_title', I18nScope()),
                slideClass: 'slide-testimonials-content',
                wrapperClass: 'slide-testimonials',
                onchange: h.analytics.event({ cat: 'project_start', act: 'start_testimonials_change' })
            }),
            m('.w-section.divider.u-margintop-30'),
            m('.w-container', [
                m('.fontsize-larger.u-text-center.u-marginbottom-60.u-margintop-40', I18n.t('qa_title', I18nScope())),
                m('.w-row.u-marginbottom-60', [
                    m('.w-col.w-col-6', _.map(ctrl.questions.col_1, question => m.component(landingQA, {
                        question: question.question,
                        answer: question.answer,
                        onclick: h.analytics.event({ cat: 'project_start', act: 'start_qa_click', lbl: question.question })
                    }))),
                    m('.w-col.w-col-6', _.map(ctrl.questions.col_2, question => m.component(landingQA, {
                        question: question.question,
                        answer: question.answer,
                        onclick: h.analytics.event({ cat: 'project_start', act: 'start_qa_click', lbl: question.question })
                    })))
                ])
            ]),
            m('#start-form.w-section.section-large.u-text-center.bg-purple.before-footer', [
                m('.w-container', [
                    m('.fontsize-jumbo.fontcolor-negative.u-marginbottom-60', 'Crie o seu rascunho gratuitamente!'),
                    m('form[action="/projects/fallback_create"][method="GET"].w-row.w-form', {
                        onsubmit: (e) => {
                            h.analytics.oneTimeEvent({ cat: 'project_create', act: 'create_form_submit' })(e);
                            return ctrl.validateProjectForm();
                        }
                    },
                        [
                            m('.w-col.w-col-2'),
                            m('.w-col.w-col-8', [
                                m('.fontsize-larger.fontcolor-negative.u-marginbottom-10', I18n.t('form.title', I18nScope())),
                                m('input[name="utf8"][type="hidden"][value="✓"]'),
                                m(`input[name="authenticity_token"][type="hidden"][value="${h.authenticityToken()}"]`),
                                m('input.w-input.text-field.medium.u-marginbottom-30[type="text"]', {
                                    name: 'project[name]',
                                    class: ctrl.projectNameError() ? 'error' : '',
                                    onfocus: () => ctrl.projectNameError(false),
                                    onchange: (e) => {
                                        h.analytics.oneTimeEvent({ cat: 'project_create', act: 'create_form_change', lbl: 'name' })(e);
                                        m.withAttr('value', ctrl.projectName)(e);
                                    }
                                }),
                                m('.fontsize-larger.fontcolor-negative.u-marginbottom-10', 'na categoria'),
                                m('select.w-select.text-field.medium.u-marginbottom-40', {
                                    name: 'project[category_id]',
                                    class: ctrl.projectCategoryError() ? 'error' : '',
                                    onfocus: () => ctrl.projectCategoryError(false),
                                    onchange: (e) => {
                                        h.analytics.oneTimeEvent({ cat: 'project_create', act: 'create_form_change', lbl: 'category' })(e);
                                        m.withAttr('value', ctrl.projectCategory)(e);
                                    }
                                }, [
                                    m('option[value="-1"]', I18n.t('form.select_default', I18nScope())),
                                    _.map(ctrl.categories(), category => m('option', { value: category.id, selected: ctrl.projectCategory() === category.id }, category.name))
                                ])
                            ]),
                            m('.w-col.w-col-2'),
                            m('.w-row.u-marginbottom-20', [
                                m('.w-col.w-col-4.w-col-push-4.u-margintop-40', [
                                    m(`input[type="submit"][value="${I18n.t('form.submit', I18nScope())}"].w-button.btn.btn-large`)
                                ])
                            ]),
                            m('.w-row.u-marginbottom-80', (ctrl.projectNameError() || ctrl.projectCategoryError()) ? m.component(inlineError, { message: 'Por favor, verifique novamente os campos acima!' }) : '')
                        ])
                ])
            ])
        ]);
    }
};

export default start;
