import m from 'mithril';
import _ from 'underscore';
import postgrest from 'mithril-postgrest';
import I18n from 'i18n-js';
import h from '../h';
import models from '../models';
import inlineError from '../c/inline-error';
import countrySelect from '../c/country-select';
import nationalityRadio from '../c/nationality-radio';
import addressVM from '../vms/address-vm';

const I18nScope = _.partial(h.i18nScope, 'activerecord.attributes.address');

const addressForm = {
    controller(args) {
        const parsedErrors = args.parsedErrors;
        const statesLoader = postgrest.loader(models.state.getPageOptions()),
            data = args.fields().address(),
            vm = addressVM({
                data
            }),
            defaultCountryID = vm.defaultCountryID,
            defaultForeignCountryID = vm.defaultForeignCountryID,
            states = m.prop(),
            zipCodeErrorMessage = m.prop(''),
            fields = args.addressFields || vm.fields,
            errors = {
                countryID: m.prop(parsedErrors ? parsedErrors.hasError('country_id') : false),
                stateID: m.prop(parsedErrors ? parsedErrors.hasError('state') : false),
                addressStreet: m.prop(parsedErrors ? parsedErrors.hasError('street') : false),
                addressNumber: m.prop(parsedErrors ? parsedErrors.hasError('number') : false),
                addressComplement: m.prop(false),
                addressNeighbourhood: m.prop(parsedErrors ? parsedErrors.hasError('neighbourhood') : false),
                addressCity: m.prop(parsedErrors ? parsedErrors.hasError('city') : false),
                addressState: m.prop(parsedErrors ? parsedErrors.hasError('state') : false),
                addressZipCode: m.prop(parsedErrors ? parsedErrors.hasError('zipcode') : false),
                phoneNumber: m.prop(parsedErrors ? parsedErrors.hasError('phonenumber') : false)
            },
            phoneMask = _.partial(h.mask, '(99) 9999-99999'),
            zipcodeMask = _.partial(h.mask, '99999-999'),
            applyZipcodeMask = _.compose(fields.addressZipCode, zipcodeMask),
            applyPhoneMask = _.compose(fields.phoneNumber, phoneMask),
            international = args.international || vm.international;

        const checkPhone = () => {
            let hasError = false;
            const phone = fields.phoneNumber(),
                strippedPhone = String(phone).replace(/[\(|\)|\-|\s]*/g, '');

            if (strippedPhone.length < 10) {
                errors.phoneNumber(true);
                hasError = true;
            } else {
                const controlDigit = Number(strippedPhone.charAt(2));
                if (!(controlDigit >= 2 && controlDigit <= 9)) {
                    errors.phoneNumber(true);
                    hasError = true;
                }
            }
            return hasError;
        };
        _.extend(args.fields(), {
            validate: () => {
                let hasError = false;
                const fieldsToIgnore = international() ? ['id', 'stateID', 'addressComplement', 'addressNumber', 'addressNeighbourhood', 'phoneNumber'] : ['id', 'addressComplement', 'addressState', 'phoneNumber'];
                // clear all errors
                _.mapObject(errors, (val, key) => {
                    val(false);
                });
                // check for empty fields
                _.mapObject(_.omit(fields, fieldsToIgnore), (val, key) => {
                    if (!val()) {
                        errors[key](true);
                        hasError = true;
                    }
                });
                if (!international()) {
                    const hasPhoneError = checkPhone();
                    hasError = hasError || hasPhoneError;
                }
                return !hasError;
            }
        });

        const lookupZipCode = (zipCode) => {
            fields.addressZipCode(zipCode);
            if (zipCode.length === 9) {
                m.request({
                    method: 'GET',
                    url: `https://api.pagar.me/1/zipcodes/${zipCode}`
                }).then((response) => {
                    fields.addressStreet(response.street);
                    fields.addressNeighbourhood(response.neighborhood);
                    fields.addressCity(response.city);
                    fields.stateID(_.find(states(), state => state.acronym === response.state).id);
                    errors.addressStreet(false);
                    errors.addressNeighbourhood(false);
                    errors.addressCity(false);
                    errors.stateID(false);
                    errors.addressZipCode(false);
                }).catch((err) => {
                    zipCodeErrorMessage(err.errors[0].message);
                    errors.addressZipCode(true);
                });
            }
        };

        statesLoader.load().then(states);
        return {
            lookupZipCode,
            zipCodeErrorMessage,
            errors,
            applyPhoneMask,
            applyZipcodeMask,
            defaultCountryID,
            defaultForeignCountryID,
            fields,
            international,
            states
        };
    },
    view(ctrl, args) {
        const fields = ctrl.fields,
            international = ctrl.international,
            defaultCountryID = ctrl.defaultCountryID,
            defaultForeignCountryID = ctrl.defaultForeignCountryID,
            errors = ctrl.errors,
            // hash to send to rails
            address = {
                id: fields.id(),
                country_id: fields.countryID(),
                state_id: fields.stateID(),
                address_street: fields.addressStreet(),
                address_number: fields.addressNumber(),
                address_complement: fields.addressComplement(),
                address_neighbourhood: fields.addressNeighbourhood(),
                address_city: fields.addressCity(),
                address_state: fields.addressState(),
                address_zip_code: fields.addressZipCode(),
                phone_number: fields.phoneNumber()
            };

        args.fields().address(address);
        if (args.stateName) {
            args.stateName(ctrl.states() && fields.stateID() ? _.find(ctrl.states(), state => state.id === parseInt(fields.stateID())).name : '');
        }

        return m('#address-form.u-marginbottom-30.w-form', [
            (!args.hideNationality ?
                m('.u-marginbottom-30',
                m(nationalityRadio, {
                    fields,
                    defaultCountryID,
                    defaultForeignCountryID,
                    international
                })) : ''),
            // @TODO move to another component
            (international() ?
                m('form', [
                    m(countrySelect, {
                        countryName: args.countryName,
                        fields,
                        international,
                        defaultCountryID,
                        defaultForeignCountryID
                    }),
                    m('div', [
                        m('.w-row',
                            m('.w-col.w-col-12', [
                                m('.field-label.fontweight-semibold',
                                    '주소 *'
                                    //coffee 'Address *'
                                ),
                                m("input.positive.text-field.w-input[required='required'][type='text']", {
                                    class: errors.addressStreet() ? '오류' : '',
                                    //coffee  class: errors.addressStreet() ? 'error' : '',
                                    value: ctrl.fields.addressStreet(),
                                    onchange: m.withAttr('value', ctrl.fields.addressStreet)
                                }),
                                errors.addressStreet() ? m(inlineError, {
                                    message: '주소를 입력해 주세요.'
                                    //coffee  message: 'Please fill in an address.'
                                }) : ''
                            ])),
                        m('div',
                            m('.w-row', [
                                m('.w-sub-col.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        '우편 번호 *'
                                        //coffee  'Zip Code *'
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressZipCode() ? '오류' : '',
                                        value: ctrl.fields.addressZipCode(),
                                        onchange: m.withAttr('value', ctrl.fields.addressZipCode)
                                    }),
                                    errors.addressZipCode() ? m(inlineError, {
                                        message: '우편 번호를 입력해 주세요.'
                                        //coffee  message: 'ZipCode is required'
                                    }) : ''
                                ]),
                                m('.w-sub-col.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        '도시 *'
                                        //coffee  'City *'
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressCity() ? '오류' : '',
                                        //coffee  class: errors.addressCity() ? 'error' : '',
                                        value: ctrl.fields.addressCity(),
                                        onchange: m.withAttr('value', ctrl.fields.addressCity)
                                    }),
                                    errors.addressCity() ? m(inlineError, {
                                        message: '도시를 입력해 주세요.'
                                        //coffee  message: 'City is required.'
                                    }) : ''
                                ]),
                                m('.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        'State *'
                                        //coffee    '국가 *'
                                    ),
                                    m("input#address-state.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressState() ? '오류' : '',
                                        //coffee  class: errors.addressState() ? 'error' : '',
                                        value: ctrl.fields.addressState(),
                                        onchange: m.withAttr('value', ctrl.fields.addressState)
                                    }),
                                    errors.addressState() ? m(inlineError, {
                                        message: 'State is required'
                                        //coffee    message: '국가를 입력해 주세요.'
                                    }) : ''
                                ])
                            ])
                        )
                    ])
                ]) :
                m('.w-form', [
                    m('div', [
                        m(countrySelect, {
                            countryName: args.countryName,
                            fields,
                            international,
                            defaultCountryID,
                            defaultForeignCountryID
                        }),
                        m('div', [
                            m('.w-row', [
                                m('.w-col.w-col-6', [
                                    m('.field-label', [
                                        m('span.fontweight-semibold',
                                            `${I18n.t('address_zip_code', I18nScope())} *`
                                        ),
                                        m("a.fontsize-smallest.alt-link.u-right[href='http://www.buscacep.correios.com.br/sistemas/buscacep/'][target='_blank']",
                                            I18n.t('zipcode_unknown', I18nScope())
                                        )
                                    ]),
                                    m("input.positive.text-field.w-input[placeholder='숫자만 입력해 주시길 바랍니다.'][required='required'][type='text']", {
                                    //coffee  m("input.positive.text-field.w-input[placeholder='Digite apenas números'][required='required'][type='text']", {
                                        class: errors.addressZipCode() ? '오류' : '',
                                        //coffee  class: errors.addressZipCode() ? 'error' : '',
                                        value: ctrl.fields.addressZipCode(),
                                        onkeyup: m.withAttr('value', value => ctrl.applyZipcodeMask(value)),
                                        oninput: (e) => {
                                            ctrl.lookupZipCode(e.target.value);
                                        }
                                    }),
                                    errors.addressZipCode() ? m(inlineError, {
                                        message: ctrl.zipCodeErrorMessage() ? ctrl.zipCodeErrorMessage() : '올바른 우편 번호를 입력해 주세요.'
                                    }) : ''
                                ]),
                                m('.w-col.w-col-6')
                            ]),
                            m('.w-row', [
                                m('.field-label.fontweight-semibold',
                                    `${I18n.t('address_street', I18nScope())} *`
                                ),
                                m("input.positive.text-field.w-input[maxlength='256'][required='required'][type='text']", {
                                    class: errors.addressStreet() ? '오류' : '',
                                    //coffee  class: errors.addressStreet() ? 'error' : '',
                                    value: ctrl.fields.addressStreet(),
                                    onchange: m.withAttr('value', ctrl.fields.addressStreet)
                                }),
                                errors.addressStreet() ? m(inlineError, {
                                    message: '주소를 입력해 주세요.'
                                    //coffee message: 'message: 'Informe um endereço.'
                                }) : ''
                            ]),
                            m('.w-row', [
                                m('.w-sub-col.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        `${I18n.t('address_number', I18nScope())} *`
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressNumber() ? '오류' : '',
                                        //coffee  class: errors.addressNumber() ? 'error' : '',
                                        value: ctrl.fields.addressNumber(),
                                        onchange: m.withAttr('value', ctrl.fields.addressNumber)
                                    }),
                                    errors.addressNumber() ? m(inlineError, {
                                        message: '번호를 입력해 주세요.'
                                        //coffee  message: 'Informe um número.'
                                    }) : ''
                                ]),
                                m('.w-sub-col.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        I18n.t('address_complement', I18nScope())
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        value: ctrl.fields.addressComplement(),
                                        onchange: m.withAttr('value', ctrl.fields.addressComplement)
                                    })
                                ]),
                                m('.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        `${I18n.t('address_neighbourhood', I18nScope())} *`
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressNeighbourhood() ? '오류' : '',
                                        //coffee class: errors.addressNeighbourhood() ? 'error' : '',
                                        value: ctrl.fields.addressNeighbourhood(),
                                        onchange: m.withAttr('value', ctrl.fields.addressNeighbourhood)
                                    }),
                                    errors.addressNeighbourhood() ? m(inlineError, {
                                        message: 'Informe um bairro.'
                                    }) : ''
                                ])
                            ]),
                            m('.w-row', [
                                m('.w-sub-col.w-col.w-col-6', [
                                    m('.field-label.fontweight-semibold',
                                        `${I18n.t('address_city', I18nScope())} *`
                                    ),
                                    m("input.positive.text-field.w-input[required='required'][type='text']", {
                                        class: errors.addressCity() ? '오류' : '',
                                        //coffee  class: errors.addressCity() ? 'error' : '',
                                        value: ctrl.fields.addressCity(),
                                        onchange: m.withAttr('value', ctrl.fields.addressCity)
                                    }),
                                    errors.addressCity() ? m(inlineError, {
                                        message: '도시 입력.'
                                        //coffee  message: 'Informe uma cidade.'
                                    }) : ''
                                ]),
                                m('.w-sub-col.w-col.w-col-2', [
                                    m('.field-label.fontweight-semibold',
                                        `${I18n.t('address_state', I18nScope())} *`
                                    ),
                                    m('select#address-state.positive.text-field.w-select', {
                                        class: errors.stateID() ? '오류' : '',
                                        //coffee  class: errors.stateID() ? 'error' : '',
                                        onchange: m.withAttr('value', ctrl.fields.stateID)
                                    }, [
                                        m('option', { value: '' }),
                                        (!_.isEmpty(ctrl.states()) ?
                                            _.map(ctrl.states(), state => m('option', {
                                                value: state.id,
                                                selected: state.id === ctrl.fields.stateID()
                                            },
                                                state.acronym
                                            )) : '')
                                    ]),
                                    errors.stateID() ? m(inlineError, {
                                        message: '상태 입력.'
                                        //coffee  message: 'Informe um estado.'
                                    }) : ''
                                ]),
                                m('.w-col.w-col-4', [
                                    m('.field-label.fontweight-semibold',
                                        `${I18n.t('phone_number', I18nScope())} *`
                                    ),
                                    m("input#phone.positive.text-field.w-input[placeholder='숫자만 입력해 주세요.'][required='required'][type='text']", {
                                    //coffee  m("input#phone.positive.text-field.w-input[placeholder='Digite apenas números.'][required='required'][type='text']", {
                                        class: errors.phoneNumber() ? '오류' : '',
                                        //coffee  class: errors.phoneNumber() ? 'error' : '',
                                        value: ctrl.fields.phoneNumber(),
                                        onkeyup: m.withAttr('value', value => ctrl.applyPhoneMask(value)),
                                        onchange: m.withAttr('value', ctrl.fields.phoneNumber)
                                    }),
                                    errors.phoneNumber() ? m(inlineError, {
                                        message: '유효한 전화번호를 입력해 주세요.'
                                        //coffee  message: 'Informe um telefone válido.'
                                    }) : ''
                                ])
                            ])

                        ])
                    ])
                ]))
        ]);
    }
};

export default addressForm;
