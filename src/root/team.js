import m from 'mithril';
import teamTotal from '../c/team-total';
import teamMembers from '../c/team-members';

const team = {
    view() {
        return m('#static-team-app', [
            m('.w-section.hero-who.hero-full', [
                m('.w-container.u-text-center', [
                    m('img.icon-hero[src="https://catarse.me/assets/logo-yellow.png"]'),
                    m('.u-text-center.u-marginbottom-20.fontsize-largest',
                      '우리 팀을 만나십시오')
                ])
            ]),
            m.component(teamTotal),
            m.component(teamMembers)
        ]);
    }
};

export default team;
