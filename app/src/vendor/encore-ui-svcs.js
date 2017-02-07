/*
 * encore-ui-svcs
 * http://docs.encore.rackspace.com

 * Version: 3.8.3 - 2017-01-26
 */

angular.module('encore.common.http', ['encore.svcs.util.http'])
/**
 * @ngdoc object
 * @name encore.common.http.HttpTransformUtil
 * @requires encore.svcs.util.http.TransformUtil
 * @deprecated
 * @description
 * Collection of Utility functions for building/generating `$http` Transforms
 * _This service has been deprecated, please switch to {@link encore.svcs.util.http.TransformUtil TransformUtil}_
 */

.factory('HttpTransformUtil', ["TransformUtil", function (TransformUtil) {
    return {
        getTransformResponse: TransformUtil.responseChain,
        getTransformRequest: TransformUtil.requestChain,
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.account
 * @requires ngResource
 * @requires encore.svcs.util
 * @requires encore.svcs.util.http
 * @description
 * Collection of services and filters for interacting
 * with and displaying customer accounts
 *
 * ## Children ##
 * * {@link encore.svcs.account.AccountUtil AccountUtil}
 *
 */
angular.module('encore.svcs.account', [
]);

angular.module('encore.svcs.account')
/**
 * @ngdoc object
 * @name encore.svcs.account.AccountUtil
 * @description
 * Methods used for interacting with customer accounts 
 */
.factory('AccountUtil', function () {
    /**
     * @ngdoc method
     * @name encore.svcs.account.AccountUtil#getCloudBillingPrefix
     * @methodOf encore.svcs.account.AccountUtil
     * @param {string} accountNumber base account number with no prefix
     * @description
     * Given a base account number, returns the appropriate prefix 020 if less
     * than 10,000,000 and 021 if greater than or equal to 10,000,000
     *
     * @returns {string} prefix: a prefix to be prepended to the account number
     * @example
     * <pre>
     * '1234'
     * </pre>
     * <pre>
     * '020'
     * </pre>
     * or if account number is greater than or equal to 10,000,000 
     * <pre>
     * '10000000'
     * </pre>
     * <pre>
     * '021'
     * </pre>
     */
    var getCloudBillingPrefix = function (accountNumber) {
        var prefix = '020';
        if (parseInt(accountNumber) >= 10000000) {
            prefix = '021';
        }
        return prefix;
    };

    return {
        getCloudBillingPrefix: getCloudBillingPrefix 
    };
});

/**
 * @ngdoc overview
 * @name encore.svcs.astra
 *
 * @description
 * Services used for interacting with the Astra Authentication Service
 */
angular.module('encore.svcs.astra', [
    'encore.svcs.astra.config'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.astra.config
 *
 * @description
 * Collection of configuration values for Astra
 */
angular.module('encore.svcs.astra.config', [])
     /**
     * @ngdoc property
     * @const ASTRA_ENDPOINTS
     * @name encore.svcs.astra.config.constant:ASTRA_ENDPOINTS
     * @description
     * Constant for Astra endpoints
     *
     * @example
     * <pre>
     *  ASTRA_ENDPOINTS.preprod 
     -> 'https://preprod.astra.rackspace.com'
     * </pre>
     */
    .constant('ASTRA_ENDPOINTS', {
        staging: 'https://staging.astra.rackspace.com',
        preprod: 'https://preprod.astra.rackspace.com',
        production: 'https://login.rackspace.com'
    });

/**
 * @ngdoc overview
 * @name encore.svcs.billing
 * @requires ngResource
 * @requires encore.svcs.util
 * @requires encore.svcs.util.http
 * @description
 * Collection of services and filters for interacting
 * with and displaying payments
 *
 * ## Children ##
 * * {@link encore.svcs.billing.config Billing Configuration}
 * * {@link encore.svcs.billing.BillingUtil BillingUtil}
 * * {@link encore.svcs.billing.DiscountResource DiscountResource}
 * * {@link encore.svcs.billing.DiscountRoute DiscountRoute}
 * * {@link encore.svcs.billing.DiscountTransform DiscountTransform}
 * * {@link encore.svcs.billing.BillInfoResource BillInfoResource}
 * * {@link encore.svcs.billing.InvoiceDeliveryService InvoiceDeliveryService}
 * * {@link encore.svcs.billing.TaxInfoRoute TaxInfoRoute}
 * * {@link encore.svcs.billing.BillingAccountResource BillingAccountResource}
 * * {@link encore.svcs.billing.BillingAccountService BillingAccountService}
 *
 * ## API Information ##
 * For a full set of documentation pertaining to BSL (billing service layer)
 * please visit {@link https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/overview.html BSL
 * Contracts}
 */
angular.module('encore.svcs.billing', [
    'ngResource',
    'encore.svcs.util',
    'encore.svcs.billing.config',
    'encore.svcs.util.http',
    'encore.util.transform'
]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.AccountBalanceRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific AccountBalanceRoute URL
 * @returns {string} Full URL for AccountBalanceRoute
 */
.factory('AccountBalanceRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/balance';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.AccountBalanceResource
 * @requires $resource
 * @requires encore.svcs.billing.AccountBalanceRoute
 * @requires encore.svcs.util.http.TransformUtil
 * @requires encore.util.transform.Pluck
 * @returns {object} an angular resource
 * @description
 * Returns the currency for a given accountNumber
 */
.factory('AccountBalanceResource', ["$resource", "AccountBalanceRoute", "TransformUtil", "Pluck", function (
    $resource,
    AccountBalanceRoute,
    TransformUtil,
    Pluck
) {
    return $resource(AccountBalanceRoute, {
            accountNumber: '@accountNumber'
        },
        {
            /**
             * @ngdoc method
             * @name AccountBalanceResource#get
             * @methodOf encore.svcs.billing.AccountBalanceResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Account Balance values using an HTTP GET request
             * @static
             * @example
             * <pre>
             * AccountBalanceResource.get({ accountNumber: 1234 });
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.AccountBalanceResource#methods_get AccountBalanceResource.get}*
             *
             * <pre>
             * {
             *     "currentBalance": "1510.75",
             *     "pastDue": "10.5",
             *     "amountDue": "1500.25",
             *     "unbilledCharges": "692.5",
             *     "currency": "USD"
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBalance_v2_accounts__ran__balance_BSL_Billing_Operations.html
             * Account Balance Contract}.
             */
            get: {
                method: 'GET',
                transformResponse: TransformUtil.responseChain(Pluck('balance')),
                cache: true
            }
        }
    );
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.AccountCurrencyRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific AccountCurrencyRoute URL
 * @returns {string} Full URL for AccountCurrencyRoute
 */
.factory('AccountCurrencyRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/currency';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.AccountCurrencyResource
 * @requires $resource
 * @requires encore.svcs.billing.AccountCurrencyRoute
 * @requires encore.svcs.util.http.TransformUtil
 * @requires encore.util.transform.Pluck
 * @returns {object} an angular resource
 * @description
 * Returns the currency for a given accountNumber
 */
.factory('AccountCurrencyResource', ["$resource", "AccountCurrencyRoute", "TransformUtil", "Pluck", function (
    $resource,
    AccountCurrencyRoute,
    TransformUtil,
    Pluck
) {
    return $resource(AccountCurrencyRoute, {
            accountNumber: '@accountNumber'
        },
        {
            /**
             * @ngdoc method
             * @name AccountCurrencyResource#get
             * @methodOf encore.svcs.billing.AccountCurrencyResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Account Currency value using an HTTP GET request
             * @static
             * @example
             * <pre>
             * AccountCurrencyResource.get({ accountNumber: 1234 });
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.AccountCurrencyResource#methods_get AccountCurrencyResource.get}*
             *
             * <pre>
             * {
             *     "currency": "USD",
             *     "link": []
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBillingAccountCurrency_v2_accounts__ran__currency_Service_API_Client_Operations.html
             * Account Currency Contract}.
             */
            get: {
                method: 'GET',
                transformResponse: TransformUtil.responseChain(Pluck('billingAccount')),
                cache: true
            }
        }
    );
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.AgingInfoRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific AgingInfoRoute URL
 * @returns {string} Full URL for AgingInfoRoute
 */
.factory('AgingInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/agingInfo';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.AgingInfoResource
 * @requires $resource
 * @requires encore.svcs.billing.AgingInfoRoute
 * @requires encore.svcs.billing.BillingUtil
 * @requires encore.svcs.util.http.TransformUtil
 * @requires encore.util.transform.Pluck
 * @returns {object} an angular resource
 * @description
 * Returns the aging information for a given accountNumber
 */
.factory('AgingInfoResource', ["$resource", "AgingInfoRoute", "BillingUtil", "TransformUtil", "Pluck", function (
    $resource,
    AgingInfoRoute,
    BillingUtil,
    TransformUtil,
    Pluck
) {
    return $resource(AgingInfoRoute, {
            accountNumber: '@accountNumber'
        },
        {
            /**
             * @ngdoc method
             * @name AgingInfoResource#get
             * @methodOf encore.svcs.billing.AgingInfoResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Aging Information using an HTTP GET request
             * @static
             * @example
             * <pre>
             * AgingInfoResource.get({ accountNumber: 1234 });
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.AgingInfoResource#methods_get AgingInfoResource.get}*
             *
             * <pre>
             * {
             *      agingBucket: [
             *         {
             *             amount: '0.00',
             *             label: 'current',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '100.00',
             *             label: '1-30',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '200.00',
             *             label: '31-60',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '300.00',
             *             label: '61-90',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '700.00',
             *             label: '91-120',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '200.00',
             *             label: '121-180',
             *             currency: 'USD'
             *         },
             *         {
             *             amount: '100.00',
             *             label: '181-Plus',
             *             currency: 'USD'
             *         }
             *      ],
             *      outstandingAmount: '1600.00',
             *      currency: 'USD'
             * }
             * </pre>
             *
             * For the full API documentation see [Aging Information](
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getAgingInfo_v2_accounts__ran__agingInfo_Aging_Information_API_Client_Operations.html)
             */
            get: {
                method: 'GET',
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors,
                    Pluck('agingInfo', 'error')
                ]),
                cache: true
            }
        }
    );
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillInfoRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific BillInfoRoute URL
 * @returns {string} Full URL for BillInfoRoute
 */
.factory('BillInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/billInfo';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillInfoResource
 * @description
 * A Service for getting and updating Billing Info. Specifically: account creation date,
 * billing day of the month, invoice delivery method and other entries.
 *
 * @requires $resource
 * @requires encore.svcs.billing.BillInfoRoute
 * @requires encore.svcs.billing.BillingUtil
 * @requires encore.util.transform.Pluck
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} an angular resource
 */
.factory('BillInfoResource', ["$resource", "BillInfoRoute", "BillingUtil", "Pluck", "TransformUtil", function (
    $resource,
    BillInfoRoute,
    BillingUtil,
    Pluck,
    TransformUtil
) {
    var billInfo = $resource(BillInfoRoute,
        {
            accountNumber: '@accountNumber'
        },
        {
            /* jshint maxlen: 180 */
            /**
             * @ngdoc method
             * @name BillInfoResource#get
             * @methodOf encore.svcs.billing.BillInfoResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Billing Info values using an HTTP GET request
             * @static
             * @example
             * <pre>
             * BillInfoResource.get({ accountNumber: 1234 });
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.BillInfoResource#methods_get BillInfoResource.get}*
             *
             * <pre>
             * {
             *     'accountCreationDate': '2014-03-18T18:36:07Z',
             *     'billingDayOfMonth': 18,
             *     'invoiceDeliveryMethod': 'PAPERLESS'
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBillInfo_v2_accounts__ran__billInfo_Billing_Information_API_Client_Operations.html
             * BillInfo Contract}.
             */
            get: {
                method: 'GET',
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors,
                    Pluck('billInfo', 'error')
                ])
            },
            /**
             * @ngdoc method
             * @name BillInfoResource#update
             * @methodOf encore.svcs.billing.BillInfoResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Updates an entry within the BillInfoResource object using an HTTP PUT operation
             * @static
             * @example
             * <pre>
             * var updateData = {
             *     'billInfo': {
             *         'invoiceDeliveryMethod': 'PAPERLESS'
             *     }
             * };
             *
             * BillInfoResource.update({ accountNumber: 12345 }, updateData)
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.BillInfoResource#methods_get BillInfoResource.update}*
             *
             * <pre>
             * {
             *     'accountCreationDate': '2014-03-18T18:36:07Z',
             *     'billingDayOfMonth': 18,
             *     'invoiceDeliveryMethod': 'PAPERLESS'
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_updateBillInfo_v2_accounts__ran__billInfo_Billing_Information_API_Client_Operations.html
             * BillInfo Contract}.
             */
            update: {
                method: 'PUT',
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors,
                    Pluck('billInfo', 'error')
                ])
            }
        }
    );
    return billInfo;
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingAccountRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * retrieves the base url for obtaining billing accounts
 * @returns {string} Full URL for retrieving the billing account
 */
.factory('BillingAccountRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:ran';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingAccountResource
 * @description
 * Service for retrieving account with full prefix
 *
 * @requires $resource
 * @requires encore.svcs.billing.BillingAccountRoute
 * @requires encore.svcs.billing.BillingAccountTransform
 * @requires encore.svcs.billing.BillingUtil
 * @requires encore.util.transform.Pluck
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} an angular resource
 */
.factory('BillingAccountResource', ["$resource", "BillingAccountRoute", "BillingAccountTransform", "BillingUtil", "Pluck", "TransformUtil", function (
    $resource,
    BillingAccountRoute,
    BillingAccountTransform,
    BillingUtil,
    Pluck,
    TransformUtil
) {
    return $resource(BillingAccountRoute, {
        searchRef: '@searchRef',
        ran: '@ran'
    }, {
        /**
         * @ngdoc method
         * @name BillingAccountResource#get
         * @methodOf encore.svcs.billing.BillingAccountResource
         * @param {object} params Parameters object
         * @description
         * Returns a single instance of an account object from an HTTP GET request
         * @example
         * <pre>
         * BillingAccountResource.get({ searchRef: 'CLOUD:1234' });
         * or
         * BillingAccountResource.get({ ran: '020-323676' });
         * </pre>
         *
         * *returns a single instance of an account after transforming the data using
         * {@link encore.svcs.billing.BillingAccountTransform#methods_get BillingAccountTransform.get}*
         * after the data has been loaded in the app, it will be cached
         *
         * <pre>
         * BillingAccountResource.get({ searchRef: 'CLOUD:1234' });
         * {
         *   "billingAccounts": {
         *     "link": [
         *       {
         *         "rel": "self",
         *         "href": "http://billing.api.rackspacecloud.com/v2/accounts/030-222000"
         *       }
         *     ],
         *     "billingAccount": [
         *       {
         *         "org": "UK",
         *         "currency": "USD",
         *         "accountNumber": "021-1234",
         *         "name": "Sir Hub Cap, the fourth of his name",
         *         "parentAccountNumber": "030-555555",
         *         "contractEntity": "CONTRACT_US"
         *       }
         *     ]
         *   }
         * }
         * </pre>
         * <pre>
         * BillingAccountResource.get({ ran: '020-323676' });
         * {
         *     "billingAccount": {
         *       "lineOfBusiness": "US_CLOUD",
         *       "link": [
         *         {
         *           "rel": "self",
         *           "href": "http://billing.api.rackspacecloud.com/v2/ran/accounts/020-123456"
         *         },
         *         {
         *           "rel": "childBillingAccounts",
         *           "href": "http://billing.api.rackspacecloud.com/v2/ran/accounts/020-757575/accounts"
         *         }
         *       ],
         *       "currency": "USD",
         *       "accountNumber": "020-323676",
         *       "name": "amazon",
         *       "contractEntity": "CONTRACT_US",
         *       "monthlyRecurringRevenue": "100.00"
         *     }
         *   }
         * </pre>
         *
         * for full API documentation see {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBillingAccounts_v2_accounts_Service_API_Client_Operations.html
         * Billing Account Search Contract}
         */
        get: {
            method: 'GET',
            cache: true,
            transformResponse: BillingAccountTransform.get
        },
        /**
         * @ngdoc method
         * @name BillingAccountResource#update
         * @methodOf encore.svcs.billing.BillingAccountResource
         * @param {object} params Parameters object
         * @param {number} params.ran Account Number (Billing RAN)
         * @param {object} payload Payload for Account Resource update Request
         * @description
         * Update Billing Account with HTTP put operation
         * @static
         * @example
         * <pre>
         *     var payLoad = {
         *         "contractEntityChangeReasonCode": "Contract Exception",
         *         "parentAccountNumber": "030-555555",
         *         "contractEntity": "CONTRACT_CH"
         *     }
         *
         * BillingAccountResource.update({ ran: '020-123456' }, payload);
         * </pre>
         *
         * * Doesn't have a response body
         * {@link encore.svcs.billing.BillingAccountResource#methods_update BillingAccountResource.update}*
         *
         * for full API documentation see {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_updateBillingAccount_v2_\
         * accounts__ran__Service_API_Client_Operations.html
         * Billing Account}
         */
        update: {
            method: 'PUT',
            transformRequest: TransformUtil.requestChain(function (data) {
                return {
                    billingAccount: data
                };
            }),
            transformResponse: TransformUtil.responseChain([
                BillingUtil.normalizeBslErrors,
                Pluck('billingAccount', 'error')
            ])
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingAccountTransform
 * @requires encore.util.http.TransformUtil
 * @description
 * Returns an object containing any transformation functionality
 * for HTTP response data
 * @returns {object} Transform functions for the BillingAccount Resource
 */
.factory('BillingAccountTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name BillingAccountTransform#get
     * @methodOf encore.svcs.billing.BillingAccountTransform
     * @description transforms the format of the BillingAccount API response
     * splits the returned accountNumber into a prefix and tenantId. Then determines
     * if the account "isPrimary", "isSubsidiary" and if "hasSubsidiary". if
     * "hasSubsidiary" is only included when account is "isPrimary" true.
     * <pre>
     * accountNumber: 020-account-uk
     * </pre>
     * <pre>
     * prefix: 020
     * tenantId: account-uk
     * </pre>
     * @param {object} data data object to be converted
     * @returns {object} a single transformed account
     * @example:
     * <pre>
     * BillingAccountResource.get({ searchRef: 'CLOUD:1234' });
     * {
     *   billingAccounts: {
     *     link: [
     *       {
     *         rel: "self",
     *         href: "http://billing.api.rackspacecloud.com/v2/accounts/030-222000"
     *       }
     *     ],
     *     billingAccount: [
     *       {
     *         org: "UK",
     *         currency: "USD",
     *         accountNumber: "021-account-uk",
     *         name: "Sir Hub Cap, the fourth of his name",
     *         parentAccountNumber: "030-555555",
     *         contractEntity: "CONTRACT_US"
     *       }
     *     ]
     *   }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * {
     *   org: "UK",
     *   currency: "USD",
     *   accountNumber: "021-account-uk",
     *   prefix: "021",
     *   tenantId: "account-uk",
     *   name: "Sir Hub Cap, the fourth of his name",
     *   parentAccountNumber: "030-555555",
     *   contractEntity: "CONTRACT_US",
     *   isPrimary: false,
     *   isSubsidiary: true,
     *   hasSubsidiary: true
     * }
     * </pre>
     *
     * or
     *
     * <pre>
     * BillingAccountResource.get({ ran: '020-323676' });
     * {
     *    "billingAccount": {
     *        "lineOfBusiness": "DEDICATED",
     *        "link": [{
     *            "rel": "self",
     *            "href": "http://billing.api.rackspacecloud.com/v2/ran/accounts/030-555555"
     *        }, {
     *            "rel": "childBillingAccounts",
     *            "href": "http://billing.api.rackspacecloud.com/v2/ran/accounts/020-757575/accounts"
     *        }],
     *        "org": "USA",
     *        "currency": "USD",
     *        "accountNumber": "030-555555",
     *        "name": "amazon",
     *        "contractEntity": "CONTRACT_US",
     *        "serviceAliasInfo": {
     *        "serviceAlias": [
     *            {
     *            "aliasId": "213266",
     *            "aliasType": "DEDICATED"
     *            }
     *        ]
     *    }
     *  }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * {
     *     ...
     *     hasSubsidiary: true,
     *     isPrimary: true,
     *     isSubsidiary: false
     * }
     * </pre>
     */
    var get = function (data) {
        var account;
        // if this object does not contain billingAccounts, then it is an error, so return the whole object
        if (data.billingAccounts) {
            account = _.head(data.billingAccounts.billingAccount);

            // split the account number on the hyphens
            var accountSplit = account.accountNumber.split('-');

            // the first split is the prefix
            account.prefix = _.head(accountSplit);

            // to create the tenantId, we need to return the rest of the string
            // excluding the prefix
            account.tenantId = accountSplit.slice(1).join('-');

            return account;
        } else if (_.has(data, 'billingAccount')) {
            account = data.billingAccount;
            // has parentAccountNumber key
            account.isSubsidiary = _.has(account, 'parentAccountNumber');
            // has parentAccountNumber key
            account.isPrimary = !account.isSubsidiary;

            if (account.isPrimary) {
                // has "childBillingAccounts" rel link
                account.hasSubsidiary = _.some(account.link, { 'rel': 'childBillingAccounts' });
            }
            return account;
        } else {
            // return the full data error object
            return data;
        }
    };
    return {
        get: TransformUtil.responseChain(get)
    };
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingAccountService
 * @description
 * Service for actions pertaining to customer account
 *
 * @requires encore.svcs.account.AccountUtil
 * @requires encore.svcs.billing.BillingAccountResource
 */
.factory('BillingAccountService', ["AccountUtil", "BillingAccountResource", function (
    AccountUtil,
    BillingAccountResource
) {
    /**
     * @ngdoc method
     * @name BillingAccountService#get
     * @methodOf encore.svcs.billing.BillingAccountService
     * @param {string} accountNumber account number with no prefix
     * @param {string} accountType account type [cloud | dedicated | managed_hosting]
     * @description
     * Given an account number with no prefix, searches for account number
     * and returns the full account number with the appropriate prefix. If
     * the API returns a 404, then it checks the account number to determine
     * the appropriate prefix (greater than 10,000,000 will return 021, otherwise
     * return 020)
     * @example
     * <pre>
     * BillingAccountService.get('cloud', '12345');
     * </pre>
     * *returns a promise containing account information*
     * <pre>
     * {
     *   $resolved: true,
     *   accountNumber: '020-12345',
     *   accountType: 'CLOUD'
     *   prefix: '020',
     *   tenantId: '12345',
     *   name: 'Sir Hub Cap'
     * }
     * </pre>
     * @returns {Object} a promise containing the accountNumber with the prefix prepended
     */
    var get = function (accountType, accountNumber) {
        var acctType = accountType.toUpperCase() === 'MANAGED_HOSTING' ? 'DEDICATED' : accountType;
        return BillingAccountResource.get({
            searchRef: acctType + ':' + String(accountNumber)
        }).$promise.catch(function () {
            // API failed, so manually resolve the prefix based upon the acct number
            // TODO: remove this and handle error properly once the API endpoint goes live
            var prefix = AccountUtil.getCloudBillingPrefix(accountNumber);
            var account = {
                accountNumber: prefix + '-' + accountNumber,
                accountType: acctType,
                prefix: prefix,
                tenantId: accountNumber
            };
            return account;
        });
    };

    return {
        get: get
    };
}]);

angular.module('encore.svcs.billing')
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingCollectionInfoRoute
     * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
     * @description
     * Combines the base URL with the specific BillingCollectionInfoRoute URL
     * @returns {string} Full URL for BillingCollectionInfoRoute
     */
    .factory('BillingCollectionInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/collectionInfo';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingCollectionInfoResource
     * @description
     * A service for getting collection info.
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingCollectionInfoRoute
     * @returns {object} an angular resource
     */
    .factory('BillingCollectionInfoResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "BillingCollectionInfoRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        BillingCollectionInfoRoute
    ) {
        var collectionInfoPluck = Pluck('collectionInfo', 'error');

        return $resource(BillingCollectionInfoRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name BillingCollectionInfoResource#get
                 * @methodOf encore.svcs.billing.BillingCollectionInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing collection info using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     BillingCollectionInfoResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Success Response object below:
                 * {@link encore.svcs.billing.BillingCollectionInfoResource#methods_get
                 *        BillingCollectionInfoResource.get}*
                 *
                 * <pre>
                 * {
                 *     'agentInfo': {
                 *         'agentName': 'John Dilbert'
                 *     }
                 *     'profileInfo': {
                 *         'profileName': 'GOLD',
                 *         'currentCollectionProfileName': 'DIAMOND'
                 *     },
                 *     'link': [{
                 *         'rel': 'notes',
                 *         'href': 'http://billing.api.rackspacecloud.com/v2/020-123456/collectionInfo/notes'
                 *     }],
                 *     'collectionStatus': 'DELINQUENT_LEVEL_1'
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/
                 *     GET_getCollectionInfo_v2_accounts__ran__collectionInfo_Collection_Information\
                 *     _API_Client_Operations.html
                 * Collection Info}.
                 *
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, collectionInfoPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingCollectionNotesRoute
     * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
     * @description
     * Combines the base URL with the specific BillingCollectionNotesRoute URL
     * @returns {string} Full URL for BillingCollectionNotesRoute
     */
    .factory('BillingCollectionNotesRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/collectionInfo/notes';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingCollectionNotesResource
     * @description
     * A service for getting collection notes.
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingCollectionNotesRoute
     * @returns {object} an angular resource
     */
    .factory('BillingCollectionNotesResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "BillingCollectionNotesRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        BillingCollectionNotesRoute
    ) {
        var notesPluck = Pluck('notes', 'error');

        return $resource(BillingCollectionNotesRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name BillingCollectionNotesResource#get
                 * @methodOf encore.svcs.billing.BillingCollectionNotesResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing collection notes using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     BillingCollectionNotesResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Success Response object below:
                 * {@link encore.svcs.billing.BillingCollectionNotesResource#methods_get
                 *        BillingCollectionNotesResource.get}*
                 *
                 * <pre>
                 * {
                 *     'total': 100,
                 *     'link': [
                 *         {
                 *         'rel': 'prev',
                 *         'href': 'http://billing.api.rackspacecloud.com/v2/accounts/AS0001/collectionInfo/
                 *                  notes?marker=4&limit=2'
                 *         },
                 *         {
                 *         'rel': 'next',
                 *         'href': 'http://billing.api.rackspacecloud.com/v2/accounts/AS0001/collectionInfo/
                 *                  notes?marker=5&limit=2'
                 *         }
                 *     ],
                 *     'note': [
                 *         {
                 *         'creationDate': '2013-05-20T16:32:52.000-05:00',
                 *         'note': 'User called on 05/20 and placed a request to consider for a startup
                 *                  discount on account',
                 *         'creator': 'Tim Bill'
                 *         },
                 *         {
                 *         'creationDate': '2013-05-21T16:32:52.000-05:00',
                 *         'note': 'User was called on 05/21 that a discount was applied on account',
                 *         'creator': 'System'
                 *         }
                 *     ]
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/
                 *     GET_getCollectionNotes_v2_accounts__ran__collectionInfo_notes_Collection_Information\
                 *     _API_Client_Operations.html
                 * Collection Notes}.
                 *
                 */
                getPaginated: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, notesPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingEstimatedChargesRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific BillingEstimatedChargesRoute URL
 * @returns {string} Full URL for BillingEstimatedChargesRoute
 */
    .factory('BillingEstimatedChargesRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/billing-periods/:periodId/estimated_charges';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingEstimatedChargesResource
     * @description
     * A Service for getting Billing Estimated Charges Info.
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingEstimatedChargesRoute
     * @returns {object} an angular resource
     */
    .factory('BillingEstimatedChargesResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "BillingEstimatedChargesRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        BillingEstimatedChargesRoute
    ) {
        // TODO check
        var estimatedChargesPluck = Pluck('estimatedCharges.estimatedCharge', 'error');
        return $resource(BillingEstimatedChargesRoute,
            {
                accountNumber: '@accountNumber',
                periodId: '@periodId'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name BillingEstimatedChargesResource#list
                 * @methodOf encore.svcs.billing.BillingEstimatedChargesResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @param {number} params.periodId Period Id
                 * @description
                 * Returns an object containing Billing Estimated Charges Info using an HTTP GET request
                 * @example
                 * <pre>
                 *     BillingEstimatedChargesResource.list({ accountNumber: 1234, periodId: 4567 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingEstimatedChargesResource#methods_list BillingEstimatedChargesResource.list}*
                 *
                 * <pre>
                 * {
                 *     "estimatedCharges": {
                 *         "estimatedCharge": [
                 *             {
                 *                 "offeringCode": "CSITES",
                 *                 "rate": "150.00",
                 *                 "quantity": "1.00",
                 *                 "amount": "150.00",
                 *                 "unitOfMeasure": "COUNT",
                 *                 "chargeType": "SITES_SUBSCRIPTION"
                 *             }
                 *         ],
                 *         "link": [
                 *           {
                 *               "rel": "self",
                 *               "href": `"https://staging.billingv2.api.rackspacecloud.com/v2/accounts/020-323676/
                 *                         billing-periods/5e81bfc6-81bf-4c68-9446-54927581bfc6/
                 *                         estimated_charges?marker=0&limit=25"`
                 *           },
                 *           {
                 *               "rel": "last",
                 *               "href": `"https://staging.billingv2.api.rackspacecloud.com/v2/accounts/020-323676/
                 *                         billing-periods/5e81bfc6-81bf-4c68-9446-54927581bfc6/
                 *                         estimated_charges?marker=0&limit=25"`
                 *           },
                 *           {
                 *               "rel": "first",
                 *               "href": `"https://staging.billingv2.api.rackspacecloud.com/v2/accounts/020-323676/
                 *                         billing-periods/5e81bfc6-81bf-4c68-9446-54927581bfc6/
                 *                         estimated_charges?marker=0&limit=25"`
                 *           }
                 *         ]
                 *     }
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     `https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/
                 *          GET_getBillingPeriods_v2_accounts__ran__billing-periods_Estimated_Charges_
                 *          API_Client_Operations.html`
                 * BillInfo Contract}.
                 */
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, estimatedChargesPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingPaymentInfoRoute
     * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
     * @description
     * Combines the base URL with the specific BillingPaymentInfoRoute URL
     * @returns {string} Full URL for BillingPaymentInfoRoute
     */
    .factory('BillingPaymentInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/paymentInfo';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingPaymentInfoResource
     * @description
     * A Service for getting Billing Payment Info
     *
     * @requires $resource
     * @requires encore.svcs.billing.BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingPaymentInfoRoute
     * @returns {object} an angular resource
     */
    .factory('BillingPaymentInfoResource', ["$resource", "BillingPaymentInfoRoute", "BillingUtil", "Pluck", "TransformUtil", function (
        $resource,
        BillingPaymentInfoRoute,
        BillingUtil,
        Pluck,
        TransformUtil
    ) {
        var paymentInfoPluck = Pluck('paymentInfo', 'error');
        return $resource(BillingPaymentInfoRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /**
                 * @ngdoc method
                 * @name BillingPaymentInfoResource#get
                 * @methodOf encore.svcs.billing.BillingPaymentInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account Number (Billing RAN)
                 * @description
                 *     Returns an object containing Billing Payment Info using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     BillingPaymentInfoResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingPaymentInfoResource#methods_get BillingPaymentInfoResource.get}*
                 *
                 * <pre>
                 * {
                 *     "paymentType": "INVOICE",
                 *     "paymentTerms": "NET_0",
                 *     "notificationOption": "OPT_OUT",
                 *     "paymentTermsType": "NEGOTIATED"
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_\
                 *     getPaymentInfo_v2_\accounts__ran__paymentInfo_Payment_Information_API_Client_Operations.html
                 * BillInfo Contract}.
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, paymentInfoPluck
                    ])
                },
                /**
                 * @ngdoc method
                 * @name BillingPaymentInfoResource#update
                 * @methodOf encore.svcs.billing.BillingPaymentInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account Number (Billing RAN)
                 * @param {object} payload Payload for Payment Info Request
                 * @description
                 * Updates an entry within the BillPaymentInfoResource object using an HTTP PUT operation
                 * Omit paymentTerms attribute and value when sending HTTP PUT request
                 * @static
                 * @example
                 * <pre>
                 *     var updateData = {
                 *         "initiatedBy": "Racker user login name",
                 *         "paymentTermsType": "Default",
                 *         "paymentType": "INVOICE",
                 *         "paymentTerms": "NET_30"
                 *     }
                 *
                 *     BillingPaymentInfoResource.update({ accountNumber: 1234 }, updateData);
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingPaymentInfoResource#methods_update\
                 *        BillingPaymentInfoResource.update}*
                 *
                 * <pre>
                 * {
                 *     "initiatedBy": "Racker user login name",
                 *     "paymentTermsType": "Default",
                 *     "paymentType": "INVOICE",
                 *     "paymentTerms": "NET_30"
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_\
                 *     updatePaymentInfo\_v2_accounts__ran__paymentInfo_Payment_Information_API_Client_Operations.html
                 * BillInfo Contract}.
                 */
                update: {
                    method: 'PUT',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, paymentInfoPluck
                    ]),
                    transformRequest: TransformUtil.requestChain(function (data) {
                        return {
                            paymentInfo: _.omit(data, 'paymentTerms')
                        };
                    })
                },
                /**
                 * @ngdoc method
                 * @name BillingPaymentInfoResource#updatePaymentTerms
                 * @methodOf encore.svcs.billing.BillingPaymentInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account Number (Billing RAN)
                 * @param {object} payload Payload for Payment Info Request
                 * @description
                 *     Updates an entry within the BillPaymentInfoResource object using an HTTP PUT operation
                 * @static
                 * @example
                 * <pre>
                 *     var updateData = {
                 *         "initiatedBy": "Racker user login name",
                 *         "paymentTermsType": "Default",
                 *         "paymentType": "INVOICE",
                 *         "paymentTerms": "NET_30"
                 *     }
                 *
                 *     BillingPaymentInfoResource.updatePaymentTerms({ accountNumber: 1234 }, updateData);
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingPaymentInfoResource#methods_updatePaymentTerms\
                 *        BillingPaymentInfoResource.updatePaymentTerms}*
                 *
                 * <pre>
                 * {
                 *     "initiatedBy": "Racker user login name",
                 *     "paymentTermsType": "Default",
                 *     "paymentType": "INVOICE",
                 *     "paymentTerms": "NET_30"
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 *     https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_\
                 *     updatePaymentInfo\_v2_accounts__ran__paymentInfo_Payment_Information_API_Client_Operations.html
                 * BillInfo Contract}.
                 */
                updatePaymentTerms: {
                    method: 'PUT',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, paymentInfoPluck
                    ]),
                    transformRequest: TransformUtil.requestChain(function (data) {
                        return {
                            paymentInfo: _.pick(data, 'paymentTerms')
                        };
                    })
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingPeriodRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific BillingPeriodRoute URL
 * @returns {string} Full URL for BillingPeriodRoute
 */
    .factory('BillingPeriodRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/billing-periods';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingPeriodResource
     * @description
     * A Service for getting Billing Period Info.
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingPeriodRoute
     * @returns {object} an angular resource
     */
    .factory('BillingPeriodResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "BillingPeriodRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        BillingPeriodRoute
    ) {
        var billingPeriodPluck = Pluck('billingPeriods.billingPeriod', 'error');
        return $resource(BillingPeriodRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name BillingPeriodResource#getAll
                 * @methodOf encore.svcs.billing.BillingPeriodResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing Billing Period values using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     BillingPeriodResource.getAll({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingPeriodResource#methods_getAll PeriodResource.list}*
                 *
                 * <pre>
                 *     [
                 *         {
                 *             'id': '5e81bfc6-81bf-4c68-9446-54927581bfc6',
                 *             'startDate': '2016-05-31',
                 *             'endDate': '2016-07-30',
                 *             'current': 'true'
                 *         },
                 *         {
                 *             'id': '5e81bfc6-81bf-4c68-9446-54927581bfc6',
                 *             'startDate': '2016-05-31',
                 *             'endDate': '2016-06-29',
                 *             'current': 'false'
                 *         },
                 *         {
                 *             'id': '5e81bfc6-81bf-4c64-9e94-707d6581bfc6',
                 *             'startDate': '2016-04-30',
                 *             'endDate': '2016-05-30',
                 *             'current': 'false'
                 *         }
                 *     ]
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBillingPeriods_v2_accounts__ran__billing-periods_Estimated_Charges_API_Client_Operations.html
                 * BillInfo Contract}.
                 */
                getAll: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, billingPeriodPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingSupportInfoRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific BillingSupportInfoRoute URL
 * @returns {string} Full URL for BillingSupportInfoRoute
 */
    .factory('BillingSupportInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/supportInfo';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.BillingSupportInfoResource
     * @description
     * A Service for getting Billing Support Info
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.BillingSupportInfoRoute
     * @returns {object} an angular resource
     */
    .factory('BillingSupportInfoResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "BillingSupportInfoRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        BillingSupportInfoRoute
    ) {
        var supportInfoPluck = Pluck('supportInfo', 'error');
        return $resource(BillingSupportInfoRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name BillingSupportInfoResource#get
                 * @methodOf encore.svcs.billing.BillingSupportInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing Billing Support Info using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     BillingSupportInfoResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.BillingSupportInfoResource#methods_get BillingSupportInfoResource.get}*
                 *
                 * <pre>
                 * {
                 *     'revenueTeamNumber': '779',
                 *     'serviceLevel': 'INFRASRUCTURE',
                 *     'serviceType': 'LEGACY',
                 *     'businessUnit': '5100'
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getSupportInfo_v2_accounts__ran__supportInfo_Support_Information_API_Client_Operations.html
                 * BillInfo Contract}.
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, supportInfoPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.BillingTransactionRoute
 * @requires encore.svcs.billing.config.constant.BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific Transaction Route URL
 * @returns {string} Full URL for Transaction Route
 */
.factory('BillingTransactionRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/:transactionType/:transactionNumber/:action';
}])
/**
* @ngdoc service
* @name encore.svcs.billing.BillingTransactionResource
* @description
* Service for interaction with transactions resources from BSLv2 API
*
* @requires $resource
* @requires encore.svcs.billing.BillingTransactionRoute
* @requires encore.svcs.billing:StringToNumericTransform
* @requires encore.util.transform.Pluck
*/
.factory('BillingTransactionResource', ["$resource", "BillingTransactionRoute", "StringToNumericTransform", "Pluck", function (
    $resource,
    BillingTransactionRoute,
    StringToNumericTransform,
    Pluck
) {
    var transaction = $resource(
        BillingTransactionRoute,
        {
            accountNumber: '@accountNumber'
        },
        {
            /**
             * @ngdoc method
             * @name BillingTransactionResource#getAll
             * @methodOf encore.svcs.billing.BillingTransactionResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing an array of Transaction items with injected numeric amounts
             * transformed from string type amounts
             * @static
             * @example
             * <pre>
             * BillingTransactionResource.getAll({ accountNumber: 1234 });
             * </pre>
             *
             * * Response object below:
             * {@link encore.svcs.billing.BillingTransactionResource
             *
             * <pre>
             * [
             *     {
             *         "amount": "10.00",
             *         "transformedAmount": 10.00,
             *         "date": "2016-08-31T00:00:00Z",
             *         "id": "7d81bfc6-91bf-4c65-a769-75d2e581bfc6",
             *         "status": "CLOSED",
             *         "transRefNum": "B1-15963490",
             *         "type": "INVOICE",
             *         "link": [{ "rel": "self", "href": "https://billingv2.api.rack..." }]
             *     }, {
             *         ...
             *     }
             * ]
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getBillingSummary_v2_accounts__ran__billing-summary_BSL_Billing_Operations.html
             * Billing Summary Contract}.
             */
            getAll: {
                method: 'GET',
                isArray: true,
                transformResponse: [
                    Pluck('billingSummary.item'),
                    StringToNumericTransform([
                        { path: 'amount', arrayPath: '' }
                    ])
                ],
                params: {
                    transactionType: 'billing-summary',
                    limit: 200
                }
            },

            /**
             * @ngdoc method
             * @name BillingTransactionResource#get
             * @methodOf encore.svcs.billing.BillingTransactionResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {string} params.transactionType Type type of transaction
             * @param {string} params.transactionNumber Number transaction id
             *
             * @description
             * Returns a single transaction object of a specific type and id
             * @static
             * @example
             * <pre>
             * BillingTransactionResource.get({
             *     accountNumber: 1234,
             *     transactionType: "adjustments",
             *     transactionNumber: "0d81bfc6-91bf-4c66-a66f-9ed2e581bfc6"
             * });
             * </pre>
             *
             * * Response object below:
             * {@link encore.svcs.billing.BillingTransactionResource
             *
             * Note: Responses vary significatly depending on Transaction Type
             * <pre>
             * {
             *    "adjustment": {
             *        "amount": "-223.96",
             *        "comments": "[HMDB Debook] adjustment - credit",
             *        "id": "e195aa88-f269-11e3-b6c4-ec1a593d41bf",
             *        "rackerSSO": "root.0.0.0.1",
             *        "reasonCode": "HMDB Debook",
             *        "status": "OPEN",
             *        "tranDate": "2014-10-02T12:30:32Z",
             *        "tranRefNum": "A1-64139999",
             *        "type": "CREDIT",
             *        "transformedAmount": -223.96
             *    }
             * }
             * </pre>
             *
             * For the full API documentation see the link below. Example contract link is for an {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getAdjustment_v2_accounts__ran__adjustments__adjustmentId__BSL_Billing_Operations.html
             * Adjustment Contract}.
             */
            get: {
                method: 'GET',
                transformResponse: [
                    StringToNumericTransform([
                        { path: 'adjustment.amount' },
                        { path: 'amountApplied', arrayPath: 'adjustment.itemReferences.itemReference' },
                        { path: 'amountApplied', arrayPath: 'payment.itemReferences.itemReference' },
                        { path: 'amountApplied', arrayPath: 'refund.itemReferences.itemReference' },
                        { path: 'amountApplied', arrayPath: 'reversal.itemReferences.itemReference' },
                        { path: 'amountApplied', arrayPath: 'writeoff.itemReferences.itemReference' },
                        { path: 'invoice.discountTotal' },
                        { path: 'invoice.invoiceSubTotal' },
                        { path: 'invoice.invoiceTotal' },
                        { path: 'invoice.taxTotal' },
                        { path: 'itemAmount', arrayPath: 'invoice.invoiceItem' },
                        { path: 'payment.amount' },
                        { path: 'refund.amount' },
                        { path: 'reversal.amount' },
                        { path: 'writeoff.amount' }
                    ])
                ]
            },

            /**
             * @ngdoc method
             * @name BillingTransactionResource#pdf
             * @methodOf encore.svcs.billing.BillingTransactionResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {string} params.transactionType Type type of transaction
             * @param {string} params.transactionNumber Number transaction id
             *
             * @description
             * Returns a pdf with details for a single transaction object of a specific type and id
             * @static
             * @example
             * <pre>
             * BillingTransactionResource.pdf({
             *     accountNumber: 1234,
             *     transactionType: "adjustments",
             *     transactionNumber: "0d81bfc6-91bf-4c66-a66f-9ed2e581bfc6"
             * });
             * </pre>
             *
             * Response is pdf containing details for that transaction
             */
            pdf: {
                method: 'GET',
                headers: {
                    accept: 'application/pdf'
                },
                responseType: 'arraybuffer',
                cache: true,
                transformResponse: function (data) {
                    var pdf;
                    if (data) {
                        pdf = new Blob([data], { type: 'application/pdf' });
                    }
                    return {
                        response: pdf
                    };
                }
            },

            /**
             * @ngdoc method
             * @name BillingTransactionResource#csv
             * @methodOf encore.svcs.billing.BillingTransactionResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {string} params.transactionType Type type of transaction
             * @param {string} params.transactionNumber Number transaction id
             *
             * @description
             * Returns a csv file with details for a single transaction object of a specific type and id
             * @static
             * @example
             * <pre>
             * BillingTransactionResource.csv({
             *     accountNumber: 1234,
             *     transactionType: "adjustments",
             *     transactionNumber: "0d81bfc6-91bf-4c66-a66f-9ed2e581bfc6"
             * });
             * </pre>
             *
             * Response is csv containing details for that transaction
             */
            csv: {
                method: 'GET',
                params: {
                    action: 'detail'
                },
                headers: {
                    accept: 'text/csv'
                },
                cache: true,
                transformResponse: function (data) {
                    var csv;
                    if (data) {
                        csv = new Blob([data], { type: 'text/csv' });
                    }
                    return {
                        response: csv
                    };
                }
            },

            /**
             * @ngdoc method
             * @name BillingTransactionResource#search
             * @methodOf encore.svcs.billing.BillingTransactionResource
             * @param {object} params Parameters object
             * @param {string} params.searchRef SerachRef search string
             *
             * @description
             * Search for accounts by a keyword
             * @static
             * @example
             * <pre>
             * BillingTransactionResource.search({ searchRef: "123" });
             * </pre>
             *
             * * Response object below:
             * <pre>
             * [
             *     {
             *        "accountNumber": "020-123456",
             *        "name": "Test Account 1"
             *     }, {
             *        "accountNumber": "020-456789",
             *        "name": "Test Account 123"
             *     }, {
             *        "accountNumber": "020-789123",
             *        "name": "Test Account 3"
             *     },
             * ]
             * </pre>
             */
            search: {
                method: 'GET',
                isArray: true,
                url: '/api/billing',
                params: { prefix: null },
                transformResponse: Pluck('billingAccounts.billingAccount')
            }
        }
    );

    return transaction;
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc object
 * @name encore.svcs.billing.BillingUtil
 * @requires encore.svcs.billing.config.BSL_FAULT_TYPES
 * @description
 * Methods used for transforming error responses for user-friendly
 * responses
 */
.factory('BillingUtil', ["BSL_FAULT_TYPES", function (
    BSL_FAULT_TYPES
) {
    /**
     * @ngdoc method
     * @name encore.svcs.billing.BillingUtil#mapErrorResponse
     * @methodOf encore.svcs.billing.BillingUtil
     * @param {Object} response response from API
     * @description
     * Returns the error structure from an error response of the Billing API
     *
     * @returns {Object} error formatted error response
     * @example
     * <pre>
     * {
     *   data: {
     *     notFound: {
     *       message: 'Resource not found'
     *     }
     *   },
     *   status: 404,
     *   statusText: 'Not Found'
     * }
     * </pre>
     */
    var mapErrorResponse = function (response) {
        var error = response.data || {};
        var keys = _.keys(error);
        var errorKey = _.head(keys);

        error = _.extend({
            type: 'error',
            msg: '',
            msgDetails: ''
        }, error[errorKey]);

        // Save the key as error type
        error.type = errorKey;
        error.status = response.status;

        if (error.status === 404) {
            error.msg = 'Permission Denied';
            error.type = 'permissionDenied';
        } else if (!_.isEmpty(error.message) && _.isEmpty(error.details)) {
            // Grab the error message from the API return data
            error.msg = error.message;
        } else if (error.status === 400 && !_.isEmpty(error.details)) {
            error.msg = _.head(error.details).message;
        }

        return error;
    };

    // transforms error returned from billing API into a standard format
    var transformError = function (data) {
        // set the base API Error and append messages to the string
        var errorMessage = 'API Error';
        if (data.details) {
            // loop through the details array and append each message onto
            // onto the string, separating them with a <br/>
            errorMessage += ': ' + data.details.map(function (detail) {
                return detail.message;
            }).join('<br/>');
        } else if (data.message) {
            // append the error message onto the string
            errorMessage += ': ' + data.message;
        }

        return {
            referenceCode: data.referenceCode,
            message: errorMessage
        };
    };

    /**
     * @ngdoc method
     * @name encore.svcs.billing.BillingUtil#normalizeBslErrors
     * @methodOf encore.svcs.billing.BillingUtil
     * @param {Object} response response from API
     * @description
     * If response includes a root key which is in the set of BSL fault types,
     * return a tranformed response with a root key 'error', and original key
     * as a 'fault' property merged with the rest of the payload. Otherwise,
     * passthrough the response.
     *
     * @returns {Object} error normalized error response
     * @example
     * <pre>
     * Original Response:
     * {
     *   methodNotAllowed: {
     *      referenceCode: 'abc123',
     *      details: [
     *          {
     *              message: 'Resource not found'
     *          }
     *      ]
     *   }
     * }
     * </pre>
     *
     * Transformed Response:
     * <pre>
     * {
     *   error: {
     *      fault: 'methodNotAllowed'.
     *      referenceCode: 'abc123',
     *      message: 'API Error: Resource not found'
     *   }
     * }
     * </pre>
     */
    var normalizeBslErrors = function (response) {
        // does response contain a key which is a BSL fault type?
        var faultKey = _.intersection(_.keys(response), BSL_FAULT_TYPES)[0];

        if (faultKey) {
            // create a normalized error response including the fault type as a property
            var error = _.assign({ fault: faultKey }, transformError(response[faultKey]));

            // else an error occurred in request
            return {
                error: error
            };
        }

        return response;
    };

    return {
        normalizeBslErrors: normalizeBslErrors,
        mapErrorResponse: mapErrorResponse
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.billing.config
 *
 * @description
 * Collection of configuration values for interacting with billing.
 */
angular.module('encore.svcs.billing.config', [])
/**
 * @ngdoc property
 * @const BILLING_BASE_URL
 * @name encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Constant for the base path of all billing calls
 * @returns {string} '/api/billing/'
 */
.constant('BILLING_BASE_URL', '/api/billing');

angular.module('encore.svcs.billing.config')
/**
 * @ngdoc object
 * @name encore.svcs.billing.config.BSL_FAULT_TYPES
 * @description
 * An array of all valid BSL fault type keys. BSL error objects will come in
 * payloads wrapped in one of these keys
 * For more info, see:
 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/faults.html
 */
.constant('BSL_FAULT_TYPES', [
    'badRequest',
    'forbidden',
    'internalServerError',
    'methodNotAllowed',
    'notFound',
    'serviceFault',
    'serviceUnavailable',
    'unauthorized'
]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.ContractEntityRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific ContractEntityRoute URL
 * @returns {string} Full URL for ContractEntityRoute
 */
    .factory('ContractEntityRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/contractEntity';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.ContractEntityResource
     * @description
     * A service for getting contract entity.
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.ContractEntityRoute
     * @returns {object} an angular resource
     */
    .factory('ContractEntityResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "ContractEntityRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        ContractEntityRoute
    ) {
        var contractEntityPluck = Pluck('contractEntity', 'error');
        var contractEntity = $resource(ContractEntityRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name ContractEntityResource#get
                 * @methodOf encore.svcs.billing.ContractEntityResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing contract entity value using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     ContractEntityResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Success Response object below:
                 * {@link encore.svcs.billing.ContractEntityResource#methods_get ContractEntityResource.get}*
                 *
                 * <pre>
                 * {
                 *     'code': 'CONTRACT_US',
                 *     'description': 'Rackspace US contract entity'
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getContractEntity_v2_accounts__ran__contractEntity_BSL_Utility_Operations.html
                 * Contract Entity}.
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, contractEntityPluck
                    ])
                }
            }
        );
        return contractEntity;
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.DiscountRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific discounts URL
 * @returns {string} Full URL for Discounts
 */
.factory('DiscountRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/discounts/:discountNumber/:action';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.DiscountResource
 * @description
 * Service for retrieving discounts
 *
 * @requires $resource
 * @requires encore.svcs.billing.DiscountTransform
 * @requires encore.svcs.billing.DiscountRoute
 * @returns {object} an angular resource
 */
.factory('DiscountResource', ["$resource", "DiscountTransform", "DiscountRoute", function (
    $resource,
    DiscountTransform,
    DiscountRoute
) {
    return $resource(DiscountRoute, {
        accountNumber: '@accountNumber',
        discountNumber: '@id',
        action: '@action'
    }, {
        /* jshint maxlen: 180 */
        /**
         * @ngdoc method
         * @name DiscountResource#list
         * @methodOf encore.svcs.billing.DiscountResource
         * @param {object} params Parameters object
         * @param {string} [params.prefix=020] Prefix of the account
         * @param {number} params.discountNumber Discount number
         * @param {number} params.accountNumber Account number
         * @description
         * Returns a list of discount objects from an HTTP GET request
         *
         * @example
         * <pre>
         * DiscountResource.list({ accountNumber: 1234 });
         * </pre>
         *
         * *returns a list of discounts that has been transformed using
         * {@link encore.svcs.billing.DiscountTransform#methods_list DiscountTransform.list}*
         *
         *
         * <pre>
         * [
         *   {
         *     'type': 'rackerDiscount',
         *     'id': '10001',
         *     'createdBy': 'example.racker',
         *     'status': 'ACTIVE',
         *     'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
         *     'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
         *   },
         *   {
         *     'type': 'rackerDiscount',
         *     'id': '10001',
         *     'createdBy': 'example.racker',
         *     'status': 'ACTIVE',
         *     'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
         *     'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
         *   }
         * ]
         * </pre>
         *
         * for full API response details see
         * {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getDiscounts_v2_accounts__ran__discounts_BSL_Discount_Operations.html
         * Discounts Contract}
         */
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: DiscountTransform.list
        },
        /**
         * @ngdoc method
         * @name DiscountResource#get
         * @methodOf encore.svcs.billing.DiscountResource
         * @param {object} params Parameters object
         * @param {string} [params.prefix=020] Prefix of the account
         * @param {number} params.discountNumber Discount number
         * @param {number} params.accountNumber Account number
         * @description
         * Returns a single instance of a discount object from an HTTP GET request
         * @example
         * <pre>
         * DiscountResource.get({ accountNumber: 1234, discountNumber: 5678 });
         * </pre>
         *
         * *returns a single instance of a discount after transforming the data using
         * {@link encore.svcs.billing.DiscountTransform#methods_single DiscountTransform.single}*
         *
         * <pre>
         * {
         *   'type': 'rackerDiscount',
         *   'id': '10001',
         *   'createdBy': 'example.racker',
         *   'status': 'ACTIVE',
         *   'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
         *   'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
         * }
         * </pre>
         *
         * for full API documentation see {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getDiscount_v2_accounts__ran__discounts__discountId__BSL_Discount_Operations.html
         * Discount Contract}
         */
        get: {
            method: 'GET',
            isArray: false,
            transformResponse: DiscountTransform.single
        },
        /**
         * @ngdoc method
         * @name DiscountResource#post
         * @methodOf encore.svcs.billing.DiscountResource
         * @param {object} params Parameters object
         * @param {string} [params.prefix=020] Prefix of the account
         * @param {number} params.accountNumber Account number
         * @param {object} postBody Post Body with key of the discount type in camelcase
         * @param {object} postBody.enrollmentDate object with key 'enrollmentDate' and value
         * being the date in which you are enrolling the discount
         * @description
         * Creates a single instance of a discount object
         * @example
         * <pre>
         * DiscountResource.post(
         *  {
         *      accountNumber: 1234
         *  },
         *  {
         *      rackerDiscount: {
         *          enrollmentDate: '2002-05-30T04:30:10.000-05:00'
         *      }
         *  }
         * );
         * </pre>
         *
         * *returns a single instance of a discount after transforming the data using
         * {@link encore.svcs.billing.DiscountTransform#methods_single DiscountTransform.single}*
         *
         * <pre>
         * {
         *   'type': 'rackerDiscount',
         *   'id': '10001',
         *   'createdBy': 'example.racker',
         *   'status': 'ACTIVE',
         *   'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
         *   'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
         * }
         * </pre>
         *
         * for full API documentation see {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/POST_createDiscount_v2_accounts__ran__discounts_BSL_Discount_Operations.html
         * Discount Contract}
         */
        post: {
            method: 'POST',
            isArray: false,
            transformResponse: DiscountTransform.single
        },
        /**
         * @ngdoc method
         * @name DiscountResource#cancel
         * @methodOf encore.svcs.billing.DiscountResource
         * @param {object} params Parameters object
         * @param {string} [params.prefix=020] Prefix of the account
         * @param {number} params.accountNumber Account number
         * @param {number} [params.action='discountCancellation'] Denotes that we are doing a discount cancellation
         * @param {number} params.discountNumber The discount ID
         * @param {object} postBody Post Body with key of the discount type in camelcase
         * @param {object} discountCancellation Parent object for the cancel payload
         * @param {string} postBody.discountCancellation.cancellationReason the reason why we are cancelling the discount
         * @param {boolean} postBody.discountCancellation.retainSites flag to determine if cloud sites subscription is also canceled
         * @param {number} postBody.discountCancellation.cancellationCharge the dollar amount the discount removes from a customer's bill
         * @description
         * Cancels a single discount. If the customer has cloud sites, the API will set cloud sites into
         * a 'cancel_initiated' state.  It will remain there until the Billing Date of Month (BDOM)
         * @example
         * <pre>
         * DiscountResource.cancel(
         *  {
         *      accountNumber: 1234,
         *      action: 'discountCancellation',
         *      discountNumber: 76879808976846
         *  },
         *  {
         *      discountCancellation: {
         *          cancellationReason: 'I don\'t want free stuff anymore',
         *          retainSites: true,
         *          cancellationCharge: 0.00
         *     }
         *  }
         * );
         * </pre>
         *
         * *returns a single instance of a canceled discount after transforming the data using
         * {@link encore.svcs.billing.DiscountTransform#methods_single DiscountTransform.single}*
         *
         * <pre>
         * {
         *     "cancellationDate": "2002-05-30T04:30:10.000-05:00",
         *     "cancelledBy": "yogi.racker",
         *     "cancellationReason": "I don't want free stuff anymore",
         *     "link": [{
         *         "rel": "via",
         *         "href": "http://billing.api.rackspacecloud.com/v2/discount/ASDF1113"
         *     }],
         *     "retainSites": true,
         *     "cancellationCharge": "0.00"
         * }
         * </pre>
         *
         * for full API documentation see {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_cancelDiscount_v2_accounts__ran__discounts__discountId__discountCancellation_BSL_Discount_Operations.html
         * Cancel Discount Contract}
         */
        cancel: {
            method: 'PUT',
            params: {
                action: 'discountCancellation'
            },
            transformResponse: DiscountTransform.single
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.DiscountTransform
 * @requires encore.util.http.TransformUtil
 * @requires encore.util.string.stringUtil
 * @description
 * Returns an object containing any transformation functionality
 * for HTTP response data
 * @returns {object} Transform functions for the Discount Resource
 */
.factory('DiscountTransform', ["TransformUtil", "StringUtil", function (
    TransformUtil,
    StringUtil
) {
    /**
     * @ngdoc method
     * @name DiscountTransform#list
     * @methodOf encore.svcs.billing.DiscountTransform
     * @param {object} data A single object that represents a list of discount objects
     * @param {object} data.discounts An object that wraps around a child object
     * @param {array} data.discounts.discount A list of discount objects
     * @description
     * Transforms a list of discount objects to be more usable
     * in the view layer
     * @returns {array} a list of transformed discounts
     * @example
     * <pre>
     * { 'discounts':
     *      { 'discount' : [{
     *          'rackerDiscount': {
     *              'id': '10001',
     *              'createdBy': 'example.racker',
     *              'status': 'ACTIVE',
     *              'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *              'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     *          }
     *          }, {
     *          'rackerDiscount': {
     *              'id': '10001',
     *              'createdBy': 'example.racker',
     *              'status': 'ACTIVE',
     *              'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *              'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     *          }}]
     *     }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * [
     *   {
     *     'type': 'rackerDiscount',
     *     'id': '10001',
     *     'createdBy': 'example.racker',
     *     'status': 'ACTIVE',
     *     'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *     'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     *   },
     *   {
     *     'type': 'rackerDiscount',
     *     'id': '10001',
     *     'createdBy': 'example.racker',
     *     'status': 'ACTIVE',
     *     'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *     'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     *   }
     * ]
     * </pre>
     */
    var flattenDiscount = function (discount) {
        var results;
        _.each(discount, function (item, key) {
            item.type = StringUtil.startCase(key);
            // replace the underscore with a space in the status
            item.status = item.status.split('_').join(' ');
            results = item;
        });
        return results;
    };
    var discountPluck = TransformUtil.pluckList('discounts.discount');
    var discountMapper = TransformUtil.mapList(flattenDiscount);

    /**
     * @ngdoc method
     * @name DiscountTransform#single
     * @methodOf encore.svcs.billing.DiscountTransform
     * @description transforms the format of the Discount API response
     * @param {object} data data object to be converted
     * @returns {object} a single transformed discount
     * @example:
     * <pre>
     * {
     *   'rackerDiscount': {
     *     'id': '10001',
     *     'createdBy': 'example.racker',
     *     'status': 'ACTIVE',
     *     'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *     'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     *   }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * {
     *   'type': 'Racker Discount',
     *   'id': '10001',
     *   'createdBy': 'example.racker',
     *   'status': 'ACTIVE',
     *   'effectiveStartDate': '2013-05-15T04:30:10.000-05:00',
     *   'enrollmentDate': '2002-05-30T04:30:10.000-05:00'
     * }
     * </pre>
     */
    var single = function (data) {
        // The API returns an object that is a single key-value pair.
        // The key is the discount type.  The value is the discount itself.
        var discountType = Object.keys(data)[0];
        var discount = data[discountType];

        discount.type = StringUtil.startCase(discountType);
        return discount;
    };

    return {
        list: TransformUtil.responseChain([discountPluck, discountMapper]),
        single: TransformUtil.responseChain(single)
    };
}]);

angular.module('encore.svcs.billing')
    /**
     * @ngdoc service
     * @name encore.svcs.billing.ExternalBillingSystemInfoRoute
     * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
     * @description
     * retrieves the base url for obtaining external billing system linkage information
     * @returns {string} Full URL for retrieving external billing system linkage information
     */
    .factory('ExternalBillingSystemInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/externalBillingSystemInfo';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.ExternalBillingSystemInfoResource
     * @description
     * Service for retrieving account external billing system information
     *
     * @requires $resource
     * @requires BillingUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.billing.ExternalBillingSystemInfoRoute
     * @returns {object} an angular resource
     */
    .factory('ExternalBillingSystemInfoResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "ExternalBillingSystemInfoRoute", function (
        $resource,
        BillingUtil,
        Pluck,
        TransformUtil,
        ExternalBillingSystemInfoRoute
    ) {
        var externalBillingSystemInfoPluck = Pluck('externalBillingSystemInfo', 'error');
        return $resource(ExternalBillingSystemInfoRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name ExternalBillingSystemInfoResource#get
                 * @methodOf encore.svcs.billing.ExternalBillingSystemInfoResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing External Billing System Info using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     ExternalBillingSystemInfoResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.ExternalBillingSystemInfoResource#methods_get
                 *   ExternalBillingSystemInfoResource.get}*
                 *
                 * <pre>
                 *     {
                 *         "externalBillingSystemName": "EBS",
                 *         "invoicedInExternalBillingSystem": false
                 *     }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getExternalBillingSystemInfo_v2_accounts__ran__externalBillingSystemInfo_External_Billing_API_Client_Operations.html
                 * External Billing System Info}.
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain([
                        BillingUtil.normalizeBslErrors, externalBillingSystemInfoPluck
                    ])
                }
            }
        );
    }]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.InvoiceDeliveryService
 * @description
 * A Service for updating Billing Info. Specifically, the: `invoiceDeliveryMethod`.
 * It uses the update method of `BillInfoResource`.
 *
 * @requires $resource
 * @returns {object} after updating an entry
 */
.factory('InvoiceDeliveryService', ["BillInfoResource", function (BillInfoResource) {
    /**
     * @ngdoc method
     * @name InvoiceDeliveryService#update
     * @methodOf encore.svcs.billing.InvoiceDeliveryService
     * @param {object} params Parameters object
     * @param {number} params.accountNumber Account number
     * @param {string} params.invoiceDeliveryMethod Entry to update
     * @description
     * Updates an entry of a BillInfoResource object using an HTTP PUT operation
     * @static
     * @example
     * <pre>
     * var oldObject = {
     *    'billInfo': {
     *        'invoiceDeliveryMethod': 'OTHER',
     *        'thresholdAmount': '500.00',
     *        'thresholdNotificationOption': 'OPT_IN',
     *        'invoiceEmailDeliveryOption': 'OPT_IN'
     *    }
     * }
     *
     * // Update the old object
     * InvoiceDeliveryService.update(12345, 'PAPERLESS');
     * </pre>
     *
     * *Response object below:
     * {@link encore.svcs.billing.BillInfoResource#methods_get BillInfoResource.update}*
     *
     * <pre>
     * {
     *     'invoiceDeliveryMethod': 'PAPERLESS',
     *     'thresholdAmount': '500.00',
     *     'thresholdNotificationOption': 'OPT_IN',
     *     'invoiceEmailDeliveryOption': 'OPT_IN'
     * }
     * </pre>
     *
     */
    var update = function (accountNumber, invoiceDeliveryMethod, success, error) {
        return BillInfoResource.update({
            accountNumber: accountNumber
        }, {
            billInfo: {
                invoiceDeliveryMethod: invoiceDeliveryMethod
            }
        }, success, error);
    };

    return {
        update: update
    };
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.InvoicePaymentRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * retrieves the base url for getting a list of payments to an invoice
 * @returns {string} Full URL for getting a list of payments to an invoice
 */
.factory('InvoicePaymentRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/invoices/:invoiceId/payments';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.InvoicePaymentResource
 * @description
 * Service for getting a list of payments of an invoice
 *
 * @requires $resource
 * @requires BillingUtil
 * @requires encore.util.transform.Pluck
 * @requires encore.svcs.util.http.TransformUtil
 * @requires encore.svcs.billing.InvoicePaymentRoute
 * @returns {object} an angular resource
 */
.factory('InvoicePaymentResource', ["$resource", "BillingUtil", "Pluck", "TransformUtil", "InvoicePaymentRoute", function (
    $resource,
    BillingUtil,
    Pluck,
    TransformUtil,
    InvoicePaymentRoute
) {
    var InvoicePaymentsPluck = Pluck('payments.payment', 'error');
    return $resource(InvoicePaymentRoute,
        {
            accountNumber: '@accountNumber',
            invoiceId: '@invoiceId'
        },
        {
            /**
             * @ngdoc method
             * @name InvoicePaymentResource#getAll
             * @methodOf encore.svcs.billing.InvoicePaymentResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {number} params.invoiceId Invoice Id
             * @description
             * Returns an array containing a list of payments for Invoice using an HTTP GET request
             * @static
             * @example
             * <pre>
             *     InvoicePaymentResource.getAll({ accountNumber: 1234, invoiceId: 'abcd-1234' });
             * </pre>
             * *returns a transformed array of payments for invoice transactions using
             * {@link encore.svcs.billing.InvoicePaymentResource#methods_getAll InvoicePaymentResource.getAll}*
             *
             * *Response array below:
             * {@link encore.svcs.billing.InvoicePaymentResource#methods_getAll InvoicePaymentResource.getAll}*
             *
             * <pre>
             * [
             *     {
             *         status: 'CLOSED',
             *         methodType: 'LOCKBOX',
             *         tranRefNum: 'P1-1212121',
             *         currency: 'USD',
             *         amount: '-121.21',
             *         id: '6e81bfc6-81bf-4c68-8ae2-7ad2e1212121',
             *         submissionDate: '2012-12-12T16:32:52.000-05:00',
             *         comments: 'Lockbox ACH Payment'
             *     },
             *     {
             *         status: 'CLOSED',
             *         methodType: 'CHECK',
             *         tranRefNum: 'P1-2323232',
             *         currency: 'USD',
             *         amount: '-232.32',
             *         id: '6e81bfc6-81bf-4c68-8ae2-7ad2e2323232',
             *         submissionDate: '2012-03-23T16:32:52.000-05:00',
             *         comments: 'Monthly Payment'
             *     },
             *     {
             *         status: 'CLOSED',
             *         methodType: 'CREDITCARD',
             *         tranRefNum: 'P1-98820534',
             *         currency: 'USD',
             *         responseMessage: 'Credit Floor.',
             *         amount: '-199.72',
             *         id: 'cc999999-f269-11e3-b6c4-ec1a593d41bf',
             *         submissionDate: '2014-10-08T16:32:52.000-05:00',
             *         rackerSSO: 'racker111',
             *         comments: 'Manual Payment',
             *         methodId: 'urn:uuid:de46d7eb-c1a0-42f3-8fe6-25b96c1a20da'
             *      },
             * ]
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getInvoicePayments_v2_accounts__ran__invoices__invoiceId__payments_BSL_Billing_Operations.html
             * Get List of Payments for an Invoice}.
             */
            getAll: {
                method: 'GET',
                isArray: true,
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors, InvoicePaymentsPluck
                ])
            }
        }
    );
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.NextDueDateRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific NextDueDateRoute URL
 * @returns {string} Full URL for NextDueDateRoute
 */
    .factory('NextDueDateRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
        return BILLING_BASE_URL + '/:accountNumber/futureBill';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.billing.NextDueDateResource
     * @description
     * A service for getting future bill (next due date).
     *
     * @requires $resource
     * @requires encore.svcs.billing.NextDueDateRoute
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('NextDueDateResource', ["$resource", "NextDueDateRoute", "Pluck", "TransformUtil", function (
        $resource,
        NextDueDateRoute,
        Pluck,
        TransformUtil
    ) {
        var toPluck = 'futureBill';
        var nextDueDate = $resource(NextDueDateRoute,
            {
                accountNumber: '@accountNumber'
            },
            {
                /* jshint maxlen: 180 */
                /**
                 * @ngdoc method
                 * @name NextDueDateResource#get
                 * @methodOf encore.svcs.billing.NextDueDateResource
                 * @param {object} params Parameters object
                 * @param {number} params.accountNumber Account number
                 * @description
                 * Returns an object containing next due date value using an HTTP GET request
                 * @static
                 * @example
                 * <pre>
                 *     NextDueDateResource.get({ accountNumber: 1234 });
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.billing.NextDueDateResource#methods_get NextDueDateResource.get}*
                 *
                 * <pre>
                 * {
                 *     'futureBill': {
                 *         'nextDueDate': '2016-06-30T00:00:00Z'
                 *     }
                 * }
                 * </pre>
                 *
                 * For the full API documentation see {@link
                 * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getNextDueDate_v2_accounts__ran__futureBill_Service_API_Client_Operations.html
                 * NextDueDate}.
                 */
                get: {
                    method: 'GET',
                    transformResponse: TransformUtil.responseChain(Pluck(toPluck))
                }
            }
        );
        return nextDueDate;
    }]);


angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.PaymentTermsRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific paymentTerms URL
 * @returns {string} Full URL for PaymentTerms
 */
.factory('PaymentTermsRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/paymentTerms';
}])
/**
 * @typedef {Object} PaymentTermsResource
 * @ngdoc service
 * @name encore.svcs.billing.PaymentTermsResource
 * @description
 * Service for retrieving paymentTerms
 *
 * @requires $resource
 * @requires encore.svcs.billing.PaymentTermsTransform
 * @requires encore.svcs.billing.PaymentTermsRoute
 * @returns {PaymentTermsResource} a resource with methods pertaining to paymentTerms
 */
.factory('PaymentTermsResource', ["$resource", "PaymentTermsTransform", "PaymentTermsRoute", function (
    $resource,
    PaymentTermsTransform,
    PaymentTermsRoute
) {
    return $resource(PaymentTermsRoute, {}, {
        /**
         * @ngdoc method
         * @name PaymentTermsResource#list
         * @methodOf encore.svcs.billing.PaymentTermsResource
         * @description
         * Returns a list of objects from an HTTP GET request
         * *returns a list of paymentTerms that has been transformed using
         * {@link encore.svcs.billing.PaymentTermsTransform#methods_list PaymentTermsTransform.list}*
         * for full API response details see
         * {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getPaymentTerms_v2_paymentTerms_Configured_Payment_Terms.html
         * PaymentTerms Contract}
         *
         * @example
         * <pre>
         * PaymentTermsResource.list();
         * </pre>
         *
         * <pre>
         * [
         *    {
         *      "paymentTermName": "NET_0"
         *    },
         *    {
         *      "paymentTermName": "NET_5"
         *    },
         *    {
         *      "paymentTermName": "NET_10"
         *    },
         *    {
         *      "paymentTermName": "NET_15"
         *    },
         *    {
         *      "paymentTermName": "NET_20"
         *    },
         *    {
         *      "paymentTermName": "NET_30"
         *    },
         *    {
         *      "paymentTermName": "NET_45"
         *    },
         *    {
         *      "paymentTermName": "NET_60"
         *    },
         *    {
         *      "paymentTermName": "NET_75"
         *    },
         *    {
         *      "paymentTermName": "NET_90"
         *    },
         *    {
         *      "paymentTermName": "NET_120"
         *    }
         * ]
         * </pre>
         *
         * for full API response details see
         * {@link
         * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getPaymentTerms_v2_paymentTerms_Configured_Payment_Terms.html
         * PaymentTerms Contract}
         */
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: PaymentTermsTransform.list
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.PaymentTermsTransform
 * @requires encore.util.http.TransformUtil
 * @description
 * Returns an object containing any transformation functionality
 * for HTTP response data
 * @returns {object} Transform functions for the PaymentTerms Resource
 */
.factory('PaymentTermsTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name PaymentTermsTransform#list
     * @methodOf encore.svcs.billing.PaymentTermsTransform
     * @param {object} data A single object that represents a list of paymentTerm objects
     * @param {object} data.configPaymentTerms An object that wraps around a child object
     * @param {array} data.configPaymentTerms.configPaymentTerm A list of paymentTerm objects
     * @description
     * Transforms a list of paymentTerm objects to be more usable
     * in the view layer
     * @returns {array} a list of transformed paymentTerms
     * @example
     * <pre>
     *
     * {
     *   "configPaymentTerms": {
     *     "configPaymentTerm": [
     *       {
     *         "paymentTermName": "NET_0"
     *       },
     *       {
     *         "paymentTermName": "NET_5"
     *       },
     *       {
     *         "paymentTermName": "NET_10"
     *       },
     *       {
     *         "paymentTermName": "NET_15"
     *       },
     *       {
     *         "paymentTermName": "NET_20"
     *       },
     *       {
     *         "paymentTermName": "NET_30"
     *       },
     *       {
     *         "paymentTermName": "NET_45"
     *       },
     *       {
     *         "paymentTermName": "NET_60"
     *       },
     *       {
     *         "paymentTermName": "NET_75"
     *       },
     *       {
     *         "paymentTermName": "NET_90"
     *       },
     *       {
     *         "paymentTermName": "NET_120"
     *       }
     *     ]
     *   }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * [
     *    {
     *        "paymentTermName": "NET_0"
     *    },
     *    {
     *        "paymentTermName": "NET_5"
     *    },
     *    {
     *        "paymentTermName": "NET_10"
     *    },
     *    {
     *        "paymentTermName": "NET_15"
     *    },
     *    {
     *        "paymentTermName": "NET_20"
     *    },
     *    {
     *        "paymentTermName": "NET_30"
     *    },
     *    {
     *        "paymentTermName": "NET_45"
     *    },
     *    {
     *        "paymentTermName": "NET_60"
     *    },
     *    {
     *        "paymentTermName": "NET_75"
     *    },
     *    {
     *        "paymentTermName": "NET_90"
     *    },
     *    {
     *        "paymentTermName": "NET_120"
     *    }
     * ]
     * </pre>
     */
    var paymentTermPluck = TransformUtil.pluckList('configPaymentTerms.configPaymentTerm');

    return {
        list: TransformUtil.responseChain(paymentTermPluck)
    };
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.PurchaseOrderRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific purchase orders URL
 * @returns {string} Full URL for Purchase Orders
 */
.factory('PurchaseOrderRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/purchaseOrders/:id';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.PurchaseOrderResource
 * @description
 * Service for getting, creating, and updating purchase orders from BSLv2
 *
 * @requires $resource
 * @requires encore.svcs.billing.PurchaseOrderRoute
 * @requires encore.svcs.billing.PurchaseOrderTransform
 * @returns {object} an angular resource
 *
 */
.factory('PurchaseOrderResource', ["$resource", "PurchaseOrderRoute", "PurchaseOrderTransform", function (
    $resource,
    PurchaseOrderRoute,
    PurchaseOrderTransform
) {
    var purchaseOrderResource = $resource(PurchaseOrderRoute,
        {
            accountNumber: '@accountNumber',
            id: '@id'
        },
        {
            /**
             * @ngdoc method
             * @name PurchaseOrderResource#getAll
             * @methodOf encore.svcs.billing.PurchaseOrderResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Purchase Orders using an HTTP GET request
             * @static
             * @example
             * <pre>
             * PurchaseOrderResource.getAll({ accountNumber: '020-323676' });
             * </pre>
             *
             * *returns an array of purchase orders that has been transformed using
             * {@link encore.svcs.billing.PurchaseOrderTransform#methods_getAll PurchaseOrderTransform.getAll}*
             *
             * *Response object below:
             * {@link encore.svcs.billing.PurchaseOrderResource#methods_getAll PurchaseOrderResource.getAll}*
             *
             * <pre>
             * [
             *     {
             *         id: 'some-guid-0123',
             *         poNumber: 'ASDF-0000',
             *         startDate: '2016-06-01',
             *         endDate: '2016-06-30'
             *     },
             *     {
             *         id: 'some-guid-4567',
             *         poNumber: 'ASDF-1111',
             *         startDate: '2016-05-01'
             *     },
             *     {
             *         id: 'some-guid-89AB',
             *         poNumber: 'ASDF-2222',
             *         startDate: '2016-04-01',
             *         endDate: '2016-04-30'
             *     }
             * ]
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getPurchaseOrders_v2_accounts__ran__purchaseOrders_Purchase_Order_API_Client_Operations.html
             * Get Purchase Orders Contract}
             * and {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/po_order_get.html
             * Get Purchase Order Validation}.
             */
            getAll: {
                method: 'GET',
                isArray: true,
                transformResponse: PurchaseOrderTransform.getAll
            },

            /**
             * @ngdoc method
             * @name PurchaseOrderResource#create
             * @methodOf encore.svcs.billing.PurchaseOrderResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {object} postBody Purchase Order to create
             * @description
             * Creates a Purchase Order using an HTTP POST
             * @static
             * @example
             * <pre>
             * var postBody = {
             *     purchaseOrder: {
             *         poNumber: 'ASDF-1234'
             *     }
             * };
             *
             * PurchaseOrderResource.create({ accountNumber: '020-323676' }, postBody);
             * </pre>
             *
             * *returns a newly created purchase order that has been transformed using
             * {@link encore.svcs.billing.PurchaseOrderTransform#methods_flatten PurchaseOrderTransform.flatten}*
             *
             * *Response object below:
             * {@link encore.svcs.billing.PurchaseOrderResource#methods_create PurchaseOrderResource.create}*
             *
             * <pre>
             * {
             *     id: 'some-guid-0123',
             *     poNumber: 'ASDF-1234',
             *     startDate: '2016-06-02'
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/POST_createPurchaseOrder_v2_accounts__ran__purchaseOrders_Purchase_Order_API_Client_Operations.html
             * Create Purchase Order Contract}
             * and {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/po_validation.html
             * Create Purchase Order Validation}.
             */
            create: {
                method: 'POST',
                transformResponse: PurchaseOrderTransform.flatten
            },

            /**
             * @ngdoc method
             * @name PurchaseOrderResource#update
             * @methodOf encore.svcs.billing.PurchaseOrderResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {string} params.id GUID of the Purchase Order to be updated
             * @param {object} putBody Purchase Order to update
             * @description
             * Updates a Purchase Order using an HTTP PUT
             * @static
             * @example
             * <pre>
             * var putBody = {
             *     purchaseOrder: {
             *         startDate: '2016-06-10'
             *     }
             * };
             *
             * PurchaseOrderResource.update({
             *     accountNumber: '020-323676',
             *     id: 'some-guid-0123'
             * }, putBody);
             * </pre>
             *
             * *returns an updated purchase order that has been transformed using
             * {@link encore.svcs.billing.PurchaseOrderTransform#methods_flatten PurchaseOrderTransform.flatten}*
             *
             * *Response object below:
             * {@link encore.svcs.billing.PurchaseOrderResource#methods_update PurchaseOrderResource.update}*
             *
             * <pre>
             * {
             *     id: 'some-guid-0123',
             *     poNumber: 'ASDF-5678',
             *     startDate: '2016-06-10'
             * }
             * </pre>
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_updatePurchaseOrder_v2_accounts__ran__purchaseOrders__purchaseOrderId__Purchase_Order_API_Client_Operations.html
             * Update Purchase Order Contract}
             * and {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/po_order_update.html
             * Update Purchase Order Validation}.
             */
            update: {
                method: 'PUT',
                transformResponse: PurchaseOrderTransform.flatten
            },

            /**
             * @ngdoc method
             * @name PurchaseOrderResource#disable
             * @methodOf encore.svcs.billing.PurchaseOrderResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @param {string} params.id GUID of the Purchase Order to be disabled
             * @description
             * Disables a Purchase Order using an HTTP DELETE
             * @static
             * @example
             * <pre>
             * PurchaseOrderResource.disable({ accountNumber: '020-323676', id: 'some-guid-0123' });
             * </pre>
             *
             * Response:
             * <pre>
             * 204 No Content
             * </pre>
             *
             * No additional API documentation exists for the DELETE functionality.
             */
            disable: {
                method: 'DELETE',
                transformResponse: PurchaseOrderTransform.flatten
            }
        }
    );

    return purchaseOrderResource;
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.PurchaseOrderTransform
 * @requires encore.util.http.TransformUtil
 * @requires encore.svcs.billing.BillingUtil
 * @requires encore.util.transform.Pluck
 * @description
 * Returns an object containing any transformation functionality
 * for HTTP response data
 * @returns {object} Transform functions for the Purchase Order Resource
 */
.factory('PurchaseOrderTransform', ["TransformUtil", "BillingUtil", "Pluck", function (
    TransformUtil,
    BillingUtil,
    Pluck
) {
    // add the properties isEnabled and status
    // to each item in a collection of purchase orders
    var calculateStatus = function (data) {
        var today = moment();
        _.forEach(data, function (item) {
            // purchase orders are enabled if the endDate is not specified
            // or the endDate is in the past
            item.isEnabled = !item.endDate || today.isBefore(item.endDate);
            item.status = item.isEnabled ? 'Enabled' : 'Disabled';
        });
        return data;
    };

    /**
     * @ngdoc method
     * @name PurchaseOrderTransform#getAll
     * @methodOf encore.svcs.billing.PurchaseOrderTransform
     * @param {object} data A single object that represents an array of purchase order objects
     * @param {object} data.purchaseOrders An object that wraps around a child object
     * @param {array} data.purchaseOrders.purchaseOrder An array of purchase order objects
     * @description
     * Transforms an array of purchase order objects to be more usable
     * in the view layer
     * @returns {array} an array of transformed purchase orders
     * @example
     * <pre>
     * {
     *     purchaseOrders: {
     *         purchaseOrder: [
     *             {
     *                id: 'some-guid-0123',
     *                poNumber: 'ASDF-0000',
     *                startDate: '2016-06-01',
     *                endDate: '2030-12-31'
     *             },
     *             {
     *                id: 'some-guid-4567',
     *                poNumber: 'ASDF-1111',
     *                startDate: '2016-05-01'
     *             },
     *             {
     *                id: 'some-guid-89AB',
     *                poNumber: 'ASDF-2222',
     *                startDate: '2016-04-01',
     *                endDate: '2016-04-30'
     *             }
     *         ]
     *     }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * [
     *     {
     *         id: 'some-guid-0123',
     *         poNumber: 'ASDF-0000',
     *         startDate: '2016-06-01',
     *         endDate: '2030-12-31',
     *         isEnabled: true,
     *         status: 'Enabled'
     *     },
     *     {
     *         id: 'some-guid-4567',
     *         poNumber: 'ASDF-1111',
     *         startDate: '2016-05-01',
     *         isEnabled: true,
     *         status: 'Enabled'
     *     },
     *     {
     *         id: 'some-guid-89AB',
     *         poNumber: 'ASDF-2222',
     *         startDate: '2016-04-01',
     *         endDate: '2016-04-30',
     *         isEnabled: false,
     *         status: 'Disabled'
     *     }
     * ]
     * </pre>
     */
    var getAll = TransformUtil.responseChain([
        BillingUtil.normalizeBslErrors,
        Pluck('purchaseOrders.purchaseOrder', 'error'),
        calculateStatus
    ]);

    /**
     * @ngdoc method
     * @name PurchaseOrderTransform#flatten
     * @methodOf encore.svcs.billing.PurchaseOrderTransform
     * @description transforms the format of the Purchase Order API response
     * @param {object} data data object to be converted
     * @returns {object} a single transformed (flattened) purchase order
     * @example:
     * <pre>
     * {
     *     purchaseOrder: {
     *         id: 'some-guid-0123',
     *         poNumber: 'ASDF-5678',
     *         startDate: '2016-06-10'
     *     }
     * }
     * </pre>
     *
     * *Converts to*
     *
     * <pre>
     * {
     *     id: 'some-guid-0123',
     *     poNumber: 'ASDF-5678',
     *     startDate: '2016-06-10'
     * }
     * </pre>
     */
    var flatten = TransformUtil.responseChain([
        BillingUtil.normalizeBslErrors,
        Pluck('purchaseOrder', 'error')
    ]);

    return {
        getAll: getAll,
        flatten: flatten
    };
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.StringToNumericTransform
 * @function
 *
 * @description
 * Convert a string number found in an object or all occurrences in an array into numeric type
 * by supplied keys for value and array. Conversion relies on the native parseFloat function
 * with the addition of removing commas from the string prior to parsing.
 *
 * Note an unusual property of the native parseFloat:
 *
 * GIVEN
 * - a string
 * - starting with digits
 * - optionally followed by a single period and at least one more digit
 * - followed by any number of non-digit characters
 *
 * THEN
 * - the digits and period that precede the non-digits will parse correctly as a float
 * - the non-digits will be truncated
 *
 * Ex. '1234.56abcd' and '1234.56.78' both correctly parse to 1234.56
 *
 * @param {array.<object>} params Objects defining values to be transformed. Parameters:
 *   - path Deep key of object whose value will be transformed
 *   - arrayPath If value(s) to be transformed exists in an array, deep key of array containing
 *               those value(s) (optional)
 *
 * @returns {function} Transform function which converts specified strings to numeric type
 *
 * @example
 * Untransformed response:
 *
 * <pre>
 * response = {
 *   invoice: {
 *     invoiceTotal: '600.01',
 *     accountName: 'ESPN Sports',
 *     invoiceItems: [
 *       {
 *         name: 'Cloud Servers',
 *         itemType: 'PRODUCT_CHARGES',
 *         itemAmount: '21.61'
 *       },
 *       {
 *         name: 'Cloud Database',
 *         itemType: 'PRODUCT_CHARGES',
 *         itemAmount: '78.55'
 *       }
 *     ]
 *   }
 * };
 * </pre>
 *
 * <pre>
 * StringToNumericTransform([
 *   { path: 'invoice.invoiceTotal' },
 *   { path: 'itemAmount', arrayPath: 'invoice.invoiceItems' }
 * ])(response);
 * </pre>
 *
 * Returns:
 * <pre>
 * {
 *   invoice: {
 *     transformedInvoiceTotal: 600.01,
 *     invoiceTotal: '600.01',
 *     accountName: 'ESPN Sports',
 *     invoiceItems: [
 *       {
 *         name: 'Cloud Servers',
 *         itemType: 'PRODUCT_CHARGES',
 *         transformedItemAmount: 21.61
 *         itemAmount: '21.61'
 *       },
 *       {
 *         name: 'Cloud Database',
 *         itemType: 'PRODUCT_CHARGES',
 *         transformedItemAmount: 78.55
 *         itemAmount: '78.55'
 *       }
 *     ]
 *   }
 * };
 * </pre>
 */
.factory('StringToNumericTransform', function () {
    // Iterate through Object 'obj' over string 'keys' returning deep value
    // ex. getDeepValue({ a: { b: { c: 1 }}}, 'a.b.c') // Returns 1
    function getDeepValue(obj, keys) {
        if (keys === '' && Array.isArray(obj)) {
            return obj;
        }

        try {
            keys = (keys !== '' ? keys.split('.') : []);

            while (keys.length) {
                obj = obj[keys.shift()];
            }

            return obj;
        } catch (e) {
            return undefined;
        }
    }

    // Similar to 'getDeepValue' but instead of returning, apply 'fn' to the value and save
    function transformDeepValue(obj, keys, fn) {
        var key;
        var transKey;

        function transformKey(str) {
            return 'transformed' + str.charAt(0).toUpperCase() + str.slice(1);
        }

        keys = keys.split('.');

        while (keys.length) {
            key = keys.shift();

            // If keys has length, not yet at deepest path
            if (keys.length) {
                obj = obj[key];
            } else {
                // If any key in the path is bad, don't transform
                if (!obj || !obj[key]) {
                    return;
                }
                transKey = transformKey(key);
                try {
                    obj[transKey] = fn(obj[key]);
                } catch (e) {
                    obj[transKey] = undefined;
                }
            }
        }
    }

    // parseFloat will parse all numeric data up to the first non-numeric, non-period
    // meaning "123,456.00" will parse to 123, so commas must be stripped.
    // This means that currencies that use commas as decimal points are not supported
    function stripCommasParseFloat(str) {
        return angular.isString(str) ? parseFloat(str.replace(/,/g, '')) : str;
    }

    return function (params) {
        return function (data) {
            data = (angular.isString(data) ? (data = angular.fromJson(data)) : data);
            params.forEach(function (param) {
                var array;

                if (!param.path) {
                    return undefined;
                }

                // If given an arrayPath parameter, try and fetch the path
                // Do nothing if given a bad arrayPath
                // Wrap the data into an array if not given an arrayPath, for convenience
                array = getDeepValue(data, param.arrayPath) || !param.arrayPath && [data] || [];
                array.forEach(function (item) {
                    transformDeepValue(item, param.path, stripCommasParseFloat);
                });
            });
            return data;
        };
    };
});

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.SubscriptionRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific SubscriptionRoute URL
 * @returns {string} Full URL for SubscriptionRoute
 */
.factory('SubscriptionRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/subscriptions/:id';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.SubscriptionResource
 * @description
 * Service for retrieving subscriptions
 * @requires $resource
 * @returns {object} an angular resource
 */
.factory('SubscriptionResource', ["$resource", "SubscriptionRoute", "SubscriptionTransform", function (
    $resource,
    SubscriptionRoute,
    SubscriptionTransform
) {
    return $resource(SubscriptionRoute,
        {
            accountNumber: '@accountNumber',
            id: '@id'
        },
        {
            getAll: {
                method: 'GET',
                isArray: true,
                transformResponse: SubscriptionTransform.getAll,
                params: {
                    includePlanDetails: true
                }
            }
        }
    );
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.SubscriptionTransform
 * @description
 * Returns an object containing transformation functionality
 * for HTTP response data
 * @returns {object} Transform functions for Subscription Resource
 */
.factory('SubscriptionTransform', ["TransformUtil", function (TransformUtil) {
    /**
    * @ngdoc service
    * @name SubscriptionTransform#getAll
    * @methodOf encore.svcs.billing.SubscriptionTransform
    * @param {array} Collection of subscription objects
    * @description
    * Transforms a collection of subscription objects to be usable
    * in the view layer
    * @returns {array} a collection of transformed subscriptions
    * @example
    * <pre>
    * { 'subscriptions': {
    *        'subscription': [
    *            {
    *                'subscriptionCode': '256640',
    *                'subscriptionStartDate': '2015-11-16T00:00:00Z',
    *                'subscriptionStatus': 'ACTIVE',
    *                'lastBilledDate': '2015-12-31T00:00:00Z',
    *                'offeringCode': 'CSITES',
    *                'id': 'be81bfc6-81bf-4c6e-97eb-f1ae6581bfc6',
    *                'link': [{
    *                    'rel': 'self',
    *                    'href': '/v2/accounts/020-323676/subscriptions/be81bfc6-81bf-4c6e-97eb-f1ae6581bfc6'
    *                }]
    *            }
    *        ],
    *        'link': []
    *    }
    * }
    * </pre>
    * Converts to:
    * <pre>
    * SubscriptionTransform.getAll(subscription) ->
    * [
    *    {
    *        'subscriptionCode': '256640',
    *        'subscriptionStartDate': '2015-11-16T00:00:00Z',
    *        'subscriptionStatus': 'ACTIVE',
    *        'lastBilledDate': '2015-12-31T00:00:00Z',
    *        'offeringCode': 'CSITES',
    *        'id': 'be81bfc6-81bf-4c6e-97eb-f1ae6581bfc6',
    *        'link': [{
    *            'rel': 'self',
    *            'href': '/v2/accounts/020-323676/subscriptions/be81bfc6-81bf-4c6e-97eb-f1ae6581bfc6'
    *        }]
    *    }
    * ]
    * </pre>
    */
    return {
        getAll: TransformUtil.pluckList('subscriptions.subscription')
    };
}]);

angular.module('encore.svcs.billing')
/**
 * @ngdoc service
 * @name encore.svcs.billing.TaxInfoRoute
 * @requires encore.svcs.billing.config.constant:BILLING_BASE_URL
 * @description
 * Combines the base URL with the specific TaxInfoRoute URL
 * @returns {string} Full URL for TaxInfoRoute
 */
.factory('TaxInfoRoute', ["BILLING_BASE_URL", function (BILLING_BASE_URL) {
    return BILLING_BASE_URL + '/:accountNumber/taxInfo';
}])
/**
 * @ngdoc service
 * @name encore.svcs.billing.TaxInfoResource
 * @description
 * A Service for getting and updating tax info. Specifically: taxId number, and
 * business type.
 *
 * @requires $resource
 * @requires encore.svcs.billing.BillingUtil
 * @requires encore.util.transform.Pluck
 * @requires encore.svcs.billing.TaxInfoRoute
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} an angular resource
 */
.factory('TaxInfoResource', ["$resource", "BillingUtil", "Pluck", "TaxInfoRoute", "TransformUtil", function (
    $resource,
    BillingUtil,
    Pluck,
    TaxInfoRoute,
    TransformUtil
) {
    var taxInfoPluck = Pluck('taxInfo', 'error');
    var taxInfo = $resource(TaxInfoRoute,
        {
            accountNumber: '@accountNumber'
        },
        {
            /**
             * @ngdoc method
             * @name TaxInfoResource#get
             * @methodOf encore.svcs.billing.TaxInfoResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Returns an object containing Tax Info values using an HTTP GET request
             * @static
             * @example
             * <pre>
             * TaxInfoResource.get({ accountNumber: 1234 });
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.TaxInfoResource#methods_get TaxInfoResource.get}*
             *
             * <pre>
             * {
             *     'taxId': '',
             *     'businessType': 'CONSUMER'
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/GET_getTaxInfo_v2_accounts__ran__taxInfo_Tax_Information_API_Client_Operations.html
             * Tax Info Contract}.
             */
            get: {
                method: 'GET',
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors, taxInfoPluck])
            },
            /**
             * @ngdoc method
             * @name TaxInfoResource#update
             * @methodOf encore.svcs.billing.TaxInfoResource
             * @param {object} params Parameters object
             * @param {number} params.accountNumber Account number
             * @description
             * Updates an entry within the TaxInfoResource object using an HTTP PUT operation
             * @static
             * @example
             * <pre>
             * var updateData = {
             *     'taxInfo': {
             *         'taxId': 'FR82542065479'
             *     }
             * };
             *
             * TaxInfoResource.update({ accountNumber: 12345 }, updateData);
             * </pre>
             *
             * *Response object below:
             * {@link encore.svcs.billing.TaxInfoResource#methods_get TaxInfoResource.update}*
             *
             * <pre>
             * {
             *     'taxId': 'FR82542065479',
             *     'businessType': 'CONSUMER'
             * }
             * </pre>
             *
             * For the full API documentation see {@link
             * https://service-contracts.corp.rackspace.com:9443/snapshots/bsl/site/content/PUT_updateBillInfo_v2_accounts__ran__billInfo_Billing_Information_API_Client_Operations.html
             * Tax Info Contract}.
             */
            update: {
                method: 'PUT',
                transformResponse: TransformUtil.responseChain([
                    BillingUtil.normalizeBslErrors, taxInfoPluck])
            }
        }
    );
    return taxInfo;
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud
 *
 * @description
 * Collection of services used for interacting with Cloud Products
 */
angular.module('encore.svcs.cloud', [
    'encore.svcs.cloud.account',
    'encore.svcs.cloud.config',
    'encore.svcs.cloud.networks',
    'encore.svcs.cloud.monitoring',
    'encore.svcs.cloud.lbaas',
    'encore.svcs.cloud.dns',
    'encore.svcs.cloud.user',
    'encore.svcs.cloud.logging'
]);

/**
 * #TODO: Move this to its own file
 * @ngdoc overview
 * @name encore.svcs.cloud.config
 *
 * @description
 * Collection of base services for interacting with Cloud Products.
 */
angular.module('encore.svcs.cloud.config', [])
    /**
     * @ngdoc property
     * @const CLOUD_API_URL_BASE
     * @name encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Constant for the base path of all Cloud API calls
     */
    .constant('CLOUD_API_URL_BASE', '/api/cloud')
    /**
     * @ngdoc property
     * @const CLOUD_URL_BASE
     * @name encore.svcs.cloud.config.constant:CLOUD_URL_BASE
     * @requires $routeParams
     * @requires encore.svcs.cloud.config.getCloudURLBase
     * @description
     *
     * Constant for the base path of all Cloud UI Routes
     */
    .factory('CLOUD_URL_BASE', ["$routeParams", "GetCloudURLBase", function ($routeParams, GetCloudURLBase) {
        return GetCloudURLBase($routeParams.accountNumber, $routeParams.user);
    }])
    /**
     * @ngdoc property
     * @const CLOUD_URL
     * @name encore.svcs.cloud.config.constant:CLOUD_URL
     * @requires encore.svcs.cloud.config.constant:CLOUD_URL_BASE
     * @description
     *
     * Constant for base path of each Cloud Product
     */
    .factory('CLOUD_URL', ["$routeParams", "GetCloudURL", function ($routeParams, GetCloudURL) {
        return GetCloudURL($routeParams.accountNumber, $routeParams.user);
    }])
    /**
     * @ngdoc property
     * @name encore.svcs.cloud.config.GetAccountRegion
     * @requires $routeParams
     * @description
     *
     * Function for retrieving the Account Region
     * As determined by Support Service, an account is considered to be
     * a UK account if it is greater than or equal to 10,000,000. Otherwise, it is a US account.
     *
     * @param {String|Number} accountNumber The account number
     */
    .factory('GetAccountRegion', ["$routeParams", function ($routeParams) {
        return function (accountNumber) {
            accountNumber = accountNumber || $routeParams.accountNumber;
            accountNumber = parseInt(accountNumber, 10);
            return (accountNumber >= 10000000) ? 'UK' : 'US';
        };
    }])
    /**
     * @ngdoc property
     * @const GetCloudURLBase
     * @name encore.svcs.cloud.config.GetCloudURLBase
     * @requires $routeParams
     * @description
     *
     * Function for generating the base path for cloud
     */
    .factory('GetCloudURLBase', ["$routeParams", function ($routeParams) {
        return function (accountNumber, user) {
            accountNumber = accountNumber || $routeParams.accountNumber;
            user = user || $routeParams.user;
            return '/cloud/' + accountNumber + '/' + user;
        };
    }])
    /**
     * @ngdoc property
     * @const GetCloudURLBase
     * @name encore.svcs.cloud.config.GetCloudURL
     * @requires encore.svcs.cloud.config.GetCloudURLBase
     * @description
     *
     * Function for generating the path for cloud products
     */
    .factory('GetCloudURL', ["GetCloudURLBase", function (GetCloudURLBase) {
        return function (accountNumber, user) {
            var base = GetCloudURLBase(accountNumber, user);

            // Turn remaining arguments into string with a leading '/'
            var extra = '';
            if (arguments.length > 2) {
                extra = '/' + _.toArray(arguments).slice(2).join('/');
            }

            return {
                servers: base + '/servers' + extra,
                images: base + '/images' + extra,
                volumes: base + '/cbs/volumes' + extra,
                snapshots: base + '/cbs/snapshots' + extra,
                databases: base + '/databases/instances' + extra,
                loadbalancers: base + '/loadbalancers' + extra,
                networks: base + '/networks' + extra,
                cdn: base + '/cdn/services' + extra
            };
        };
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.lbaas.LbaasRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for LBaaS API calls
     */
    .factory('LbaasRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/users/:user/lbaas/:region/:id/:details/:detailId/:innerDetails';
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.account
 *
 * @description
 * Services used for manipulation and retrieval of cloud account service data
 */
angular.module('encore.svcs.cloud.account', [
    'ngResource',
    'encore.svcs.cloud.config',
    'encore.common.http',
    'encore.util.transform'
]);

angular.module('encore.svcs.cloud.account')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.account.CloudAccountHybridInfoRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Account Hybrid API
     */
    .factory('CloudAccountHybridInfoRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/accounts/:accountId/hybrid_info';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.account.CloudAccountHybridInfoResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.account.CloudAccountHybridInfoRoute
     * @requires encore.svcs.cloud.account.CloudAccountHybridInfoTransform
     * @param {string} accountId - The Account Id
     * @description
     * `$resource` definition of the Hybrid Account API
     */
    .factory('CloudAccountHybridInfoResource', ["$resource", "CloudAccountHybridInfoRoute", "CloudAccountHybridInfoTransform", function ($resource, CloudAccountHybridInfoRoute,
        CloudAccountHybridInfoTransform) {
        
         return $resource(CloudAccountHybridInfoRoute, {
            accountId: '@accountId'
         }, {
            /**
             * @ngdoc method
             * @name CloudAccountHybridInfoResource#get
             * @methodOf encore.svcs.cloud.account.CloudAccountHybridInfoResource
             * @description
             * The current hybrid account information
             *
             * @example
                <pre> CloudAccountHybridInfoResource.get({ accountId: '1234' });</pre>
                <pre>
                    {
                        "account_name": "Jason QA 1",
                        "core_account_number": "3145001",
                        "service_level": "Racker IT",
                        "segment": "ENT Z",
                        "has_critical_sites": false
                    }
                </pre>
             */
            get: {
                method: 'GET',
                transformResponse: CloudAccountHybridInfoTransform.info
            }
         });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.account.CloudAccountHybridInfoTransform
     * @requires encore.common.http.HttpTransformUtil
     * @requires encore.util.transform.Pluck
     * @returns {object} A mapping of AccountHybridInfo response transformations
     * @description
     *
     * Transforms the result of AccountHybridInfo api calls
     */
    .factory('CloudAccountHybridInfoTransform', ["HttpTransformUtil", "Pluck", function (HttpTransformUtil, Pluck) {
        return {
            info: HttpTransformUtil.getTransformResponse(Pluck('hybrid_account_info'))
        };
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.account.user
 *
 * @description
 * Services used for manipulation and retrieval of cloud account user service data
 */
angular.module('encore.svcs.cloud.account.user', [
    'encore.svcs.cloud.account'
]);

angular.module('encore.svcs.cloud.account.user')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserGroupRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud Account User Group API
*/
.factory('CloudAccountUserGroupRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/account_users/:userId/:groupType/:groupId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserGroupResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.account.user.CloudAccountUserGroupRoute
 * @param {string} user - the user name
 * @param {string} userId - the id of the user you want act upon
 * @param {string} groupId - (optional) the group id you want to remove
 * @description
 * `$resource` definition of the Cloud Account User Group API
 */
.factory('CloudAccountUserGroupResource', ["$resource", "CloudAccountUserGroupRoute", "CloudAccountUserGroupTransform", function ($resource, CloudAccountUserGroupRoute,
                                                   CloudAccountUserGroupTransform) {
    return $resource(CloudAccountUserGroupRoute, {
        user: '@user',
        'userId': '@userId',
        'groupId': '@groupId'
    }, {
        /**
         * @ngdoc method
         * @name CloudAccountUserGroupResource#listCurrentGroups
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserGroupResource
         * @description
         * Lists current groups for the specified cloud account user
         *
         * @example
         * <pre> CloudAccountUserGroupResource.listCurrentGroups({ user: 'hub_cap', userId: '245' });</pre>
         * <pre>
         * [
         *   {
         *     "description": "Maximum Memory Size of 128 GB",
         *     "name": "128GB - defaults",
         *     "id": "106"
         *   },
         *   {
         *     "description": "new desc",
         *     "name": "RAX_CONNECT",
         *     "id": "1651"
         *   },
         *   {
         *     "description": "NetworkLg description.",
         *     "name": "NetworkLg",
         *     "id": "1632"
         *   }
         * ]
         * </pre>
        */
        listCurrentGroups: {
            method: 'GET',
            transformResponse: CloudAccountUserGroupTransform.list,
            isArray: true,
            params: {
                groupType: 'groups'
            }
        },
        /**
         * @ngdoc method
         * @name CloudAccountUserGroupResource#listAvailableGroups
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserGroupResource
         * @description
         * Lists available groups for the specified cloud account user to add
         *
         * @example
         * <pre> CloudAccountUserGroupResource.listAvailableGroups({ user: 'hub_cap', userId: '245' });</pre>
         * <pre>
         * [
         *   {
         *     "description": "Maximum Memory Size of 128 GB",
         *     "name": "128GB - defaults",
         *     "id": "106"
         *   },
         *   {
         *     "description": "new desc",
         *     "name": "RAX_CONNECT",
         *     "id": "1651"
         *   },
         *   {
         *     "description": "NetworkLg description.",
         *     "name": "NetworkLg",
         *     "id": "1632"
         *   }
         * ]
         * </pre>
        */
        listAvailableGroups: {
            method: 'GET',
            transformResponse: CloudAccountUserGroupTransform.list,
            isArray: true,
            params: {
                groupType: 'available_groups'
            }
        },
        /**
         * @ngdoc method
         * @name CloudAccountUserGroupResource#addGroup
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserGroupResource
         * @description
         * Adds group to current list of groups user is associated with.
         *
         * @example
         * <pre> CloudAccountUserGroupResource
         *  .addGroup({ user: 'hub_cap', userId: '245' }, { 'group_id': '124' });</pre>
         */
        addGroup: {
            method: 'POST',
            params: {
                groupType: 'groups'
            }
        },
        /**
         * @ngdoc method
         * @name CloudAccountUserGroupResource#removeGroup
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserGroupResource
         * @description
         * Remove a group from the specified cloud account user
         *
         * @example
         * <pre>
         * CloudAccountUserGroupResource.removeGroup({
         *   user: 'hub_cap',
         *   userId: '245'
         * },{
         *   group_id: '12345'
         * });
         * </pre>
         */
        removeGroup: {
            method: 'DELETE',
            params: {
                groupType: 'groups'
            }
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserGroupTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of CloudAccountUserGroup response transformations
 * @description
 *
 * Transforms the result of CloudAccountUserGroup api calls
 */
.factory('CloudAccountUserGroupTransform', ["TransformUtil", function (TransformUtil) {

    /**
     * @ngdoc method
     * @name CloudAccountUserGroupTransform#listGroups
     * @methodOf encore.svcs.cloud.account.user.CloudAccountUserGroupTransform
     * @description
     *
     * Plucks the groups from the api response
     */
    var listGroups = TransformUtil.pluckList('groups');

    return {
        list: TransformUtil.responseChain(listGroups)
    };
}]);

angular.module('encore.svcs.cloud.account.user')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserRoleRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud Account User Role API
*/
.factory('CloudAccountUserRoleRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/account_users/:userId/roles/:roleId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserRoleResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.account.user.CloudAccountUserRoleRoute
 * @param {string} user - the user name
 * @param {string} userId - the id of the user you want act upon
 * @description
 * `$resource` definition of the Cloud Account User Role API
 */
.factory('CloudAccountUserRoleResource', ["$resource", "CloudAccountUserRoleRoute", "CloudAccountUserRoleTransform", function ($resource, CloudAccountUserRoleRoute,
                                                   CloudAccountUserRoleTransform) {
    return $resource(CloudAccountUserRoleRoute, {
        user: '@user',
        userId: '@userId',
        roleId: '@roleId'
    }, {
        /**
         * @ngdoc method
         * @name CloudAccountUserRoleResource#listRoles
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserRoleResource
         * @description
         * Lists roles for the specified account user
         *
         * @example
         * <pre> CloudAccountUserRoleResource.listRoles({ user: 'hub_cap', userId: '245' });</pre>
         * <pre>
         * [
         *   {
         *     'service_id': 'aab123',
         *     'description': 'Role description',
         *     'id': '12345678',
         *     'name': 'role:admin'
         *   },
         *   {
         *     'service_id': 'bbc123',
         *     'description': 'Role description',
         *     'id': '12345678',
         *     'name': 'role:observer'
         *   }
         * ]
         * </pre>
         */
        listRoles: {
            method: 'GET',
            transformResponse: CloudAccountUserRoleTransform.list,
            isArray: true
        },
        /**
         * @ngdoc method
         * @name CloudAccountUserRoleResource#addRole
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserRoleResource
         * @description
         * Add a role to the specified account user
         *
         * @example
         * <pre>
         * CloudAccountUserResource.addRole({
         *   user: 'hub_cap',
         *   userId: '245'
         * },{
         *   role_id: '12345'
         * });
         * </pre>
         */
        addRole: {
            method: 'POST'
        },
        /**
         * @ngdoc method
         * @name CloudAccountUserRoleResource#removeRole
         * @methodOf encore.svcs.cloud.account.user.CloudAccountUserRoleResource
         * @description
         * Remove a role from the specified account user
         *
         * @example
         * <pre>
         * CloudAccountUserResource.removeRole({
         *   user: 'hub_cap',
         *   userId: '245',
         *   roleId: '12345'
         * });
         * </pre>
         */
        removeRole: {
            method: 'DELETE'
        }

    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.account.user.CloudAccountUserRoleTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of CloudAccountUserRole response transformations
 * @description
 *
 * Transforms the result of CloudAccountUserRole api calls
 */
.factory('CloudAccountUserRoleTransform', ["TransformUtil", function (TransformUtil) {

    /**
     * @ngdoc method
     * @name CloudAccountUserRoleTransform#listRoles
     * @methodOf encore.svcs.cloud.account.user.CloudAccountUserRoleTransform
     * @description
     *
     * Plucks the roles from the api response
     */
    var listRoles = TransformUtil.pluckList('roles');

    return {
        list: TransformUtil.responseChain(listRoles)
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.cbs
 *
 * @description
 * Services used for manipulation and retrieval of CBS service data
 */
angular.module('encore.svcs.cloud.cbs', [
    'encore.common.http',
    'encore.util.transform'
])
/**
 * @ngdoc property
 * @const VOLUMES_STORAGE_TYPES
 * @name encore.svcs.cloud.cbs.constant:VOLUMES_STORAGE_TYPES
 * @description
 *
 * Constant for the Volumes Storage Types
 */
.constant('VOLUME_STORAGE_TYPES', [
    {
        'value': 'SATA',
        'label': 'SATA'
    },
    {
        'value': 'SSD',
        'label': 'SSD'
    }
])
/**
 * @ngdoc property
 * @const VOLUMES_FORCE_TYPES
 * @name encore.svcs.cloud.cbs.constant:VOLUMES_FORCE_TYPES
 * @description
 *
 * Constant for the Volumes Storage Types
 */
.constant('VOLUME_FORCE_TYPES', [
    {
        'value': 'true',
        'label': 'Yes'
    }, {
        'value': 'false',
        'label': 'No'
    }
]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.SnapshotService
 * @requires encore.svcs.cloud.cbs.SnapshotResource
 * @description
 *
 * Service for interacting with Encore Cloud API for Cloud Snapshots
 */
.factory('SnapshotService', ["SnapshotResource", function (SnapshotResource) {
    return {
        /**
         * @ngdoc method
         * @name SnapshotService#create
         * @methodOf encore.svcs.cloud.cbs.SnapshotService
         * @param {object} scope - the scope of the controller
         * @description
         *
         * Creates a new cloud snapshot
         */
        create: function (scope) {
            return function (fields, id, region) {
                var params = {
                    user: scope.user,
                    region: region
                };

                // add in fields to params object
                fields = fields || {};
                fields['volume_id'] = id;

                return SnapshotResource.create(params, fields).$promise;
            };
        }
    };
}]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.SnapshotRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Snapshot API
 */
.factory('SnapshotRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/block_storage/:region/snapshots/:snapshotid';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.SnapshotResource
 * @requires $resource
 * @requires encore.svcs.cloud.cbs.SnapshotRoute
 * @description
 *
 * `$resource` definition of Snapshot API
 */
.factory('SnapshotResource', ["$resource", "SnapshotRoute", function ($resource, SnapshotRoute) {
    return $resource(SnapshotRoute, {
            user: '@user',
            region: '@region',
            snapshotid: '@snapshotid'
        }, {
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }
        }
    );
}]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc filter
 * @name encore.svcs.cloud.cbs.SnapshotAttributes
 * @description
 * Filter which refines the collection of rows based on the criteria provided. If no criteria are selected,
 * the filter will return the entire collection of rows.  The filter leverages an 'AND' search so as more
 * criteria are selected more results will be filtered out.
 */
.filter('SnapshotAttributes', ["$filter", function ($filter) {
    /**
     * @ngdoc method
     * @name SnapshotAttributes#comparator
     * @methodOf encore.svcs.cloud.cbs.SnapshotAttributes
     * @requires $filter
     * @param {object} row JSON object that defines a table row to search
     * @param {string} keyword What to search for
     * @description Loops through the values of a a table row looking for the keyword.
     * If found will return that it is a match.
     * @returns {boolean} whether it is a match or not.
     */
    var comparator = function (row, keyword) {
        var isMatch = false;
        var dateFormatter = $filter('date');
        var rxDiskSize = $filter('rxDiskSize');

        // we need to be case insensitive
        keyword = angular.lowercase(keyword);

        _.forEach(row, function (val) {
            // recursive
            if (_.isObject(val)) {
                comparator(val, keyword);
            }
            // Compare criteria
            if (_.includes(angular.lowercase(val), keyword) ||
                _.includes(angular.lowercase(dateFormatter(val, 'short')), keyword) ||
                _.includes(angular.lowercase(rxDiskSize(val)), keyword)) {
                // If it does contain the keyword set this row as a match
                isMatch = true;
            }
        });

        return isMatch;
    };

    /**
     * @ngdoc method
     * @name anonymous
     * @methodOf encore.svcs.cloud.cbs.SnapshotAttributes
     * @param {array} rows Array of JSON objects representing a table
     * @param {object} filter optional filter object that contains the keyword to search for
     * @description If the keyword is present will filter the rows using the defined comparator.
     * If a row matches the comparator then it gets returned as apart to the array from the filter.
     * @returns {array} filter list of table rows.
     */
    return function (rows, filter) {
        filter = filter ? filter : {};
        return filter.keyword ? _.filter(rows, function (row) {
            return comparator(row, filter.keyword);
        }) : rows;
    };
}]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.VolumeRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Volume API
 */
.factory('VolumeRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/block_storage/:region/volumes/:volumeid/:action';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.VolumeResource
 * @requires $resource
 * @requires encore.svcs.cloud.cbs.VolumeRoute
 * @description
 *
 * `$resource` definition of Volume API
 */
.factory('VolumeResource', ["$resource", "VolumeRoute", function ($resource, VolumeRoute) {
    return $resource(VolumeRoute, {
        user: '@user',
        region: '@region',
        volumeid: '@volumeid'
    }, {
        /**
         * @ngdoc method
         * @name VolumeResource#create
         * @methodOf encore.svcs.cloud.cbs.VolumeResource
         * @description
         *
         * Definition of API interface used to create a volume
         */
        create: {
            method: 'POST',
        },
        /**
         * @ngdoc method
         * @name VolumeResource#update
         * @methodOf encore.svcs.cloud.cbs.VolumeResource
         * @description
         *
         * Definition of API interface used to update a volume
         */
        update: {
            method: 'PUT'
        },
        /**
         * @ngdoc method
         * @name VolumeResource#manualDetach
         * @methodOf encore.svcs.cloud.cbs.VolumeResource
         * @description
         *
         * Definition of API interface used to manually detach a volume
         */
        manualDetach: {
            method: 'PUT',
            params: {
                action: 'manual_detach'
            }
        },
        /**
         * @ngdoc method
         * @name VolumeResource#delete
         * @methodOf encore.svcs.cloud.cbs.VolumeResource
         * @description
         *
         * Definition of API interface used to delete a volume
         */
        delete: {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
}]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cbs.VolumeService
 * @requires encore.svcs.cloud.cbs.VolumeResource
 * @description
 *
 * Service for interacting with Encore Cloud API for Cloud Volumes
 */
.factory('VolumeService', ["VolumeResource", function (VolumeResource) {
    return {
      /**
       * @ngdoc method
       * @name VolumeService#create
       * @methodOf encore.svcs.cloud.cbs.VolumeService
       * @param {string} user - user name
       * @description
       *
       * Create a new cloud volume
       */
        create: function (user) {
            return function (fields, id, region) {
                var params = {
                    user: user,
                    region: region
                };

                // add in fields to params object
                fields = fields || {};
                fields['snapshot_id'] = id;

                return VolumeResource.create(params, fields).$promise;
            };

        }
    };
}]);

angular.module('encore.svcs.cloud.cbs')
/**
 * @ngdoc filter
 * @name encore.svcs.cloud.cbs.VolumeAttributes
 * @description
 * Filter which refines the collection of rows based on the criteria provided. If no criteria are selected,
 * the filter will return the entire collection of rows.  The filter leverages an 'AND' search so as more
 * criteria are selected more results will be filtered out.
 */
.filter('VolumeAttributes', ["$filter", function ($filter) {
    /**
     * @ngdoc method
     * @name VolumeAttributes#comparator
     * @methodOf encore.svcs.cloud.cbs.VolumeAttributes
     * @requires $filter
     * @param {object} row JSON object that defines a table row to search
     * @param {string} keyword What to search for
     * @description Loops through the values of a a table row looking for the keyword.
     * If found will return that it is a match.
     * @returns {boolean} whether it is a match or not.
     */
    var comparator = function (row, keyword) {
        var isMatch = false;
        var rxDiskSize = $filter('rxDiskSize');

        // we need to be case insensitive
        keyword = angular.lowercase(keyword);

        _.forEach(row, function (val) {
            // recursive
            if (_.isObject(val)) {
                comparator(val, keyword);
            }
            // Compare criteria
            if (_.includes(angular.lowercase(val), keyword) ||
                _.includes(angular.lowercase(rxDiskSize(row.size)), keyword)) {
                // If it does contain the keyword set this row as a match
                isMatch = true;
            }
        });

        return isMatch;
    };

    /**
     * @ngdoc method
     * @name anonymous
     * @methodOf encore.svcs.cloud.cbs.VolumeAttributes
     * @param {array} rows Array of JSON objects representing a table
     * @param {object} filter optional filter object that contains the keyword to search for
     * @description If the keyword is present will filter the rows using the defined comparator.
     * If a row matches the comparator then it gets returned as apart to the array from the filter.
     * @returns {array} filter list of table rows.
     */
    return function (rows, filter) {
        filter = filter ? filter : {};
        return filter.keyword ? _.filter(rows, function (row) {
            return comparator(row, filter.keyword);
        }) : rows;
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.cdn
 *
 * @description
 * Services used for manipulation and retrieval of CDN service data
 */
angular.module('encore.svcs.cloud.cdn', [
    'encore.common.http',
    'encore.util.transform'
])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cdn.CDNStatus
 * @requires encore.svcs.cloud.common.value:PRODUCT_VERSIONS
 * @description
 *
 * Return status (if any) of CDN Services product.
 */
.factory('CDNStatus', ["PRODUCT_VERSIONS", function (PRODUCT_VERSIONS) {
    return PRODUCT_VERSIONS['CDN Services'];
}]);

var fixtures = fixtures || {};
fixtures.cdn = fixtures.cdn || {};

(function () {
    var _emptyService = {
        origins: [{}],
        restrictions: [{}],
        status: 'deployed',
        name: 'empty',
        domains: [{}],
        id: 'abc-123-def-456',
        caching: [{}]
    };

    var _kitchenSink = {
        origins: [
            {
                origin: 'somewhere.net',
                port: 80,
                ssl: false,
                rules: []
            }
        ],
        restrictions: [],
        status: 'deployed',
        name: 'kitchen sink',
        domains: [
            {
                domain: 'test.com',
                protocol: 'http'
            }
        ],
        id: 'abc-123-def-456',
        caching: [
            {
                ttl: 3600,
                name: 'home',
                rules: [
                    {
                        request_url: '/index.html',
                        name: 'index'
                    }
                ]
            }
        ]
    };

    fixtures.cdn.service = {
        get: {
            notFound: {
                error: {
                    type: 'Bad Request',
                    code: 400,
                    message: 'Invalid service id'
                }
            },
            kitchenSink: {
                service: _kitchenSink
            },
            emptyService: {
                service: _emptyService
            }
        },
        list: {
            notFound: {
                error: {
                    type: 'Not Found',
                    code: 404,
                    message: 'Region not found.'
                }
            },
            forbidden: {
                error: {
                    type: 'Forbidden',
                    code: 403,
                    message: 'Something went wrong with CDN, we couldn\'t find the error, please contact this service.'
                }
            },
            kitchenSinks: {
                services: [_kitchenSink]
            },
            emptyServices: {
                services: [_emptyService]
            },
            loadedServices: {
                services: [_kitchenSink, _emptyService]
            }
        }
    };//fixtures.cdn.service
})();

angular.module('encore.svcs.cloud.cdn')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cdn.CDNServiceRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * API Route for $resource consumption
 */
.factory('CDNServiceRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/cdn/:accountId/:serviceId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cdn.CDNService
 * @requires $resource
 * @requires encore.svcs.cloud.cdn.CDNServiceRoute
 * @requires encore.svcs.cloud.cdn.CDNServiceTransforms
 * @description
 *
 * Service for interacting with Encore Cloud API for CDN functionality.
 *
 * Rackspace Documentation: http://docs.rackspace.com/cdn/api/v1.0/cdn-devguide/content/Overview.html
 */
.factory('CDNService', ["$resource", "CDNServiceRoute", "CDNServiceTransforms", "GetCloudURL", function ($resource, CDNServiceRoute, CDNServiceTransforms, GetCloudURL) {
    var resource = $resource(CDNServiceRoute, {
        user: '@user',
        accountId: '@accountId',
        serviceId: '@serviceId'
    }, {
        /**
         * @ngdoc method
         * @name CDNService#list
         * @methodOf encore.svcs.cloud.cdn.CDNService
         * @description
         *
         * Retrieve a list of CDN Services
         */
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: CDNServiceTransforms.list
        },
        /**
         * @ngdoc method
         * @name CDN#get
         * @methodOf encore.svcs.cloud.cdn.CDNService
         * @description
         *
         * Retrieve a single CDN Service resource
         */
        get: {
            method: 'GET',
            transformResponse: CDNServiceTransforms.get
        }
    });

    resource.prototype.getURL = function (accountNumber, user) {
        return GetCloudURL(accountNumber, user).cdn + '/' + this.id;
    };

    return resource;
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.cdn.CDNServiceTransforms
 * @requires TransformUtil
 * @description
 *
 * Service providing transform functions
 */
.factory('CDNServiceTransforms', ["TransformUtil", function (TransformUtil) {
    function _transformItem (item) {
        if (_.has(item, 'error')) {
            return item;
        }

        item.origins = item.origins.map(function (origin) {
            _.defaults(origin, { port: 80 }, { ssl: false });
            return origin;
        });

        item.domains = item.domains.map(function (domain) {
            _.defaults(domain, { protocol: 'http' });
            return domain;
        });
        return item;
    }//_transformItem()

    var _transforms = {
        /**
         * @ngdoc method
         * @name encore.svcs.cloud.cdn.CDNServiceTransforms#list
         * @methodOf encore.svcs.cloud.cdn.CDNServiceTransforms
         * @description
         *
         * On success it transforms the origin and domains properties.
         * On error it wraps the error object inside an array.
         * #TODO: Review logic
         * Should not wrap the error object inside an array.
         */
        list: [TransformUtil.pluckList('services'),
               TransformUtil.mapList(_transformItem)],

        get: function (data) {
            /*
             * We need to check for an error.code of 400 (returned by api, not
             * http status) in the event that we request an invalid service
             * for an account without CDN enabled.
             */
            if (data.error && data.error.code === 400) {
                return { name: 'Unknown Service' };
            }
            return _transformItem(data.service);
        }
    };//_transforms

    return {
        list: TransformUtil.responseChain(_transforms.list),
        get: TransformUtil.responseChain(_transforms.get)
    };
}]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.cloud.common', [
    'ngResource',
    'encore.svcs.cloud.config',
    'encore.svcs.util.url'
]);

angular.module('encore.svcs.cloud.common')
    .value('ROUTE_PATHS', {})
    .value('PRODUCT_VERSIONS', {})
    .factory('BreadcrumbUtil', ["$route", "$location", "$routeParams", "ROUTE_PATHS", "PRODUCT_VERSIONS", "URLUtil", function ($route, $location, $routeParams, ROUTE_PATHS, PRODUCT_VERSIONS,
                URLUtil) {

        var interpolate = function (uri) {
            return URLUtil.interpolateRoute(uri, _.clone($route.current.pathParams));
        };

        var parentDetails = function (parentName) {
            return ROUTE_PATHS[parentName];
        };

        var getParentStatus = function (parent) {
            return PRODUCT_VERSIONS[parent];
        };

        /**
         * @ngdoc function
         * @name nestedBreadcrumb
         * @param {string} details (of route_path)
         * @param {object} breadcrumbs (referencing current breadcrumbs)
         * @param {string} prefix (for setting up whole url) parameter
         * @description
         * Method is used to create nested breadcrumb, when there are more level of parent and child
         * relationship between route paths. This has nested method call if it finds the route_path that has
         * its parent, which will then displayed in appropriate order of breadcrumb.
         * @returns {Array} breadcrumbs array
         *
         * @example
         * <pre>
         * var details = {
         *     uri: '/:accountNumber/:user/loadbalancers/:region/:loadbalancerid/historicalusage',
         *     parent: 'showLoadBalancer',
         *     detailName: 'Historical Usage'
         * };
         *
         * var breadcrumbs = [{
         *     name: 'User hub_cap',
         *     path: '/cloud/323676/hub_cap'
         * }];
         *
         * var prefix = '/cloud';
         *
         * var breadcrumbs = nestedBreadcrumb(details, breadcrumbs, prefix);
         * </pre>
         * <pre>
         * // return breadcrumbs value
         *
         * [
         *   {
         *     name: 'User hub_cap',
         *     path: '/cloud/323676/hub_cap'
         *   },
         *   {
         *     name: 'Load Balancers',
         *     path: '/cloud/323676/hub_cap/loadbalancers'
         *   },
         *   {
         *     name: 'Load Balancer Details',
         *     path: '/cloud/323676/hub_cap/loadbalancers/STAGING/57361'
         *   }
         * ]
         * </pre>
         */
        var nestedBreadcrumb = function (details, breadcrumbs, prefix) {
            var _parentDetails = parentDetails(details.parent);
            var breadcrumb = {
                path: prefix + interpolate(_parentDetails.uri),
                name: (_parentDetails.pathName) ? _parentDetails.pathName : _parentDetails.detailName
            };
            var parentStatus = getParentStatus(_parentDetails.pathName);
            if (parentStatus) {
                breadcrumb.status = parentStatus;
            } else {
                breadcrumb.usePageStatusTag = true;
            }

            // The purpose is to add a breadcrumb at the 2nd level from top to make it parent
            if (breadcrumbs.length > 1) {
                breadcrumbs.splice(1, 0, breadcrumb);
            } else {
                breadcrumbs.push(breadcrumb);
            }

            // This is nested call, when the current entry has parent details associated with
            // it. This way the current entry would be considered and displayed after the
            // parent entry.
            if (_.has(_parentDetails, 'parent')) {
                breadcrumbs = nestedBreadcrumb(_parentDetails, breadcrumbs, prefix);
            }
            return breadcrumbs;
        };

        return {
            setup: function (prefix) {
                var breadcrumbs, currentPath = $location.path();
                prefix = (prefix) ? '/' + prefix : '';

                _.forEach(ROUTE_PATHS, function (details) {
                    var path = interpolate(details.uri);
                    if (path === currentPath) {
                        breadcrumbs = [{
                            path: prefix + '/' + $routeParams.accountNumber + '/' + $routeParams.user,
                            name: 'User ' + $routeParams.user
                        }];

                        if (_.has(details, 'pathName')) {
                            breadcrumbs.push({ path: prefix + path, name: details.pathName, usePageStatusTag: true });
                        } else if (_.has(details, 'parent')) {
                            breadcrumbs = nestedBreadcrumb(details, breadcrumbs, prefix);
                        }

                        breadcrumbs.push({ name: details.detailName });
                        return false;
                    }
                });

                return breadcrumbs;
            }
        };

    }]);

angular.module('encore.svcs.cloud.common')
    .directive('rxClipboardCopy', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.on('focus', function () {
                    this.select();
                });
            }
        };
    });

var fixtures = fixtures || {};

fixtures.errors = {
    400: {
        data: [
            {
                error: {
                    message: 'Failed to parse input'
                }
            }
        ],
        status: 400,
        statusText: 'Bad Request'
    },
    405: {
        status: 405,
        statusText: 'Method Not Allowed'
    },
    404: {
        code: 404,
        status: 'Not Found',
        message: 'Upstream API not found'
    },
    500: {
        code: 500,
        status: 'Internal Server Error',
        message: 'Server blew up'
    }
}

angular.module('encore.svcs.cloud.common')
/* @ngdoc service
 * @name encore.svcs.cloud.common.CloudErrorHandlerService
 * @requires $q
 * @requires $interpolate
 * @requires $rootScope
 * @description
 * A common error handler that is the source of truth
 * on how to handle errors in Encore Cloud
 *
 * @example
 * # Pass resolution message to Status.setError directly
 * <pre>
 * CloudErrorHandlerService(errorObj, 'some action made').then(Status.setError);
 * </pre>
 * # Check message and take actions based on message
 * <pre>
 * CloudErrorHandlerService(errorObj, 'some action made').then(function (msg) {
 *    if (_.contains(msg.toLowerString(), 'timeout')) {
 *        // let's reload if we timed out
 *        $timeout(function () {
 *            CloudService.get({ user: 'hub_cap' });
 *        }, 1000);
 *    } else {
 *        Status.setError(msg);
 *    }
 * });
 * </pre>
 */
.factory('CloudErrorHandlerService', ["$q", "$interpolate", "$rootScope", function ($q, $interpolate, $rootScope) {

    var DEFAULT_MSG = 'So sorry, this resource is currently unavailable.';

    // Private function to get the error message from an error object
    var parseResponse = function (response) {
        if (_.has(response, 'data')) {
            var dataObj = _.isArray(response.data) ? response.data[0] : response.data;
            if (_.has(dataObj, 'error')) {
                return dataObj.error.message;
            }
        }
        return response.message || response.statusText || DEFAULT_MSG;
    };

    return function (error, action, template) {
        var self = this;
        self.error = parseResponse(error);
        self.action = action;
        self.defer = $q.defer();
        self.template = template || 'Unable to {{ action }}: {{ message }}';
        self.interpolater = $interpolate(self.template);

        /* @ngdoc method
         * @name CloudErrorHandlerService#handle
         * @methodOf encore.svcs.cloud.common.CloudErrorHandlerService
         * @description
         *
         * Resolves a deferred promise with the interpolated message template
         *
         */
        self.handle = function () {
            self.defer.resolve(self.interpolater({
                action: self.action,
                message: self.error
            }));
        };

        /* @ngdoc method
         * @name CloudErrorHandlerService#resolve
         * @methodOf encore.svcs.cloud.common.CloudErrorHandlerService
         * @description
         *
         * fires the handle function using the $evalAsync() which
         * will fire the event off in ~10ms after being called.
         */
        self.resolve = function () {
            $rootScope.$evalAsync(self.handle);
            return self;
        };

        return self.resolve().defer.promise;
    };
}]);

angular.module('encore.svcs.cloud.common')
    .factory('PageSvcPostHook', ["rxNotify", "$interpolate", function (rxNotify, $interpolate) {
        // #TODO: Come up with a better name for svc
        return function (pageScope, svc, defaultParams, msgs, postHook) {
            return function (actionParams) {
                var svcSuccess = function (data) {
                    // set to 'success' state
                    if (!_.isEmpty(msgs.success)) {
                        rxNotify.add(msgs.success, { type: 'success' });
                    }

                    if (_.isFunction(postHook)) {
                        postHook(data);
                    }
                };

                var svcFailure = function (data) {
                    // convert any bound properties into a string based on obj from result
                    if (!_.isEmpty(msgs.fail)) {
                        var exp = $interpolate(msgs.fail);
                        var msg = exp(data);

                        // set to 'failure' state
                        rxNotify.add(msg, { type: 'error' });
                    }
                };

                // set to 'loading' state
                pageScope.pageSvcLoaded = false;

                if (!_.isEmpty(msgs.loading)) {
                    rxNotify.add(msgs.loading, {
                        loading: true,
                        dismiss: [ pageScope, 'pageSvcLoaded' ]
                    });
                }

                var promise = svc(defaultParams, actionParams);
                if (promise.$promise) {
                    promise = promise.$promise;
                }
                promise.then(svcSuccess).catch(svcFailure).finally(function () {
                    pageScope.pageSvcLoaded = true;
                });
            };
        };
    }]);

angular.module('encore.svcs.cloud.common')
    /*
     * This defines the 'pretty' names for each region
     */
    .constant('CLOUD_REGIONS', [{
        label: 'ORD (Chicago)',
        value: 'ORD',
        type: 'NextGen'
    }, {
        label: 'DFW (Dallas)',
        value: 'DFW',
        type: 'NextGen'
    }, {
        // #TODO: Possibly rename to proper spelling, 'North Virginia'
        label: 'IAD (North Virgina)',
        value: 'IAD',
        type: 'NextGen'
    }, {
        label: 'SYD (Sydney)',
        value: 'SYD',
        type: 'NextGen'
    }, {
        label: 'LON (London)',
        value: 'LON',
        type: 'NextGen'
    }, {
        label: 'HKG (Hong Kong)',
        value: 'HKG',
        type: 'NextGen'
    }, {
        label: 'STAGING (Staging)',
        value: 'STAGING',
        type: 'NextGen'
    }, {
        label: 'QE-ORD (Chicago)',
        value: 'QE-ORD',
        type: 'NextGen'
    }, {
        label: 'PREPROD',
        value: 'PREPROD',
        type: 'NextGen'
    }])
    /*
     * Associate the Service name with the Service Catalog type
     */
    .constant('CLOUD_CATALOG_TYPE', [{
        name: 'NextGen',
        type: 'compute'
    }, {
        name: 'Volumes',
        type: 'volume'
    }, {
        name: 'Snapshots',
        type: 'volume'
    }, {
        name: 'Databases',
        type: 'rax:database'
    }, {
        name: 'LoadBalancers',
        type: 'rax:load-balancer'
    }, {
        name: 'Networks',
        type: 'compute'
    }, {
        name: 'Images',
        type: 'image'
    }, {
        name: 'RackConnect',
        type: 'rax:rackconnect'
    }])
    /*
     * This service retrieves the region data by pulling down the user's Service Catalog,
     * looping through it, and parsing out the available regions.
     *
     * @ngdoc Service
     *
     */
    .factory('CloudRegions', ["CloudUsers", "CLOUD_REGIONS", "CLOUD_CATALOG_TYPE", "$q", function (CloudUsers, CLOUD_REGIONS, CLOUD_CATALOG_TYPE, $q) {
        var regions = [];
        /*
         * This parses the API response to retrieve an deduped array of region objects
         * @param {String} filterType - a service name from CLOUD_CATALOG_TYPE to filter on
         * @param {Object} data - data to parse. Expected format is:
         *     {
         *         'endpoints:': [{
         *             'region': 'ORD'
         *             'somethingElse': 'yeah',
         *         }, {
         *             'region': 'DFW'
         *             'somethingElse': 'huh',
         *         }]
         *     }
         * @returns {Array} Array of objects with dupes and null region values removed
         */
        var parseData = function (filterType, data) {
            var catalogType = getCatalogType(filterType);

            regions = _.reduce(data.endpoints, function (result, region) {

                if (filterType === undefined || catalogType.type === region.type) {
                    var tmp = { 'name': region.region, 'type': region.type };

                    if (!_.isEmpty(tmp.type) && !_.isEmpty(tmp.name) && _.find(result, tmp) === undefined) {
                        result.push(tmp);
                    }
                }
                return result;
            }, []);

            return regions;
        };

        /*
         * This function checks that regions have not already been retrieved and acts accordingly.
         * It grabs the service catalog for the user and parses out the appropriate data. It will
         * only reject if there is an error retrieving the service catalog
         * @param {String} user - username to pass to CloudUsers.catalog API call
         * @param {String} filterType - filter service catalog to only entries with the product name provided
         * @returns {Object} a promise that will be resolved when the regions are retrieved
         */
        var getRegions = function (user, filterType) {
            var deferred = $q.defer(),
                apiCall;

            // make call to user's service catalog and parse the result
            apiCall = CloudUsers.catalog({ user: user });
            apiCall.$promise.catch(deferred.reject);

            // on response, convert to array, then resolve
            apiCall.$promise.then(parseData.bind(this, filterType)).then(deferred.resolve);

            return deferred.promise;
        };

        var getCatalogType = function (filter) {
            return _.find(CLOUD_CATALOG_TYPE, { 'name': filter });
        };

        /*
         * This function converts an array of CloudRegions to a format friendly to rx-form-radio
         * @param {Array} region - The regions to convert
         * @returns {Array} an array of CloudRegions in rx-form-radio friendly format
         */
        var convertToFormFriendly = function (regions) {
            var filteredRegions = _.filter(CLOUD_REGIONS, function (region) {
                return _.findIndex(regions, { 'name': region.value }) > -1;
            });

            return filteredRegions;
        };

        return {
            getRegions: getRegions,
            convert: convertToFormFriendly
        };
    }])
    // This utility takes care of loading data from and API service for every region
    .factory('CloudRegionsUtil', ["CloudRegions", "$q", "CLOUD_CATALOG_TYPE", "CloudAllSettled", "ErrorFormatter", function (CloudRegions, $q, CLOUD_CATALOG_TYPE, CloudAllSettled, ErrorFormatter) {
        /*
         * Adds the region information to the data
         * @param {String} region - region name
         * @returns {Object} original data with region added to each item
         */
        var addRegionToData = function (region, scopeProp, data) {
            var regionData = data;
            if (!_.isArray(data)) {
                regionData = data[scopeProp];
            }

            // add region to each item for that region
            _.each(regionData, function addRegionToItem (item) {
                item.region = region;
            });

            return regionData;
        };

        /*
         * Handles making requests to the service API for each region, then formatting those requests and returning them
         * @param {Object} config - Configuration object with service information in it
         * @param {Object} deferred - Promise to update upon success/failure/notify
         * @param {Array} regions - CloudRegions to make service calls to
         * @returns null
         */
        var requestRegionData = function (config, deferred, regions) {
            var data = [];
            var failedRequests = [];
            var apiPromises = [];
            var catalogType = _.find(CLOUD_CATALOG_TYPE, { 'name': config.name });
            var params = _.defaults({
                user: config.user,
                visibility: config.visibility
            }, config.params);

            _.each(regions, function (regionObj) {
                if (regionObj.type !== catalogType.type) {
                    return;
                }
                var region = regionObj.name;

                params.region = region;
                // make service call and return promise
                var apiPromise = config.svc(params).$promise;

                // get relevant data out of the service response
                apiPromise
                    .then(addRegionToData.bind(this, region, config.scopeProp))
                    .then(function (regionData) {
                        // notify parent promise of data update
                        deferred.notify(regionData);
                        // add that data to the full list
                        data = data.concat(regionData);
                    });

                // catch any error responses
                apiPromise.catch(function handleApiFailure (error) {
                    // create list of failed regions to be sent back upon promise rejection
                    error.region = region;
                    var message = ErrorFormatter.buildErrorMsg('${region} - ${message}', error);
                    failedRequests.push(message);
                });

                apiPromises.push(apiPromise);
            });

            // create a promise that listens to our APIs and resolves/rejects accordingly
            CloudAllSettled.allSettled(apiPromises).then(
                function () {
                    deferred.resolve(data);
                },
                function () {
                deferred.reject(failedRequests);
            });
        };

        /*
         * Makes a service request for each region and runs a callback
         *
         * This promise can reject for two reasons:
         *  1. We are unable to get the user's service catalog
         *  2. One or more of the regions resulted in an error
         *
         * Note that this will not reject until all individual regions have resolved/rejected. So
         * if you're tracking the incoming results through a notifyCallback, then you'll have all
         * the available data by the time the rejection happens.
         *
         * @param {Object} config - Details for the request
         * @param {Object} config.svc - the API service to call
         * @param {String} config.name - the user friendly name to use for error messages
         * @param {String} config.scopeProp - the property the API data will be attached to
         * @param {String} config.user - the user to get the data for
         * @param {String} config.visibilty - the visibility type of image
         * @param {String} config.regionsCallback - optional function to call when we retrieve the region names
         */
        var loadDataForEachRegion = function (config) {
            var deferred = $q.defer();

            var regionsPromise = CloudRegions.getRegions(config.user, config.name);

            var extractError = function (error) {
                /*
                 * If we return a body with a 404, then Angular will put that body
                 * inside of a `data` attribute inside of `error`. We want to extract it
                 */
                if (_.has(error, 'data') && _.has(error.data, 'error')) {
                    error = error.data.error;
                } else if (_.isString(error)) {
                    error = { message: error };
                }
                return error;

            };

            regionsPromise
                .then(function (regions) {
                    if (_.isFunction(config.regionsCallback)) {
                        config.regionsCallback(regions);
                    }
                    requestRegionData(config, deferred, regions);
                },
                    function (error) {
                    error = extractError(error);
                    error.configName = config.name;
                    var message = ErrorFormatter.buildErrorMsg('${configName}: ${message}', error);
                    deferred.reject([message]);
                });

            return deferred.promise;
        };

        return {
            loadDataForEachRegion: loadDataForEachRegion
        };
    }])
    // TODO convert this to an addon of for $q
    .factory('CloudAllSettled', ["$q", function ($q) {
        // Because $q does not have an 'allSettled' function, we need to recreate the functionality
        // so, we'll manually check if all the promises have been resolved, and respond accordingly

        /*
         * Creates a new promise that resolves only when all promises have completed
         * @param {Array} promises - The promises that we're going to wait for
         * @returns {Object} Promise tied to promises passed in
         */
        var allSettled = function (promises) {
            var deferred = $q.defer();
            var promisesCount = promises.length;
            var promisesComplete = 0;
            var hasPromiseFailed = false;

            /*
             * increments the number of resolved promises, checks if they've all resolved,
             * and resolves parent promise accordingly
             */
            var resolvePromise = function () {
                promisesComplete++;
                deferred.notify(promisesComplete);
                if (promisesComplete === promisesCount) {
                    (hasPromiseFailed) ? deferred.reject() : deferred.resolve();
                }
            };

            var rejectPromise = function () {
                hasPromiseFailed = true;
                resolvePromise();
            };

            _.each(promises, function (promise) {
                promise.then(resolvePromise, rejectPromise);
            });

            return deferred.promise;
        };

        return {
            allSettled: allSettled
        };
    }])
    .factory('CloudRegionStatusUpdate', ["Status", function (Status) {
        /*
         * This factory returns an object with a few functions in it, which you can call to get
         * the components necessary for per-region loading updates.
         * Most of the time, you should only need to use buildRegionsCallback and promiseHandler.
         *
         * buildRegionsCallback is used to create a callback for the `config` object
         * passed to loadDataForEachRegion. promiseHandler gets passed the promise
         * for loadDataForEachRegion and takes care of updating the Loading spinners
         * whenever data for a new region comes in.
         *
         * Make sure that your own notify function returns the data that gets passed to it,
         * otherwise that data won't be propagated through the promise
         */

        // 'Global' variable to hold base string
        // Couldn't be declared in return function
        var msgTemplate;

        /*
         * Call this in a finally() for loadDataForEachRegion, and it will
         * clear the Loading spinners for any of the regions that had no data
         */
        var clearEmptyRegions = function (allRegions) {
            //Removes remaining loading banner for regions with no data
            Status.complete({ prop: 'allRegions' + allRegions.join('') });
        };

        /*
         * Call this function in the notify method for loadDataForEachRegion.
         * It will figure out which region the data represents, and remove
         * the Loading message for that region
         */
        var notifyCallback = function (allRegions, data) {
            if (data.length > 0) {
                var regionName = data[0].region;
                if (!_.isUndefined(regionName)) {
                    //Clear the current loading bar before setting another
                    //To keep the number of loading notifs down to one
                    Status.complete({ prop: 'allRegions' + allRegions.join('') });
                    _.pull(allRegions, regionName);
                    var msg = msgTemplate({ regionName: allRegions.join(', ') });
                    Status.setLoading(msg, { prop: 'allRegions' + allRegions.join('') });
                }
            }
        };

        return function () {
            var allRegions = [];
            
            /*
             * Given a baseString with ${regionName} in it, this will generate a function
             * to be used as the regionsCallback in a config object passed to loadDataForEachRegion
             * Once the CloudRegions service has retrieved the regions, this function will use the baseString
             * to build Loading messages for each of the regions
             */
            var buildRegionsCallback = function (baseString) {
                msgTemplate = _.template(baseString);

                var regionsCallback = function (regions) {

                    _.each(regions, function (region) {
                        allRegions.push(region.name);
                    });

                    var msg = msgTemplate({ regionName: allRegions.join(', ') });
                    Status.setLoading(msg, { prop: 'allRegions' + allRegions.join('') });

                };
                return regionsCallback;
            };

            /*
             * Pass this function the promise responsible for loading all your data (something
             * like loadDataForEachRegion, or NetworksUtils.fetchNetworks), and it will
             * take care of calling notifyCallback during each notify, and will call
             * clearEmptyRegions when the promise is complete
             */
            var promiseHandler = function (promise) {
                promise.then(
                    function (data) { return data; },
                    null,
                    function (dataUpdate) {
                        notifyCallback(allRegions, dataUpdate);
                        return dataUpdate;
                    }
                )
                .finally(function () {
                    clearEmptyRegions(allRegions);
                });

            };

            return {
                // Only use these two if you don't want to use the automatic promiseHandler.
                notifyCallback: notifyCallback,
                clearEmptyRegions: function () { return clearEmptyRegions(allRegions); },

                // Generally you should only need these two
                buildRegionsCallback: buildRegionsCallback,
                promiseHandler: promiseHandler
            };

        };

    }]);

angular.module('encore.svcs.cloud.common')
    .factory('TableBoilerplate', ["PageTracking", "rxSortUtil", function (PageTracking, rxSortUtil) {

        var sortCol = function (scope) {
            return function (predicate) {
                return rxSortUtil.sortCol(scope, predicate);
            };
        };

        var resetPage = function (scope) {
            return function () {
                scope.pager.pageNumber = 0;
            };
        };

        var clearFilter = function (scope) {
            return function () {
                scope.filter = {};
                scope.resetPage();
            };
        };
        return {
            setup: function (scope, sort) {
                scope.filter = {};
                scope.sort = rxSortUtil.getDefault(sort.predicate, sort.reverse);
                scope.pager = PageTracking.createInstance();
                scope.resetPage = resetPage(scope);
                scope.clearFilter = clearFilter(scope);
                scope.sortCol = sortCol(scope);

            }
        };

    }]);

angular.module('encore.svcs.cloud.common')
    .factory('CloudUsers', ["$resource", "CLOUD_API_URL_BASE", function ($resource, CLOUD_API_URL_BASE) {
        var apiPath = CLOUD_API_URL_BASE + '/users/:user/:action';
        var users = $resource(apiPath, {}, {
            catalog: {
                method: 'GET',
                params: {
                    action: 'service_catalog'
                }
            },
            reach: {
                method: 'GET',
                params: {
                    action: 'reach'
                }
            }

        });

        return users;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.dbaas
 *
 * @description
 * Services used for manipulation and retrieval of Dbaas service data
 */
angular.module('encore.svcs.cloud.dbaas', [
    'encore.common.http',
    'encore.util.transform'
])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * returns a string representation of the base path for the Dbaas API
 */
.factory('DbaasBaseRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/dbaas/:region';
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasDatabaseAccessResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasRoute
 * @description
 *
 * '$resource' definition of the Dbaas Database Access API
 *
 * PUT: Grants access for the specified user to one or more databases for the specified instance.
 * DELETE: Removes access to the specified database for the specified user.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/PUT_grantUserAccess__version___accountId__instances__instanceId__users__name__databases_user_management.html
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/DELETE_revokeUserAccess__version___accountId__instances__instanceId__users__name__databases__databaseName__user_management.html
 */
.factory('DbaasDatabaseAccessResource', ["$resource", "DbaasUserRoute", function ($resource, DbaasUserRoute) {
    return $resource(DbaasUserRoute + '/databases/:databasename', {
        user: '@user',
        region: '@region',
        id: '@id',
        dbUsername: '@accountId',
        databasename: '@name'
    }, {
       /**
         * @ngdoc method
         * @name DbaasDatabaseAccesResource#update
         * @methodOf encore.svcs.cloud.dbaas.DbaasDatabaseAccessResource
         * @description
         *
         * Grants users access to certain databases
         */ 
        update: {
            method: 'PUT',
        }
    });
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasDatabaseRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas Database API
 */
.factory('DbaasDatabaseRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/instances/:id/databases';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasDatabaseResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasDatabaseRoute
 * @description
 *
 * '$resource' definition of the Dbaas Database API
 *
 * GET: Lists databases for the specified instance.
 * POST: Creates a new database within the specified instance.
 * DELETE: Deletes the specified database.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/databases.html
 */
.factory('DbaasDatabaseResource', ["$resource", "DbaasDatabaseRoute", function ($resource, DbaasDatabaseRoute) {
    return $resource(DbaasDatabaseRoute + '/:databasename', {
        user: '@user',
        region: '@region',
        id: '@id',
        databasename: '@name'
    });
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasFlavorRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas flavor API
 */
.factory('DbaasFlavorRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/:id/flavors';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasFlavorResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasFlavorRoute
 * @description
 *
 * '$resource' definition of Dbaas API
 *
 * GET: Lists information for all available flavors.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/flavors.html
 */
.factory('DbaasFlavorResource', ["$resource", "DbaasFlavorRoute", function ($resource, DbaasFlavorRoute) {
    return $resource(DbaasFlavorRoute, {
        user: '@user',
        region: '@region',
        id: '@id'
    });
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasInstanceRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas Instance API
 */
.factory('DbaasInstanceRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/instances/:id';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasInstanceActionRoute
 * @requires encore.svcs.cloud.dbaas.DbaasInstanceRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas Instance Actions API
 */
.factory('DbaasInstanceActionRoute', ["DbaasInstanceRoute", function (DbaasInstanceRoute) {
    return DbaasInstanceRoute + '/action/:action/:actionParam';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasInstanceResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasInstanceRoute
 * @description
 *
 * '$resource' definition of the Dbaas Instance API
 *
 * GET: Lists the status and information for all database instances.
 * POST: Creates a new database instance.
 * PUT: Associates a specified database instance with a configuration group.
 * DELETE: Deletes the specified database instance.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/Database_Instances.html
 */
.factory('DbaasInstanceResource', ["$resource", "DbaasInstanceRoute", "DbaasInstanceActionRoute", function ($resource, DbaasInstanceRoute,
            DbaasInstanceActionRoute) {
    return $resource(DbaasInstanceRoute, {
        user: '@user',
        region: '@region',
        id: '@id'
    }, {
        /**
         * @ngdoc method
         * @name DbaasInstanceResource#changeFlavor
         * @methodOf encore.svcs.cloud.dbaas.DbaasInstanceResource
         * @description
         *
         * Changes the instance flavor which represents the RAM allocated
         */
        changeFlavor: {
            url: DbaasInstanceActionRoute,
            method: 'POST',
            params: {
                action: 'resize_instance',
                actionParam: '@flavor'
            }
        },
        /**
         * @ngdoc method
         * @name DbaasInstanceResource#resize
         * @methodOf encore.svcs.cloud.dbaas.DbaasInstanceResource
         * @description
         *
         * Changes the volume of the instance which represents the hard disk space allocated
         */
        resize: {
            url: DbaasInstanceActionRoute,
            method: 'POST',
            params: {
                action: 'resize_volume',
                actionParam: '@size'
            }
        },
        /**
         * @ngdoc method
         * @name DbaasInstanceResource#restart
         * @methodOf encore.svcs.cloud.dbaas.DbaasInstanceResource
         * @description
         *
         * Tells the instance to restart
         */
        restart: {
            url: DbaasInstanceActionRoute,
            method: 'POST',
            params: {
                action: 'restart',
            }
        }
    });
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasRootRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas Root API
 */
.factory('DbaasRootRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/instances/:id/root';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasRootResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasRootRoute
 * @description
 *
 * '$resource' definition of Dbaas API
 *
 * GET: Returns true if root user is enabled for the specified database instance or false otherwise.
 * POST: Enables the root user for the specified database instance and returns the root password.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/GET_isRootEnabled__version___accountId__instances__instanceId__root_Database_Instances.html
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/POST_createRoot__version___accountId__instances__instanceId__root_Database_Instances.html
 */
.factory('DbaasRootResource', ["$resource", "DbaasRootRoute", function ($resource, DbaasRootRoute) {
    return $resource(DbaasRootRoute, {
        user: '@user',
        region: '@region',
        id: '@id'
    });
}]);

angular.module('encore.svcs.cloud.dbaas')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasUserRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas User API
 */
.factory('DbaasUserRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/instances/:id/users/:dbUsername';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasUserActionRoute
 * @requires encore.svcs.cloud.dbaas.DbaasBaseRoute
 * @description
 *
 * returns a string representation of the path for the Dbaas User API that manages user access
 */
.factory('DbaasUserActionRoute', ["DbaasBaseRoute", function (DbaasBaseRoute) {
    return DbaasBaseRoute + '/instances/:id/users/:dbUsername/databases/access';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dbaas.DbaasUserResource
 * @requires $resource
 * @requires encore.svcs.cloud.dbaas.DbaasUserRoute
 * @description
 *
 * '$resource' definition of the Dbaas User API
 *
 * GET: Lists the users in the specified database instance.
 * POST: Creates a user for the specified database instance.
 * PUT: Changes the database password of one or more users.
 * DELET: Deletes the user identified by {name} for the specified database instance.
 *
 * http://docs.rackspace.com/cdb/api/v1.0/cdb-devguide/content/user_management.html
 */
.factory('DbaasUserResource', ["$resource", "DbaasUserRoute", "DbaasUserActionRoute", function ($resource, DbaasUserRoute, DbaasUserActionRoute) {
    return $resource(DbaasUserRoute, {
        user: '@user',
        region: '@region',
        id: '@id',
        dbUsername: '@name'
    }, {
        /**
         * @ngdoc method
         * @name DbaasUserResource#update
         * @methodOf encore.svcs.cloud.dbaas.DbaasUserResource
         * @description
         *
         * Definition of API interface that is used to alter a users information.
         * Primarily users password.
         */
        update: {
            method: 'PUT',
        },
        /**
         * @ngdoc method
         * @name DbaasUserResource#manageUserAccess
         * @methodOf encore.svcs.cloud.dbaas.DbaasUserResource
         * @param {String} [dbUsername] - Username to interact with<br />
         *      For Example:
         *      <pre>{ 'dbUsername': 'user' }</pre>
         * @description
         *
         * Definition of API interface that is used to alter a users access.
         * This requires that a dbUsername be passed.
         */
        manageUserAccess: {
            url: DbaasUserActionRoute,
            method: 'PUT'
        }
    });
}]);

var fixtures = fixtures || {};

(function () {
    var databases =  [{
        'updated_on': '2014-01-08T21:17:24',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/432e170c-7cbd-4144-8da0-6d0a4c705ace'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/432e170c-7cbd-4144-8da0-6d0a4c705ace'
        }],
        'volume': {
            'size': 15
        },
        'created_on': '2014-01-08T21:17:18',
        'name': 'AlphaInstance',
        'id': '432e170c-7cbd-4144-8da0-6d0a4c705ace',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': 'df71988f9e44f90532e70006c2d76d2491ddef5d.staging.rackspaceclouddb.com',
        'region': 'STAGING',
        'status': 'ACTIVE'
    },
    {
        'updated_on': '2013-12-26T16:56:15',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/547b3c8a-a8d8-40b9-ba92-324afa7b90ef'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/547b3c8a-a8d8-40b9-ba92-324afa7b90ef'
        }],
        'volume': {
            'size': 2
        },
        'created_on': '2013-12-26T16:56:10',
        'name': 'BetaInstance',
        'id': '547b3c8a-a8d8-40b9-ba92-324afa7b90ef',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': '8ae6f1e7ac244b923400a37372ba1b53ae774531.staging.rackspaceclouddb.com',
        'region': 'STAGING',
        'status': 'ACTIVE'
    },
    {
        'updated_on': '',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/7c227e01-50ad-4fe3-a3c6-d1b6fddf578a'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/7c227e01-50ad-4fe3-a3c6-d1b6fddf578a'
        }],
        'volume': {
            'size': 4
        },
        'created_on': '',
        'name': 'FooInstance1',
        'id': '7c227e01-50ad-4fe3-a3c6-d1b6fddf578a',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': '',
        'region': 'STAGING',
        'status': 'ACTIVE'
    },
    {
        'updated_on': '',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/d6fe4e78-c1ee-4b39-a9c8-f02f6930eb09'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/d6fe4e78-c1ee-4b39-a9c8-f02f6930eb09'
        }],
        'volume': {
            'size': 2
        },
        'created_on': '',
        'name': 'TestInstance1',
        'id': 'd6fe4e78-c1ee-4b39-a9c8-f02f6930eb09',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': '',
        'region': 'STAGING',
        'status': 'ACTIVE'
    },
    {
        'updated_on': '2013-12-25T12:34:50',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/f46c9c04-32f7-4e81-ab73-a1446b0576ad'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/f46c9c04-32f7-4e81-ab73-a1446b0576ad'
        }],
        'volume': {
            'size': 8
        },
        'created_on': '2013-12-20T09:22:50',
        'name': 'test_instance',
        'id': 'f46c9c04-32f7-4e81-ab73-a1446b0576ad',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': '',
        'region': 'STAGING',
        'status': 'ACTIVE'
    },
    {
        'updated_on': '2013-12-25T12:34:50',
        'links': [{
            'rel': 'self',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/instances/f46c9c04-32f7-4e81-ab73-a1446b0576ad'
        },
        {
            'rel': 'bookmark',
            'href': 'https://api.staging.ord1.clouddb.rackspace.net/instances/f46c9c04-32f7-4e81-ab73-a1446b0576ad'
        }],
        'volume': {
            'size': 8
        },
        'created_on': '2013-12-20T09:22:50',
        'name': 'No_Users_Or_Databases',
        'id': 'emptydbinstance',
        'flavor': {
            'links': [{
                'rel': 'self',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/v1.0/323676/flavors/1'
            },
            {
                'rel': 'bookmark',
                'href': 'https://api.staging.ord1.clouddb.rackspace.net/flavors/1'
            }],
            'ram': null,
            'disk_size': null,
            'name': '512MB Instance',
            'id': '1',
            'vcpus': null
        },
        'hostname': '',
        'region': 'STAGING',
        'status': 'ACTIVE'
    }];

    fixtures.dbaas = {
        databases: databases
    }
})();

angular.module('encore.svcs.cloud.dbaas')
/**
* @ngdoc filter
* @name encore.svcs.cloud.dbaas.InstanceAttributes
* @description
* Filter which refines the collection of rows based on the criteria provided. If no criteria are selected,
* the filter will return the entire collection of rows.  The filter leverages an 'AND' search so as more
* criteria are selected more results will be filtered out.
*/
.filter('InstanceAttributes', ['$filter', function ($filter) {
   /**
     * @ngdoc method
     * @name comparator
     * @methodOf encore.svcs.cloud.dbaas.InstanceAttributes
     * @requires $filter
     * @param {object} row JSON object that defines a table row to search
     * @param {string} keyword What to search for
     * @description Loops through the values of a a table row looking for the keyword.
     * If found will return that it is a match.
     * @returns {boolean} whether it is a match or not.
     */
    var comparator = function (row, keyword) {
        var isMatch = false;
        var rxDiskSize = $filter('rxDiskSize');

        // we need to be case insensitive
        keyword = angular.lowercase(keyword);

        _.forEach(row, function (val) {
            // recursive
            if (_.isObject(val)) {
                comparator(val, keyword);
            }
            // Compare criteria
            if (_.includes(angular.lowercase(val), keyword) ||
                _.includes(angular.lowercase(rxDiskSize(val)), keyword)) {
                // If it does contain the keyword set this row as a match
                isMatch = true;
            }
        });

        return isMatch;
    };

    /**
     * @ngdoc method
     * @name anonymous
     * @methodOf encore.svcs.cloud.dbaas.InstanceAttributes
     * @param {array} rows Array of JSON objects representing a table
     * @param {object} filter optional filter object that contains the keyword to search for
     * @description If the keyword is present will filter the rows using the defined comparator.
     * If a row matches the comparator then it gets returned as apart to the array from the filter.
     * @returns {array} filter list of table rows.
     */
    return function (rows, filter) {
        filter = filter ? filter : {};
        return filter.keyword ? _.filter(rows, function (row) {
            return comparator(row, filter.keyword);
        }) : rows;
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.dns
 *
 * @description
 * Services used for manipulation and retrieval of dns service data
 */
angular.module('encore.svcs.cloud.dns', [
    'encore.svcs.cloud.dns.config',
    'ngResource',
    'encore.common.http',
    'encore.svcs.util.http',
    'encore.util.transform',
]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.dns.config
 *
 * @description
 * Configurations for Cloud DNS business logic.
 */
angular.module('encore.svcs.cloud.dns.config', [
    'encore.svcs.cloud.config',
]);

angular.module('encore.svcs.cloud.dns.config')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the DNS API
 */
.factory('DNSRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/dnsaas';
}])

/**
* @ngdoc service
* @name encore.svcs.cloud.dns.config.DNSDomainRoute
* @requires encore.svcs.cloud.dns.config.DNSRoute
* @description
*
* Returns a string representation of the base path for the DNSDomain API
*/
.factory('DNSDomainRoute', ["DNSRoute", function (DNSRoute) {
    return DNSRoute + '/domains/:domainId';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSDomainChangeRoute
 * @requires encore.svcs.cloud.dns.config.DNSDomainRoute
 * @description
 *
 * Returns a string representation of the base path for the DNSDomainChange API
 */
.factory('DNSDomainChangeRoute', ["DNSDomainRoute", function (DNSDomainRoute) {
    return DNSDomainRoute + '/changes';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSDomainExportRoute
 * @requires encore.svcs.cloud.config.DNSDomainRoute
 * @description
 *
 * Returns a string representation of the base path for the DNSDomain export API
 */
.factory('DNSDomainExportRoute', ["DNSDomainRoute", function (DNSDomainRoute) {
    return DNSDomainRoute + '/export';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSDomainImportRoute
 * @requires encore.svcs.cloud.dns.config.DNSDomainRoute
 * @description
 *
 * Returns a string representation of the base path for the DNSDomain Import API
 */
.factory('DNSDomainImportRoute', ["DNSDomainRoute", function (DNSDomainRoute) {
    return DNSDomainRoute + '/import';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSDomainLimitRoute
 * @requires encore.svcs.cloud.dns.config.DNSRoute
 *
 * Returns a string representation of the base path for the DNSDomain Limits API.
 */
 .factory('DNSDomainLimitRoute', ["DNSRoute", function (DNSRoute) {
    return DNSRoute + '/limits';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.config.DNSDomainRecordRoute
 * @requires encore.svcs.cloud.dns.config.DNSDomainRoute
 * @description
 *
 * Returns a string representation of the base path for the DNSDomainRecords API
 */
.factory('DNSDomainRecordRoute', ["DNSDomainRoute", function (DNSDomainRoute) {
    return DNSDomainRoute + '/records/:recordId';
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainChangesResource
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainChangeResource}
 */
.factory('DNSDomainChangesResource', ["DNSDomainChangeResource", function (DNSDomainChangeResource) {
    console.warn(
        'DEPRECATED: DNSDomainChangesResource - Please use DNSDomainChangeResource (singular). ' +
        'DNSDomainChangesResource (plural) will be removed in the next major release.'
    );
    return DNSDomainChangeResource;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainChangesTransform
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainChangeTransform}
 */
.factory('DNSDomainChangesTransform', ["DNSDomainChangeTransform", function (DNSDomainChangeTransform) {
    console.warn(
        'DEPRECATED: DNSDomainChangesTransform - Please use DNSDomainChangeTransform (singular). ' +
        'DNSDomainChangesTransform (plural) will be removed in the next major release.'
    );
    return DNSDomainChangeTransform;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainChangesRoute
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.config.DNSDomainChangeRoute}
 */
.factory('DNSDomainChangesRoute', ["DNSDomainChangeRoute", function (DNSDomainChangeRoute) {
    console.warn(
        'DEPRECATED: DNSDomainChangesRoute - Please use DNSDomainChangeRoute (singular). ' +
        'DNSDomainChangesRoute (plural) will be removed in the next major release.'
    );
    return DNSDomainChangeRoute;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainLimitsResource
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainChangeResource}
 */
.factory('DNSDomainLimitsResource', ["DNSDomainLimitResource", function (DNSDomainLimitResource) {
    console.warn(
        'DEPRECATED: DNSDomainLimitsResource - Please use DNSDomainLimitResource (singular). ' +
        'DNSDomainLimitsResource (plural) will be removed in the next major release.'
    );
    return DNSDomainLimitResource;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainLimitsTransform
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainLimitTransform}
 */
.factory('DNSDomainLimitsTransform', ["DNSDomainLimitTransform", function (DNSDomainLimitTransform) {
    console.warn(
        'DEPRECATED: DNSDomainLimitsTransform - Please use DNSDomainLimitTransform (singular). ' +
        'DNSDomainLimitsTransform (plural) will be removed in the next major release.'
    );
    return DNSDomainLimitTransform;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainLimitsRoute
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.config.DNSDomainLimitRoute}
 */
.factory('DNSDomainLimitsRoute', ["DNSDomainLimitRoute", function (DNSDomainLimitRoute) {
    console.warn(
        'DEPRECATED: DNSDomainLimitsRoute - Please use DNSDomainLimitRoute (singular). ' +
        'DNSDomainLimitsRoute (plural) will be removed in the next major release.'
    );
    return DNSDomainLimitRoute;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainRecordsResource
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainRecordResource}
 */
.factory('DNSDomainRecordsResource', ["DNSDomainRecordResource", function (DNSDomainRecordResource) {
    console.warn(
        'DEPRECATED: DNSDomainRecordsResource - Please use DNSDomainRecordResource (singular). ' +
        'DNSDomainRecordsResource (plural) will be removed in the next major release.'
    );
    return DNSDomainRecordResource;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainRecordsTransform
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.DNSDomainRecordTransform}
 */
.factory('DNSDomainRecordsTransform', ["DNSDomainRecordTransform", function (DNSDomainRecordTransform) {
    console.warn(
        'DEPRECATED: DNSDomainRecordsTransform - Please use DNSDomainRecordTransform (singular). ' +
        'DNSDomainRecordsTransform (plural) will be removed in the next major release.'
    );
    return DNSDomainRecordTransform;
}])

/**
 * @ngdoc service
 * @deprecated
 * @name encore.svcs.cloud.dns.DNSDomainRecordsRoute
 * @description **DEPRECATED** Use {@link encore.svcs.cloud.dns.config.DNSDomainRecordRoute}
 */
.factory('DNSDomainRecordsRoute', ["DNSDomainRecordRoute", function (DNSDomainRecordRoute) {
    console.warn(
        'DEPRECATED: DNSDomainRecordsRoute - Please use DNSDomainRecordRoute (singular). ' +
        'DNSDomainRecordsRoute (plural) will be removed in the next major release.'
    );
    return DNSDomainRecordRoute;
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainChangeResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainChangeRoute
 * @param {string} user - signifies the ownership of the domain
 * @param {string} domainId - signifies the domain id
 * @description
 * `$resource` definition of DNS API
* http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/domains.html
*/
.factory('DNSDomainChangeResource', ["$resource", "DNSDomainChangeRoute", "DNSDomainChangeTransform", function ($resource, DNSDomainChangeRoute, DNSDomainChangeTransform) {
    return $resource(DNSDomainChangeRoute, {
        user: '@user',
        domainId: '@id'
    }, {
        /**
         * @ngdoc method
         * @name DNSDomainChangeResource#get
         * @methodOf encore.svcs.cloud.dns.DNSDomainChangeResource
         * @description
         *
         * Get the domain changes details for the specified domain
         * *default get method from `$resource`*
         * @example
         * <pre>
         * DNSDomainChangeResource.get({ user: 'hub_cap', domainId: '123' });
         * </pre>
         * <pre>
         * [{
         *      "action": "create",
         *      "action_taken_on": "Thu Nov 12 10:08:19 UTC 2015",
         *      "domain": "atestfornewjars.com",
         *      "details": [
         *          {
         *              "original_value": "1447322773",
         *              "field": "serial_number",
         *              "new_value": "1447322899"
         *          },
         *          {
         *              "original_value": "Thu Nov 12 10:06:13 UTC 2015",
         *              "field": "updated_at",
         *              "new_value": "Thu Nov 12 10:08:19 UTC 2015"
         *          }
         *      ],
         *      "target": "Domain"
         * }]
         * </pre>
         */
        get: {
            method: 'GET',
            isArray: true,
            transformResponse: DNSDomainChangeTransform.get
        }
    });
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainChangeTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of DNS Domain response transformations
 * @description
 *
 * Transforms the result of DNS Domain changes api calls
 */
.factory('DNSDomainChangeTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name DNSDomainChangeTransform#getDNSDomainChangesDetails
     * @methodOf encore.svcs.cloud.dns.DNSDomainChangeTransform
     * @description
     *
     * Transform will pluck 'domain_changes' from the response
     * @example
     * <pre>
     * // api response:
     * {
     *      "domain_changes": [
     *          {
     *              "action": "create",
     *              "action_taken_on": "Thu Nov 12 10:08:19 UTC 2015",
     *              "domain": "atestfornewjars.com",
     *              "details": [
     *                  {
     *                      "original_value": "1447322773",
     *                      "field": "serial_number",
     *                      "new_value": "1447322899"
     *                  },
     *                  {
     *                      "original_value": "Thu Nov 12 10:06:13 UTC 2015",
     *                      "field": "updated_at",
     *                      "new_value": "Thu Nov 12 10:08:19 UTC 2015"
     *                  }
     *              ],
     *              "target": "Domain"
     *          }
     *      ]
     * }
     * </pre>
     * <pre>
     * // transformed response:
     * [{
     *      "action": "create",
     *      "action_taken_on": "Thu Nov 12 10:08:19 UTC 2015",
     *      "domain": "atestfornewjars.com",
     *      "details": [
     *          {
     *              "original_value": "1447322773",
     *              "field": "serial_number",
     *              "new_value": "1447322899"
     *          },
     *          {
     *              "original_value": "Thu Nov 12 10:06:13 UTC 2015",
     *              "field": "updated_at",
     *              "new_value": "Thu Nov 12 10:08:19 UTC 2015"
     *          }
     *      ],
     *      "target": "Domain"
     * }]
     */
    var getDNSDomainChangesDetails = TransformUtil.pluckList('domain_changes');

    return {
        get: TransformUtil.responseChain(getDNSDomainChangesDetails)
    };
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainExportResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainExportRoute
 * @requires encore.svcs.util.http.TransformUtil
 * @requires Pluck - service to pluck values from its path
 * @returns {object} A mapping of DNSDomainExportRoute response transformations
 * @description
 * `$resource` definition of Dns API
 * http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/domains.html
 */
.factory('DNSDomainExportResource', ["$resource", "DNSDomainExportRoute", "TransformUtil", "Pluck", function ($resource, DNSDomainExportRoute, TransformUtil, Pluck) {
    return $resource(DNSDomainExportRoute, {
        user: '@user',
        domainId: '@id'
    }, {
        /**
         * @ngdoc method
         * @name DNSDomainExportResource#get
         * @methodOf encore.svcs.cloud.dns.DNSDomainExportResource
         * @description
         * Get the export domain data for the specified domain
         * @param {object} params Parameter object
         * @param {string} params.user username under which domain exist
         * @param {string} params.domainId signifies the ownership of the entity
         * @example
         * <pre>
         * DNSDomainExportResource.get({ user: 'abc', domainId: '1234' });
         * </pre>
         * <pre>
         *  //response data format:
         *  {
         *      content_type: 'BIND_9',
         *      id: '1234',
         *      account_id: '321',
         *      contents: 'test data'
         *  }
         * </pre>
         *
         */
         get: {
            method: 'GET',
            transformResponse: TransformUtil.responseChain(Pluck('result'))
        }
    });
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainImportResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainImportRoute
 * @param {string} user - signifies the ownership of the entity
 * @description
 * `$resource` definition of Dns API
 * http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/domains.html
 *
 * @example
 * // call save with params and body with corresponding data
 * ```
 * var body = { contents: '\nexample.net. 3600 IN SOA dns1.stabletransit.com.
 *                               sample@rackspace.com. 1308874739 3600 3600 3600 3600\nexample.net.
 *                               86400 IN A 110.11.12.16\nexample.net.
 *                               3600 IN MX 5 mail2.example.net.\nwww.example.net.
 *                               5400 IN CNAME example.net.\n' };
 *
 * // POST (domains) - post the domain to specified user's domain list.
 * DNSDomainImportResource.save({ user: 'hub_cap' }, body);
 * ```
 */
.factory('DNSDomainImportResource', ["$resource", "DNSDomainImportRoute", function ($resource, DNSDomainImportRoute) {
    return $resource(DNSDomainImportRoute, {
        user: '@user'
    });
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainLimitResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainLimitRoute
 * @param {string} user - signifies the ownership of the entity
 * @description
 * `$resource` definition of Dns API
 * http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/limits.html
 */
.factory('DNSDomainLimitResource', ["$resource", "DNSDomainLimitRoute", "DNSDomainLimitTransform", function ($resource, DNSDomainLimitRoute, DNSDomainLimitTransform) {
    return $resource(DNSDomainLimitRoute, {
        user: '@user'
    }, {
        /**
         * @ngdoc method
         * @name DNSDomainLimitResource#get
         * @methodOf encore.svcs.cloud.dns.DNSDomainLimitResource
         * @description
         * retrieves limits rate and absolute object for the specified user.
         *
         * @example
         * <pre>
         * DNSDomainLimitResource.get({ user: 'hub_cap' });
         * </pre>
         * <pre>
         *  {
         *      'rate': [{
         *              'limit': [{
         *                  'value': 20,
         *                  'unit': 'MINUTE',
         *              }],
         *      }],
         *      'absolute': {
         *          'records_per_domain': 500,
         *          'domains': 500
         *      }
         *  }
         * </pre>
         */
        get: {
            method: 'GET',
            transformResponse: DNSDomainLimitTransform.get
        }
    });
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainLimitTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of DNS Limits response transformations
 * @description
 *
 * Transforms the result of DNS Limits api calls. This result will have two attributes.
 * One is rate array and the other one is absolute object.
 */
.factory('DNSDomainLimitTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name DNSDomainLimitTransform#get
     * @methodOf encore.svcs.cloud.dns.DNSDomainLimitTransform
     * @returns {array} - Needs to ensure that it will byPass limits and return an
     * response object of rate and absolute limits attribute objects.
     * @description
     *
     * Takes a collection of DNS Limits and massages the object to ensure it is as expected object.
     *
     * @example
     * <pre>
     *  // api response:
     *  var data = {
     *      'limits': {
     *          'rate': [{
     *                  'limit': [{
     *                      'value': 20,
     *                      'unit': 'MINUTE',
     *                  }],
     *          }],
     *          'absolute': {
     *              'records_per_domain': 500,
     *              'domains': 500
     *          }
     *      }
     *  }
     *
     *  DNSDomainLimitTransform.get(data);
     * </pre>
     * <pre>
     *  // transformed response:
     *  {
     *      'rate': [{
     *              'limit': [{
     *                  'value': 20,
     *                  'unit': 'MINUTE',
     *              }],
     *      }],
     *      'absolute': {
     *          'records_per_domain': 500,
     *          'domains': 500
     *      }
     *  }
     * </pre>
     */
     var getDNSDomainLimits = function (data) {
        return data['limits'] || data;
     };

     return {
        get: TransformUtil.responseChain(getDNSDomainLimits)
     };
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainRecordResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainRecordRoute
 * @requires encore.svcs.cloud.dns.config.DNSDomainRoute
 * @requires encore.svcs.cloud.dns.DNSDomainRecordTransform
 * @description
 * `$resource` definition of Dns API
* http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/domains.html
*
*/
.factory('DNSDomainRecordResource', ["$resource", "DNSDomainRecordRoute", "DNSDomainRoute", "DNSDomainRecordTransform", function ($resource, DNSDomainRecordRoute, DNSDomainRoute,
         DNSDomainRecordTransform) {
    return $resource(DNSDomainRecordRoute, {
        user: '@user',
        domainId: '@id',
        recordId: '@recordId'
    }, {
        /**
         * @ngdoc method
         * @name DNSDomainRecordResource#save
         * @methodOf encore.svcs.cloud.dns.DNSDomainRecordResource
         * @description
         * Create the new record for specific domain
         * @param {object} data Data object for passing record information
         * @param {Array.<Object>} data.records list of Domain Records to save against
         * @param {string} params.user signifies the ownership of the domain
         * @param {string} params.domainId signifies the domain id
         * @example
         * <pre>
         * DNSDomainRecordResource.save({
         *     "domainId": '123',
         *     "user": 'abc',
         *     "records": [
         *         { "name" : "ftp.example.com", "type" : "A", "data" : "192.0.2.8", "ttl" : 5771 }
         *     ]
         * });
         * </pre>
         */

        /**
         * @ngdoc method
         * @name DNSDomainRecordResource#delete
         * @methodOf encore.svcs.cloud.dns.DNSDomainRecordResource
         * @description
         * Create the new record for specific domain
         * @param {object} params Parameters object
         * @param {string} params.domainId signifies the domain id
         * @param {string} params.recordId signifies the record id
         * @example
         * <pre>
         * DNSDomainRecordResource.delete({ domainId: '123', recordId: 'MX-123' });
         * </pre>
         */

        /**
         * @ngdoc method
         * @name DNSDomainRecordResource#update
         * @methodOf encore.svcs.cloud.dns.DNSDomainRecordResource
         * @description
         * update the particular record details.
         * @example
         * <pre>
         * DNSDomainRecordResource.update({ domainId: '123', recordId: 'MX-123' },
         *      {name: 'abc', data: '1.1.1.1', ttl: '300'});
         * </pre>
         */
        update: {
            method: 'PUT'
        },

        /**
         * @ngdoc method
         * @name DNSDomainRecordResource#getAll
         * @methodOf encore.svcs.cloud.dns.DNSDomainRecordResource
         * @description
         * get list of dns domain records based on limit and offset.
         * @example
         * <pre>
         * DNSDomainRecordResource.getAll({ domainId: '1234', limit : '100', offset: '0' });
         * </pre>
         * <pre>
         *  [
         *      { ttl: '3600', id: '123', data: 'test'},
         *      { ttl: '3600', id: '124', data: 'test'},
         *      { ttl: '3600', id: '125', data: 'test'}
         *  ]
         * </pre>
         */
        getAll: {
            method: 'GET',
            isArray: true,
            transformResponse: DNSDomainRecordTransform.records
        },

        /**
         * @ngdoc method
         * @name DNSDomainRecordResource#recent
         * @methodOf encore.svcs.cloud.dns.DNSDomainRecordResource
         * @description
         * retrieves limits rate and absolute object for the specified user.
         *
         * @param {object} params Parameters object
         * @param {string} params.user signifies the ownership of the domain
         * @param {string} params.domainId signifies the domain id
         * @example
         * <pre>
         * DNSDomainRecordResource.recent({ domainId: '1234' });
         * </pre>
         * <pre>
         *  [
         *      { ttl: '3600', id: '123', data: 'test'},
         *      { ttl: '3600', id: '124', data: 'test'},
         *      { ttl: '3600', id: '125', data: 'test'}
         *  ]
         * </pre>
         */
        recent: {
            method: 'GET',
            isArray: true,
            url: DNSDomainRoute + '/records/recent',
            transformResponse: DNSDomainRecordTransform.records
        }
    });
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainRecordTransform
 * @requires encore.common.http.TransformUtil
 * @returns {object} A mapping of DNS recent records response transformations
 * @description
 *
 * Transforms the result of DNS Limits api calls. This result will have two attributes.
 * One is rate array and the other one is absolute object.
 */
.factory('DNSDomainRecordTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name DNSDomainRecordTransform#list
     * @methodOf encore.svcs.cloud.dns.DNSDomainRecordTransform
     * @returns {array} - Needs to ensure that it will byPass limits and return an
     * response object of rate and absolute limits attribute objects.
     * @description
     *
     * Takes a collection of DNS Limits and massages the object to ensure it is as expected object.
     *
     * @example
     * <pre>
     *  var data = {
     *      records: [
     *          { ttl: '3600', id: '123', data: 'test'},
     *          { ttl: '3600', id: '124', data: 'test'},
     *          { ttl: '3600', id: '125', data: 'test'}
     *      ]
     *  }
     *
     *  DNSDomainRecordTransform.list(data);
     * </pre>
     * <pre>
     *  // transformed response:
     *  [
     *      { ttl: '3600', id: '123', data: 'test'},
     *      { ttl: '3600', id: '124', data: 'test'},
     *      { ttl: '3600', id: '125', data: 'test'}
     *  ]
     * </pre>
     */
     var recordsProperty = TransformUtil.pluckList('records');

     return {
        records: TransformUtil.responseChain(recordsProperty)
     };
}]);

angular.module('encore.svcs.cloud.dns')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.dns.config.DNSDomainRoute
 * @param {string} user - signifies the ownership of the domain
 * @param {string} domainId - signifies the domain id
 * @description
 * `$resource` definition of Dns API
 * http://docs.rackspace.com/cdns/api/v1.0/cdns-devguide/content/domains.html
 *
 * @example
 *
 * ```
 * # list (GET)
 * *Lists domains for the specified user.*
 * <pre>
 * DNSDomainResource.list({ user: 'hub_cap' });
 * </pre>
 *
 * # get (GET)
 * *Gets the details for the specified domain.*
 * <pre>
 * DNSDomainResource.get({ user: 'hub_cap', domainId: '123' });
 * </pre>
 *
 * # update (PUT)
 * *Update the specific domain details.*
 * <pre>
 * var body = { comment: 'test', ttl: 3360, email: 'test' };
 * DNSDomainResource.update({ user: 'hub_cap', domainId: '123' }, body);
 * </pre>
 * ```
 *
 */
.factory('DNSDomainResource', ["$resource", "DNSDomainRoute", "DNSDomainTransform", function ($resource, DNSDomainRoute, DNSDomainTransform) {
    return $resource(DNSDomainRoute, {
        user: '@user',
        domainId: '@id'
    }, {
        /**
         * @ngdoc method
         * @name DNSDomainResource#update
         * @methodOf encore.svcs.cloud.dns.DNSDomainResource
         * @description
         * update the domain details.
         */
        update: {
            method: 'PUT'
        },
        /**
         * @ngdoc method
         * @name DNSDomainResource#get
         * @methodOf encore.svcs.cloud.dns.DNSDomainResource
         * @description
         * retrieves domain  domains for the specified domain.
         */
        get: {
            method: 'GET',
            transformResponse: DNSDomainTransform.get
        },
        /**
         * @ngdoc method
         * @name DNSDomainResource#delete
         * @methodOf encore.svcs.cloud.dns.DNSDomainResource
         * @description
         *
         * Deletes the specified domains. The boolean status 'true' for 'delete_subdomains' attribute determines
         * that user wants to delete subdomains with the main domain. Status 'false' determines that only domain
         * will be deleted and the subdomains will remain intact. To delete more than one domain 'ids' takes
         * an array object.
         *
         * @param {object} params Parameter object
         * @param {array} params.ids list of domains to delete
         * @param {boolean=} params.delete_subdomains delete any subdomains associated
         * @example
         * <pre>
         * DNSDomainResource.delete(
            {
         *     'ids': [450001],
         *     'delete_subdomains': true
         *  }
         * );
         * </pre>
         *
         */
        delete: {
            method: 'POST',
            url: DNSDomainRoute + '/delete_domains'
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.dns.DNSDomainTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of DNS Domain response transformations
 * @description
 *
 * Transforms the result of DNS Domains api calls
 */
.factory('DNSDomainTransform', ["TransformUtil", function (TransformUtil) {

    /**
     * @ngdoc method
     * @name DNSDomainTransform#get
     * @methodOf encore.svcs.cloud.dns.DNSDomainTransform
     * @returns {object} - Needs to ensure that it will byPass domain_details and return an
     * response object of individual instance
     * @description
     *
     * Takes a of DNS Details and massages the instance to ensure it is as expected object
     */
    var getDNSDetails = function (data) {
        return data['domain_details'] || data;
    };

    return {
        get: TransformUtil.responseChain(getDNSDetails)
    };
}]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.cloud.files', [
    'ngResource'
]);

angular.module('encore.svcs.cloud.files')

/**
* @ngdoc service
* @name encore.svcs.files.FilesRoute
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
* @description
*
* Returns a string representation of the base path for files 
*/
.factory('FilesRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:username/cloud_files/:region';
}])

/**
* @ngdoc service
* @name encore.svcs.files.FilesResource
* @description
* File Service for interaction with cloud_files API
* @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
*/
.factory('FilesResource', ["$resource", "FilesRoute", function ($resource, FilesRoute) {
    return $resource(FilesRoute, {
        username: '@user',
        region: '@region'
    });
}]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.image
 *
 * @description
 * Services used for manipulation and retrieval of images service data
 */
angular.module('encore.svcs.cloud.image', [
    'encore.common.http',
    'encore.util.transform'
]);

var fixtures = fixtures || {};

(function () {
    var images = {
        images: [{ 
            status: 'active', 
            id: 'id1', 
            region: 'ORD', 
            'instance_uuid': 'serverId1' 
        },
        { 
            status: 'inactive', 
            id: 'id2', 
            region: 'DFW', 
            'instance_uuid': 'serverId2' 
        }]
    };

    var defaultParams = {
        'user': 'test',
        'accountNumber': 123
    };

    fixtures.images = {
        sample: images ,
        defaultParams: defaultParams
    }
})();

angular.module('encore.svcs.cloud.image')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.image.ImageRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Image API
 */
.factory('ImageRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/glance/:region/:id';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.image.ImageResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.image.ImageRoute
 * @requires encore.svcs.cloud.image.ImageTransform
 * @description
 *
 * http://docs.rackspace.com/images/api/v2/ci-devguide/content/Image_Calls.html
 *
 * GET (no id) - Lists public virtual machine (VM) images.
 * GET (with id) - Gets the details for the specified image.
 * DELETE - Deletes the specified image.
 */
.factory('ImageResource', ["$resource", "ImageRoute", "ImageTransform", function ($resource, ImageRoute, ImageTransform) {
    return $resource(ImageRoute, {
        user: '@user',
        region: '@region',
        id: '@id'
    }, {
        /**
         * @ngdoc method
         * @name ImageResource#list
         * @methodOf encore.svcs.cloud.image.ImageResource
         * @requires encore.svcs.cloud.image.ImageTransform#list
         * @description
         *
         * Overwriting the default GET function so that we can use the transformResponse
         */
        list: {
            method: 'GET',
            transformResponse: ImageTransform.list,
            isArray: true
        },

        /**
         * @ngdoc method
         * @name ImageResource#get
         * @methodOf encore.svcs.cloud.image.ImageResource
         * @requires encore.svcs.cloud.image.ImageTransform#get
         * @description
         *
         * Special case GET function so that we can transform a single instance of an image
         */
        get: {
            method: 'GET',
            transformResponse: ImageTransform.get
        },

        /**
         * @ngdoc method
         * @name ImageResource#getPaginated
         * @methodOf encore.svcs.cloud.image.ImageResource
         * @description
         * Get result with next_page_marker
         * @param {Object} params Parameter object
         * @example
         * <pre>
         * ImageResource.getPaginated({ visibility: 'private' });
         * </pre>
         * <pre>
         * //response data format:
         * {
         *   "next_page_marker": "/v2/images?marker=51ffa9f9-4fa9-4dfc-b4a6-b645a458b258&visibility=private",
         *   "images": [
         *       {
         *         "checksum": "15dd2638014bcd442257e39c99032b2f",
         *         "id": "99104f95-a005-4165-b147-6ed9a3702642",
         *         "updated": "2016-04-13T15:02:11-0500",
         *         "name": "708236_test",
         *         "faults": [],
         *         "created": "2016-04-13T15:02:11-0500"
         *       },
         *       {
         *         "checksum": "15dd2638014bcd442257e39c99032b2f",
         *         "id": "99104f95-a005-4165-b147-6ed9a3702642",
         *         "updated": "2016-04-13T15:28:51-0500",
         *         "name": "708236_testtom",
         *         "faults": [],
         *         "created": "2016-04-13T15:28:51-0500",
         *         "id": "982147"
         *       }
         *     ]
         * }
         * </pre>
         */
        getPaginated: {
            method: 'GET',
            transformResponse: ImageTransform.paginated
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.image.ImageTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @requires $routeParams
 * @requires encore.svcs.cloud.config.GetCloudURL
 * @description
 * Transforms the result of Image api calls
 *
 * @returns {Object} A mapping of image response transformations
 */
.factory('ImageTransform', ["TransformUtil", "CLOUD_URL", function (TransformUtil, CLOUD_URL) {
    var _transformImage = function (image) {
        if (_.has(image, 'error')) {
            return image;
        }

        image.gen = 'Next';
        image.status = image.status.toUpperCase();
        image['image_type'] = image.visibility;
        image.url = CLOUD_URL.images + '/' + image.region + '/' + image.id;
        image.associatedServerUrl = CLOUD_URL.servers + '/' + image.region + '/' + image['instance_uuid'];
        return image;
    };
    /**
     * @ngdoc method
     * @name ImageTransform#getImages
     * @methodOf encore.svcs.cloud.image.ImageTransform
     * @description
     * Takes a collection of images and massages each instance to ensure it is as expected
     *
     * @returns {Array}
     * Needs to ensure that it will always return an array, even when an
     * error occurs
     */
    var getImages = [TransformUtil.pluckList('images'),
                     TransformUtil.mapList(_transformImage)];

    /**
     * @ngdoc method
     * @name ImageTransform#getImage
     * @methodOf encore.svcs.cloud.image.ImageTransform
     * @description
     * Takes a single instance of an image and massages it to ensure it is as expected
     */
    var getImage = function (data) {
        if (_.has(data, 'image')) {
            // Convert image size from bytes to megabytes
            var size = data.image.size;
            if (_.isNumber(size) && size > 0) {
                data.image.sizeInMB = size / 1000000;
            } else {
                data.image.sizeInMB = size;
            }

            data.image.gen = 'Next';
            return data.image;
        }
        return data;
    };

    /**
     * @ngdoc method
     * @name ImageTransform#getPaginated
     * @methodOf encore.svcs.cloud.image.ImageTransform
     * @description
     * Takes a collection of images and massages each instance to ensure it is as expected
     * Add marker value to next_page_marker
     */
    var getPaginated = function (data) {
        if (_.has(data, 'images')) {
            _.each(data.images, _transformImage);
        }
        if (_.has(data, 'next_page_marker') && data['next_page_marker']) {
            // #TODO: Need to replace with a URL parsing function
            data['marker'] = data['next_page_marker'].split('=')[1].split('&')[0];
        }
        return data;
    };

    return {
        list: TransformUtil.responseChain(getImages),
        get: TransformUtil.responseChain(getImage),
        paginated: TransformUtil.responseChain(getPaginated),
    };
}]);

angular.module('encore.svcs.cloud.image')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.image.ImageService
 * @requires $q - AngularJS promise library for interacting with Search API
 * @requires encore.svcs.cloud.common.CloudRegionsUtil
 * @requires encore.svcs.cloud.image.ImageResource
 * @description
 * Returns a promise a transformed list of images
 */
.factory('ImageService', ["$q", "CloudRegionsUtil", "ImageResource", function ($q, CloudRegionsUtil, ImageResource) {
    return {
        /**
         * @ngdoc method
         * @name ImageService#fetchNextGenImages
         * @methodOf encore.svcs.cloud.image.ImageService
         * @requires encore.svcs.cloud.image.ImageResource
         * @description
         * fetches the next generation images based on defined parameters.
         *
         * @param {String} user signifies ownership of the image
         * @param {String} visibility filter param, for example:
         * - public
         * - private
         * - shared
         *
         * @param {Object} failedRequestsContainer
         * A container that stores any errors on a per region basis.  This allows
         * us to keep resolving each region without killing the entire promise.
         * @param {Object} regionsCallback
         * A callback used when each region is fetched.
         *
         * @returns {Object} a promise for fetching next generation images
         */
        fetchNextGenImages: function (user, visibility, failedRequestsContainer, regionsCallback) {
            var deferred = $q.defer();
            var imagesList = [];

            var config = {
                svc: ImageResource.list,
                name: 'Images',
                scopeProp: 'images',
                user: user,
                visibility: visibility,
                regionsCallback: regionsCallback
            };

            CloudRegionsUtil.loadDataForEachRegion(config)
                .then(function (images) {
                    deferred.resolve(images);
                }, function (errors) {
                    failedRequestsContainer.failedRequests = errors;
                    deferred.resolve(imagesList);
                }, function (images) {
                    imagesList = imagesList.concat(images);
                    deferred.notify(images);
                });

            return deferred.promise;
        }
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.lbaas
 * @requires ngResource
 * @requires encore.common.resource
 * @requires encore.svcs.cloud.config
 * @requires encore.util.transform
 *
 * @description
 * Services used for manipulation and retrieval of lbaas service data
 */
angular.module('encore.svcs.cloud.lbaas', [
    'ngResource',
    'encore.common.resource',
    'encore.svcs.cloud.config',
    'encore.util.transform'
]);
angular.module('encore.svcs.cloud.lbaas')
  /**
 * @ngdoc service
 * @name encore.svcs.cloud.lbaas.LbaasNodeResource
 * @requires $resource: AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.lbaas.LbaasRoute
 * @param {string} user: signifies the ownership of the load balancer
 * @param {string} region: signifies which region to load balancer belongs to
 * @param {string} id:  signifies specific load balancer key
 * @param {string} detailId: signifies node key
 * @description
 * `$resource` definition of Lbaas API
 * https://developer.rackspace.com/docs/cloud-load-balancers/v1/developer-guide
 * this factory makes the API request for load balancer node's.
 *
 */

.factory('LbaasNodeResource', ["$resource", "LbaasRoute", function ($resource, LbaasRoute) {
    return $resource(LbaasRoute, {
        user: '@user',
        region: '@region',
        id: '@id',
        details: 'nodes',
        detailId: '@nodeid'
    }, {
        /**
        * @ngdoc method
        * @name LbaasResource#update
        * @methodOf encore.svcs.cloud.lbaas.LbaasNodeResource
        * @description
        *  Update the specified node's attributes
        * @example
        * <pre>
        * ### PUT (update) - Update the specified node's attributes
        * LbaasResource.update({ user: 'hub_cap', region: 'ord',  id: '123, detailId: '345'});
        *</pre>
        */
        update: {
            method: 'PUT'
        },
        /**
        * @ngdoc method
        * @name LbaasResource#getExtendedView
        * @methodOf encore.svcs.cloud.lbaas.LbaasNodeResource
        * @description
        *  Lists load balancer nodes.
        * @example
        * <pre>
        * ### GET (getExtendedView) - Lists load balancer nodes.
        * LbaasResource.getExtendedView({ user: 'hub_cap', region: 'ord',  id: '123'});
        *</pre>
        *<pre>
        * {
        *     "nodes": 
        *         [{"condition": "ENABLED",
        *          "id": 235201,
        *          "port": 80,
        *          "slice_id": "",
        *          "nodeStatus": "ONLINE",
        *          "region": null,
        *          "nodeType": "PRIMARY",
        *          "slice_name": "",
        *          "weight": null,
        *          "address": "10.178.8.213"}]
        * }
        *</pre>
        */
        getExtendedView: {
            method: 'GET',
            params: {
                innerDetails: 'extended_view'
            }
        },
        /**
        * @ngdoc method
        * @name LbaasResource#bulkDelete
        * @methodOf encore.svcs.cloud.lbaas.LbaasNodeResource
        * @description
        *  Bulk deletes specified node list from load balancer
        * @example
        * <pre>
        * ### POST (bulkDelete) - Bulk deletes specified node list from load balancer
        * LbaasResource.bulkDelete({ user: 'hub_cap', region: 'ord',  id: '123'});
        *</pre>
        */
        bulkDelete: {
            method: 'POST',
            params: {
                innerDetails: 'bulk_delete'
            }
        }
    });
}]);
angular.module('encore.svcs.cloud.lbaas')
 /**
 * @ngdoc service
 * @name encore.svcs.cloud.lbaas.Lbaas
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.lbaas.LbaasRoute
 * @requires encore.svcs.cloud.lbaas.LoadBalancerTransforms
 * @param {string} user - signifies the ownership of the load balancer
 * @param {string} region - signifies which region to load balancer belongs to
 * @param {string} id -  signifies specific load balancer key
 * @param {string} detailId - signifies detailed load balancer key
 * @description
 * `$resource` definition of Lbaas API
 * https://developer.rackspace.com/docs/cloud-load-balancers/v1/developer-guide
 *
 * @example
 * <pre>
 * // GET (get) - Gets the details for the specified load balancer.
 * Lbaas.get({ user: 'hub_cap', id: '456' });
 *</pre>
 *
 *<pre>
 * // GET (gets) - Lists load balancers for the specified user.
 * Lbaas.gets({ user: 'hub_cap', region: 'ord' });
 *</pre>
 *
 *<pre>
 * // PUT (update) - Update the specified load balancer's attributes
 * Lbaas.update({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // POST (create) - Create a load balancer
 * Lbaas.create({ user: 'hub_cap', region: 'ord' });
 *</pre>
 *
 *<pre>
 * // DELETE (delete) - Delete load balancer
 * Lbaas.delete({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (disableSessionPersistence) - Removes session persistence from a load balancer
 * Lbaas.disableSessionPersistence({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateSessionPersistence) - Adds session persistence to a load balancer
 * Lbaas.updateSessionPersistence({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getSessionPersistence) - Get the session persistence configuration
 * Lbaas.getSessionPersistence({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // POST (postSuspend) - Suspend the specified load_balancer
 * Lbaas.postSuspend({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (deleteSuspend) - Unsuspend the specified load_balancer
 * Lbaas.deleteSuspend({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getHostCluster) - Gets a cluster of hosts for a region
 * Lbaas.getHostCluster({ user: 'hub_cap', region: 'ord', detailId: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateHost) - Reassign the host id of a set of load balancer
 * Lbaas.updateHost({ user: 'hub_cap', region: 'ord' });
 *</pre>
 *
 *<pre>
 * // POST (saveNodes) - Add nodes to a load balancer
 * Lbaas.saveNodes({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getErrorPage) - Get the specified load balancer's error page
 * Lbaas.getErrorPage({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateErrorPage) - Update the specified load balancer's error page
 * Lbaas.updateErrorPage({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (deleteErrorPage) - Delete the specified load balancer's error page
 * Lbaas.deleteErrorPage({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getSSLTermination) - Get the load balancer SSL termination configuration
 * Lbaas.getSSLTermination({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (disableSSLTermination) - Delete the specified load balancer's SSL termination
 * Lbaas.disableSSLTermination({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateSSLTermination) - Update the specified load balancer's SSL termination configuration
 * Lbaas.updateSSLTermination({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getContentCaching) - Get the load balancer content caching configuration
 * Lbaas.getContentCaching({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateContentCaching) - Enable/Disable content caching
 * Lbaas.updateContentCaching({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getHealthMonitor) - Get the load balancer health monitor configuration
 * Lbaas.getHealthMonitor({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateHealthMonitor) - Update the load balancer health monitor configuration
 * Lbaas.updateHealthMonitor({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (disableHealthMonitor) - Delete the load balancer health monitor configuration
 * Lbaas.disableHealthMonitor({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getAccessList) - Get the load balancer access list
 * Lbaas.getAccessList({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (deleteAccessList) - Delete the access list
 * Lbaas.deleteAccessList({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // POST (saveAccessList) - Add a network to a load balancer access list
 * Lbaas.saveAccessList({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getConnectionThrottle) - Get the load balancer connection throttle configuration
 * Lbaas.getConnectionThrottle({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateConnectionThrottle) - Create/Update connection throttle configuration
 * Lbaas.updateConnectionThrottle({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (disableConnectionThrottle) - Delete connection throttle configuration
 * Lbaas.disableConnectionThrottle({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getProtocols) - Get a list of load balancer protocols
 * Lbaas.getProtocols({ user: 'hub_cap', region: 'ord' });
 *</pre>
 *
 *<pre>
 * // GET (getConnectionLogging) - Get the load balancer connection logging configuration
 * Lbaas.getConnectionLogging({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateConnectionLogging) - Enable/Disable connection logging
 * Lbaas.updateConnectionLogging({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre> // #TODO: Possibly rename to proper spelling, 'postVirtualIP'
 * // POST (postVituralIP) - Assign virtualip to the specified load_balancer
 * Lbaas.postVituralIP({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // POST (addTemporaryRateLimit) - Add ratelimit to the specified load_balancer
 * Lbaas.addTemporaryRateLimit({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // PUT (updateTemporaryRateLimit) - Update ratelimit to the specified load_balancer
 * Lbaas.updateTemporaryRateLimit({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // DELETE (deleteVIP) - Bulk delete virtual IPs
 * Lbaas.deleteVIP({ user: 'hub_cap', region: 'ord', id: '123', detailId: '345'  });
 *</pre>
 *
 *<pre>
 * // PUT (updateSync) - Sync the specified load balancer
 * Lbaas.updateSync({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 *
 *<pre>
 * // GET (getHistoricalUsage) - Get the specified load balancer's usage details
 * Lbaas.getHistoricalUsage({ user: 'hub_cap', region: 'ord', id: '123' });
 *</pre>
 */
.factory('Lbaas', ["$resource", "LbaasRoute", "LoadBalancerTransforms", "rxResourceHelper", function ($resource, LbaasRoute, LoadBalancerTransforms, rxResourceHelper) {
    var actions = {};
    var createAction = rxResourceHelper.createAction;
    /**
    * @ngdoc method
    * @name Lbaas#get
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *  Lists load balancers for the specified user.
    */
    createAction(actions, '', ['get', 'list', 'update', 'save', 'delete'], {}, {
       list: {
            transformResponse: LoadBalancerTransforms.list
        }
    });
    /**
    * @ngdoc method
    * @name Lbaas#disableSessionPersistence
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    *  Removes session persistence from a load balancer
    */
    createAction(actions, 'SessionPersistence', ['disable', 'get', 'update'], {
        details: 'sessionpersistence'
    });
    /**
    * @ngdoc method
    * @name Lbaas#suspendLoadBalancer
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Suspend the specified load_balancer
    */
    createAction(actions, 'Suspend', ['post', 'delete'], {
        details: 'suspend'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getHosts
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    *  Gets a cluster of hosts for a region
    */
    createAction(actions, 'HostCluster', ['get'], {
        details: 'clusters',
        innerDetails: 'hosts'
    });
    /**
    * @ngdoc method
    * @name Lbaas#assignHost
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    *  Reassign the host id of a set of load balancer
    */
    createAction(actions, 'Host', ['update'], {
        details: 'reassign_hosts'
    });
    /**
    * @ngdoc method
    * @name Lbaas#addExternalNodes
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Add nodes to a load balancer
    */
    createAction(actions, 'Nodes', ['save'], {
        details: 'nodes'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getErrorPage
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the specified load balancer's error page
    */
    createAction(actions, 'ErrorPage', ['get', 'update', 'delete'], {
        details: 'errorpage'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getSSLTermination
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer SSL termination configuration
    */
    createAction(actions, 'SSLTermination', ['get', 'update', 'disable'], {
        details: 'ssltermination'
    }, {
        update: {
            contentType: 'application/text'
        }
    });
    /**
    * @ngdoc method
    * @name Lbaas#getContentCaching
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer content caching configuration
    */
    createAction(actions, 'ContentCaching', ['get', 'update'], {
        details: 'contentcaching'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getHealthMonitor
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer health monitor configuration
    */
    createAction(actions, 'HealthMonitor', ['get', 'update', 'disable'], {
        details: 'healthmonitor'
    }, {
        update: {
            transformRequest: LoadBalancerTransforms.updateHealthMonitor
        }
    });
    /**
    * @ngdoc method
    * @name Lbaas#getAccessList
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer access list
    */
    createAction(actions, 'AccessList', ['get', 'delete', 'save'], {
        details: 'accesslist'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getConnectionThrottle
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer connection throttle configuration
    */
    createAction(actions, 'ConnectionThrottle', ['get', 'update', 'disable'], {
        details: 'connectionthrottle'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getProtocols
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get a list of load balancer protocols
    */
    createAction(actions, 'Protocols', ['get'], {
        details: 'protocols'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getConnectionLogging
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the load balancer connection logging configuration
    */
    createAction(actions, 'ConnectionLogging', ['get', 'update'],{
        details: 'connectionlogging'
    });
    /**
    * @ngdoc method
    * @name Lbaas#addVirtualip
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Assign virtualip to the specified load_balancer
    */
    // #TODO: Possibly rename to proper spelling, 'VirtualIP'
    createAction(actions,'VituralIP', ['post'], {
            details: 'admin_virtualips'
    });
        /**
    * @ngdoc method
    * @name Lbaas#deleteVip
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Bulk delete virtual IPs
    */
    createAction(actions,'VIP', ['delete'], {
            details: 'virtualips'
    });
    /**
    * @ngdoc method
    * @name Lbaas#addTemporaryRateLimit
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Add ratelimit to the specified load_balancer
    */
    createAction(actions, 'TemporaryRateLimit', ['update', 'post'],{
            details: 'ratelimit'
    },{
        contentType: 'application/json'
    });
     /**
    * @ngdoc method
    * @name Lbaas#syncLoadBalancer
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Sync the specified load balancer
    */
    createAction(actions,'Sync', ['update'], {
            details: 'sync'
    });
    /**
    * @ngdoc method
    * @name Lbaas#getHistoricalUsage
    * @methodOf encore.svcs.cloud.lbaas.Lbaas
    * @description
    *
    * Get the specified load balancer's usage details
    */
    createAction(actions,'HistoricalUsage', ['get'], {
            details: 'usage'
    });

    return $resource(LbaasRoute, {
        user: '@user',
        region: '@region',
        id: '@id',
        detailId: '@detailId'
    }, actions);
}])
.factory('LoadBalancerTransforms', ["TransformUtil", "$routeParams", function (TransformUtil, $routeParams) {
    function listTransform (loadBalancer) {
        loadBalancer.url = '/cloud/' + $routeParams.accountNumber + '/' + $routeParams.user +
        '/loadbalancers/' + loadBalancer.region + '/' + loadBalancer.id;
        loadBalancer.nameId = loadBalancer.name + loadBalancer.id;
        loadBalancer.protocolPort = loadBalancer.protocol + ('00000' + loadBalancer.port).slice(-5);
        return loadBalancer;
    }
    var transforms = {
        list: [TransformUtil.pluckList('loadBalancers'),
            TransformUtil.mapList(listTransform)],
        updateHealthMonitor: function (data) {
            data.delay = parseInt(data.delay);
            data.timeout = parseInt(data.timeout);
            data.attemptsBeforeDeactivation = parseInt(data.attemptsBeforeDeactivation);
            return data;
        }
    };
    return {
        list: TransformUtil.responseChain(transforms.list),
        updateHealthMonitor: TransformUtil.requestChain(transforms.updateHealthMonitor)
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.logging
 *
 * @description
 * Services used for manipulation, retrieval and posting of Logging data
 */
angular.module('encore.svcs.cloud.logging', [
    'ngResource',
    'encore.svcs.cloud.config',
]);
angular.module('encore.svcs.cloud.logging')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudAccountActivityLogRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for New Relic API
     * for retrieving logs for a single account between two dates
     */
    .factory('CloudAccountActivityLogRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return (CLOUD_API_URL_BASE + '/new_relic/accounts/:accountId/insights');
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudAccountActivityLogResource
     * @description
     *
     * A set of functions that interact with the logging service API
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.config.logging:CloudAccountActivityLogRoute
     *
     *
     * For full API documentation see
     * {@link https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#new_relic}
     */
    .factory('CloudAccountActivityLogResource', ["CloudAccountActivityLogRoute", "$resource", function (CloudAccountActivityLogRoute, $resource) {
        return $resource(CloudAccountActivityLogRoute, {}, {
            /**
             * @ngdoc method
             * @name CloudAccountActivityLogResource#get
             * @methodOf encore.svcs.cloud.logging.CloudAccountActivityLogResource
             * @description
             *
             * Retrieve logs for an account based on dates sent to api
             * @example
             * <pre>
             *     CloudAccountActivityLogResource.get({
             *          "accountId": "12345",
             *          "start_date": "02-22-2016",
             *          "end_date": "01-22-2016" });
             *</pre>
             */
        });
    }]);

angular.module('encore.svcs.cloud.logging')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudActivityLogRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for New Relic API
     * for retrieving all logs between two given dates
     */
    .factory('CloudActivityLogRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return (CLOUD_API_URL_BASE + '/new_relic/insights');
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudActivityLogResource
     * @requires $resource
     * @requires encore.svcs.cloud.logging:CloudActivityLogRoute
     * @description
     *
     * A set of functions that interact with the logging service API
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.config.logging:CloudActivityLogRoute
     *
     *
     * For full API documentation see {@link
        * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#new_relic}
     */
    .factory('CloudActivityLogResource', ["CloudActivityLogRoute", "$resource", function (CloudActivityLogRoute, $resource) {
        return $resource(CloudActivityLogRoute, {}, {
            /**
             * @ngdoc method
             * @name CloudActivityLogResource#get
             * @methodOf encore.svcs.cloud.logging.CloudActivityLogResource
             * @description
             *
             * Retrieve logs based on dates sent to api
             * @example
             * <pre>
             *     CloudActivityLogResource.get({
             *     "start_date": "02-22-2016",
             *     "end_date": "01-22-2016" });
             * </pre>
             */
        });
    }]);
angular.module('encore.svcs.cloud.logging')

    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudActivityLogService
     * @requires encore.svcs.cloud.logging.CloudActivityLogResource
     * @requires encore.svcs.cloud.logging.CloudAccountActivityLogResource
     * @description:
     * A service dedicated to retrieving logs.
     */
    .factory('CloudActivityLogService', ["CloudActivityLogResource", "CloudAccountActivityLogResource", function (CloudActivityLogResource, CloudAccountActivityLogResource) {
        /**
         * @ngdoc method
         * @name CloudActivityLogService#rearrangeDate
         * @methodOf encore.svcs.cloud.logging.CloudActivityLogService
         * @param {String} dateString - String date representation to be rearranged for api call
         * @return { String | Boolean } - The date string rearranged or a boolean indicating a failed parse
         * @description
         * Takes a date string formatted as `yyyy-mm-dd` and
         * returns formatted date for api call `mm-dd-yyyy` or
         * false if the string fails the format check
         *
         */

        var rearrangeDate = function (dateString) {
            dateString = moment(dateString, 'YYYY-MM-DD').format('MM-DD-YYYY');
            if (dateString === 'Invalid date') {
                return false;
            } else {
                return dateString;
            }
        };

        /**
         * @ngdoc method
         * @name CloudActivityLogService#retrieveLogs
         * @methodOf encore.svcs.cloud.logging.CloudActivityLogService
         * @param {String} startDate - String indicating start date for logs in "yyyy-mm-dd" from rxDatePicker
         * (optional)
         * @param {String} endDate - String indicating end date for logs in "yyyy-mm-dd" from rxDatePicker
         * (optional)
         * @param {String} accountId - Account number to retrieve logs for (optional)
         * @description
         * Based on what parameters are passed in, makes get call to Encore Cloud API to
         * retrieve all logs for a date range or a single account's logs for a date range.
         * If none are passed in, retrieve them all
         *
         * @example
         * <pre>
         *     CloudActivityLogService.retrieveLogs('2016-02-11', '2016-04-23', '323676')
         * </pre>
         * <pre>
         *     CloudActivityLogService.retrieveLogs('2016-02-11', '2016-04-23')
         * </pre>
         *
         * <pre>
         *     CloudActivityLogService.retrieveLogs('2016-02-11')
         * </pre>
         *
         * <pre>
         *     // Potentially very very long running operation
         *     // Retrieves ALL LOGS EVER
         *     // Use with caution
         *     CloudActivityLogService.retrieveLogs()
         * </pre>
         * <pre>
         *     //Sample Data
         *     {
         *       "events": [
         *         {
         *           "timestamp": 1460412393349,
         *           "racker_sso": "sing2480",
         *           "product": "Account Overview",
         *           "action_text": "Updated Email for User cloudfiles1",
         *           "cloud_account_id": "323676",
         *           "app_name": "Encore Staging"
         *         }
         *       ]
         *     }
         * </pre>
         */
        var retrieveLogs = function (startDate, endDate, accountId) {
            var params = {};
            var endDateProperty = 'end_date';
            var startDateProperty = 'start_date';

            startDate = rearrangeDate(startDate);
            endDate = rearrangeDate(endDate);

            if (startDate && endDate) {
                params[startDateProperty] = startDate;
                params[endDateProperty] = endDate;

            } else if (startDate && !endDate) {
                params[startDateProperty] = startDate;

            } else if (!startDate && endDate) {
                params[endDateProperty] = endDate;

            }

            if (accountId) {
                params['accountId'] = accountId;
                return CloudAccountActivityLogResource.get(params);
            } else {
                return CloudActivityLogResource.get(params);
            }
        };
        return {
            rearrangeDate: rearrangeDate,
            retrieveLogs: retrieveLogs
        };
    }]);

angular.module('encore.svcs.cloud.logging')  
    /**
     * @ngdoc property
     * @name encore.svcs.cloud.logging.constant:LOGGING_TOGGLES
     * @example
        <pre>
            Standard Form
            productName: {
                name: What will show on New Relic
                action: {
                    enabled: if it will log at all,
                    template: lodash compile template form
                },
                action2: {
                    enabled: blah,
                    template: blah
                }
            },
            productName2: { ... }
         </pre>
     * @description:
     * Creates a standard form to the logging information and
     * allows Developers to turn off and on the logging itself
     */
    .constant('LOGGING_TOGGLES', {
        account: {
            name: 'Account Overview',
            addRole: {
                enabled: true,
                template: 'Added ${ rolename } for User ${ username }'
            },
            editInstruction: {
                enabled: true,
                template: 'Updated Account Instructions'
            },
            toggleUserState: {
                enabled: true,
                template: '${ state ? "Enabled" : "Disabled"} User ${ user }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            },
            removeGroup: {
                enabled: true,
                template: 'Removed Account Group ${ group }'
            },
            removeRole: {
                enabled: true,
                template: 'Removed ${ rolename} Role from User ${ username }'
            },
            updateEmail: {
                enabled: true,
                template: 'Updated Email for User ${ username }' 
            },
            updatePassword: {
                enabled: true,
                template: 'Updated Password for User ${ username }'
            },
            updateQuestion:{
                enabled: true,
                template: 'Updated Secret Question and Answer for User ${ username }'
            }
        },
        database: {
            name: 'Cloud Database',
            addDatabase: {
                enabled: true,
                template: 'Created Database Instance ${ databaseId }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            }
        },
        dns: {
            name: 'Cloud DNS',
            addDomain: {
                enabled: true,
                template: 'Added Domain ${ domainId }'
            },
            addRecord: {
                enabled: true,
                template: 'Added Record ${ hostname } to Domain ${ domainId }'
            },
            deleteDomain: {
                enabled: true,
                template: 'Deleted Domain ${ domainId }'
            },
            deleteMultiDomains: {
                enabled: true,
                template: 'Deleted Domains ${ domains.join(", ") }'
            },
            editDomain: {
                enabled: true,
                template: 'Updated Domain Details for Domain ${ domainId }'
            },
            editTTL: {
                enabled: true,
                template: 'Updated TTL for Domain ${ domainId }'
            },
            importDomain: {
                enabled: true,
                template: 'Imported Domain ${ domainId }'
            },
            updateContact: {
                enabled: true,
                template: 'Updated Contact for Domain ${ domainId }'
            }
        },
        image: {
            name: 'Cloud Server Images',
            createServer: {
                enabled: true,
                template: 'Created Server ${ serverName } from Image ${ imageId }'
            },
            deleteImage: {
                enabled: true,
                template: 'Deleted Image ${ imageId }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            }
        },
        loadBalancer: {
            name: 'Cloud Load Balancers',
            addAccessControlRule: {
                enabled: true,
                template: 'Updated Access Controls for Load Balancer ${ loadBalancerId }'
            },
            addCloudServers: {
                enabled: true,
                template: 'Added Cloud Server(s) ${ serverIds.join(", ") } to Load Balancer ${ loadBalancerId }'
            },
            addExternalNodes: {
                enabled: true,
                template: 'Added External Node(s) ${ nodeIds.join(", ") } to Load Balancer ${ loadBalancerId }'
            },
            addLoadbalancer: {
                enabled: true,
                template: 'Created Load Balancer ${ loadBalancerId }'
            },
            editErrorPage: {
                enabled: true,
                template: 'Edited Error Page for Load Balancer ${ loadBalancerId }'
            },
            enableContentCaching: {
                enabled: true,
                template: '${ state } Content Caching for Load Balancer ${ loadBalancerId }'
            },
            editLoadBalancerDetails: {
                enabled: true,
                template: 'Edited Details for Load Balancer ${ loadBalancerId }'
            },
            enableConnectionThrottling: {
                enabled: true,
                template: '${ state } Connection Throttling for Load Balancer ${ loadBalancerId }'
            },
            enableHealthMonitoring: {
                enabled: true,
                template: 'Updated Monitoring Settings for Load Balancer ${ loadBalancerId }'
            },
            enableLogging: {
                enabled: true,
                template: '${ state } Logging for Cloud Load Balancer ${ loadBalancerId }'
            },
            enableSessionPersistence: {
                enabled: true,
                template: 'Updated Session Persistence for Load Balancer ${ loadBalancerId }'
            },
            enableSSLTermination: {
                enabled: true,
                template: 'Enabled SSL Termination for Load Balancer ${ loadBalancerId }'
            },
            enableTemporaryRateLimit: {
                enabled: true,
                template: 'Updated Temporary Rate Limit for Load Balancer ${ loadBalancerId }'
            },
            goToReach:{
                enabled: true,
                template: 'Impersonated Customer in Reach'
            },
            syncLoadBalancer: {
                enabled: true,
                template: 'Synced Load Balancer ${ loadBalancerId }'
            }
        },
        monitoring: {
            name: 'Cloud Monitoring',
            exportEntities: {
                enabled: true,
                template: 'Exported Entities CSV'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            },
            traceroute: {
                enabled: true,
                template: 'Submitted Traceroute Query for Entity ID ${ entityId }'
            },
            updateAlarm: {
                enabled: true,
                template: 'Updated Criteria for Alarm ID ${ alarmId }, Entity ID ${ entityId }'
            }
        },
        server: {
            name: 'Cloud Servers',
            addIPv4: {
                enabled: true,
                template: 'Added IPv4 Address to Public Network'
            },
            create: {
                enabled: true,
                template: 'Created Server ${ serverId }'
            },
            delete: {
                enabled: true,
                template: 'Deleted Server ${ serverId }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            },
            suspend: {
                enabled: true,
                template: 'Suspended Server ${ serverId }'
            },
            unsuspend: {
                enabled: true,
                template: 'Unsuspended Server ${ serverId }'
            }
        },
        volume: {
            name: 'Cloud Block Storage Volumes',
            attachVolume: {
                enabled: true,
                template: 'Attached Volume ${ volumeId } to Server ${ serverId }'
            },
            createVolume: {
                enabled: true,
                template: 'Created CBS Volume ${ volumeId }'
            },
            createSnapshot: {
                enabled: true,
                template: 'Created Snapshot ${ snapshotName } of Volume ${ volumeId }'
            },
            deleteVolume: {
                enabled: true,
                template: 'Deleted Volume ${ volumeId }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            }
        },
        network: {
            name: 'Cloud Networks',
            create: {
                enabled: true,
                template: 'Created Network ${ networkId }'
            },
            goToReach: {
                enabled: true,
                template: 'Impersonated Customer in Reach'
            }
        },
        sites: {
            name: 'Cloud Sites',
            add: {
                enabled: true,
                template: 'Added primary site ${ siteName }'
            },
            delete: {
                enabled: true,
                template: 'Deleted primary site ${ siteName }'
            }
        },
        snapshot: {
            name: 'Cloud Block Storage Snapshot',
            createVolume: {
                enabled: true,
                template: 'Created Volume ${ volumeName } from Snapshot ${ snapshotId }'
            },
            deleteSnapshot:{
                enabled: true,
                template: 'Deleted Snapshot ${ snapshotId }'
            },
            goToReach:{
                enabled: true,
                template: 'Impersonated Customer in Reach'
            }
        }
    });
angular.module('encore.svcs.cloud.logging')
/**
* @ngdoc service
* @name encore.svcs.cloud.logging.CloudLoggingRoute
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
* @description
*
* Returns a string representation of the base path for files 
*/
.factory('CloudLoggingRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/new_relic/insights';
}])
/**
* @ngdoc service
* @name encore.svcs.cloud.logging.CloudLoggingResource
* @description
* 
* A set of function that interact with the logging service API
* @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
*/
.factory('CloudLoggingResource', ["$resource", "CloudLoggingRoute", function ($resource, CloudLoggingRoute) {
    return $resource(CloudLoggingRoute, {}, {
        /**
         * @ngdoc method
         * @name CloudLoggingResource#log
         * @methodOf encore.svcs.cloud.logging.CloudLoggingResource
         * @description
         * 
         * Sends given information to logging process for recording
         * @example
         * <pre> 
            CloudLoggingResource.log({
                "cloudAccountId": "12345",
                "product": "Account",
                "actionText": "Added Role XX to User XX" });
            </pre>
         */
        log: {
            method: 'POST'
        }
    });
}]);
angular.module('encore.svcs.cloud.logging')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.logging.CloudLoggingService
     * @requires LOGGING_TOGGLES
     * @requires CloudLoggingResource
     * @description:
     * A service dedicated to logging actions.
     */
    .factory('CloudLoggingService', ["LOGGING_TOGGLES", "CloudLoggingResource", function (LOGGING_TOGGLES, CloudLoggingResource) {
        //TODO: pre _.template the LOGGGING_TOGGLES all templates
        // so we dont do it on each call.

        /**
         * @name replaceText
         * @param {String} structure The template given in LOGGING_TOGGLES
         * @param {Object} values An object with key value pairs for
         * template
         * @returns {String} Successfully compiled string
         * @example
            <pre>
                //create a server
                // values = {server: "myTestServer"}
                replaceText('Created Server ${ server }, values)
                // replaceText == 'Created Server myTestServer'
            </pre>
         * @description:
         * Replaces template variables with given objects key values allowing for
         * template reuse.
         */
        var replaceText = function (structure, templatePairs) {

            //templatePairs is not empty check to make
            //sure all are defined.
            if (templatePairs) {
                for (var prop in templatePairs) {
                    if (_.isUndefined(templatePairs[prop]) || _.isNull(templatePairs[prop])) {
                        return false;
                    }
                }
            }

            try {
                var compiled = _.template(structure);
                return compiled(templatePairs);
            } catch (error) {
                //returns false if problem with compiling
                return false;
            }
        };

        return {
            /**
             * @ngdoc method
             * @name log
             * @methodOf encore.svcs.cloud.logging.CloudLoggingService
             * @param {String} accountId Id of Account
             * @param {String} product Where action is taking place
             * @param {String} action What is taking place
             * @param {Object} values An object with key values pairs for
             * template
             * @returns {Boolean} true if sent the api request
             * @example
                <pre>
                    // Create
                    CloudLoggingService.log('12333', 'server', 'create', { serverId: '1234-server'});
                </pre>
                <pre>
                    // Go to Reach Overview
                    CloudLoggingService.log('12333', 'server', 'reachOverview');
                </pre>
             * @description:
             * This function formats the log text using the arguments provided and
             * does a POST to the logging resource.

             */
            log: function (accountId, product, action, values) {
                values = values || {};
                // Will fail to Log the action if any of the following are true:
                    // 1. account is not a number
                    // 2. the product does not exists
                    // 3. the action does not exists within the product
                    // 4. logging for the action is disabled
                if (!isFinite(accountId) ||
                    !_.has(LOGGING_TOGGLES, product) ||
                    !_.has(LOGGING_TOGGLES[product], action) ||
                    !LOGGING_TOGGLES[product][action].enabled) {

                    return false;
                }

                var text = replaceText(LOGGING_TOGGLES[product][action].template, values);
                if (text) {
                    CloudLoggingResource.log({
                        'cloudAccountId': accountId,
                        'product': LOGGING_TOGGLES[product].name,
                        'actionText': text
                    });

                    return true;
                }

                return false;
            }
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.monitoring
 *
 * @description
 * Services used for manipulation and retrieval of monitoring service data
 */
angular.module('encore.svcs.cloud.monitoring', [
    'encore.svcs.cloud.config',
    'ngResource',
    'encore.common.http',
    'encore.util.transform'
]);

angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.AlarmRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Alarm API
 */
.factory('AlarmRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/entities/:entityId/alarms/:alarmId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.AlarmResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.AlarmRoute
 * @param {string} user - signifies the ownership of the entity
 * @param {string} entityId - signifies the entity id
 * @param {string} alarmId - signifies the alarm id
 * @description
 * `$resource` definition of Alarm API
 * http://docs-internal.rackspace.com/cm/api/v1.0/cm-devguide/content/service-alarms.html
 *
 * @example
 * <pre>
 * // GET (with id) - Gets the details for the specified alarm.
 * AlarmResource.get({ user: 'hub_cap', entityId: '123', alarmId: '456' });
 *
 * // GET (list) - Lists alarms for the specified user.
 * AlarmResource.list({ user: 'hub_cap' });
 *
 * // PUT - Updates the specified alarm resource.
 * AlarmResource.update({
 *   user: 'hub_cap', entityId: '123', alarmId: '456'
 * }, {
 *   name: 'Test Alarm', notification_plan_id: 'np2mteZxxt'
 * });
 *
 * // Gets the details for the specified alarm and updates it using one resource.
 * var alarm = AlarmResource.get({ user: 'hub_cap', entityId: '123', alarmId: '456' });
 * alarm.name = 'Boom';
 * alarm.$update({ entityId: '123', alarmId: '456'});
 * </pre>
 */
.factory('AlarmResource', ["$resource", "AlarmRoute", function ($resource, AlarmRoute) {
    return $resource(AlarmRoute, {
        user: '@user',
        entityId: '@entityId',
        alarmId: '@alarmId'
    }, {
        /**
         * @ngdoc method
         * @name AlarmResource#list
         * @methodOf encore.svcs.cloud.monitoring.AlarmResource
         * @description
         * Lists alarms for the specified user.
         */
        list: {
            isArray: true
        },
        /**
         * @ngdoc method
         * @name AlarmResource#update
         * @methodOf encore.svcs.cloud.monitoring.AlarmResource
         */
        update: {
            method: 'PUT'
        }
    });
}]);

angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudEntityCheckRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Check API
 */
.factory('CloudEntityCheckRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/entities/:entityId/checks/:checkId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudEntityCheckResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.CloudEntityCheckRoute
 * @description
 * `$resource` definition of Check API
 * http://docs-internal.rackspace.com/cm/api/v1.0/cm-devguide/content/service-checks.html
 */
.factory('CloudEntityCheckResource', ["$resource", "CloudEntityCheckRoute", "CloudEntityCheckTransform", function ($resource, CloudEntityCheckRoute, CloudEntityCheckTransform) {
    return $resource(CloudEntityCheckRoute, {
        user: '@user',
        entityId: '@entityId',
        checkId: '@checkId'
    }, {
        /**
         * @ngdoc method
         * @name CloudEntityCheckResource#get
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityCheckResource
         * @requires encore.svcs.cloud.monitoring.CloudEntityCheckTransform#get
         * @description
         *
         *  Get an entity's check details
         * *default get method from `$resource`*
         * @example
         * <pre>
         * CloudEntityCheckResource.get({ user: 'hub_cap', entityId: '123', checkId: '456' });
         * </pre>
         * <pre>
         * {
         *     "disabled": false,
         *     "timeout": 10,
         *     "type": "agent.mysql",
         *     "details": {
         *         "port": 3306,
         *         "username": "raxmon",
         *         "host": "127.0.0.1",
         *         "password": "7i4eyte5-b3a1-46a9-9885-ptc3a3b4087e"
         *     },
         *     "created_at": 1428505880606,
         *     "period": 30,
         *     "updated_at": 1428505880606,
         *     "alarms": [],
         *     "name": "MySQL",
         *     "monitoring_zones": null,
         *     "id": "ch4j9PYUbx",
         *     "alarm_count": {
         *         "ok": 0,
         *         "unknown": 0,
         *         "warning": 0,
         *         "critical": 0
         *     }
         * }
         * </pre>
         */
        get: {
            method: 'GET',
            transformResponse: CloudEntityCheckTransform.get
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudEntityCheckTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of cloud entity check response transformations
 * @description
 *
 * Transforms the result of Cloud Entity Check api calls
 */
.factory('CloudEntityCheckTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name CloudEntityCheckTransform#getCloudEntityCheck
     * @methodOf encore.svcs.cloud.monitoring.CloudEntityCheckTransform
     * @description
     *
     * Takes a single instance of a cloud entity check and massages it to ensure it is as expected
     * @example
     * <pre>
     * // api response:
     * "check": {
     *     "disabled": false,
     *     "timeout": 10,
     *     "type": "agent.mysql",
     *     "details": {
     *         "port": 3306,
     *         "username": "raxmon",
     *         "host": "127.0.0.1",
     *         "password": "7i4eyte5-b3a1-46a9-9885-ptc3a3b4087e"
     *     },
     *     "created_at": 1428505880606,
     *     "period": 30,
     *     "updated_at": 1428505880606,
     *     "alarms": [],
     *     "name": "MySQL",
     *     "monitoring_zones": null,
     *     "id": "ch4j9PYUbx",
     *     "alarm_count": {
     *         "ok": 0,
     *         "unknown": 0,
     *         "warning": 0,
     *         "critical": 0
     *     }
     * }
     * </pre>
     * <pre>
     * // transformed response:
     * {
     *     "disabled": false,
     *     "timeout": 10,
     *     "type": "agent.mysql",
     *     "details": {
     *         "port": 3306,
     *         "username": "raxmon",
     *         "host": "127.0.0.1",
     *         "password": "7i4eyte5-b3a1-46a9-9885-ptc3a3b4087e"
     *     },
     *     "created_at": 1428505880606,
     *     "period": 30,
     *     "updated_at": 1428505880606,
     *     "alarms": [],
     *     "name": "MySQL",
     *     "monitoring_zones": null,
     *     "id": "ch4j9PYUbx",
     *     "alarm_count": {
     *         "ok": 0,
     *         "unknown": 0,
     *         "warning": 0,
     *         "critical": 0
     *     }
     * }
     * </pre>
     */
    // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
    var getCloudEntityCheck = function (data) {
        if (_.has(data, 'check')) {
            return data.check;
        } else {
            return data;
        }
    };

    return {
        get: TransformUtil.responseChain(getCloudEntityCheck)
    };
}]);
angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.EntityRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Entity API
 */
.factory('EntityRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/entities/:entityId/:action';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudEntityResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.EntityRoute
 * @requires encore.svcs.cloud.monitoring.EntityTransform
 * @param {string} user - signifies the ownership of the entity
 * @param {string} entityId - signifies the entity id
 * @description
 * `$resource` definition of Entity API
 * http://docs-internal.rackspace.com/cm/api/v1.0/cm-devguide/content/service-entities.html
 *
 * @example
 * <pre>
 * // GET (with id) - Gets the details for the specified entity.
 * CloudEntityResource.get({ user: 'hub_cap', entityId: '123' });
 *
 * // GET (list) - Lists entities for the specified user.
 * CloudEntityResource.list({ user: 'hub_cap' });
 *
 * // POST (test_alarm) - Tests criteria for the specified alarm.
 * CloudEntityResource.testAlarm({
 *   user: 'hub_cap', entityId: '123'
 * }, {
 *   criteria: 'if (metric["duration"] > 2) { return [...] }', check_id: 'cid2mte'
 * });
 * </pre>
 */
.factory('CloudEntityResource', ["$resource", "EntityRoute", "EntityTransform", function ($resource, EntityRoute, EntityTransform) {
    return $resource(EntityRoute, {
        user: '@user',
        entityId: '@entityId'
    }, {
        /**
         * @ngdoc method
         * @name CloudEntityResource#list
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityResource
         * @requires encore.svcs.cloud.monitoring.EntityTransform#list
         * @description
         * Lists entities for the specified user.
         */
        list: {
            method: 'GET',
            transformResponse: EntityTransform.list,
            isArray: true
        },
        /**
         * @ngdoc method
         * @name CloudEntityResource#processes
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityResource
         * @description
         * Lists processes for the specified user and entity
         *
         * @example
         * <pre>CloudEntityResource.processes({ user: 'hubcap', entityId: 'enTitY123' })</pre>
         * <pre>
         * {
         *   "processes": [
         *     {
         *       "memory_size": 10858496,
         *       "state_name": "init",
         *       "id": 1,
         *       "name": "\/sbin\/init"
         *     },
         *     {
         *       "memory_size": null,
         *       "state_name": "kthreadd\/829",
         *       "id": 2,
         *       "name": null
         *     },
         *     {
         *       "memory_size": null,
         *       "state_name": "khelper\/829",
         *       "id": 3,
         *       "name": null
         *     }
         *   ]
         * }
         * </pre>
         */
        processes: {
            method: 'GET',
            params: {
                action: 'processes'
            }
        },
        /**
         * @ngdoc method
         * @name CloudEntityResource#get
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityResource
         * @requires encore.svcs.cloud.monitoring.EntityTransform#get
         * @description
         *
         * Special case GET function so that we can transform a single instance of an entity
         */
        get: {
            method: 'GET',
            transformResponse: EntityTransform.get
        },
        /**
         * @ngdoc method
         * @name CloudEntityResource#testAlarm
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityResource
         */
        testAlarm: {
            method: 'POST',
            params: {
                action: 'test_alarm'
            }
        },
        /**
         * @ngdoc method
         * @name CloudEntityResource#csv
         * @methodOf encore.svcs.cloud.monitoring.CloudEntityResource
         * @requires encore.svcs.cloud.monitoring.EntityTransform#getCsv
         *
         * @example
         * <pre>CloudEntityResource.csv({ user: 'hubcap' });</pre>
         * <pre>
         * {
         *    "url": /hub_cap/maas/entities/csv/1326c7a77098db9754f313ca4c847479d36fdd683a709"
         * }
         * </pre>
         */
        csv: {
            method: 'GET',
            transformResponse: EntityTransform.csv,
            params: {
                action: 'csv'
            }
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.EntityTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of entity response transformations
 * @description
 *
 * Transforms the result of Entity api calls
 */
.factory('EntityTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name EntityTransform#getEntities
     * @methodOf encore.svcs.cloud.monitoring.EntityTransform
     * @returns {array} - Returns an array of entities from TransformUtil.pluckList
     * @description
     *
     * Takes a collection of entities and massages each instance to ensure it is as expected
     */
    var getEntities = TransformUtil.pluckList('entities');

    /**
     * @ngdoc method
     * @name EntityTransform#getEntity
     * @methodOf encore.svcs.cloud.monitoring.EntityTransform
     * @description
     *
     * Takes a single instance of an image and massages it to ensure it is as expected
     */
    var getEntity = function (data) {
        if (_.has(data.entity, 'ip_addresses')) {
            //Rename ip addresses keys to use (<ip-type>_v<#>) i.e. private1_v4 => private_v4
            var newList = {};
            _.each(data.entity['ip_addresses'], function (ip, key) {
                //only rename public and private keys
                if (key.indexOf('access')  !== -1) {
                    newList[key] = ip;
                } else {
                    newList[key.replace(/\d+_/g, '_')] = ip;
                }
            });
            data.entity['ip_addresses'] =  newList;
        }
        return data;
    };

    /**
     * @ngdoc method
     * @name EntityTransform#getCsv
     * @methodOf encore.svcs.cloud.monitoring.EntityTransform
     * @description
     *
     * Prepends /api/cloud/users to comply with proxy set up
     */
    var getCsv = function (data) {
        data.url = '/api/cloud/users' + data.url;
        return data;
    };

    return {
        list: TransformUtil.responseChain(getEntities),
        get: TransformUtil.responseChain(getEntity),
        csv: TransformUtil.responseChain(getCsv)
    };
}]);

angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.notificationPlanRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Notification Plan API
 */
.factory('NotificationPlanRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/notification_plans';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.NotificationPlanResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.NotificationPlanRoute
 * @description
 * `$resource` definition of Notification Plan API
 * http://docs-internal.rackspace.com/cm/api/v1.0/cm-devguide/content/service-notification-plans.html
 *
 * @example
 * <pre>
 * // GET (no id) - Lists notifications plans available for the specified user.
 * NotificationPlanResource.get({ user: 'hub_cap' });
 * </pre>
 */
.factory('NotificationPlanResource', ["$resource", "NotificationPlanRoute", function ($resource, NotificationPlanRoute) {
    return $resource(NotificationPlanRoute, {
        user: '@user'
    });
}]);

angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudZoneRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 * Returns a string representation of the base path for the Zone API
 */
.factory('CloudZoneRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/zones/:zoneId';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.CloudZoneResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.CloudZoneRoute
 * @param {string} user - signifies the ownership of the account
 * @description
 * `$resource` definition of Zone API
 * http://docs-internal.rackspace.com/cm/api/v1.0/cm-devguide/content/service-monitoring-zones.html
 */
.factory('CloudZoneResource', ["$resource", "CloudZoneRoute", "CloudZoneTransforms", function ($resource, CloudZoneRoute, CloudZoneTransforms) {
    return $resource(CloudZoneRoute, {
        user: '@user',
        zoneId: '@zoneId'
    }, {
        /**
         * @ngdoc method
         * @name CloudZoneResource#zones
         * @methodOf encore.svcs.cloud.monitoring.CloudZoneResource
         * @description
         * Lists available zones for the specified user.
         *
         * @example
           <pre>
           // GET (list) - Lists available monitoring zones for the specified user.
           CloudZoneResource.list({ user: 'hub_cap' });
           </pre>
           <pre>
           // response
           [
               {"name": "dfw", "id": "mzdfw"},
               {"name": "hkg", "id": "mzhkg"},
               {"name": "iad", "id": "mziad"},
               {"name": "lon", "id": "mzlon"},
               {"name": "ord", "id": "mzord"}
           ]
           </pre>
         */
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: CloudZoneTransforms.list
        },
        /**
         * @ngdoc method
         * @name CloudZoneResource#traceroute
         * @methodOf encore.svcs.cloud.monitoring.CloudZoneResource
         * @description
         * Performs a traceroute to the specified target.
         *
         * @example
           <pre>
           //POST - Performs a traceroute to the specified target.
           CloudZoneResource.traceroute({ user: 'hub_cap' }, {
             target: '184.106.255.31', target_resolver: 'IPv4'
           });
           </pre>
           <pre>
           // response
           [
             {
               "hop": 1, "ip": "74.205.48.194", "rtts": [0.45, 0.475, 0.419, 0.446, 0.447]
             }, {
               "hop": 2, "ip": "67.192.56.42", "rtts": [0.499, 0.524, 0.514, 0.552, 0.568]
             }, {
               "hop": 3, "ip": "184.106.126.125", "rtts": [30.991, 30.897, 31.051, 30.949, 30.938]
             }, {
               "hop": 4, "ip": "173.203.0.233", "rtts": [30.794, 30.77, 30.804, 31.031, 30.791]
             }
           ]
           </pre>
         */
        traceroute: {
            method: 'POST',
            isArray: true,
            url: CloudZoneRoute + '/trace_route',
            transformResponse: CloudZoneTransforms.traceroute
        }
    });
}])
/**
 * @ngdoc object
 * @name encore.svcs.cloud.monitoring.CloudZoneTransforms
 * @requires encore.svcs.util.http.TransformUtil
 * @description
 * Collection of `$http` transforms to modify data being received/sent of API services
 * in regards with Zones.
 */
.factory('CloudZoneTransforms', ["TransformUtil", function (TransformUtil) {
    var getZones = TransformUtil.pluckList('zones');
    var getTraceroute = TransformUtil.pluckList('tracked_routes');

    return {
        list: TransformUtil.responseChain(getZones),
        traceroute: TransformUtil.responseChain(getTraceroute)
    };
}]);

angular.module('encore.svcs.cloud.monitoring')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.TriggeredAlarmsRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Triggered Alarms API
 */
.factory('TriggeredAlarmsRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/maas/triggered_alarms';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.TriggeredAlarmsResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.monitoring.TriggeredAlarmsRoute
 * @description
 * `$resource` definition of Triggered Alarms API
 *
 * @example
 * <pre>
 * // GET (list) - Lists triggered alarms for the specified user.
 * TriggeredAlarms.list({ user: 'hub_cap' });
 * </pre>
 */
.factory('TriggeredAlarmsResource', ["$resource", "TriggeredAlarmsRoute", "TriggeredAlarmsTransform", function ($resource, TriggeredAlarmsRoute, TriggeredAlarmsTransform) {
    return $resource(TriggeredAlarmsRoute, {
        user: '@user'
    }, {
    	/**
         * @ngdoc method
         * @name TriggeredAlarmsResource#list
         * @methodOf encore.svcs.cloud.monitoring.TriggeredAlarmsResource
         * @requires encore.svcs.cloud.monitoring.TriggeredAlarmsTransform#list
         * @description
         * Lists triggered alarms for the specified user.
         */
        list: {
            method: 'GET',
            transformResponse: TriggeredAlarmsTransform.list,
            isArray: true
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.monitoring.TriggeredAlarmsTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of triggered alarms response transformations
 * @description
 *
 * Transforms the result of Triggered Alarms api calls
 */
.factory('TriggeredAlarmsTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name TriggeredAlarmsTransform#list
     * @methodOf encore.svcs.cloud.monitoring.TriggeredAlarmsTransform
     * @returns {array} - Needs to ensure that it will always return an array, even
     * when an error occurs
     * @description
     *
     * Takes a collection of triggered alarms and massages each instance to ensure it is as expected
     */
    var getTriggeredAlarms = TransformUtil.pluckList('triggered_alarms');

    return {
        list: TransformUtil.responseChain(getTriggeredAlarms)
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.networks
 *
 * @description
 * Collection of services used for interacting with Networks for Cloud Products
 */
angular.module('encore.svcs.cloud.networks', [
    'encore.common.http',
    'encore.util.transform'
])
/**
 * @ngdoc property
 * @const NETWORK_PRIVATE_ID
 * @name encore.svcs.cloud.networks.constant:NETWORK_PRIVATE_ID
 * @description
 *
 * Constant for the Network Private Id
 */
.constant('NETWORK_PRIVATE_ID', '11111111-1111-1111-1111-111111111111')
/**
 * @ngdoc property
 * @const NETWORK_PUBLIC_ID
 * @name encore.svcs.cloud.networks.constant:NETWORK_PUBLIC_ID
 * @description
 *
 * Constant for the Network Public Id
 */
.constant('NETWORK_PUBLIC_ID', '00000000-0000-0000-0000-000000000000');

angular.module('encore.svcs.cloud.networks')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.networks.NetworkRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Network API
 */
.factory('NetworkRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/networks/:region/:networkid';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.networks.NetworkResource
 * @requires $resource
 * @requires encore.svcs.cloud.servers.NetworkRoute
 * @description
 *
 * `$resource` definition of Network API
 */
.factory('NetworkResource', ["$resource", "NetworkRoute", "NetworkTransforms", function ($resource, NetworkRoute, NetworkTransforms) {
    return $resource(NetworkRoute, {
        user: '@user',
        region: '@region',
        networkid: '@networkid'
    }, {
        list: {
            method: 'GET',
            transformResponse: NetworkTransforms.list,
            isArray: true
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.networks.NetworkTransforms
 * @requires $routeParams
 * @requires encore.svcs.util.http.TransformUtil
 * @requires encore.util.transform.Pluck
 * @requires encore.svcs.cloud.networks.NetworkNameFilter
 * @requires encore.svcs.cloud.networks.isPrivateNetwork
 * @requires encore.svcs.cloud.networks.isRackspaceNetwork
 * @description
 *
 * Collection of `$http` transforms to modify data being received/sent of API services for Networks
 */
.factory('NetworkTransforms', ["TransformUtil", "Pluck", "NetworkUtil", function (TransformUtil, Pluck, NetworkUtil) {

    // #TODO Convert to use TransformUtil.mapList
    var transforms = {
        list: function (networks) {
            _.map(networks, function (network) {
                network.privateNetwork = NetworkUtil.isPrivateNetwork(network);
                network.rackspaceNetwork = NetworkUtil.isRackspaceNetwork(network);
                network.deletableNetwork = NetworkUtil.isDeletableNetwork(network);
                network.title = NetworkUtil.getNetworkTitle(network);
                return network;
            });
            return networks;
        }
    };
    // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
    return {
        list: TransformUtil.responseChain([Pluck('networks'), transforms.list])
    };
}]);

angular.module('encore.svcs.cloud.networks')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.networks.NetworkService
 * @requires $q
 * @requires encore.svcs.cloud.networks.NetworkResource
 * @requires encore.svcs.cloud.common.CloudRegionsUtil
 * @description
 *
 * Service for interacting with Encore Cloud API for Cloud Networks
 */
.factory('NetworkService', ["$q", "NetworkResource", "CloudRegionsUtil", function ($q, NetworkResource, CloudRegionsUtil) {
    return {

        /**
         * @ngdoc method
         * @name NetworkService#fetchNetworks
         * @methodOf encore.svcs.cloud.networks.NetworkService
         * @description
         *
         * Returns a promise that retrieves an array of networks transformed by
         * {@link encore.svcs.cloud.networks.NetworkTransforms#list}
         */
        fetchNetworks: function (user, failedRequestsContainer, regionsCallback) {

            var deferred = $q.defer();

            var networksList = [];

            var config = {
                svc: NetworkResource.list,
                name: 'Networks',
                scopeProp: 'networks',
                user: user,
                regionsCallback: regionsCallback
            };

            CloudRegionsUtil.loadDataForEachRegion(config)
                .then(function (networks) {
                    deferred.resolve(networks);
                }, function (errors) {
                    /* jshint maxlen:false */
                    failedRequestsContainer.failedRequests = errors;
                    deferred.resolve(networksList);
                }, function (networks) {
                    networksList = networksList.concat(networks);
                    deferred.notify(networks);
                });

            return deferred.promise;
        }
    };
}]);

angular.module('encore.svcs.cloud.networks')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.networks.NetworkUtil
 * @requires encore.svcs.cloud.networks.constant:NETWORK_PUBLIC_ID
 * @requires encore.svcs.cloud.networks.constant:NETWORK_PRIVATE_ID
 * @description
 *
 * Collection of utility functions to be used with Cloud Networks.
 */
.factory('NetworkUtil', ["NETWORK_PUBLIC_ID", "NETWORK_PRIVATE_ID", function (NETWORK_PUBLIC_ID, NETWORK_PRIVATE_ID) {
    var utils = {
        /**
         * @ngdoc method
         * @name NetworkUtil#isPrivateNetwork
         * @methodOf encore.svcs.cloud.networks.NetworkUtil
         * @description
         *
         * Determines whether a network is a private network
         *
         * @param {Object} network Object representing a Cloud Network
         * @returns {Boolean} Returns true for a Private network, else false
         */
        isPrivateNetwork: function (network) {
            return network.privateNetwork === true ||
                (network.id !== NETWORK_PUBLIC_ID && network.id !== NETWORK_PRIVATE_ID);
        },
        /**
         * @ngdoc method
         * @name NetworkUtil#isRackspaceNetwork
         * @methodOf encore.svcs.cloud.networks.NetworkUtil
         * @description
         *
         * Determines whether a network is a Rackspace network
         *
         * @param {Object} network Object representing a Cloud Network
         * @returns {Boolean} Returns true for a Rackspace network, else false
         */
        isRackspaceNetwork: function (network) {
            return network.rackspaceNetwork === true ||
                (network.id === NETWORK_PUBLIC_ID || network.id === NETWORK_PRIVATE_ID);
        },
        /**
         * @ngdoc service
         * @name NetworkUtil#isDeletableNetwork
         * @methodOf encore.svcs.cloud.networks.NetworkUtil
         * @description
         *
         * Determines whether a network is deletable
         *
         * @param {Object} network Object representing a Cloud Network
         * @returns {Boolean} Returns true for a network that is deletable, else false
         */
        isDeletableNetwork: function (network) {
            return utils.isPrivateNetwork(network);
        },
        /**
         * @ngdoc method
         * @name NetworkUtil#getNetworkTitle
         * @methodOf encore.svcs.cloud.networks.NetworkUtil
         * @description
         *
         * Retrieve the network title
         *
         * @param {Object} network Object representing a Cloud Network
         * @returns {String} Returns the network title
         */
        getNetworkTitle: function (network) {
            if (network.id === NETWORK_PUBLIC_ID) {
                return 'PublicNet';
            } else if (network.id === NETWORK_PRIVATE_ID) {
                return 'ServiceNet';
            } else {
                return network.label;
            }
        }
    };
    return {
        isPrivateNetwork: utils.isPrivateNetwork,
        isRackspaceNetwork: utils.isRackspaceNetwork,
        isDeletableNetwork: utils.isDeletableNetwork,
        getNetworkTitle: utils.getNetworkTitle
    };
}])
/**
 * @ngdoc filter
 * @name encore.svcs.cloud.networks.PrivateNetworks
 * @requires encore.svcs.cloud.networks.NetworkUtil
 * @description
 *
 * Filter used to filter the Private networks from a collection of networks
*/
.filter('PrivateNetworks', ["NetworkUtil", function (NetworkUtil) {
    return function (networks) {
        return _.filter(networks, NetworkUtil.isPrivateNetwork);
    };
}])
/**
 * @ngdoc filter
 * @name encore.svcs.cloud.networks.RackspaceNetworks
 * @requires encore.svcs.cloud.networks.NetworkUtil
 * @description
 *
 * Filter used to filter the Rackspace networks from a collection of networks
*/
.filter('RackspaceNetworks', ["NetworkUtil", function (NetworkUtil) {
    return function (networks) {
        return _.filter(networks, NetworkUtil.isRackspaceNetwork);
    };
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.search
 *
 * @description
 * Services used for cloud search within encore applications
 */
angular.module('encore.svcs.cloud.search', [
    'ngResource',
    'encore.common.http'
]);

angular.module('encore.svcs.cloud.search')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.search
     * @requires $resource
     * @requires CloudSearchTransforms
     * @description
     *
     * Return results based on a search for an account within an encore application
     * Transform the data to be displayed appropriately using CloudSearchTransforms
     */
    .factory('CloudSearchResource', ["$resource", "CloudSearchTransforms", function ($resource, CloudSearchTransforms) {
        return $resource('/api/cloud/search', {}, {
            search: {
                method: 'GET',
                isArray: true,
                transformResponse: CloudSearchTransforms.search
            }
        });
    }])
    /**
     * @ngdoc service
     * @name CloudSearchTransforms
     * @requires encore.common.http
     * @description
     *
     * Transform the data by plucking the 'hits' then convert 'account_id' to a string
     * because some accounts are stored as integers. Push the results back into the
     * object and then return the results back.
     */
    .factory('CloudSearchTransforms', ["TransformUtil", function (TransformUtil) {
        var searchPluck = TransformUtil.pluckList('hits');
        var searchMap = function (hits) {
            var results = [];
            _.uniqBy(hits, function (rec) {
                //convert account_id to string since some accounts are stored as integers
                return (rec['_source']['account_id']).toString();
            }).forEach(function (hit) {
                results.push({
                    score: hit['_score'],
                    type: hit['_type'],
                    id: hit['_source']['account_id'],
                    name: hit['_source']['account_name'] || hit['_source']['name'],
                    status: hit['_source']['account_status'] || hit['_source']['state']
                });
            });
            return results;
        };
        return {
            search: TransformUtil.responseChain([searchPluck, searchMap])
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers
 *
 * @description
 * Collection of services used for the interaction of FirstGen & NextGen Servers for Cloud Products
 */
angular.module('encore.svcs.cloud.servers', [
    'encore.common.http',
    'encore.util.transform',
    'encore.svcs.cloud.servers.firstGen',
    'encore.svcs.cloud.servers.nextGen',
    'encore.svcs.cloud.servers.rackConnect',
    'encore.svcs.cloud.servers.serverMill'
])
    /**
     * @ngdoc property
     * @const FIRST_GEN_MIGRATION_TILL
     * @name encore.svcs.cloud.servers.constant:FIRST_GEN_MIGRATION_TILL
     * @description
     *
     * Constant for the Key of the last day self migration is available for a First Gen Server
     */
    .constant('FIRST_GEN_MIGRATION_TILL', 'FG2NG_self_migration_available_till')
    /**
     * @ngdoc property
     * @const FIRST_GEN_MIGRATION_FROM
     * @name encore.svcs.cloud.servers.constant:FIRST_GEN_MIGRATION_FROM
     * @description
     *
     * Constant for the Key of the first day self migration is available for a First Gen Server
     */
    .constant('FIRST_GEN_MIGRATION_FROM', 'FG2NG_self_migration_available_from')
    /**
     * @ngdoc property
     * @const FIRST_GEN_DAYS_OF_WEEK
     * @name encore.svcs.cloud.servers.constant:FIRST_GEN_DAYS_OF_WEEK
     * @description
     *
     * List of days of the week for Backup Schedule Dropdowns
     */
    .constant('FIRST_GEN_DAYS_OF_WEEK', [
        { value: 'DISABLED', label: 'Disable' },
        { value: 'SUNDAY', label: 'Sunday' },
        { value: 'MONDAY', label: 'Monday' },
        { value: 'TUESDAY', label: 'Tuesday' },
        { value: 'WEDNESDAY', label: 'Wednesday' },
        { value: 'THURSDAY', label: 'Thursday' },
        { value: 'FRIDAY', label: 'Friday' },
        { value: 'SATURDAY', label: 'Saturday' }
    ])
    /**
     * @ngdoc property
     * @const FIRST_GEN_HOURS_OF_DAY
     * @name encore.svcs.cloud.servers.constant:FIRST_GEN_HOURS_OF_DAY
     * @description
     *
     * List of hours of the day for Backup Schedule Dropdowns
     */
    .constant('FIRST_GEN_HOURS_OF_DAY', [
        { value: 'DISABLED', label: 'Disable' },
        { value: 'H_0000_0200', label: '12:00 am - 2:00 am UTC' },
        { value: 'H_0200_0400', label: '2:00 am - 4:00 am UTC' },
        { value: 'H_0400_0600', label: '4:00 am - 6:00 am UTC' },
        { value: 'H_0600_0800', label: '6:00 am - 8:00 am UTC' },
        { value: 'H_0800_1000', label: '8:00 am - 10:00 am UTC' },
        { value: 'H_1000_1200', label: '10:00 am - 12:00 pm UTC' },
        { value: 'H_1200_1400', label: '12:00 pm - 2:00 pm UTC' },
        { value: 'H_1400_1600', label: '2:00 pm - 4:00 pm UTC' },
        { value: 'H_1600_1800', label: '4:00 pm - 6:00 pm UTC' },
        { value: 'H_1800_2000', label: '6:00 pm - 8:00 pm UTC' },
        { value: 'H_2000_2200', label: '8:00 pm - 10:00 pm UTC' },
        { value: 'H_2200_0000', label: '10:00 pm - 12:00 am UTC' }
    ]);

angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.AddressVersionLabel
     * @description
     *
     * Returns an IP address label based on the IP version
     */
    .factory('AddressVersionLabel', function () {
        return function (address) {
            address.label = 'IPv' + address.version;
        };
    });

angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.AdminAuthenticate
     * @description
     *
     * A set of methods for authenticating for admin actions on servers
     */
    .factory('AdminAuthenticate', ["$q", "NovaAdmin", function ($q, NovaAdmin) {
        var AdminAuthenticate = {};
        var authenticateDeferred;

        var newPromise = function () {
            authenticateDeferred = $q.defer();
        };

        newPromise();

        /**
         * @ngdoc method
         * @name AdminAuthenticate#authenticate
         * @methodOf encore.svcs.cloud.servers.AdminAuthenticate
         * @description
         *
         * Authenticate with the given password. This returns a promise
         * that will resolve to the API response if the authentication succeeded,
         * otherwise it will reject
         */
        AdminAuthenticate.authenticate = function (username, password, regions) {
            var currentPromise = authenticateDeferred.promise;

            NovaAdmin.authenticate({}, {
                username: username,
                password: password,
                regions: regions
            }).$promise.then(function (data) {
                authenticateDeferred.resolve(data);
                newPromise();
            }, function (error) {
                authenticateDeferred.reject(error);
                newPromise();
            });

            return currentPromise;
        };

        /**
         * @ngdoc method
         * @name AdminAuthenticate#isAuthenticated
         * @methodOf encore.svcs.cloud.servers.AdminAuthenticate
         * @description
         *
         * Return the current promise. It will be resolved/rejected
         * after someone calls AdminAuthenticate.authenticate()
         */
        AdminAuthenticate.isAuthenticated = function () {
            return authenticateDeferred.promise;
        };

        return AdminAuthenticate;
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.CloudServerActionsDisable
     * @description
     *
     * Determine if a server action should be displayed as disabled.
     * @param {String} state - Server task state
     */
    .factory('CloudServerActionsDisable', function () {
        return function (state) {
            return state === 'deleting';
        };
    });

angular.module('encore.svcs.cloud.servers')
    /**
    * @ngdoc service
    * @name encore.svcs.cloud.servers.CloudServerActionsDisplay
    *
    * @description
    * Generate a function to compare against server information and the expected actions
    * to be taken against the server
    *
    * @param {Object} $scope - scope from which to get server/actions
    * @returns {function(status, actionName[, expr1, expr2, exprN...])} function that can be called with a status,
    *                                                                   the name of an action, and expressions that
    *                                                                   are truthy/falsy to determine true/false outcome
    */
    .factory('CloudServerActionsDisplay', function () {
        return function ($scope) {
            return function (status, actionName) {
                var expected = arguments.length - 2;
                var expressions, confirmed;
                // Check if we have status first
                var show = (_.isNull(status) || $scope.server.status === status);
                // Check if we have a valid action
                show = show && _.includes($scope.actions, actionName);
                // If we are still to show, check to see if we expect any more truthy/falsy statements
                if (show === true && expected > 0) {
                    // Get the rest of the expressions
                    expressions = _.toArray(arguments).slice(2);
                    // Get a count of all truthy expressions by getting rid of falsy ones by _.compact
                    confirmed = _.compact(expressions).length;

                    // If no true/false statement
                    show = show && expected === confirmed;
                }
                return show;
            };
        };
    });

angular.module('encore.svcs.cloud.servers')
    .value('NEXTGEN_FLAVOR_CLASS_TITLES', [])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.CloudServerFlavorClass
     * @description
     *
     * Get metadata on the flavor class for a specific flavor
     */
    .factory('CloudServerFlavorClass', ["NEXTGEN_FLAVOR_CLASS_TITLES", "rxCapitalizeFilter", function (NEXTGEN_FLAVOR_CLASS_TITLES, rxCapitalizeFilter) {
        // Only match the alphabetical first part of the flavor id
        var matchGroupRegEx = /([A-Za-z]+)\-?.*/;
        var matchStandardIdRegEx = /^([0-9]+)$/;

        // If the flavorId has any defined custom class titles
        var matchCustomFlavorTitle = function (flavorId) {
            if (!isNaN(parseFloat(flavorId))) {
                return;
            }
            return _.find(NEXTGEN_FLAVOR_CLASS_TITLES, _.bind(function (flavor) {
                return _.includes(this.flavor, flavor.id);
            }, { flavor: flavorId }));
        };
        var formatFlavorGrouping = function (flavorId) {
            // get the first grouping match
            if (!_.isNull(flavorId.match(matchStandardIdRegEx))) {
                return 'standard';
            }
            return flavorId.match(matchGroupRegEx)[1];
        };

        return function (flavorId) {
            // See which flavor matches
            var flavor = matchCustomFlavorTitle(flavorId), title, id;

            // We didn't find a custom flavor title match
            if (_.isEmpty(flavor)) {
                // Get only the first part of the flavor
                id = title = formatFlavorGrouping(flavorId);
                // Capitalize!
                title = rxCapitalizeFilter(title);
            } else {
                id = flavor.id;
                title = flavor.title;
            }
            // return an object describing the Flavor Class
            return {
                id: id,
                title: title
            };
        };
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.CloudServerFlavorGroups
     * @description
     *
     * Returns the different flavor groups defined by the list of flavors
     */
    .factory('CloudServerFlavorClasses', function () {
        var getFlavorFields = _.partialRight(_.pick, ['id', 'title']);

        return function (flavors) {
            // Get all metadata from a flavor regarding the flavorClass
            var flavorClasses = _.map(flavors, 'flavorClass');

            // Keep only the relevant attributes (no $$ resource attributes)
            flavorClasses = _.map(flavorClasses, getFlavorFields);

            // Sort by id
            flavorClasses = _.sortBy(flavorClasses, 'id');

            // Get only the unique values
            flavorClasses = _.sortedUniqBy(flavorClasses, 'id');

            return flavorClasses;
        };
    });
angular.module('encore.svcs.cloud.servers')
    .factory('CloudServerLoaders', ["$q", "CloudRegionsUtil", "NextGenServers", "FirstGenServers", "CloudUsers", "ErrorFormatter", function ($q, CloudRegionsUtil, NextGenServers, FirstGenServers, CloudUsers,
                ErrorFormatter) {
        return {
            loadNextGenServers: function (user, failedRequestsContainer, regionsCallback) {
                var config = {
                    svc: NextGenServers.list,
                    name: 'NextGen',
                    scopeProp: '',
                    user: user,
                    regionsCallback: regionsCallback
                };
                var deferred = $q.defer();
                var serverList = [];

                CloudRegionsUtil.loadDataForEachRegion(config)
                .then(function (servers) {
                    // now that servers have loaded, show any queued messages
                    // otherwise, remove the status message
                    deferred.resolve(servers);
                }, function (errors) {
                    // Add failed regions if any. `errors` comes back as an array
                    // of error strings
                    failedRequestsContainer.failedRequests = errors;
                    deferred.resolve(serverList);

                }, function (servers) {
                    deferred.notify(servers);
                    serverList = serverList.concat(servers);
                });

                return deferred.promise;
            },
            loadFirstGenServers: function (user, failedRequestsContainer) {
                var deferred = $q.defer();
                var servers = [];

                var catalogSuccess = function (data) {
                    var endpoint = _.find(data.endpoints, function (endpoint) {
                        return endpoint.region === null && endpoint.type === 'compute';
                    });

                    return !_.isUndefined(endpoint);
                };

                var catalogFailure = function (error) {
                    failedRequestsContainer.failedRequests.push(ErrorFormatter.buildErrorMsg('${message}', error));
                    return false;
                };

                var queryFirstGen = function (firstGenPresent) {

                    var loadServers = function (servers) {
                        deferred.resolve(servers);
                    };

                    var loadError = function (error) {
                        // Add FirstGen as a failed Region
                        failedRequestsContainer.failedRequests.push('FirstGen - ' + error.message);
                        failedRequestsContainer.failedRequests.push(
                            ErrorFormatter.buildErrorMsg('FirstGen - ${message}', error));
                        deferred.resolve(servers);
                    };

                    if (firstGenPresent) {
                        FirstGenServers.getServers({ user: user }).$promise
                        .then(loadServers, loadError);
                    } else {
                        deferred.resolve(servers);
                    }
                };

                // Pull user service catalog and search for FirstGen endpoint
                CloudUsers.catalog({ user: user }).$promise
                .then(catalogSuccess, catalogFailure)
                // Pull FirstGen Data if it exists in user catalog
                .then(queryFirstGen);

                return deferred.promise;
            }
        };

    }]);

angular.module('encore.svcs.cloud.servers')
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use NextGenActionResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('NextGenActions', ["NextGenActionResource", function (NextGenActionResource) {
        console.warn(
            'DEPRECATED: NextGenActions - Please use NextGenActionResource. ' +
            'NextGenActions will be removed in an upcoming major release.'
        );
        return NextGenActionResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use NextGenAttachmentResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('NextGenAttachments', ["NextGenAttachmentResource", function (NextGenAttachmentResource) {
        console.warn(
            'DEPRECATED: NextGenAttachments - Please use NextGenAttachmentResource. ' +
            'NextGenAttachments will be removed in an upcoming major release.'
        );
        return NextGenAttachmentResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use FirstGenActionResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('FirstGenActions', ["FirstGenActionResource", function (FirstGenActionResource) {
        console.warn(
            'DEPRECATED: FirstGenActions - Please use FirstGenActionResource. ' +
            'FirstGenActions will be removed in an upcoming major release.'
        );
        return FirstGenActionResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use FirstGenBackupScheduleResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('FirstGenBackupSchedule', ["FirstGenBackupScheduleResource", function (FirstGenBackupScheduleResource) {
        console.warn(
            'DEPRECATED: FirstGenBackupSchedule - Please use FirstGenBackupScheduleResource. ' +
            'FirstGenBackupSchedule will be removed in an upcoming major release.'
        );
        return FirstGenBackupScheduleResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use NextGenManagedPasswordResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('NextGenManagedPasswords', ["NextGenManagedPasswordResource", function (NextGenManagedPasswordResource) {
        console.warn(
            'DEPRECATED: NextGenManagedPasswords - Please use NextGenManagedPasswordResource. ' +
            'NextGenManagedPasswords will be removed in an upcoming major release.'
        );
        return NextGenManagedPasswordResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use NextGenServerResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('NextGenServers', ["NextGenServerResource", function (NextGenServerResource) {
        console.warn(
            'DEPRECATED: NextGenServers - Please use NextGenServerResource. ' +
            'NextGenServers will be removed in an upcoming major release.'
        );
        return NextGenServerResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use ServerMillManagedPasswordResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('ServerMillManagedPasswords', ["ServerMillManagedPasswordResource", function (ServerMillManagedPasswordResource) {
        console.warn(
            'DEPRECATED: ServerMillManagedPasswords - Please use ServerMillManagedPasswordResource. ' +
            'ServerMillManagedPasswords will be removed in an upcoming major release.'
        );
        return ServerMillManagedPasswordResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use FirstGenOpenConsoleUrlResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('FirstGenOpenConsoleUrl', ["FirstGenOpenConsoleUrlResource", function (FirstGenOpenConsoleUrlResource) {
        console.warn(
            'DEPRECATED: FirstGenOpenConsoleUrl - Please use FirstGenOpenConsoleUrlResource. ' +
            'FirstGenOpenConsoleUrl will be removed in an upcoming major release.'
        );
        return FirstGenOpenConsoleUrlResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use FirstGenNextGenImageResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('FirstGenNextGenImage', ["FirstGenNextGenImageResource", function (FirstGenNextGenImageResource) {
        console.warn(
            'DEPRECATED: FirstGenNextGenImage - Please use FirstGenNextGenImageResource. ' +
            'FirstGenNextGenImage will be removed in an upcoming major release.'
        );
        return FirstGenNextGenImageResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use FirstGenServersResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('FirstGenServers', ["FirstGenServersResource", function (FirstGenServersResource) {
        console.warn(
            'DEPRECATED: FirstGenServers - Please use FirstGenServersResource. ' +
            'FirstGenServers will be removed in an upcoming major release.'
        );
        return FirstGenServersResource;
    }])
    /**
     * @deprecated
     * @description **DEPRECATED**: Please use RackConnectResource
     * This item **will be removed** in an upcoming major release.
     */
    .factory('RackConnect', ["RackConnectResource", function (RackConnectResource) {
        console.warn(
            'DEPRECATED: RackConnect - Please use RackConnectResource. ' +
            'RackConnect will be removed in an upcoming major release.'
        );
        return RackConnectResource;
    }]);

angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.FirstGenOpenConsoleUrlResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.firstGen.config.FirstGenConsoleRoute
     * @description
     *
     * `$resource` definition of FirstGen Console REST resources for API control of FirstGen Servers
     */
    .factory('FirstGenOpenConsoleUrlResource', ["$resource", "FirstGenConsoleRoute", function ($resource, FirstGenConsoleRoute) {
        var url = $resource(FirstGenConsoleRoute, {
                user: '@user',
                type: 'servers',
                id: '@id'
            }, {
                /**
                 * @ngdoc method
                 * @name FirstGenOpenConsoleUrlResource#getUrl
                 * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenOpenConsoleUrlResource
                 * @description
                 *
                 * Retrieves the URL for a FirstGen Console
                 */
                getUrl: {
                    method: 'GET'
                }
            });

        return url;
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.FirstGenServersResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.firstGen.config.FirstGenServersRoute
     * @requires encore.svcs.cloud.servers.FirstGenTransforms
     * @requires encore.svcs.cloud.config.GetCloudURL
     * @description
     *
     * `$resource` definition of FirstGen REST resources for API communication, also adds a
     * `getURL` function to every instance of a FirstGen server in order to retrieve the UI Path to a
     * FirstGen server
     */
    .factory('FirstGenServersResource', ["$resource", "FirstGenServersRoute", "FirstGenTransforms", "GetCloudURL", function ($resource, FirstGenServersRoute, FirstGenTransforms, GetCloudURL) {
        var servers = $resource(FirstGenServersRoute, {
            user: '@user',
            accountNumber: '@accountNumber',
            type: 'servers',
            id: '@id'
        }, {
            /**
             * @ngdoc method
             * @name FirstGenServersResource#getLite
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @description
             *
             * Get list of servers without image and flavor details
             */
            getLite: {
                method: 'GET',
                params: {
                    details: 'lite'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#changeName
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @description
             *
             * Creates a PUT Method Requests against the default API Path
             */
            changeName: {
                method: 'PUT'
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#changePassword
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @description
             *
             * Creates a PUT Method Requests against the default API Path
             */
            changePassword: {
                method: 'PUT'
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#getServers
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @requires encore.svcs.cloud.servers.FirstGenTransforms#servers
             * @description
             *
             * Retrieves an array of servers transformed
             * by {@link encore.svcs.cloud.servers.FirstGenTransforms#methods_servers}
             */
            getServers: {
                method: 'GET',
                isArray: true,
                transformResponse: FirstGenTransforms.servers
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#getImages
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @requires encore.svcs.cloud.servers.FirstGenTransforms#images
             * @description
             *
             * Retrieves an object with a list of images transformed
             * by {@link encore.svcs.cloud.servers.FirstGenTransforms#methods_images}
             */
            getImages: {
                method: 'GET',
                params: {
                    type: 'images'
                },
                transformResponse: FirstGenTransforms.images
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#getImages
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @requires encore.svcs.cloud.servers.FirstGenTransforms#images
             * @description
             *
             * Makes an HTTP DELETE Method API call with parameters of `{ type: 'images' }`
             * in order to delete an image
             */
            deleteImage: {
                method: 'DELETE',
                params: {
                    type: 'images'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenServersResource#getFlavors
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenServersResource
             * @requires encore.svcs.cloud.servers.FirstGenTransforms#flavors
             * @description
             *
             * Retrieves an object with a list of flavors transformed
             * by {@link encore.svcs.cloud.servers.FirstGenTransforms#methods_flavors}
             */
            getFlavors: {
                method: 'GET',
                params: {
                    type: 'flavors'
                },
                transformResponse: FirstGenTransforms.flavors
            }
        });

        servers.prototype.getURL = function (accountNumber, user) {
            return GetCloudURL(accountNumber, user).servers + '/firstgen/' + this.id;
        };

        servers.prototype.getIPV4Addresses = function () {
            return _.filter(this.addresses, { version: '4' });
        };

        return servers;
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.firstGen
 *
 * @description
 * Collection of services used for the interaction of FirstGen Servers for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.firstGen', [
    'encore.svcs.cloud.servers.firstGen.config'
]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.firstGen.config
 *
 * @description
 * Collection of services used for the interaction of FirstGen Servers Configuration for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.firstGen.config', []);

angular.module('encore.svcs.cloud.servers.firstGen.config')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for all FirstGen API calls
     */
    .factory('FirstGenRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/users/:user/firstgen/:type/:id/:details';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenActionsRoute
     * @requires FirstGenRoute
     * @description
     *
     * Returns a string representation of the base path for all FirstGenActions API calls
     */ 
    .factory('FirstGenActionsRoute', ["FirstGenRoute", function (FirstGenRoute) {
        return FirstGenRoute + '/action/:action';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenBackupScheduleRoute
     * @requires FirstGenRoute
     * @description
     *
     * Returns a string representation of the base path for all FirstGenBackupSchedule API calls
     */ 
    .factory('FirstGenBackupScheduleRoute', ["FirstGenRoute", function (FirstGenRoute) {
        return FirstGenRoute + '/backup_schedule';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenNextGenImageRoute
     * @requires FirstGenRoute
     * @description
     *
     * Returns a string representation of the base path for all FirstGenNextGenImage API calls
     */ 
    .factory('FirstGenNextGenImageRoute', ["FirstGenRoute", function (FirstGenRoute) {
        return FirstGenRoute + '/next_gen_image';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenConsoleRoute
     * @requires FirstGenRoute
     * @description
     *
     * Returns a string representation of the base path for all FirstGenConsole API calls
     */ 
    .factory('FirstGenConsoleRoute', ["FirstGenRoute", function (FirstGenRoute) {
        return FirstGenRoute + '/console';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.config.FirstGenServersRoute
     * @requires FirstGenRoute
     * @description
     *
     * Returns a string representation of the base path for all FirstGenServers API calls
     */ 
    .factory('FirstGenServersRoute', ["FirstGenRoute", function (FirstGenRoute) {
        return FirstGenRoute;
    }]);

angular.module('encore.svcs.cloud.servers.firstGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.FirstGenActionResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.firstGen.config.FirstGenActionsRoute
     * @description
     *
     * `$resource` definition of FirstGen Actions REST resources for API control of FirstGen Servers
     */
    .factory('FirstGenActionResource', ["$resource", "FirstGenActionsRoute", function ($resource, FirstGenActionsRoute) {
        var serverActions = $resource(FirstGenActionsRoute, {
            user: '@user',
            type: 'servers',
            id: '@id'
        }, {
            /**
             * @ngdoc method
             * @name FirstGenActionResource#reboot
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Reboots a FirstGen Server
             */
            reboot: {
                method: 'POST',
                params: {
                    action: 'reboot'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#rebuild
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Rebuild a FirstGen Server
             */
            rebuild: {
                method: 'POST',
                params: {
                    action: 'rebuild'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#resize
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Resize a FirstGen Server
             */
            resize: {
                method: 'POST',
                params: {
                    action: 'resize'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#confirmResize
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Confirm Resize action of a FirstGen Server
             */
            confirmResize: {
                method: 'POST',
                params: {
                    action: 'confirm_resize'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#revertResize
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Revert a Resize a FirstGen Server
             */
            revertResize: {
                method: 'POST',
                params: {
                    action: 'revert_resize'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#rescue
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Rescue a FirstGen Server
             */
            rescue: {
                method: 'POST',
                params: {
                    action: 'rescue'
                }
            },
            /**
             * @ngdoc method
             * @name FirstGenActionResource#unrescue
             * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenActionResource
             * @description
             *
             * Unrescue a FirstGen Server
             */
            unrescue: {
                method: 'POST',
                params: {
                    action: 'unrescue'
                }
            }
        });

        return serverActions;
    }]);
angular.module('encore.svcs.cloud.servers.firstGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.FirstGenBackupScheduleResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.firstGen.config.FirstGenBackupScheduleRoute
     * @requires encore.svcs.cloud.servers.FirstGenTransforms
     * @description
     *
     * `$resource` definition of FirstGen Backup Schedule REST resources for backups of FirstGen Servers
     */
    .factory('FirstGenBackupScheduleResource',
        ["$resource", "FirstGenBackupScheduleRoute", "FirstGenTransforms", function ($resource, FirstGenBackupScheduleRoute, FirstGenTransforms) {
        var backupSchedule = $resource(FirstGenBackupScheduleRoute, {
                user: '@user',
                type: 'servers'
            }, {
                /**
                 * @ngdoc method
                 * @name FirstGenBackupScheduleResource#getBackupSchedule
                 * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenBackupScheduleResource
                 * @requires encore.svcs.cloud.servers.FirstGenTransforms#backupSchedule
                 * @description
                 *
                 * Makes an HTTP GET Method API call in order to get a backup schedule for a FirstGen Server,
                 * transformed by {@link encore.svcs.cloud.servers.FirstGenTransforms#methods_backupSchedule}
                 */
                getBackupSchedule: {
                    method: 'GET',
                    transformResponse: FirstGenTransforms.backupSchedule
                },
                /**
                 * @ngdoc method
                 * @name FirstGenBackupScheduleResource#getBackupSchedule
                 * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenBackupScheduleResource
                 * @description
                 *
                 * Makes an HTTP POST Method API call in order to update/modify the backup schedule of a FirstGen Server
                 */
                updateBackupSchedule: {
                    method: 'POST'
                },
                /**
                 * @ngdoc method
                 * @name FirstGenBackupScheduleResource#getBackupSchedule
                 * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenBackupScheduleResource
                 * @description
                 *
                 * Makes an HTTP DELETE Method API call in order to delete the backup schedule of a FirstGen Server
                 */
                deleteBackupSchedule: {
                    method: 'DELETE'
                }
            });
        /**
         * @ngdoc method
         * @name FirstGenBackupScheduleResource#saveBackupSchedule
         * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenBackupScheduleResource
         * @description
         *
         * Figures whether it needs to call `updateBackupSchedule` vs `deleteBackupSchedule` depending on the data
         * if both `daily` and `weekly` attributes of the body are **"DISABLED"** then it will call
         * `deleteBackupSchedule`
         */
        backupSchedule.saveBackupSchedule = function (params, body, success, fail) {
            if (body.daily === 'DISABLED' && body.weekly === 'DISABLED') {
                return backupSchedule.deleteBackupSchedule(params, body, success, fail);
            } else {
                return backupSchedule.updateBackupSchedule(params, body, success, fail);
            }
        };
        return backupSchedule;
    }]);
angular.module('encore.svcs.cloud.servers.firstGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.firstGen.FirstGenNextGenImageResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.firstGen.config.FirstGenNextGenImageRoute
     * @description
     *
     * `$resource` definition of FirstGen to NextGen Image REST resources for conversion of FirstGen Servers
     */
    .factory('FirstGenNextGenImageResource', ["$resource", "FirstGenNextGenImageRoute", function ($resource, FirstGenNextGenImageRoute) {
        var imageId = $resource(FirstGenNextGenImageRoute, {
                user: '@user',
                type: 'images',
                id: '@id'
            }, {
                /**
                 * @ngdoc method
                 * @name FirstGenNextGenImageResource#getImageId
                 * @methodOf encore.svcs.cloud.servers.firstGen.FirstGenNextGenImageResource
                 * @description
                 *
                 * Retrieves the NextGen Image ID of a FirstGen Server conversion
                 */
                getImageId: {
                    method: 'POST'
                }
            });

        return imageId;
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc object
     * @name encore.svcs.cloud.servers.FirstGenBackupDropdowns
     * @description

     * @requires encore.svcs.cloud.servers.constant:FIRST_GEN_DAYS_OF_WEEK
     * @requires encore.svcs.cloud.servers.constant:FIRST_GEN_HOURS_OF_DAY
     *
     * Object of functions regarding the Backup Schedule options for FirstGen Servers
     */
    .factory('FirstGenBackupDropdowns',
        ["FIRST_GEN_DAYS_OF_WEEK", "FIRST_GEN_HOURS_OF_DAY", function (FIRST_GEN_DAYS_OF_WEEK, FIRST_GEN_HOURS_OF_DAY) {
            return {
                /**
                 * @ngdoc method
                 * @name FirstGenBackupDropdowns#dropdowns
                 * @methodOf encore.svcs.cloud.servers.FirstGenBackupDropdowns
                 * @description
                 *
                 * Returns metadata to be used in a Backup Schedule form for dropdowns
                 *
                 * @returns {Object} An object with `days` and `hours`
                 * @example
                 * <pre>
                 * {
                 *     "days": [
                 *         { value: 'DISABLED', label: 'Disable' },
                 *         { value: 'SUNDAY', label: 'Sunday' },
                 *         { value: 'MONDAY', label: 'Monday' },
                 *         ...
                 *     ],
                 *     "hours": [
                 *         { value: 'DISABLED', label: 'Disable' },
                 *         { value: 'H_0000_0200', label: '12:00 am - 2:00 am UTC' },
                 *         { value: 'H_0200_0400', label: '2:00 am - 4:00 am UTC' },
                 *         ...
                 *     ]
                 * }
                 * </pre>
                 */
                dropdowns: function () {
                    return { 'days': FIRST_GEN_DAYS_OF_WEEK, 'hours': FIRST_GEN_HOURS_OF_DAY };
                }
            };
        }]
    );
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.FirstGenMigrating
     * @description
     *
     * Determine if a FirstGen server is migrating
     */
    .factory('FirstGenMigrating', ["FIRST_GEN_MIGRATION_TILL", function (FIRST_GEN_MIGRATION_TILL) {
        return function (server) {
            return server.gen === 'First' && _.has(server.metadata, FIRST_GEN_MIGRATION_TILL);
        };
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc object
     * @name encore.svcs.cloud.servers.FirstGenTransforms
     * @requires $routeParams
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.cloud.servers.CloudServerFlavorClass
     * @requires encore.svcs.cloud.servers.FirstGenMigrating
     * @requires encore.svcs.cloud.config.constant:CLOUD_URL
     * @requires encore.svcs.cloud.servers.constant:FIRST_GEN_MIGRATION_TILL
     * @requires encore.svcs.cloud.servers.constant:FIRST_GEN_MIGRATION_FROM
     * @description
     *
     * Collection of `$http` transforms to modify data being received/sent of API services in regards
     * with FirstGen Servers.
     */
    .factory('FirstGenTransforms', ["TransformUtil", "CloudServerFlavorClass", "FirstGenMigrating", "$routeParams", "CLOUD_URL", "FIRST_GEN_MIGRATION_TILL", "FIRST_GEN_MIGRATION_FROM", function (TransformUtil, CloudServerFlavorClass, FirstGenMigrating,
             $routeParams, CLOUD_URL, FIRST_GEN_MIGRATION_TILL, FIRST_GEN_MIGRATION_FROM) {
        var transforms = {
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.FirstGenTransforms#backupSchedule
             * @methodOf encore.svcs.cloud.servers.FirstGenTransforms
             * @description
             *
             * Determines if the `backupSchedule` is disabled and sets the appropriate values for it
             * if the data passed to it is an object and has a key of `backup_schedule` it uses it's value
             *
             * @param {Object} data Data object representing a `backupSchedule` for a firstGen server
             * @returns {Object} an object with all the `backupSchedule` information available at it's root
             * @example
             * <pre>
             * {
             *     "backup_schedule": {
             *         "daily": "H_0200_0400",
             *         "weekly": "MONDAY",
             *         "enabled": true
             *     }
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "daily": "H_0200_0400",
             *     "weekly": "MONDAY",
             *     "enabled": true
             * }
             * </pre>
             *
             * ------------------------------------
             * <pre>
             * {
             *     "backup_schedule": {
             *         "daily": "H_0200_0400",
             *         "weekly": "MONDAY",
             *         "enabled": false
             *     }
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "daily": "DISABLED",
             *     "weekly": "DISABLED",
             *     "enabled": false
             * }
             * </pre>
             */
            backupSchedule: function (data) {
                // Exit out if error is present
                if (_.has(data, 'error')) {
                    return data;
                }
                data = _.has(data, 'backup_schedule') ?
                                    data['backup_schedule'] : data;
                if (data.enabled === false) {
                    data.daily = 'DISABLED';
                    data.weekly = 'DISABLED';
                }
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.FirstGenTransforms#servers
             * @methodOf encore.svcs.cloud.servers.FirstGenTransforms
             * @description
             *
             * Adds metadata to a list of servers, including the Gen type, the URL,
             * and converts to date expected migration dates if they exist
             * if the data passed to it is an object and has a key of `servers` it uses it's value
             * and returns the list
             *
             * @param {Object} data Data list (or object) representing a list of firstGen `servers`
             * @returns {Array} an array with all the `servers`
             * @example
             * <pre>
             * {
             *     "servers": [{
             *         "name": "server1",
             *         "metadata": { "FG2NG_self_migration_available_till": "2015-01-01 00:00:00" },
             *         "id": 100000,
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * [{
             *     "name": "server1",
             *     "gen": "First",
             *     "url": "/cloud/servers/firstgen/100000",
             *     "metadata": { "FG2NG_self_migration_available_till": "2015-01-01 00:00:00" },
             *     "migrationDateTill": Date(2015, 0, 1, 0, 0, 0)
             *     "id": 100000,
             *     ...
             * }, {
             *     ...
             * }]
             * </pre>
             *
             */
            servers: function (data) {
                // Exit out if error is present
                if (_.has(data, 'error')) {
                    return data;
                }
                data = _.has(data, 'servers') ? data.servers : data;
                _.each(data, function (server) {
                    server.gen = 'First';
                    server.url = CLOUD_URL.servers + '/firstgen/' + server.id;
                    if (FirstGenMigrating(server)) {
                        var dateTill, dateFrom;
                        if (_.has(server.metadata, FIRST_GEN_MIGRATION_TILL)) {
                            dateTill = moment(server.metadata[FIRST_GEN_MIGRATION_TILL]).toDate();
                        }
                        if (_.has(server.metadata, FIRST_GEN_MIGRATION_FROM)) {
                            dateFrom = moment(server.metadata[FIRST_GEN_MIGRATION_FROM]).toDate();
                        }
                        server['migrationDateTill'] = dateTill;
                        server['migrationDateFrom'] = dateFrom;
                    }
                });
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.FirstGenTransforms#images
             * @methodOf encore.svcs.cloud.servers.FirstGenTransforms
             * @description
             *
             * Adds metadata to a list of images, including the Gen type, region, visibility, ostype
             *
             * @param {Object} data Data object representing a list of firstGen `images`
             * @returns {Object} An object with an `images` key containing an array with all the `images`
             * @example
             * <pre>
             * {
             *     "images": [{
             *         "metadata": {
             *             "image_type": "base"
             *         },
             *         "id": "91",
             *         "created": "2012-04-25T16:11:57Z",
             *         "name": "Windows Server 2008 R2 x64 + SQL Server 2012 Standard"
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "images": [{
             *         "gen": "First",
             *         "region": "N/A",
             *         "visibility": "public",
             *         "metadata": {
             *             "image_type": "base"
             *         },
             *         "id": "91",
             *         "created": "2012-04-25T16:11:57Z",
             *         "name": "Windows Server 2008 R2 x64 + SQL Server 2012 Standard"
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             */
            images: function (data) {
                // Exit out if error is present
                if (_.has(data, 'error')) {
                    return data;
                }
                if (_.isArray(data)) {
                    data = { images: data };
                }
                _.each(data.images, function (image) {
                    image.gen = 'First';
                    image.region = 'N/A';
                    image.visibility = 'N/A';
                    var imageType = image.metadata['image_type'];
                    image['image_type'] = imageType;
                    if (imageType === 'base') {
                        image.visibility = 'public';
                    } else if (imageType === 'snapshot') {
                        image.visibility = 'private';
                    }
                    if (_.includes(image.name.toLowerCase(), 'windows')) {
                        image.osType = 'windows';
                    } else {
                        image.osType = 'linux';
                    }
                });
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.FirstGenTransforms#flavors
             * @methodOf encore.svcs.cloud.servers.FirstGenTransforms
             * @requires encore.svcs.cloud.servers.CloudServerFlavorClass
             * @description
             *
             * Adds metadata to a list of flavors, pertaining to it's flavor class type
             *
             * @param {Object} data Data object representing a list of firstGen `flavors`
             * @returns {Object} An object with a `flavors` key containing an array with all the `flavors`
             * @example
             * <pre>
             * {
             *     "flavors": [{
             *         "name": "256 server",
             *         "id": "1"
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "flavors": [{
             *         "name": "256 server",
             *         "id": "1"
             *         "flavorClass": {
             *             "id": "standard",
             *             "title": "Standard"
             *         }
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             */
            flavors: function (data) {
                // Exit out if error is present
                if (_.has(data, 'error')) {
                    return data;
                }
                _.forEach(data.flavors, function (flavor) {
                    flavor.flavorClass = CloudServerFlavorClass(flavor.id);
                });
                return data;
            }
        };
        return {
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            backupSchedule: TransformUtil.responseChain(transforms.backupSchedule),
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            servers: TransformUtil.responseChain(transforms.servers),
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            images: TransformUtil.responseChain(transforms.images),
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            flavors: TransformUtil.responseChain(transforms.flavors)
        };
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.nextGen
 *
 * @description
 * Collection of services used for the interaction of nextGen Servers for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.nextGen', [
    'encore.svcs.cloud.servers.nextGen.config'
]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.nextGen.config
 *
 * @description
 * Collection of services used for the interaction of nextGen Servers Configuration for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.nextGen.config', []);

angular.module('encore.svcs.cloud.servers.nextGen.config')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.config.NextGenServersRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for all NextGenServers API calls
     */ 
    .factory('NextGenServersRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/users/:user/:type/:region/:id/:details';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.config.NextGenActionsRoute
     * @requires NextGenServersRoute
     * @description
     *
     * Returns a string representation of the base path for all NextGenActions API calls
     */ 
    .factory('NextGenActionsRoute', ["NextGenServersRoute", function (NextGenServersRoute) {
        return NextGenServersRoute + '/action/:action';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.config.NextGenAttachmentsRoute
     * @requires NextGenServersRoute
     * @description
     *
     * Returns a string representation of the base path for all NextGenAttachments API calls
     */ 
    .factory('NextGenAttachmentsRoute', ["NextGenServersRoute", function (NextGenServersRoute) {
        return NextGenServersRoute + '/volume_attachments/:attachmentid';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.config.NextGenManagedPasswordsRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for all NextGenManagedPasswords API calls
     */ 
    .factory('NextGenManagedPasswordsRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/servermill/mc-passwords/:id';
    }]);

angular.module('encore.svcs.cloud.servers.nextGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.NextGenActionResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.nextGen.config.NextGenActionResource
     * @requires encore.svcs.cloud.servers.nextGen.config.NextGenServersRoute
     * @description
     *
     * `$resource` definition of NextGen Actions REST resources for API control of NextGen Servers
     */
    .factory('NextGenActionResource', ["$resource", "NextGenActionsRoute", "NextGenServersRoute", function ($resource, NextGenActionsRoute, NextGenServersRoute) {
        var serverActions = $resource(NextGenActionsRoute, {
            user: '@user',
            type: 'servers',
            region: '@region',
            id: '@id'
        }, {
            /**
             * @ngdoc method
             * @name NextGenActionResource#createImage
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Creates an image from a NextGen Server
             */
            createImage: {
                method: 'POST',
                params: {
                    action: 'create_image'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#reboot
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Reboots a NextGen Server
             */
            reboot: {
                method: 'POST',
                params: {
                    action: 'reboot'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#rebuild
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Rebuild a NextGen Server
             */
            rebuild: {
                method: 'POST',
                params: {
                    action: 'rebuild'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#rescue
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Rescue a NextGen Server
             */
            rescue: {
                method: 'POST',
                params: {
                    action: 'rescue'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#unrescue
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Unrescue a NextGen Server
             */
            unrescue: {
                method: 'POST',
                params: {
                    action: 'unrescue'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#resize
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Resize a NextGen Server
             */
            resize: {
                method: 'POST',
                params: {
                    action: 'resize'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#confirmResize
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Confirm Resize action of a NextGen Server
             */
            confirmResize: {
                method: 'POST',
                params: {
                    action: 'confirm_resize'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#revertResize
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Revert a Resize a NextGen Server
             */
            revertResize: {
                method: 'POST',
                params: {
                    action: 'revert_resize'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#changePass
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Change admin password for a NextGen Server
             */
            changePass: {
                method: 'POST',
                params: {
                    action: 'change_admin_pass'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#changeNickname
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Makes a PUT request call for updating a server nickname
             */
            changeNickname: {
                url: NextGenServersRoute + '/:action',
                method: 'PUT',
                params: {
                    action: 'nickname'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenActionResource#openConsole
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenActionResource
             * @description
             *
             * Retrieve URL for opening a console of a NextGen Server
             */
            openConsole: {
                method: 'GET',
                params: {
                    action: 'console'
                }
            }
        });

        return serverActions;
    }]);

angular.module('encore.svcs.cloud.servers.nextGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.NextGenAttachmentResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.nextGen.config.NextGenAttachmentsRoute
     * @description
     *
     * `$resource` definition of NextGen Volume Attachment REST resources for API control of NextGen
     * Volume Attachments
     */
    .factory('NextGenAttachmentResource', ["$resource", "NextGenAttachmentsRoute", function ($resource, NextGenAttachmentsRoute) {
        /**
         * @ngdoc method
         * @name NextGenAttachmentResource#get
         * @methodOf encore.svcs.cloud.servers.nextGen.NextGenAttachmentResource
         * @description
         *
         * Get attachments for a NextGen Server
         */
        /**
         * @ngdoc method
         * @name NextGenAttachmentResource#save
         * @methodOf encore.svcs.cloud.servers.nextGen.NextGenAttachmentResource
         * @description
         *
         * Attach a Volume to a NextGen Server
         */
        /**
         * @ngdoc method
         * @name NextGenAttachmentResource#delete
         * @methodOf encore.svcs.cloud.servers.nextGen.NextGenAttachmentResource
         * @description
         *
         * Remove a Volume from a NextGen Server
         */
        var attachments = $resource(NextGenAttachmentsRoute, {
            type: 'servers',
        });
        return attachments;
    }]);
angular.module('encore.svcs.cloud.servers.nextGen')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.NextGenManagedPasswordResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.nextGen.config.NextGenManagedPasswordsRoute
     * @description
     *
     * `$resource` definition of NextGen Managed Passwords REST resources for API control of NextGen
     * Managed Passwords
     */
    .factory('NextGenManagedPasswordResource', ["NextGenManagedPasswordsRoute", "$resource", function (NextGenManagedPasswordsRoute, $resource) {
        var managedPasswords = $resource(NextGenManagedPasswordsRoute, {
            id: '@id'
        });
        return managedPasswords;
    }]);

angular.module('encore.svcs.cloud.servers.nextGen')
	/**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.nextGen.NextGenServerResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.nextGen.config.NextGenServersRoute
     * @requires encore.svcs.cloud.servers.NextGenTransform
     * @requires encore.svcs.cloud.config.GetCloudURL
     * @description
     *
     * `$resource` definition of NextGen REST resources for API communication, also adds a
     * `getURL` function to every instance of a NextGen server in order to retrieve the UI Path to a
     * NextGen server
     */
    .factory('NextGenServerResource', ["$resource", "NextGenServersRoute", "NextGenTransforms", "GetCloudURL", function ($resource, NextGenServersRoute, NextGenTransforms, GetCloudURL) {
        var servers = $resource(NextGenServersRoute, {
            user: '@user',
            type: 'servers',
            region: '@region',
            id: '@id'
        }, {
            /**
             * @ngdoc method
             * @name NextGenServerResource#save
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @requires encore.svcs.cloud.servers.NextGenTransforms#save
             * @description
             *
             * Makes a POST request call to save a server
             * by {@link encore.svcs.cloud.servers.NextGenTransforms#methods_save}
             */
            save: {
                method: 'POST',
                transformRequest: NextGenTransforms.save
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#get
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @requires encore.svcs.cloud.servers.NextGenTransforms#get
             * @description
             *
             * Retrieves an array of servers transformed
             * by {@link encore.svcs.cloud.servers.NextGenTransforms#methods_get}
             */
            get: {
                method: 'GET',
                transformResponse: NextGenTransforms.get
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#list
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @requires encore.svcs.cloud.servers.NextGenTransforms#list
             * @description
             *
             * Retrieves an array of servers transformed
             * by {@link encore.svcs.cloud.servers.NextGenTransforms#methods_list}
             */
            list: {
                method: 'GET',
                isArray: true,
                transformResponse: NextGenTransforms.list
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getAccountServers
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @description
             *
             * Retrieves an array of all servers for an account
             */
            getAccountServers: {
                method: 'GET',
                params: {
                    details: 'account_servers'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getImages
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @description
             *
             * Retrieves an array of images
             */
            getImages: {
                method: 'GET',
                params: {
                    type: 'images'
                }
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getActiveImages
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @description
             *
             * Retrieves an array of active images
             */
            // #TODO: Review logic
            // $resource is meant to represent a REST entity so
            // server and image should be two separate definitions
            // some clean up needed
            getActiveImages: {
                method: 'GET',
                isArray: true,
                params: {
                    type: 'images'
                },
                transformResponse: NextGenTransforms.getActiveImages
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getFlavors
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @requires encore.svcs.cloud.servers.NextGenTransforms#flavors
             * @description
             *
             * Retrieves an array of flavors transformed
             * by {@link encore.svcs.cloud.servers.NextGenTransforms#methods_flavors}
             */
            getFlavors: {
                method: 'GET',
                params: {
                    type: 'flavors'
                },
                transformResponse: NextGenTransforms.flavors
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#changeName
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @description
             *
             * Makes a PUT request call for updating a server
             */
            changeName: {
                method: 'PUT'
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getFlavor
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @requires encore.svcs.cloud.servers.NextGenTransforms#flavor
             * @description
             *
             * Retrieves the details of a flavor transformed
             * by {@link encore.svcs.cloud.servers.NextGenTransforms#methods_flavor}
             */
            getFlavor: {
                method: 'GET',
                params: {
                    type: 'flavors'
                },
                transformResponse: NextGenTransforms.flavor
            },
            /**
             * @ngdoc method
             * @name NextGenServerResource#getStatus
             * @methodOf encore.svcs.cloud.servers.nextGen.NextGenServerResource
             * @description
             *
             * Retrieves the current status string for a given server
             */
            getStatus: {
                method: 'GET',
                params: {
                    details: 'status'
                }
            }
        });

        servers.prototype.getURL = function (accountNumber, user) {
            return GetCloudURL(accountNumber, user).servers + '/' + this.region + '/' + this.id;
        };

        servers.prototype.getIPV4Addresses = function () {
            return _.filter(this.addresses, { version: 4 });
        };

        return servers;
    }]);

angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.NextGenAdminService
     * @requires $http
     * @requires encore.svcs.cloud.servers.NextGenTransforms
     * @description
     *
     * Services used to POST to NextGen servers needing a nova token  
     */
    .factory('NextGenAdminService', ["$http", "NextGenTransforms", "TransformUtil", function ($http, NextGenTransforms, TransformUtil) {
       /**
         * @params {String} type One action you select to perform
         * @params {Object} params An object containing necessary settings for the action
         * @params {String} params.serverId Id of Server Action to be taken on
         * @params {String} params.novaToken Nova Token for that server
         * @params {String} params.region Admin Region 
         * @params {String} params.userName  User name 
         * @params {String=} params.networkId Network you wish to add (only adding Ips)
         * @params {String=} params.address Address you wish to remove (only removing ips)
         * @returns {Promise} $http promise that determines the success of the call  
         * @example
         *  <pre>
                action('suspend', params);
            </pre>
            <pre>
                types: "suspend", "unsuspend", "migrate", "add-ip", "remove-ip"
            </pre>
         */
        var action = function (type, params) {
            var dataToSend = {
                id: params.serverId,
                user: params.username,
                region: params.region
            };

            var destinationUrl = '/api/cloud/users/' + params.username + '/nova/' + params.region +
                '/' + params.serverId + '/' + type;
            
            var request = {
                method: 'POST',
                url: destinationUrl,
                headers: {
                   'X-Nova-Auth-Token': params.novaToken
                },
                data: dataToSend
            };

            var requestChain = TransformUtil.requestChain;
            if (type === 'add-ip') {
                dataToSend.networkId = params.networkId;
                request.transformRequest = requestChain(NextGenTransforms.addPublicAddress);
            } else if (type === 'remove-ip') {    
                dataToSend.address = params.address;
                request.transformRequest = requestChain(NextGenTransforms.removeAddress);
            } 
        
            return $http(request);
        };

        var adminActions = {
            /**
             * @ngdoc method
             * @name NextGenAdminService#suspend
             * @methodOf encore.svcs.cloud.servers.NextGenAdminService
             * @returns {Promise} $http promise that determines the success of the call
             * @description
             *
             * Suspends a given server
             */
            suspend: function (params) {
                return action('suspend', params);
            },
            /**
             * @ngdoc method
             * @name NextGenAdminService#unsuspend
             * @methodOf encore.svcs.cloud.servers.NextGenAdminService
             * @returns {Promise} $http promise that determines the success of the call
             * @description
             *
             * Un-suspends a given server
             */
            unsuspend: function (params) {
                return action('unsuspend', params);
            },
            /**
             * @ngdoc method
             * @name NextGenAdminService#migrate
             * @methodOf encore.svcs.cloud.servers.NextGenAdminService
             * @returns {Promise} $http promise that determines the success of the call
             * @description
             *
             * Migrate a given server
             */
            migrate: function (params) {
                return action('migrate', params);
            },
            /**
             * @ngdoc method
             * @name NextGenAdminService#addPublicAddress
             * @methodOf encore.svcs.cloud.servers.NextGenAdminService
             * @returns {Promise} $http promise that determines the success of the call
             * @description
             *
             * Add a public IP address to a NextGen Server
             */
            addPublicAddress: function (params) {
                return action('add-ip', params);
            },
            /**
             * @ngdoc method
             * @name NextGenAdminService#removeAddress
             * @methodOf encore.svcs.cloud.servers.NextGenAdminService
             * @returns {Promise} $http promise that determines the success of the call
             * @description
             *
             * Remove an IP address from a NextGen Server
             */
            removeAddress: function (params) {
                return action('remove-ip', params);
            }
        };
        
        return adminActions;
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.NextGenBootSource
     * @description
     *
     * Add boot source to the server configuration
     */
    .factory('NextGenBootSource', function () {
        return function (server, image, volume, sourceType) {
            if (sourceType === 'new') {
                volume.imageId = image;
                volume = _.pick(volume, ['imageId', 'deleteOnTermination', 'bootIndex',
                                         'volumeSize', 'sourceType', 'destinationType']);
                server.v2 = true;
            } else {
                volume = _.pick(volume, ['volumeId', 'deleteOnTermination']);
                server.v2 = false;
            }
            server.minCount = 1;
            server.maxCount = 1;
            server.flavorRef = server.flavor;
            server.blockDeviceMapping = [volume];
            // API does not like these fields when creating a new Server with BFV
            delete server.image;
            delete server.flavor;
            return server;
        };
    });
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.NextGenNetworks
     * @description
     *
     * Add networks to next gen server configuration
     */
    .factory('NextGenNetworks', function () {
        return function (server, networks) {
            server.networks = [];

            _.forEach(networks, _.bind(function (network) {
                if (network.checked) {
                    this.push({ uuid: network.id });
                }
            }, server.networks));

            return server;
        };
    });
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc object
     * @name encore.svcs.cloud.servers.NextGenTransforms
     * @requires $routeParams
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.svcs.cloud.servers.CloudServerFlavorClass
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.cloud.config.constant:CLOUD_URL
     * * @requires encore.svcs.cloud.servers.AddressVersionLabel
     * @description
     *
     * Collection of `$http` transforms to modify data being received/sent of API services in regards
     * with NextGen Servers.
     */
     /* jshint maxlen:false */
    .factory('NextGenTransforms', ["$routeParams", "TransformUtil", "CloudServerFlavorClass", "Pluck", "CLOUD_URL", "AddressVersionLabel", function ($routeParams, TransformUtil, CloudServerFlavorClass,
        Pluck, CLOUD_URL, AddressVersionLabel) {
        var transforms = {
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#get
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Adds metadata to a list of servers, including the Gen type, the URL
             *
             * @param {Object} data Data object representing a list of nextGen `servers`
             * @returns {Object} an array Data object representing a list of nextGen `servers`
             * @example
             * <pre>
             * {
             *     "servers": [{
             *         "name": "server1",
             *         "region": "ORD",
             *         "id": 100000,
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "servers": [{
             *         "name": "server1",
             *         "gen": "Next",
             *         "region": "ORD",
             *         "url": "/cloud/servers/ORD/100000",
             *         "id": 100000,
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             */
            get: function (data) {
                if (_.has(data, 'server')) {
                    _.each(data.server.addresses, AddressVersionLabel);
                } else if (_.has(data, 'servers')) {
                    _.each(data.servers, function (server) {
                        server.gen = 'Next';
                        server.url = CLOUD_URL.servers + '/' + server.region + '/' + server.id;
                    });
                }
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#list
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Adds metadata to a list of servers, including the Gen type, the URL
             *
             * @param {Object} data Data object representing a list of nextGen `servers`
             * @returns {Array} an array representing a list of nextGen `servers`
             * @example
             * <pre>
             * {
             *     "servers": [{
             *         "name": "server1",
             *         "region": "ORD",
             *         "id": 100000,
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * [{
             *     "name": "server1",
             *     "gen": "Next",
             *     "region": "ORD",
             *     "url": "/cloud/servers/ORD/100000",
             *     "id": 100000,
             *     ...
             * }, {
             *     ...
             * }]
             * </pre>
             */
            list: function (data) {
                if (!_.has(data, 'servers')) {
                    return data;
                }
                _.each(data.servers, function (server) {
                    server.gen = 'Next';
                    server.url = CLOUD_URL.servers + '/' + server.region + '/' + server.id;
                });
                return data.servers;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#save
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Converts volumesize to strings for all blockDeviceMapping's
             *
             * @param {Object} data Data object representing a nextGen `server`
             * @returns {Object} an array Data object representing a nextGen `server`
             *
             */
            save: function (data) {
                _.forEach(data.blockDeviceMapping, function (blockDevice) {
                    if (_.isNumber(blockDevice.volumeSize)) {
                        blockDevice.volumeSize += '';
                    }
                });
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#getActiveImages
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Filters out images that don't have a status of ACTIVE
             *
             * @param {Object} data Data object representing a list of images for nextGen `servers`
             * @returns {Object} an array Data object representing a list of active `images`
             *
             */
            getActiveImages: function (data) {
                return _.filter(data.images, { status: 'ACTIVE' });
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#flavors
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @requires encore.svcs.cloud.config.CloudServerFlavorClass
             * @description
             *
             * Adds metadata to a list of flavors, defining the type of flavor it is
             *
             * @param {Object} data Data object representing a list of flavors for nextGen `servers`
             * @returns {Object} an array Data object representing a list of flavors for nextGen `servers`
             * @example
             * <pre>
             * {
             *     "flavors": [{
             *         "id": "compute1-1",
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "flavors": [{
             *         "id": "compute1-1",
             *         "flavorClass": {
             *             "id": "compute",
             *             "title": "Compute"
             *         }
             *         ...
             *     }, {
             *         ...
             *     }]
             * }
             * </pre>
             */
            flavors: function (data) {
                _.forEach(data.flavors, function (flavor) {
                    flavor.flavorClass = CloudServerFlavorClass(flavor.id);
                });
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#flavor
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @requires encore.svcs.cloud.config.CloudServerFlavorClass
             * @description
             *
             * Adds metadata to flavor details, defining the type of flavor it is
             *
             * @param {Object} data Data object representing details for a flavor
             * @returns {Object} an array Data object representing details for a flavor
             * @example
             * <pre>
             * {
             *     "flavor": {
             *         "id": "compute1-1",
             *         ...
             *     }
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "id": "compute1-1",
             *     "flavorClass": {
             *         "id": "compute",
             *         "title": "Compute"
             *     }
             * }
             * </pre>
             */
            flavor: function (data) {
                data = data.flavor || data;
                if (!_.isEmpty(data.id)) {
                    data.flavorClass = CloudServerFlavorClass(data.id);
                }
                return data;
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#addPublicAddress
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Removes the following object properties from the request body:
             * id, user and region
             *
             * @param {Object} data Data object representing the request body
             * @returns {Object} an array Data object representing a request body
             * @example
             * <pre>
             * {
             *     "id": "7ad8edf1-18a6-419e-b32d-ca2516d20a9a"
             *     "region": "preprod-ord-rackeradminapi"
             *     "user": "hub_cap"
             *     "networkId": "00000000-0000-0000-0000-000000000000"
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "networkId": "00000000-0000-0000-0000-000000000000"
             * }
             * </pre>
             */
            addPublicAddress: function (data) {
                return {
                    networkId: data.networkId
                };
            },
            /**
             * @ngdoc method
             * @name encore.svcs.cloud.servers.NextGenTransforms#flavor
             * @methodOf encore.svcs.cloud.servers.NextGenTransforms
             * @description
             *
             * Removes the following object properties from the request body:
             * id, user and region
             *
             * @param {Object} data Data object representing the request body
             * @returns {Object} an array Data object representing a request body
             * @example
             * <pre>
             * {
             *     "id": "7ad8edf1-18a6-419e-b32d-ca2516d20a9a"
             *     "region": "preprod-ord-rackeradminapi"
             *     "user": "hub_cap"
             *     "address": "10.23.193.27"
             * }
             * </pre>
             *
             * *becomes*:
             *
             * <pre>
             * {
             *     "address": "10.23.193.27"
             * }
             * </pre>
             */
            removeAddress: function (data) {
                return {
                    address: data.address
                };
            }
        };
        return {
            get: TransformUtil.responseChain(transforms.get),
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            list: TransformUtil.responseChain(transforms.list),
            save: TransformUtil.requestChain(transforms.save),
            // #TODO Add transformGenerator for filtering results
            getActiveImages: TransformUtil.responseChain(transforms.getActiveImages),
            // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
            flavors: TransformUtil.responseChain(transforms.flavors),
            flavor: TransformUtil.responseChain(transforms.flavor),
            addPublicAddress: TransformUtil.requestChain(transforms.addPublicAddress),
            removeAddress: TransformUtil.requestChain(transforms.removeAddress)
        };
    }]);
angular.module('encore.svcs.cloud.servers')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.NovaAdminRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for Nova Admin authentication
     */
    .factory('NovaAdminRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/admin/nova/authenticate';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.NovaAdmin
     * @requires $resource
     * @requires encore.svcs.cloud.servers.NovaAdminRoute
     * @description
     *
     * `$resource` definition of Nova Admin REST resources for API communication
     *
     * @example
     * <pre>
     * NovaAdmin.authenticate({}, { username: 'admin', password: 'pass', regions: ['ORD'] });
     * </pre>
     */
    .factory('NovaAdmin', ["$resource", "NovaAdminRoute", function ($resource, NovaAdminRoute) {
        var admin = $resource(NovaAdminRoute, {}, {
            /**
             * @ngdoc method
             * @name NovaAdmin#authenticate
             * @methodOf encore.svcs.cloud.servers.NovaAdmin
             * @description
             *
             * Makes a POST request call to authenticate
             */
            authenticate: {
                method: 'POST'
            }
        });

        return admin;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.firstGen
 *
 * @description
 * Collection of services used for the interaction of rackConnect Servers for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.rackConnect', [
    'encore.svcs.cloud.servers.rackConnect.config'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.firstGen.config
 *
 * @description
 * Collection of services used for the interaction of rackConnect Servers Configuration for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.rackConnect.config', []);

angular.module('encore.svcs.cloud.servers.rackConnect.config')    
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.config.RackConnectRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for RackConnect API
     */
    .factory('RackConnectRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloudcontrol/:region/:accountNumber/servers/:id/rackconnect';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.config.RackConnectAccountRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the RackConnect Account API
     */
    .factory('RackConnectAccountRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/rackconnect/accounts/:accountNumber';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.config.RackConnectNetworkRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the RackConnect Network API
     */
    .factory('RackConnectNetworkRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/users/:user/rackconnect/:region/cloud_networks';
    }]);

angular.module('encore.svcs.cloud.servers.rackConnect')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.RackConnectAccountResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.rackConnect.config.RackConnectAccountRoute
     * @description
     *
     * `$resource` definition of Rack Connect Account API
     */
    .factory('RackConnectAccountResource', ["$resource", "RackConnectAccountRoute", function ($resource, RackConnectAccountRoute) {
        return $resource(RackConnectAccountRoute, {
            accountNumber: '@accountNumber'
        });
    }]);

angular.module('encore.svcs.cloud.servers.rackConnect')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.RackConnectNetworkResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.rackConnect.config.RackConnectNetworkRoute
     * @description
     *
     * `$resource` definition of Rack Connect Network API
     */
    .factory('RackConnectNetworkResource', ["$resource", "RackConnectNetworkRoute", "RackConnectNetworkTransforms", function ($resource, RackConnectNetworkRoute, RackConnectNetworkTransforms) {
        return $resource(RackConnectNetworkRoute, {
            region: '@region',
            user: '@user'
        }, {
            get: {
                method: 'GET',
                transformResponse: RackConnectNetworkTransforms.get
            }
            // #TODO Add list method that plucks and transform networks
        });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.RackConnectNetworkTransforms
     * @requires TransformUtil
     * @description
     *
     * `$resource` definition of Rack Connect Network Transforms
     */
    .factory('RackConnectNetworkTransforms', ["TransformUtil", function (TransformUtil) {
        // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList in list transform
        var _transforms = {
            get: function (data) {
                _.each(data['cloud_networks'], function (network) {
                    network.label = network.name;
                });
                return data;
            }
        }; //_transforms

        return {
            get: TransformUtil.responseChain(_transforms.get)
        };
    }]);

angular.module('encore.svcs.cloud.servers.rackConnect')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.RackConnectResource
     * @requires $resource
     * @requires encore.svcs.cloud.servers.rackConnect.config.RackConnectRoute
     * @requires encore.svcs.cloud.servers.rackConnect.RackConnectTransform
     * @description
     *
     * `$resource` definition of Rack Connect API
     */
     // #TODO Rename Service to represent RackConnectIpAddressResource
    .factory('RackConnectResource', ["$resource", "RackConnectRoute", "RackConnectTransform", function ($resource, RackConnectRoute, RackConnectTransform) {
        var rackconnect = $resource(RackConnectRoute, {
            id: '@id',
            region: '@region',
            accountNumber: '@accountNumber'
        }, {
            /**
             * @ngdoc method
             * @name RackConnectResource#getIpAddresses
             * @methodOf encore.svcs.cloud.servers.rackConnect.RackConnectResource
             * @description
             *
             * Performs a GET against the RackConnect IP Address API
             */
             // #TODO Rename to represent `list` a list of IP addresses
            getIpAddresses: {
                method: 'GET',
                transformResponse: RackConnectTransform
            }
        });
        return rackconnect;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.rackConnect.RackConnectTransform
     * @requires encore.common.http: TransformUtil
     * @description
     *
     * Sends data to TransformUtil then upon return adds the label property.
     * if no address property then original data is returned
     * if address data and ip_type is public  adds address.label =  RackConnect - Public
     * if address data and ip_type is private  adds address.label =  RackConnect - Access IP
     */
    .factory('RackConnectTransform', ["TransformUtil", function (TransformUtil) {
        // #TODO Convert to use TransformUtil.pluckList & TransformUtil.mapList
        return TransformUtil.responseChain(function (data) {
            if (!_.has(data, 'addresses')) {
                return data;
            }

            _.forEach(data.addresses, function (address) {
                address.isRackConnect = true;

                var isPublic = _.includes(address['ip_type'].toLowerCase(), 'public');
                if (isPublic) {
                    address.label = 'RackConnect - Public';
                } else {
                    address.label = 'RackConnect - Access IP';
                }
            });

            return data;
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.serverMill
 *
 * @description
 * Collection of services used for the interaction of serverMill Servers for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.serverMill', [
    'encore.svcs.cloud.servers.serverMill.config'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.servers.serverMill.config
 *
 * @description
 * Collection of services used for the interaction of serverMill Servers Configuration for Cloud Products
 */
angular.module('encore.svcs.cloud.servers.serverMill.config', []);

angular.module('encore.svcs.cloud.servers.serverMill.config')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.serverMill.config.ServerMillManagedPasswordsRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for ServerMillManagedPasswords API
     */
    .factory('ServerMillManagedPasswordsRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/servermill/mc-passwords/:id';
    }]);
angular.module('encore.svcs.cloud.servers.serverMill')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.servers.serverMill.ServerMillManagedPasswordResource
     * @requires encore.svcs.cloud.servers.serverMill.config.ServerMillManagedPasswordsRoute
     * @description
     *
     * `$resource` definition of ServerMillManagedPasswords API
     */
    .factory('ServerMillManagedPasswordResource', ["ServerMillManagedPasswordsRoute", "$resource", function (ServerMillManagedPasswordsRoute, $resource) {
        var managedPasswords = $resource(ServerMillManagedPasswordsRoute, {
            id: '@id'
        }, {
            get: {
                method: 'GET'
            }
        });
        return managedPasswords;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.cloud.sites
 *
 * @description
 * Services used for retrieval of cloud sites service data
 *
 * ##Children##
 * * {@link encore.svcs.cloud.sites.CloudSiteRoute Cloud Sites Route}
 * * {@link encore.svcs.cloud.sites.CloudSiteResource Cloud Sites Resource}
 * * {@link encore.svcs.cloud.sites.CloudSiteEmailResource Cloud Sites Resource}
 */
angular.module('encore.svcs.cloud.sites', [
    'encore.svcs.cloud.config',
    'ngResource',
    'encore.common.http',
    'encore.svcs.util.http',
    'encore.util.transform'
]);

angular.module('encore.svcs.cloud.sites')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteAccountRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud Site API
 */
.factory('CloudSiteAccountRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/cloud_sites/accounts/:accountId/sites/:name';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteAccountResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.sites.CloudSiteAccountRoute
 * @description
 * `$resource` definition of Cloud site API
 * https://pages.github.rackspace.com/EncoreUI/encore-cloud-api-docs/#cloud_sites_accounts
 * Cloud Sites}
 *
*/
.factory('CloudSiteAccountResource', ["$resource", "CloudSiteAccountRoute", "CloudSiteAccountTransform", function ($resource, CloudSiteAccountRoute, CloudSiteAccountTransform) {
    return $resource(CloudSiteAccountRoute, {
        accountId: '@accountId',
        name: '@name'
    }, {
        /**
         * @ngdoc method
         * @name CloudSiteAccountResource#get
         * @methodOf encore.svcs.cloud.sites.CloudSiteAccountResource
         * @param {object} params Parameter object
         * @param {string} params.accountId Account ID
         * @description
         * Get the primary site details for the specified accounts
         * *default get method from `$resource`*
         * @example
         * <pre>
         * CloudSiteAccountResource.get({
         *   'accountId': '440369'
         * });
         * </pre>
         * //response data format:
         * <pre>
         * [{
         *      "status": "ACTIVE",
         *      "id": 663800,
         *      "domain": "junitt-mmosso-apache2zeus-testt.com",
         *      "name": "www.junitt-mmosso-apache2zeus-testt.com",
         *      "account_id": "440369",
         *      "updated": "2015-09-25T11:23:38-0500",
         *      "faults": [],
         *      "created": "2012-06-26T18:27:50-0500"
         * }]
         * </pre>
         */
        list: {
            method: 'GET',
            isArray: true,
            transformResponse: CloudSiteAccountTransform.get
        }

        /**
         * @ngdoc method
         * @name CloudSiteAccountResource#delete
         * @methodOf encore.svcs.cloud.sites.CloudSiteAccountResource
         * @param {object} params Parameter object
         * @param {string} params.accountId Account ID
         * @param {string} params.name name 
         * @description
         * Delete a primary site
         * *default delete method from `$resource`*
         * @example
         * <pre>
         * CloudSiteAccountResource.delete({
         *   'accountId': '440369',
         *   'name': 'www.encore.com'
         * });
         * </pre>
         * <pre>
         *  No response given
         * </pre>
         * # Or
         * <pre>
         * var accountSites = CloudSitesAccountResource.list({ 'accountId': 123456 });
         * accountSites[0].$delete(); 
         * </pre>
         * <pre>
         *  No response given
         * </pre>
         */

        /**
         * @ngdoc method
         * @name CloudSiteAccountResource#save
         * @methodOf encore.svcs.cloud.sites.CloudSiteAccountResource
         * @param {object} params Parameter object
         * @param {string} params.accountId Account ID
         * @param {object} bodyParams Body Parameter object
         * @param {string} bodyParams.name Fqdn 
         * @param {string} bodyParams.technology Fqdn technology 
         * @description
         * Add a primary site
         * *default save method from `$resource`*
         * @example
         * <pre>
         * CloudSiteAccountResource.save({
         *   'accountId': '440369'
         * }, {
         *   'fqdn': 'www.encore.com',
         *   'technology': 'PYTHON3'
         * });
         * </pre>
         * <pre>
         *  No response given
         * </pre>
         */
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteAccountTransform
 * @requires encore.svcs.util.http.TransformUtil
 * @returns {object} A mapping of Cloud Site response transformations
 * @description
 *
 * Transforms the result of Cloud Site Primary info api calls
 */
.factory('CloudSiteAccountTransform', ["TransformUtil", function (TransformUtil) {
    /**
     * @ngdoc method
     * @name CloudSiteAccountTransform#get
     * @methodOf encore.svcs.cloud.sites.CloudSiteAccountTransform
     * @description
     *
     * Takes of a Cloud site Primary Details and massages the instance to ensure it is as expected object
     */
    var getPrimaryDetails = TransformUtil.pluckList('sites');

    return {
        get: TransformUtil.responseChain(getPrimaryDetails)
    };
}]);
angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteDatabaseRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Database
     */
    .factory('CloudSiteDatabaseRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/sites/:id/databases';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteDatabaseResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteDatabaseRoute - base path of Cloud Site Database
     * @returns {object} returns a $resource to communicate with Cloud Sites Database
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Database API.
     * Use cloud sites account id as parameter when interacting with the API.
     * For full API documentation see {@link
     * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteDatabaseResource', ["$resource", "CloudSiteDatabaseRoute", function ($resource, CloudSiteDatabaseRoute) {
        return $resource(CloudSiteDatabaseRoute, {
            id: '@id'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteDatabaseResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteDatabaseResource
             * @description
             * Get database and pagination for specified site based on site account id
             * @param {object} params Parameter object
             * @param {string} params.id Site account id
             * @example
             * <pre>
             * CloudSiteDatabaseResource.get({ id: '323676' });
             * </pre>
             * <pre>
             * //response data format:
             * {
             *     "databases": [
             *         {
             *             "type": "MYSQL5",
             *             "id": 456669,
             *             "pod": "staging.ord1",
             *             "updated": "2015-10-13T11:44:21-0500",
             *             "created": "2015-10-13T11:43:08-0500",
             *             "name": "6215052_encore02",
             *             "host": "mysql51-01.staging.ord1.stabletransit.com",
             *             "status": "ACTIVE",
             *             "faults": []
             *         }
             *     ],
             *     "page": 0,
             *     "pages": 1,
             *     "total": 1,
             *     "count": 1
             * }
             * </pre>
             */
        });
    }]);

angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteDatabaseUserRoute
     * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
     * @description
     * Returns a string representation of the base path for the Cloud Site Database Users
     *
     * @return {String} - string that is the relative url for api
     * @example
     * <pre>
     * '/api/cloud/cloud_sites/databases/{{databaseId}}/users'
     * </pre>
     */
    .factory('CloudSiteDatabaseUserRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/databases/:databaseId/users';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteDatabaseUserResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteDatabaseRoute - base path of Cloud Site Database
     * @returns {object} returns a $resource to communicate with Cloud Sites Database API
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Database API.
     * For full API documentation see
     * {@link https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites
     * Cloud Sites}
     *
     */
    .factory('CloudSiteDatabaseUserResource', ["$resource", "CloudSiteDatabaseUserRoute", function ($resource, CloudSiteDatabaseUserRoute) {
        return $resource(CloudSiteDatabaseUserRoute, {}, {
            /**
             * @ngdoc method
             * @name CloudSiteDatabaseUserResource#getPaginated
             * @methodOf encore.svcs.cloud.sites.CloudSiteDatabaseUserResource
             * @description
             * Get cloud sites database users based on the database id
             * @param {Object} params Parameter object
             * @param {String} params.databaseId Database id
             * @example
             * <pre>
             * CloudSiteDatabaseUserResource.getPaginated({ databaseId: '845558' });
             * </pre>
             * <pre>
             * //response data format:
             * {
             *   "pagination": {
             *     "total_records": 2
             *   },
             *     "database_users": [
             *       {
             *         "access": "ReadWrite",
             *         "status": "ACTIVE",
             *         "updated": "2016-04-13T15:02:11-0500",
             *         "name": "708236_test",
             *         "faults": [],
             *         "created": "2016-04-13T15:02:11-0500",
             *         "id": "982134"
             *       },
             *       {
             *         "access": "ReadWrite",
             *         "status": "ACTIVE",
             *         "updated": "2016-04-13T15:28:51-0500",
             *         "name": "708236_testtom",
             *         "faults": [],
             *         "created": "2016-04-13T15:28:51-0500",
             *         "id": "982147"
             *       }
             *     ]
             * }
             * </pre>
             */
            'getPaginated': {
                method: 'GET'
            }
        });
    }]);
angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailAliasRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Users
     */
    .factory('CloudSiteEmailAliasRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/sites/:name/email_aliases';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailAliasResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteEmailAliasRoute - base path of Cloud Site Email Alias
     * @returns {object} returns a $resource to communicate with Cloud Sites Email Alias
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Email Alias API.
     * Use cloud sites Fully Qualified Domain Name as parameter when interacting with the API.
     * For full API documentation see {@link
        * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteEmailAliasResource', ["$resource", "CloudSiteEmailAliasRoute", function ($resource, CloudSiteEmailAliasRoute) {
        return $resource(CloudSiteEmailAliasRoute, {
            name: '@name'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteEmailAliasResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteEmailAliasResource
             * @description
             * Get cloud sites email aliases based on fully qualified domain name
             * @param {object} params Parameter object
             * @param {string} params.name fully qualified domain name
             * @example
             * <pre>
             * CloudSiteEmailAliasResource.get({ name: 'www.testcloudsite.com' });
             * </pre>
             * <pre>
             * //response data format:
             * {
             *     'count': 2,
             *     'total': 2,
             *     'faults': [],
             *     'page': 0,
             *     'pages': 1,
             *     'mailboxAliases': [{
             *         'numberOfMembers': 1,
             *         'name': 'clientemail1'
             *     }, {
             *         'numberOfMembers': 1,
             *         'name': 'clientemail2'
             *     }]
             * }
             * </pre>
             */
        });
    }]);
angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Email
     */
    .factory('CloudSiteEmailRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/sites/:name/emails';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteEmailRoute - base path of Cloud Site Email
     * @returns {object} returns a $resource to communicate with Cloud Sites Email
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Email API.
     * Use site url as parameter when interacting with the API.
     * For full API documentation see {@link
     * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteEmailResource', ["$resource", "CloudSiteEmailRoute", function ($resource, CloudSiteEmailRoute) {
        return $resource(CloudSiteEmailRoute, {
            name: '@name',
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteEmailResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteEmailResource
             * @description
             * Get emails and pagination for specified site based on fully qualified domain name
             * @param {object} params Parameter object
             * @param {string} params.name fully qualified domain name
             * @example
             * <pre>
             * CloudSiteEmailResource.get({ name : 'www.testcloudsite.com' });
             * </pre>
             * <pre>
             *  //response data format:
             * {
             *      "pagination": {
             *          "total_records": 2
             *      },
             *      "emails": [
             *          {
             *              "name": "clientemail1",
             *              "display_name": "Lou Smith"
             *          },
             *          {
             *              "name": "clientemail2",
             *              "display_name": "Paul Smith"
             *          }
             *      ]
             * }
             * </pre>
             *
             */
        });
    }]);

angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailSyncRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Users
     */
    .factory('CloudSiteEmailSyncRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/sites/:name/sync_emails';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteEmailSyncResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteEmailSyncRoute - base path of Cloud Site Email Sync
     * @returns {object} returns a $resource to communicate with Cloud Sites Email Sync
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Email Sync API.
     * Use cloud sites Fully Qualified Domain Name as parameter when interacting with the API.
     * For full API documentation see {@link
        * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteEmailSyncResource', ["$resource", "CloudSiteEmailSyncRoute", function ($resource, CloudSiteEmailSyncRoute) {
        return $resource(CloudSiteEmailSyncRoute, {
            name: '@name'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteEmailSyncResource#save
             * @methodOf encore.svcs.cloud.sites.CloudSiteEmailSyncResource
             * @description
             * Get cloud sites email aliases based on fully qualified domain name
             * @param {object} params Parameter object
             * @param {string} params.name fully qualified domain name
             * @example
             * <pre>
             *     CloudSiteEmailSyncResource.save({ name: 'www.testcloudsite.com' });
             * </pre>
             * <pre>
             *     //response data format:
             *     {}
             * </pre>
             */
        });
    }]);
angular.module('encore.svcs.cloud.sites')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud Site Details
 */
.factory('CloudSiteRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/cloud_sites/sites/:name';
}])

/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteResource
 * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
 * @requires encore.svcs.cloud.sites.CloudSiteRoute
 * @returns {object} A mapping of CloudSiteRoute response transformations
 * @description
 *
 * For full API documentation see {@link
 * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
 * Cloud Sites}
 *
 */
.factory('CloudSiteResource', ["$resource", "CloudSiteRoute", function ($resource, CloudSiteRoute) {
    return $resource(CloudSiteRoute, {
        name: '@name',
    }, {
        /**
         * @ngdoc method
         * @name CloudSiteResource#get
         * @methodOf encore.svcs.cloud.sites.CloudSiteResource
         * @description
         * Get cloud primary site details for the specified site
         * @param {object} params Parameter object
         * @param {string} params.name fully qualified domain name
         * @example
         * <pre>
         * CloudSiteResource.get({ name : 'www.testcloudsite.com' });
         * </pre>
         * <pre>
         *  //response data format:
         * {
         *     "domain": "testcloudsite.com",
         *     "created": "2012-06-26T18:27:50-0500",
         *     "name": "www.testcloudsite.com",
         *     "updated": "2015-09-25T11:23:38-0500",
         *     "monitor": {},
         *     "account_id": "323676",
         *     "log_path": "/mnt/stor1-staging-ord1/323676/www.testcloudsite.com/logs/",
         *     "unix_path": "/mnt/stor1-staging-ord1/323676/www.testcloudsite.com/web/content/",
         *     "id": 663800,
         *     "technology": "PHP56",
         *     "cifs_path": "\\\\fs1-n01\\stor1stagingord1\\323676\\www.testcloudsite.com\\web\\content\\",
         *     "cdn_service": {},
         *     "raw_logging": false,
         *     "test_link": "http://www.testcloudsite.com.php5-1.staging.websitetestlink.com",
         *     "ftp_server": "ftp.staging.ftptoyoursite.com",
         *     "ftp_path": "/www.testcloudsite.com/web/content/",
         *     "faults": [],
         *     "pod": "staging.ord1",
         *     "status": "ACTIVE",
         *     "aliases": []
         * }
         * </pre>
         */
    });
}]);
angular.module('encore.svcs.cloud.sites')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.sites.CloudSiteSubAccountRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud Site API
 */
    .factory('CloudSiteSubAccountRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/accounts/:accountId/subaccounts/:subAccountId';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteSubAccountResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteSubAccountRoute
     * @description
     * The `get` method returns $resource object which enables the communication with
     *     Cloud Sites Sub Account API.
     * For full API documentation, see:
     * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites
     *
     */
    .factory('CloudSiteSubAccountResource', ["$resource", "CloudSiteSubAccountRoute", function ($resource, CloudSiteSubAccountRoute) {
        return $resource(CloudSiteSubAccountRoute, {
            accountId: '@id',
            subAccountId: '@subAccountId'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteSubAccountResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteSubAccountResource
             * @param {object} params Parameter object
             * @param {string} params.accountId Account ID
             * @param {string} params.subAccountId Sub Account ID
             * @description
             * Get the sub site account details for the specified account
             * *default get method from `$resource`*
             * @example
             * <pre>
             * CloudSiteSubAccountResource.get({
             *     'accountId': '6215052',
             *     'subAccountId': '6215192'
             * });
             * </pre>
             * //response data format:
             * <pre>
             * {
             *   "id":"6215052",
             *   "status":"ACTIVE",
             *   "created":"2015-10-13T09:38:38-0500",
             *   "contacts":[
             *       {
             *          "lastName":"Account",
             *          "phoneNumbers":[
             *              {
             *                "mask":"(###) ###-#### x############",
             *                "country":"US",
             *                "number":"(210)733-4282"
             *              }
             *          ],
             *          "roles":[
             *              "PRIMARY"
             *          ],
             *          "emailAddresses":[
             *               {
             *                   "address":"fran.torreslopez@rackspace.com",
             *                   "primary":true
             *               }
             *          ],
             *          "addresses":[
             *               {
             *                   "zipcode":"78201",
             *                   "primary":true,
             *                   "street":"222 Main",
             *                   "state":"Texas",
             *                   "statecode":"TX",
             *                   "country":"US",
             *                   "city":"San Antonio"
             *               }
             *          ],
             *          "firstName":"Sub"
             *       }
             *   ]
             * }
             * </pre>
             */
        });
    }]);
angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteTechRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Database
     */
    .factory('CloudSiteTechRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/accounts/:accountId/technologies';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteTechResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteTechRoute - base path of Cloud Site Tech
     * @requires encore.svcs.cloud.sites.CloudSiteTechTransform
     * @returns {object} returns a $resource to communicate with Cloud Sites Tech
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Tech API.
     * Use cloud sites account id as parameter when interacting with the API.
     * For full API documentation see {@link
     * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteTechResource', ["$resource", "CloudSiteTechRoute", "CloudSiteTechTransform", function ($resource, CloudSiteTechRoute, CloudSiteTechTransform) {
        return $resource(CloudSiteTechRoute, {
            accountId: '@accountId'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteTechResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteTechResource
             * @description
             * Get database and pagination for specified site based on site account id
             * @param {object} params Parameter object
             * @param {string} params.accountId Site account id
             * @example
             * <pre>
             * CloudSiteTechResource.get({ accountId: '323676' });
             * </pre>
             * <pre>
             * //response data example
             *  "technologies":{
             *        "databases": [{
             *                "description": "MSSQL 2014",
             *                "type": "MSSQL_2014",
             *                "pods": [
             *                    "wc1.ord1",
             *                    "wc1.dfw3",
             *                    "wc2.dfw3"
             *                ]
             *            }, {
             *                "description": "MSSQL 2012",
             *                "type": "MSSQL_2012",
             *                "pods": [
             *                    "wc1.ord1",
             *                    "wc1.dfw3",
             *                    "wc2.dfw3"
             *                ]
             *            }
             *        ],
             *        "crons": [],
             *        "websites": [{
             *                "description": "Windows Server 2012 R2 / IIS 8.5 / .NET 2.0, 3.0, 3.5",
             *                "type": "IIS7",
             *               "pods": [
             *                    "wc1.ord1"
             *                ]
             *            }
             *        ],
             *        "deployments": []
             *    }
             * }
             * </pre>
             */
            get: {
                method: 'GET',
                transformResponse: CloudSiteTechTransform.get
            }
         });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteTechTransform
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.util.transform.Pluck
     * @returns {object} A mapping of Cloud Site response transformations
     * @description
     * Transforms the result of Cloud Site Primary info api calls
     */
    .factory('CloudSiteTechTransform', ["TransformUtil", "Pluck", function (TransformUtil, Pluck) {
        /**
         * @ngdoc method
         * @name CloudSiteTechTransform#get
         * @methodOf encore.svcs.cloud.sites.CloudSiteTechTransform
         * @description
         * Takes of a Cloud site account and massages the instance to ensure it is as expected object
         * @example
         * <pre>
         * {
         *  "technologies":{
         *        "databases": [{
         *                "description": "MSSQL 2014",
         *                "type": "MSSQL_2014",
         *                "pods": [
         *                    "wc1.ord1",
         *                    "wc1.dfw3",
         *                    "wc2.dfw3"
         *                ]
         *            }, {
         *                "description": "MSSQL 2012",
         *                "type": "MSSQL_2012",
         *                "pods": [
         *                    "wc1.ord1",
         *                    "wc1.dfw3",
         *                    "wc2.dfw3"
         *                ]
         *            }
         *        ],
         *        "crons": [],
         *        "websites": [{
         *                "description": "Windows Server 2012 R2 / IIS 8.5 / .NET 2.0, 3.0, 3.5",
         *                "type": "IIS7",
         *               "pods": [
         *                    "wc1.ord1"
         *                ]
         *            }
         *        ],
         *        "deployments": []
         *    }
         * }
         * </pre>
         * <pre>
         * //After transform
         * {
         *        "databases": [{
         *                "description": "MSSQL 2014",
         *                "type": "MSSQL_2014",
         *                "pods": [
         *                    "wc1.ord1",
         *                    "wc1.dfw3",
         *                    "wc2.dfw3"
         *                ]
         *            }, {
         *                "description": "MSSQL 2012",
         *                "type": "MSSQL_2012",
         *                "pods": [
         *                    "wc1.ord1",
         *                    "wc1.dfw3",
         *                    "wc2.dfw3"
         *                ]
         *            }
         *        ],
         *        "crons": [],
         *        "websites": [{
         *                "description": "Windows Server 2012 R2 / IIS 8.5 / .NET 2.0, 3.0, 3.5",
         *                "type": "IIS7",
         *               "pods": [
         *                    "wc1.ord1"
         *                ]
         *            }
         *        ],
         *        "deployments": []
         * }
         * </pre>
         */
        var getTech = Pluck('technologies');

        return {

            get: TransformUtil.responseChain(getTech)
        };
    }]);

angular.module('encore.svcs.cloud.sites')
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteUserRoute
     * @requires CLOUD_API_URL_BASE
     * @description
     *
     * Returns a string representation of the base path for the Cloud Site Users
     */
    .factory('CloudSiteUserRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/cloud_sites/sites/:fqdn/users';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloud.sites.CloudSiteUserResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires encore.svcs.cloud.sites.CloudSiteUserRoute - base path of Cloud Site User
     * @returns {object} returns a $resource to communicate with Cloud Sites Users
     * @description
     * The get method returns $resource object which enables the communication with Cloud Sites Users API.
     * Use cloud sites Fully Qualified Domain Name as parameter when interacting with the API.
     * For full API documentation see {@link
        * https://pages.github.rackspace.com/EncoreUI/encore-cloud-docs/#cloud_sites_account
     * Cloud Sites}
     *
     */
    .factory('CloudSiteUserResource', ["$resource", "CloudSiteUserRoute", function ($resource, CloudSiteUserRoute) {
        return $resource(CloudSiteUserRoute, {
            fqdn: '@fqdn'
        }, {
            /**
             * @ngdoc method
             * @name CloudSiteUserResource#get
             * @methodOf encore.svcs.cloud.sites.CloudSiteUserResource
             * @description
             * Get cloud sites users based on fqdn
             * @param {object} params Parameter object
             * @param {string} params.fqdn Fully Qualified Domain Name
             * @example
             * <pre>
             * CloudSiteUserResource.get({ fqdn: 'www.testcloudsite.com' });
             * </pre>
             * <pre>
             * //response data format:
             * {
             *     "users": [
             *         {
             *             "id": 2148063,
             *             "updated": "2015-12-21T13:31:12-0600",
             *             "group_id": 745840,
             *             "faults": [],
             *             "status": "",
             *             "domain": "",
             *             "account_id": 6210622,
             *             "username": "bll1ftp1",
             *             "home_directory": "www.wtfsubacct1.com",
             *             "name": "",
             *             "type": "FTP",
             *             "created": "2015-12-21T13:31:12-0600"
             *         },
             *         {
             *             "id": 2148064,
             *             "updated": "2015-12-21T13:34:38-0600",
             *             "group_id": 745840,
             *             "faults": [],
             *             "status": "",
             *             "domain": "",
             *             "account_id": 6210622,
             *             "username": "bll1ftp2",
             *             "home_directory": "www.wtfsubacct1.com/web",
             *             "name": "",
             *             "type": "FTP",
             *             "created": "2015-12-21T13:34:38-0600"
             *         },
             *         {
             *             "id": 5111966,
             *             "updated": "2016-01-05T15:51:32-0600",
             *             "group_id": 746153,
             *             "faults": [],
             *             "status": "",
             *             "domain": "",
             *             "account_id": 6210622,
             *             "username": "ryansub1",
             *             "home_directory": "www.wtfsubacct1.com",
             *             "name": "",
             *             "type": "FTP",
             *             "created": null
             *         }
             *     ],
             *     "pagination": {
             *         "total_records": 3
             *     }
             * }
             * </pre>
             */
        });
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.cloud.user
 * @description
 * Services used for manipulation and retrieval of cloud user service data
 */
angular.module('encore.svcs.cloud.user', [
    'ngResource',
    'encore.svcs.cloud.config',
    'encore.svcs.util.http'
]);

angular.module('encore.svcs.cloud.user')
/**
 * @ngdoc service
 * @name encore.svcs.cloud.user.CloudUserRoute
 * @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
 * @description
 *
 * Returns a string representation of the base path for the Cloud User API
 */
.factory('CloudUserRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/users/:user/:action';
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.user.CloudUserResource
 * @requires $resource - AngularJS service to extend the $http service and wrap AJAX calls to APIs
 * @requires encore.svcs.cloud.user.CloudUserRoute
 * @requires encore.svcs.cloud.user.CloudUserTransform
 * @description
 *
 * `$resource` definition of the Cloud User API
 */
.factory('CloudUserResource', ["$resource", "CloudUserRoute", "CloudUserTransform", function ($resource, CloudUserRoute, CloudUserTransform) {
    return $resource(CloudUserRoute, {
        user: '@user'
    }, {
        /**
         * @ngdoc method
         * @name CloudUserResource#roles
         * @methodOf encore.svcs.cloud.user.CloudUserResource
         * @description
         * Lists the available roles for a user
         *
         * @example
         * <pre>
         * CloudUserResource.roles({
         *   user: 'hub_cap'
         * });
         * </pre>
         * <pre>
         * [
         *   {
         *     "name": "LBaaS:observer",
         *     "description": "LBaaS Observer",
         *     "id": "10000209",
         *     "service_id": "bde1268ebabeeabb70a0e702a4626977c331d5c4"
         *   },
         *   {
         *     "name": "legacyCompute:observer",
         *     "description": "Legacy Compute Observer Role for Account User",
         *     "id": "10000255",
         *     "service_id": "bde1268ebabeeabb70a0e702a4626977c331d5c4"
         *   },
         *   {
         *     "name": "object-store:admin",
         *     "description": "Object Store Admin Role for Account User",
         *     "id": "10000256",
         *     "service_id": "bde1268ebabeeabb70a0e702a4626977c331d5c4"
         *   }
         * ]
         * </pre>
         */
        roles: {
            method: 'GET',
            params: {
                action: 'roles'
            },
            transformResponse: CloudUserTransform.roles,
            isArray: true
        }
    });
}])
/**
 * @ngdoc service
 * @name encore.svcs.cloud.user.CloudUserTransform
 * @requires service in module encore.util.TransformUtil
 * @returns {object} A mapping of CloudUser response transformations
 * @description
 *
 * Transforms the result of CloudUser API requests
 */
.factory('CloudUserTransform', ["TransformUtil", function (TransformUtil) {

    /**
     * @ngdoc method
     * @name CloudUserTransform#roles
     * @methodOf encore.svcs.cloud.user.CloudUserTransform
     * @description
     *
     * Transform will pluck 'roles' from the response
     * <pre>
     * {
     *   roles: [
     *     {
     *       'service_id': 'aab123',
     *       'description': 'Role description',
     *       'id': '12345678',
     *       'name': 'role:admin'
     *     },
     *     {
     *       'service_id': 'bbc123',
     *       'description': 'Role description',
     *       'id': '12345678',
     *       'name': 'role:observer'
     *     }
     *   ]
     * };
     * </pre>
     * <pre>
     * // Transformed response:
     * [
     *   {
     *     'service_id': 'aab123',
     *     'description': 'Role description',
     *     'id': '12345678',
     *     'name': 'role:admin'
     *   },
     *   {
     *     'service_id': 'bbc123',
     *     'description': 'Role description',
     *     'id': '12345678',
     *     'name': 'role:observer'
     *   }
     * ]
     * </pre>
     */
    var roles =  TransformUtil.pluckList('roles');

    return {
        roles: TransformUtil.responseChain(roles)
    };
}]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.cloudControl', [
    'ngResource',
    'encore.util.transform'
])
    /**
     * @ngdoc property
     * @name encore.svcs.cloudControl.CLOUD_CONTROL_SERVICE_PATHS
     * @description
     *
     * Constant for Cloud Control paths by service type
     */
    .constant('CLOUD_CONTROL_SERVICE_PATHS', {
        'serversFirst': 'first_gen_servers',
        'serversNext': 'next_gen_servers',
        'dbaas': 'dbaas/instances',
        'lbaas': 'load_balancers',
        'volumes': 'block_storage/volumes',
        'snapshots': 'block_storage/snapshots',
        'images': 'images'
    })
    /**
     * @ngdoc property
     * @name encore.svcs.cloudControl.CLOUD_CONTROL_SERVICE_DETAIL_IDS
     * @description
     *
     * Constant for Cloud Control detail identifiers by service type
     */
    .constant('CLOUD_CONTROL_SERVICE_DETAIL_IDS', {
        'servers': 'serverId',
        'dbaas': 'instanceId',
        'lbaas': 'loadBalancerId',
        'volumes': 'volumeId',
        'snapshots': 'snapshotId',
        'images': 'imageId'
    })
    /**
     * @ngdoc property
     * @name encore.svcs.cloudControl.GetCloudControlEndpoint
     * @description
     *
     * Function for retrieving the Cloud Control Endpoint
     *
     * @param {String} supportRegion The support region, e.g. 'US' or 'UK'
     * @param {String} env The environment, e.g. 'staging', 'production'
     */
    .factory('GetCloudControlEndpoint', function () {
        return function (supportRegion, env) {
            if (supportRegion !== 'US' && supportRegion !== 'UK') {
                throw new Error(supportRegion + ' not available. Only US and UK regions are supported at this time');
            }
            var endpoints = {
                'US': {
                    'local': 'https://cloudcontrol.staging.us.ccp.rackspace.net',
                    'staging': 'https://cloudcontrol.staging.us.ccp.rackspace.net',
                    'preprod': 'https://cloudcontrol.preview.us.ccp.rackspace.net',
                    'production': 'https://cloudcontrol.rackspacecloud.com'
                },
                'UK': {
                    'local': 'https://cloudcontrol.staging.ord1.uk.ccp.rackspace.net',
                    'staging': 'https://cloudcontrol.staging.ord1.uk.ccp.rackspace.net',
                    'production': 'https://uk.cloudcontrol.rackspacecloud.com'
                }
            };
            var url = endpoints[supportRegion][env];
            if (_.isEmpty(url)) {
                throw new Error('Cloud Control link not available for environment: ' + env);
            }
            return url;
        };
    })
    /**
     * @ngdoc property
     * @name encore.svcs.cloudControl.GetCloudControlURLBase
     * @requires $routeParams
     * @requires encore.svcs.cloudControl.GetCloudControlEndpoint
     * @description
     *
     * Function for generating the base path for Cloud Control
     *
     * @param {String} supportRegion The support region, e.g. 'US' or 'UK'
     * @param {String} env The environment, e.g. 'staging', 'production'
     * @param {String} accountNumber The customer's account number
     * @param {String} userId The id of the user
     */
    .factory('GetCloudControlURLBase', ["$routeParams", "GetCloudControlEndpoint", function ($routeParams, GetCloudControlEndpoint) {
        return function (supportRegion, env, accountNumber, userId) {
            supportRegion = supportRegion || $routeParams.supportRegion;
            env = env || $routeParams.env;
            accountNumber = accountNumber || $routeParams.accountNumber;
            userId  = userId || $routeParams.userId;
            var host = GetCloudControlEndpoint(supportRegion, env);
            return host + '/customer/' + accountNumber + '/users/' + userId + '/';
        };
    }])
    /**
     * @ngdoc property
     * @name encore.svcs.cloudControl.GetCloudControlURL
     * @requires encore.svcs.cloudControl.CLOUD_CONTROL_SERVICE_PATHS
     * @requires encore.svcs.cloudControl.CLOUD_CONTROL_SERVICE_DETAIL_IDS
     * @description
     *
     * Function for generating Cloud Control URLs
     *
     * @param {String} supportRegion The support region, e.g. 'US' or 'UK'
     * @param {String} env The environment, e.g. 'staging', 'production'
     * @param {String} accountNumber The customer's account number
     * @param {String} userId The id of the user
     * @param {String} params The params for the URL
     */
    .factory('GetCloudControlURL', ["GetCloudControlURLBase", "CLOUD_CONTROL_SERVICE_PATHS", "CLOUD_CONTROL_SERVICE_DETAIL_IDS", function (GetCloudControlURLBase, CLOUD_CONTROL_SERVICE_PATHS,
                                             CLOUD_CONTROL_SERVICE_DETAIL_IDS) {

        // var resourceURLTemplate = '${service}';
        var resourceURLTemplate = '${service}${region}${id}';

        return function (supportRegion, env, accountNumber, userId, params) {
            var templateParams = { id: '', region: '', service: '' };
            var baseURL = GetCloudControlURLBase(supportRegion, env, accountNumber, userId);
            var resourceURL = _.template(baseURL + resourceURLTemplate);

            // Return baseURL if service is not provided
            if (!_.has(params, 'serviceType')) {
                return baseURL;
            }

            // Add service param
            if (params.serviceType === 'servers') {
                templateParams.service = CLOUD_CONTROL_SERVICE_PATHS[params.serviceType + params.serverGen];
            } else {
                templateParams.service = CLOUD_CONTROL_SERVICE_PATHS[params.serviceType];
            }

            // Add region param, if available
            if (_.has(params, 'region')) {
                templateParams.region = '/' + params.region;
            }

            // Check serviceType and throw error if not available
            if (!_.includes(_.keys(CLOUD_CONTROL_SERVICE_DETAIL_IDS), params.serviceType)) {
                throw new Error('serviceType must be one of ' + _.keys(CLOUD_CONTROL_SERVICE_DETAIL_IDS));
            // Add id if available
            } else if (_.has(params, CLOUD_CONTROL_SERVICE_DETAIL_IDS[params.serviceType])) {
                templateParams.id = '/' + params[CLOUD_CONTROL_SERVICE_DETAIL_IDS[params.serviceType]];
            }

            return resourceURL(templateParams);
        };
    }]);

angular.module('encore.svcs.cloudControl')
    /**
     * @deprecated Please use CloudControlService
     */
    .factory('CloudControl', ["CloudControlService", function (CloudControlService) {
        return CloudControlService;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.cloudControl.CloudControlService
     * @description
     * Resource object for Cloud Control API
     *
     * @requires $resource
     * @requires encore.util.transform.Transform
     */
    .factory('CloudControlService', ["$resource", "Transform", function ($resource, Transform) {
        return $resource('/api/cloudcontrol/:action', {}, {
            /**
             * @ngdoc method
             * @name CloudControlService#search
             * @methodOf encore.svcs.cloudControl.CloudControlService
             * @description
             *
             * Performs a GET against the Cloud Control Elasticsearch API
             */
            search: {
                method: 'GET',
                params: {
                    action: 'search'
                },
                isArray: true,
                transformResponse: Transform.customTransform('cloudControlSearch')
            }
        });
    }]);

// TODO: `@ngdoc overview`
angular.module('encore.common', [
    'encore.common.resource',
    'encore.common.http'
]);

angular.module('encore.common.resource', [])
    /**
     * @ngdoc object
     * @name encore.common.resource.rxResourceHelper
     * @description
     * Utility Helper for Configuring `$resource` Actions and avoiding long configurations
     */
    .factory('rxResourceHelper', function () {
        // List of verbs per HTTP Method, LIST is special as it defines isArray: true for $resource
        var defaultVerbs = {
            'GET': ['get', 'list', 'query'],
            'POST': ['save', 'post'],
            'DELETE': ['remove', 'delete', 'disable'],
            'PUT': ['update']
        };

        var arrayVerbs = ['list', 'query'];

        return {
            /**
             * @ngdoc method
             * @name encore.common.resource.rxResourceHelper#createAction
             * @methodOf encore.common.resource.rxResourceHelper
             * @description
             * Remove boilerplate of creating nested resources for an instance of $resource, it will
             * return an object with default configuration for a specific nested resource of a model.
             *
             * Creates actions of the name of the nested resource and adds the following verbs:
             *
             *     { 'get':     {method:'GET'},
             *       'list':    {method:'GET', isArray:true},
             *       'query':   {method:'GET', isArray:true},
             *       'update':  {method:'PUT'},
             *       'save':    {method:'POST'},
             *       'post':    {method:'POST'},
             *       'remove':  {method:'DELETE'},
             *       'delete':  {method:'DELETE'},
             *       'disable': {method:'DELETE'} };
             *
             * @param {Object} dest - An object to extend with the generated desired actions.
             * @param {String} name - Name of the `$resource` sub-entity being created (i.e User)
             * @param {Array} [verbs=Array] - List of verbs to use, if null or empty, all default
             *                             verbs will be created, available names
             * @param {Object} [params=Object] - Default parameters for all calls of this type<br />
             *                               For Example:
             *                               <pre>{ type: 'user' }</pre>
             * @param {Object} [config=Object] - Other configuration parameters for each action defined
             *                               in the form of the verb on the action<br />
             *                               For Example:
             *                               <pre>{ 'update': {transformRequest: [updateBody]} }</pre>
             * @example
             * *Removes*:
             *
             * <pre>
             * var LBaas = $resource('/api/lbaas/:id', {
             *     id: '@id',
             * }, {
             *     getHealthMonitor: {
             *         method: 'GET',
             *         params: {
             *             details: 'healthmonitor'
             *         }
             *     },
             *     updateHealthMonitor: {
             *         method: 'PUT',
             *         params: {
             *             details: 'healthmonitor'
             *         },
             *         transformRequest: LoadBalancerTransforms.updateHealthMonitor
             *     },
             *     disableHealthMonitor: {
             *         method: 'DELETE',
             *         params: {
             *             details: 'healthmonitor'
             *         }
             *     }
             * });
             * </pre>
             *
             * *to*:
             *
             * <pre>
             * // Define an empty actions object
             * var actions = {};
             *
             * // Define only get/update/disable verbs
             * rxResourceHelper.createAction(actions, 'HealthMonitor', ['get', 'update', 'disable'], {
             *     details: 'healthmonitor'
             * }, {
             *     update: {
             *         transformRequest: LoadBalancerTransforms.updateHealthMonitor
             *     }
             * });
             *
             * // Create resource
             * var LBaas = $resource('/api/lbaas/:id', {
             *     id: '@id',
             * }, actions);
             * </pre>
             *
             * <pre>
             * // Get Health Monitor
             * var healthMonitor = LBaas.getHealthMonitor(...);
             * </pre>
             *
             * <pre>
             * // Populate lbaasInstance with LBaas Details
             * var lbaasInstance = new LBaas();
             * lbaasInstance.$get({ id: 1 });
             *
             * // Populate lbaasInstance with healthMonitoring Details
             * lbaasInstance.$getHealthMonitoring({ id: 1 });
             *
             * // Update healthMonitoring with the current healthMonitoring data.
             * lbaasInstance.healthMonitoring.enabled = false;
             * lbaasInstance.$updateHealthMonitoring({ id: 1 });
             * </pre>
             */
            createAction: function (dest, name, verbs, params, config) {
                name = name || ''; // Name can be blank if overriding default $resource Actions
                config = _.defaults({}, config);
                verbs = _.isArray(verbs) ? verbs : [];
                params = {
                    params: _.defaults({}, params)
                };

                // Force capitalization for the purposes of naming conventions
                if (name.length > 0) {
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }

                var action = {};

                // Create the `$resource` action configuration
                var createAction = function (method, verb) {
                    action[verb + name] = _.defaults({
                        method: method,
                        isArray: arrayVerbs.indexOf(verb) > -1
                    }, params, config[verb]);
                };

                // Go through each of the expected (or default) verbs for each HTTP Method
                var configureVerbs = function (methodVerbs, method) {
                    // if Verbs is empty, use the expected methodVerbs, otherwise only use the expected verbs
                    methodVerbs = _.intersection(methodVerbs, verbs.length > 0 ? verbs : methodVerbs);

                    _.forEach(methodVerbs, _.partial(createAction, method));
                };

                _.forEach(defaultVerbs, configureVerbs);
                _.extend(dest, action);

                return action;
            }
        };
    });

/**
 * @ngdoc overview
 * @name encore.svcs.customerAdmin
 *
 * @description
 * Collection of configuration values for interacting with accounts and contacts in Customer Admin
 *
 * ## Children
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountResource CustomerAdminAccountResource}
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountStatusResource CustomerAdminAccountStatusResource}
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountContactResource CustomerAdminAccountContactResource}
 * - {@link encore.svcs.customerAdmin.contact.CustomerAdminContactResource CustomerAdminContactResource}
 *
 * ## API Information
 * For a full set of documentation pertaining to Customer Admin Service
 * please visit {@link https://customer-admin.staging.ord1.us.ci.rackspace.net/docs/devguide/content/Concepts.html
 * Customer Admin Developer Guide}
 */
angular.module('encore.svcs.customerAdmin', [
    'ngResource',
    'encore.util.transform',
    'encore.svcs.customerAdmin.account'
    ]);
angular.module('encore.svcs.customerAdmin')
    /**
     * @ngdoc service
     * @deprecated
     * @name encore.svcs.customerAdmin._deprecated.Account
     * @description
     * Account Service for interaction with CAS API
     *
     * ***This service has been deprecated, please switch to:***
     * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountResource CustomerAdminAccountResource}
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('Account', ["$resource", function ($resource) {
        return $resource('/api/customer-admin/customer_accounts/:type/:accountNumber',
            {
                accountNumber: '@number',
                type: '@type'
            },
            {
                get: {
                    cache: true,
                    params: {
                        type: 'CLOUD'
                    }
                }
            });
    }])
    // jshint maxlen: false
    /**
     * @ngdoc service
     * @deprecated
     * @name encore.svcs.customerAdmin._deprecated.Contact
     * @description
     * Contact Service for interaction with CAS API
     *
     * ***This service has been deprecated, please switch to:***
     * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountContactResource CustomerAdminAccountContactResource}
     * - {@link encore.svcs.customerAdmin.contact.CustomerAdminContactResource CustomerAdminContactResource}
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    // jshint maxlen: false
    .factory('Contact', ["$resource", "Pluck", function ($resource, Pluck) {
        var transformList = Pluck('contact');
        return $resource('/api/customer-admin/customer_accounts/:type/:accountNumber/contacts',
            {
                accountNumber: '@number',
                type: '@type'
            },
            {
                /**
                 * @ngdoc service
                 * @deprecated
                 * @name Contact#get
                 * @methodOf encore.svcs.customerAdmin._deprecated.Contact
                 * @description
                 *
                 * Get single Contact
                 * @example
                 * ```
                 * // get single Contact by contactNumber
                 * Contact.get({ contactNumber: 'RPN-189-207-481' });
                 * ```
                 */
                get: {
                    method: 'GET',
                    url: '/api/customer-admin/contacts/:contactNumber'
                },
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: transformList,
                    params: {
                        marker: 1,
                        limit: 10,
                        type: 'CLOUD'
                    }
                }
            }
        );
    }])
    /**
     * @ngdoc service
     * @deprecated
     * @name encore.svcs.customerAdmin._deprecated.ContactsTransform
     * @description
     * Customer Admin service returns a customer array that is directly translated from XML and now well formatted
     * to be easily used in JavaScript. ContactsTransformer transforms the response object into a more useful format.
     */
    .factory('ContactsTransform', ["Encore", function (Encore) {

        function concatenateName (first, last) {
            var name = '';

            first = (typeof first === 'string' ? first.trim() : '');
            last = (typeof last === 'string' ? last.trim() : '');
            if (first) {
                name += first + ' ';
            }

            if (last) {
                name += last;
            }

            return name.trim();
        }

        // Move primary to the front, strip out unneeded attributes, and return unique
        function transformEmails (emails) {
            var sortedEmails = _.sortBy(emails, function (email) { return !email.primary; });
            sortedEmails = sortedEmails.map(function (email) { return email.address.toLowerCase(); });
            return _.uniq(sortedEmails);
        }

        // Move primary to the front, strip out unneeded attributes, and return unique
        function transformAddresses (addresses) {
            var sortedAddresses = _.sortBy(addresses, function (address) { return !address.primary; });
            sortedAddresses = sortedAddresses.map(function (address) {
                return {
                    street: 'street' in address ? address.street.toLowerCase() : '',
                    city: 'city' in address ? address.city.toLowerCase() : '',
                    state: 'state' in address ? address.state.toLowerCase() : '',
                    zip: address.zipcode
                };
            });
            return _.uniqBy(sortedAddresses, function (address) { return address.street.toLowerCase(); });
        }

        // Strip out unneeded attributes, and return unique
        function transformPhones (phones) {
            var newPhones = phones.map(function (phone) {
                return {
                    formatted: phone.number
                        // Add a space after closing parens ex "(xxx)xxx" -> "(xxx) xxx"
                        .replace(/\)(\d)/, ') $1')
                        // Change xxx-xxx-xxxx format to (xxx) xxx-xxxx
                        .replace(/^(\d{3})-(\d{3}-)(.*)/, '($1) $2$3')
                        // Change xxx xxx xxxx format to (xxx) xxx-xxxx
                        .replace(/^(\d{3}) (\d{3}) (.*)/, '($1) $2-$3'),
                    raw: phone.number.replace(/\D/g, '')
                };
            });
            return _.uniqBy(newPhones, function (phone) { return phone.raw; });
        }

        function formatRoleName (role) {
            if (role.toLowerCase() === 'ftp') {
                return role.toUpperCase();
            } else {
                return role[0].toUpperCase() + role.slice(1).toLowerCase();
            }
        }

        // splitting roles into a new contact and add to contacts array
        function splitContactRoles(contact) {
            var contacts = [];
            if (contact && contact.role instanceof Array) {
                // If there are more than 1 role, split off the rest
                var roles = contact.role;
                _.each(roles, function (role) {
                    // Shove all the rest into a new, cloned contact and add to contacts array
                    var newContact = _.cloneDeep(contact);
                    newContact.role = role;
                    // split nested roles into new contacts;
                    if (role instanceof Array) {
                        var newContacts = splitContactRoles(newContact);
                        contacts = contacts.concat(newContacts);
                    } else {
                        contacts.push(newContact);
                    }
                });
            }
            return contacts;
        }

        /**
         * @ngdoc method
         * @name transform
         * @methodOf encore.svcs.customerAdmin._deprecated.ContactsTransform
         * @returns {object} Collection of transformed contacts keyed on each contact's role
         */
        this.transform = function (data) {
            if (!('contacts' in data && data.contacts instanceof Array)) {
                return data;
            }

            var contacts = data.contacts;

            // Organize relevant properties and remove extraneous
            _.each(contacts, function (contact, index) {

                var newContact = {
                    id: contact.id,
                    enabled: contact.enabled,
                    primary: contact.admin,
                    username: contact.username,
                    contactNumber: contact.contactNumber,
                    name: concatenateName(contact.firstName, contact.lastName),
                    showQA: false
                };

                // Set permission type - Custom, Read-only, Full, and Owner.
                if (contact.id) {
                    var rolesPromise = new Encore().$getIdentityRoles({ id: contact.id });
                    rolesPromise.then(function (data) {
                        var roles = data.roles;
                        if (_.some(roles, { name: 'identity:user-admin' })) {
                            newContact.permission = 'Owner';
                        } else if (_.some(roles, { name: 'admin' })) {
                            newContact.permission = 'Full';
                        } else if (_.some(roles, { name: 'observer' })) {
                            newContact.permission = 'Read';
                        } else {
                            newContact.permission = 'Custom';
                        }
                    });
                }

                if ('emailAddresses' in contact && 'emailAddress' in contact.emailAddresses) {
                    newContact.emails = transformEmails(contact.emailAddresses.emailAddress);
                    // Add user email to email list
                    if (contact.email) {
                        newContact.emails.push(contact.email);
                    }
                    // make unique email list since ng-repeat doesn't allow duplicates
                    newContact.emails = _.uniq(newContact.emails);
                }

                if ('addresses' in contact && 'address' in contact.addresses) {
                    newContact.addresses = transformAddresses(contact.addresses.address);
                }

                if ('phoneNumbers' in contact && 'phoneNumber' in contact.phoneNumbers) {
                    newContact.phones = transformPhones(contact.phoneNumbers.phoneNumber);
                }

                if ('roles' in contact && 'role' in contact.roles) {
                    var roles = _.map(contact.roles.role, formatRoleName);
                    newContact.role = roles;
                }

                contacts[index] = newContact;
            });

            // Split roles, duplicating contacts each into a single role
            _.each(contacts, function (contact) {
                var newContacts = splitContactRoles(contact);
                if (!_.isEmpty(newContacts)) {
                    contacts = contacts.concat(newContacts);
                    _.pull(contacts, contact);
                }
            });

            return contacts;
        };

        return this;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.customerAdmin.account
 *
 * @description
 * Services used for interacting with Accounts in the Customer Admin API
 *
 * ## Children
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountResource CustomerAdminAccountResource}
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountStatusResource CustomerAdminAccountStatusResource}
 * - {@link encore.svcs.customerAdmin.account.CustomerAdminAccountContactResource CustomerAdminAccountContactResource}
 *
 * ## API Information
 * For a full set of documentation pertaining to Customer Admin Service
 * please visit
 * {@link https://customer-admin.staging.ord1.us.ci.rackspace.net/docs/devguide/content/CustomerAccount_Operations.html
 * CAS Customer Account Developer Guide}
 */
angular.module('encore.svcs.customerAdmin.account', [
    'ngResource',
    'encore.svcs.util'
]);

angular.module('encore.svcs.customerAdmin.account')
    /**
     * @ngdoc service
     * @name encore.svcs.customerAdmin.account.CustomerAdminAccountContactResource
     * @description
     * Services based around listing contacts of the Admin account
     * @requires CustomerAdminAccountContactTransform A transform for easy use.
     */
    .factory('CustomerAdminAccountContactResource', ["$resource", "CustomerAdminAccountContactTransform", function ($resource, CustomerAdminAccountContactTransform) {

        return $resource('/api/customer-admin/customer_accounts/:type/:number/contacts',
            {
                type:'@type',
                number: '@number'
            },{
                /**
                 * @ngdoc method
                 * @name CustomerAdminAccountContactResource#list
                 * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountContactResource
                 * @param {object} params Parameters Object
                 * @param {string} params.type Type of account
                 *                              * `CLOUD`
                 *                              * `MANAGED_HOSTING`
                 * @param {number} params.number Account Number
                 * @description
                 * Returns a list of contacts associated with given account number
                 * @example
                 * <pre>
                 * // get a list of contacts by number
                 * CustomerAdminAccountContactResource.list({ type: 'CLOUD', number: 12345 });
                 * </pre>
                 * <pre>
                 * [{
                 *     addresses: {
                 *         address: [{
                 *             city: "Sioux Falls",
                 *             country: "US",
                 *             customer_admin:matchStatus: "V4",
                 *             primary: true,
                 *             state: "South Dakota",
                 *             statecode: "SD",
                 *             street: "5000 Walzem RD",
                 *             zipcode: "57109-1205"}
                 *         ]
                 *     }
                 *     contactNumber: "RPN-817-094-592",
                 *     customer_admin:legacyId: "57316",
                 *     emailAddresses: {
                 *         emailAddress: [{
                 *             address: "admin.contact@tst.com",
                 *             primary: true}
                 *         ]
                 *     },
                 *     firstName: "Administrative",
                 *     lastName: "Contact",
                 *     lastUpdatedBy: "CIS_API",
                 *     lastUpdatedDate: "2015-08-10T17:06:17.385Z",
                 *     phoneNumbers: {
                 *         phoneNumber: [{
                 *             country: "US",
                 *             mask: "(###) ###-#### x############",
                 *             number: "210-447-4743"}
                 *         ]
                 *     },
                 *     roles: {
                 *         customerAccountRole: [{
                 *             customerAccountNumber: "323676",
                 *             customerAccountType: "CLOUD",
                 *             customerType: "RESELLER",
                 *             rcn: "RCN-000-065-068",
                 *             value: "PRIMARY"}
                 *         ]
                 *     },
                 *     username: "hub_cap"
                 * }, { ...}]
                 *
               * </pre>
                 */
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: CustomerAdminAccountContactTransform.list
                }
            });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.customerAdmin.CustomerAdminAccountContactTransform
     * @description
     * Customer Admin service returns a customer array that is directly translated from XML and now well formatted
     * to be easily used in JavaScript. Transformer transforms the response object into a more useful format.
     */
    .factory('CustomerAdminAccountContactTransform', ["TransformUtil", function (TransformUtil) {
        var contactPluckList = TransformUtil.pluckList('contact');

        return {
            list: TransformUtil.responseChain(contactPluckList)
        };
    }]);

angular.module('encore.svcs.customerAdmin.account')
    /**
     * @ngdoc service
     * @name encore.svcs.customerAdmin.account.CustomerAdminAccountResource
     * @description
     * Services based around getting and updating the customers admin account.
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('CustomerAdminAccountResource', ["$resource", "ACCOUNT_INSTRUCTIONS_TITLE", "ACCOUNT_URLS", "ACCOUNT_DISPLAY_TYPE", "URLUtil", function ($resource, ACCOUNT_INSTRUCTIONS_TITLE,
                                                        ACCOUNT_URLS, ACCOUNT_DISPLAY_TYPE, URLUtil) {
        var account = $resource('/api/customer-admin/customer_accounts/:type/:number',
            {
                type: '@type',
                number: '@number'
            }, {
                /**
                 * @ngdoc method
                 * @name CustomerAdminAccountResource#get
                 * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
                 * @param {object} params Parameters Object
                 * @param {string} params.type Type of account
                 *                              * `CLOUD`
                 *                              * `MANAGED_HOSTING`
                 * @param {number} params.number Account Number
                 * @description
                 * Get an account details
                 * @example
                 * # GET information detailing given account number
                 * <pre>
                 * CustomerAdminAccountResource.get({ type: 'cloud', number: 323676 });
                 * </pre>
                 * <pre>
                 * {
                 *     'accessPolicy': 'FULL',
                 *     'createdDate': '2006-01-31T11:49:30.863Z',
                 *     'lastUpdatedBy': 'qe_encloud_lvl3',
                 *     'lastUpdatedDate': '2015-09-18T16:08:38.353Z',
                 *     'name': 'Hub Cap III',
                 *     'number': 465629,
                 *     'rcn': 'RCN-000-065-068',
                 *     'status': 'Active',
                 *     'type': 'CLOUD'
                 * }
                 * <pre>
                 */

                /**
                 * @ngdoc method
                 * @name CustomerAdminAccountResource#update
                 * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
                 * @param {object} params Parameters Object
                 * @param {string} params.type Type of account
                 *                              * `CLOUD`
                 *                              * `MANAGED_HOSTING`
                 * @param {number} params.number Account Number
                 * @description
                 * Updates the given account with details
                 * @example
                 * <pre>
                 * CustomerAdminAccountResource.update({ type: 'cloud', number: 323676 }, details);
                 * </pre>
                 * <pre>
                 *  No response given
                 * </pre>
                 * # Or
                 * <pre>
                 * var account = CustomerAdminResource.get()
                 * account.status = 'INACTIVE';
                 * account.$update();
                 * </pre>
                 * <pre>
                 *  No response given
                 * </pre>
                 */
                update: {
                    method: 'PUT'
                }
            }
        );
        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#isCloud
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns whether or not an account is a cloud account
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.isCloud();
         * </pre>
         * <pre>
         * true
         * </pre>
         */
        account.prototype.isCloud = function () {
            return this.getType() === 'cloud';
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#isManagedHosting
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns whether or not an account is a managed hosting account
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.isManagedHosting();
         * </pre>
         * <pre>
         * false
         * </pre>
         */
        account.prototype.isManagedHosting = function () {
            return this.getType() === 'managed_hosting';
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getType
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns lowercase of the type
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getType();
         * </pre>
         * <pre>
         * cloud
         * </pre>
         */
        account.prototype.getType = function () {
            return this.type ? this.type.toLowerCase() : '';
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getDisplayType
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns label for displaying the account type in the UI (Cloud or Dedicated).
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getDisplayType();
         * </pre>
         * <pre>
         * Cloud
         * </pre>
         */
        account.prototype.getDisplayType = function () {
            return ACCOUNT_DISPLAY_TYPE[this.getType()];
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getInstructionsTitle
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the titling for instructions depending on the account type
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getInstructionsTitle();
         * </pre>
         * <pre>
         * Instructions
         * </pre>
         */
        account.prototype.getInstructionsTitle = function () {
            return ACCOUNT_INSTRUCTIONS_TITLE[this.getType()];
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getAccountURL
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the appropriate Encore or CORE account details URL for this account
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getAccountURL();
         * </pre>
         * <pre>
         * /accounts/323676
         * </pre>
         */
        account.prototype.getAccountURL = function () {

            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.account, { accountNumber: this.number });
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getTicketURL
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the appropriate Encore or CORE account details URL for the given ticket for this account
         *
         * @param {String} ticketID  The ID for the ticket
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getTicketURL(12345);
         * </pre>
         * <pre>
         * /ticketing/ticket/12345
         * </pre>
         */
        account.prototype.getTicketURL = function (ticketId) {
            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.ticket, { ticketId: ticketId });
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getAllTicketsURL
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the appropriate Encore or CORE "all tickets" URL for this account
         *
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getAllTicketsURL();
         * </pre>
         * <pre>
         * /ticketing/account/323676
         * </pre>
         */
        account.prototype.getAllTicketsURL = function () {
            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.allTickets, { accountNumber: this.number });
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getBillingURL
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the appropriate Billing URL for this account
         *
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 123456, type: 'managed_hosting' });
         * account.getBillingURL();
         * </pre>
         * <pre>
         * /billing/MANAGED_HOSTING/123456
         * </pre>
         */
        account.prototype.getBillingURL = function () {
            return '/billing/' + this.getType().toUpperCase() + '/' + this.number;
        };

        /**
         * @ngdoc method
         * @name CustomerAdminAccountResource#getNotificationCenterURL
         * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountResource
         * @description
         * Returns the appropriate Notification Center URL for this account
         *
         * @example
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getNotificationCenterURL();
         * </pre>
         * <pre>
         * /notification-center/cloud:323676
         * </pre>
         * <pre>
         * var account = new CustomerAdminAccountResource({ number: 323676, type: 'cloud' });
         * account.getNotificationCenterURL('123456789');
         * </pre>
         * <pre>
         * /notification-center/cloud:323676?notification=123456789
         * </pre>

         */
        account.prototype.getNotificationCenterURL = function (notificationId) {
            var accountType = this.getType();
            // notification center uses the term `hybrid` for managed hosting accounts
            if (accountType === 'managed_hosting') {
                accountType = 'hybrid';
            }

            // Note: can't use the URLUtil because of the colon in the URL
            var url = '/notification-center/' + accountType + ':' + this.number;
            if (!_.isEmpty(notificationId)) {
                 url += '?notification=' + notificationId;
            }
            return url;
        };

        return account;
    }]);

angular.module('encore.svcs.customerAdmin.account')
    /**
     * @ngdoc service
     * @name encore.svcs.customerAdmin.account.CustomerAdminAccountStatusResource
     * @description
     * Services based around getting statuses and getting status history
     * @requires $http - AngularJS service to transform responses in a default manner.
     */
    .factory('CustomerAdminAccountStatusResource', ["$resource", "TransformUtil", function ($resource, TransformUtil) {

        return $resource('/api/customer-admin/customer_accounts/:type/:number/status_history',
            {
                type: '@type',
                number: '@number'
            },{
            /**
             * @ngdoc method
             * @name CustomerAdminAccountStatusResource#list
             * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountStatusResource
             * @description
             * Returns an array of statuses
             * @example
             * <pre>
             * CustomerAdminAccountStatusResource.list();
             * </pre>
             * <pre>
             * [
             *     {
             *         status: 'Active',
             *         type: 'CLOUD'
             *     },{
             *         status: 'Approval Denied',
             *         type: 'CLOUD'
             *     }
             * ]
             * </pre>
             */
            list: {
                method: 'GET',
                isArray: true,
                url: '/api/customer-admin/account_statuses',
                transformResponse: TransformUtil.responseChain(TransformUtil.pluckList('status'))
            },
            /**
             * @ngdoc method
             * @name CustomerAdminAccountStatusResource#getHistory
             * @methodOf encore.svcs.customerAdmin.account.CustomerAdminAccountStatusResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @example
             * <pre>
             * CustomerAdminAccountStatusResource.getHistory({ number: 323673, type: 'cloud' });
             * </pre>
             * <pre>
             * [
             *     {
             *         'status': 'Active',
             *         'date': '2014-12-11T23:31:04.504Z',
             *         'username': 'ajay6704'
             *     },
             *     {
             *         'status': 'Delinquent',
             *         'date': '2014-12-11T23:30:48.801Z',
             *         'username': 'ajay6704'
             *     },
             *     {
             *         'status': 'Active',
             *         'date': '2014-12-09T20:41:23.827Z',
             *         'username': 'ajay6704'
             *     }
             * ]
             * </pre>
             * @description
             * Returns the Account Status History of given account number
             */
            getHistory: {
                isArray: true,
                method: 'GET',
                transformResponse: TransformUtil.responseChain(TransformUtil.pluckList('statusChange'))
            }
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.customerAdmin.contact
 *
 * @description
 * Services used for interacting with Contacts in the Customer Admin API
 *
 * ## Children
 * - {@link encore.svcs.customerAdmin.contact.CustomerAdminContactResource CustomerAdminContactResource}
 *
 * ## API Information
 * For a full set of documentation pertaining to Customer Admin Service
 * please visit
 * {@link https://customer-admin.staging.ord1.us.ci.rackspace.net/docs/devguide/content/Contact_Operations.html
 * CAS Contact Developer Guide}
 */
angular.module('encore.svcs.customerAdmin.contact', [
    'ngResource',
    'encore.svcs.util'
]);

angular.module('encore.svcs.customerAdmin.contact')
    /**
     * @ngdoc service
     * @name encore.svcs.customerAdmin.contact.CustomerAdminContactResource
     * @description
     * Contact Service for interaction with CAS API pulls only one contact
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * <pre>
     * {
     *     'firstName': 'Mike',
     *     'lastName': 'Billing',
     *     'contactNumber': 'RPN-189-207-481'
     * }
     * </pre>
     */
    .factory('CustomerAdminContactResource', ["$resource", function ($resource) {
        return $resource('/api/customer-admin/contacts/:contactNumber',
        {
            contactNumber: '@contactNumber'
        }, {
            /**
             * @ngdoc method
             * @name CustomerAdminContactResource#get
             * @methodOf encore.svcs.customerAdmin.contact.CustomerAdminContactResource
             * @param {object} params Parameters Object
             * @param {number} params.contactNumber Contact Number
             * @description
             * Returns a single contacts information given the contact number
             * @example
             * <pre>
             * // get single Contact by contactNumber
             * CustomerAdminContactResource.get({ contactNumber: 'RPN-189-207-481' });
             * </pre>
             * <pre>
             * {
             *     "lastName": "Doe",
             *     "contactNumber": "RPN-823-034-233",
             *     "customer_admin:legacyId": "26362636",
             *     "phoneNumbers": {
             *         "phoneNumber": [{
             *             "mask": "(###)-###-####",
             *             "number": "6758783848",
             *             "country": "US"
             *             }]
             *     },
             *     "suffix": "Senior",
             *     "username": "john0982",
             *     "title": "Mr",
             *     "roles": {
             *         "customerAccountRole": [{
             *                 "rcn": "RCN-999-888-777",
             *                 "value": "BILLING",
             *                 "customerAccountNumber": "7483483",
             *                 "customerAccountType": "CLOUD"
             *             }]
             *     },
             *     "lastUpdatedBy": "user1",
             *     "lastUpdatedDate": "2015-04-21T18:00:00.000Z",
             *     "addresses": {
             *         "address": [{
             *         "customer_admin:matchStatus": "V4",
             *         "zipcode": "78366",
             *         "street": "1 Dezavala Place",
             *         "primary": true,
             *         "state": "Texas",
             *         "country": "US",
             *         "city": "San Francisco"
             *         }, {
             *         "customer_admin:matchStatus": "C4",
             *         "zipcode": "78366",
             *         "street": "1 market place",
             *         "state": "Texas",
             *         "country": "US",
             *         "city": "The Boggle"
             *         }]
             *     },
             *     "firstName": "John",
             *     "emailAddresses": {
             *         "emailAddress": [{
             *             "address": "john.doe@incogneeto.com",
             *             "primary": true
             *             }]
             *     }
             * }
             * </pre>
             */
        });
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.djinn
 *
 * @description
 * Services used for Djinn interaction
 */
angular.module('encore.svcs.djinn', ['encore.svcs.djinn.config']);

/**
 * @ngdoc overview
 * @name encore.svcs.djinn.config
 *
 * @description
 * Collection of configuration values for interacting with Djinn services.
 */
angular.module('encore.svcs.djinn.config', [])
    /**
     * @ngdoc property
     * @const DJINN_MDW_URL
     * @name encore.svcs.djinn.config.constant:DJINN_MDW_URL
     * @description
     *
     * Constant for middleware URL path for djinn services.
     */
     .constant('DJINN_MDW_URL', '/api/djinn')
     .constant('DJINN_ENABLED', 'djinn-enabled');

angular.module('encore.svcs.djinn')
    /* globals djinn */
    /**
     * @ngdoc service
     * @name encore.svcs.djinn.DjinnService
     * @description
     * Methods used for interacting with the djinn-browser-lib
     */
    .factory('DjinnService', ["$q", "Environment", "DJINN_MDW_URL", function ($q, Environment, DJINN_MDW_URL) {
        var djinnObj, currentConfig;
        var running = false;

        var getConfig = function (userId, token) {
            var djinnUrl = DJINN_MDW_URL;

            //salt-pillar has no localhost
            if (Environment.isLocal()) {
                djinnUrl = 'https://127.0.0.1:8001';
            }

            return {
                url: djinnUrl,
                headers: {
                    'x-user': userId,
                    'x-auth': token,
                    'x-domain': 'encore',
                    'x-clientType': 'browser'
                }
            };
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnService#isRunning
         * @methodOf encore.svcs.djinn.DjinnService
         * @description
         * A simple getter function that returns the boolean value of 'running'
         *
         * @returns {boolean} running: if Djinn is running or not
         * @example
         * <pre>
            if (!DjinnService.isRunning()) {
                Djinn.run();
            }
         * </pre>
         */
        var isRunning = function () {
            return running === true;
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnService#run
         * @methodOf encore.svcs.djinn.DjinnService
         * @param {string} userId SSO id for current user session
         * @param {string} token token for current session
         * @description
         * When called this function creates an instance of Djinn
         * then wraps a promise with the event emitter "on".
         *
         * @returns {object} promise: a promisifed callback
         * @example
         * <pre>
            Djinn.run('jon', '123145aaa');
         * </pre>
         */
        var run = function (userId, token) {
            var deferred = $q.defer();

            if (!isRunning()) {
                currentConfig = getConfig(userId, token);
                djinnObj = new djinn(currentConfig, window);
                djinnObj.once('socket:ready', function () {
                    djinnObj.findPeer(function () {
                        djinnObj.once('peer:ready', function () {
                            djinnObj.removeAllListeners('peer:fail');
                            running = true;
                            deferred.resolve({});
                        });

                        djinnObj.once('peer:fail', function (errMsg) {
                            djinnObj.removeAllListeners('peer:ready');
                            running = false;
                            deferred.reject(errMsg);
                        });
                    });
                });

            } else {
                // if djinnObj exists then resolve
                // Since we cant guarantee the state
                // this addition allows us to run this
                // function over and over without taking
                // the performance hit.
                deferred.resolve();
            }

            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnService#getActions
         * @methodOf encore.svcs.djinn.DjinnService
         * @param {string} resourceType  what type of djinn resources
         * @param {boolean} prefab changes the filters to look for prefabs or not
         * @description
         * Calls the getActions function of Djinn wrapped
         * in a promise for easy injestion.
         * When returned:
            Status    "Ok",
            Code    0, (not 0 if error)
            Msg    "",
            Details    null,
            Data    {
                "actions": [{},{}, ...]
            }
         * @returns {object} promise: a promisifed callback
         * @example
         * <pre>
         *  var actionPromise = DjinnService.getActions();
         * </pre>
         */
        var getActions = function (resourceType, prefab) {
            var deferred = $q.defer();

            /*
             * Djinn actions in the config file is mixture of core and encore
             * actions. An action may have a resource type (Ticket.Ticket, Account.Account, Server)
             * and a type (execute, prefab, etc.)
             * when user calls getActions method, we want to filter actions to
             * specified resourceType and action type.
             * Here, by default, encore is the action domain.
             * If resource type is specified, we want to ensure the action has resource type
             * specified by the user. If prefab flag is set to true, we want to return this action
             * if and only if it is action type of prefab. If set to false, we want to get non-prefab
             * actions only.
             */
            var encoreFilter = function (action) {
                return _.includes(action.domains, 'encore') &&
                    (resourceType ? _.includes(action.resources, resourceType) : true) &&
                    (prefab ? action.type === 'prefab' : action.type !== 'prefab');
            };

            djinnObj.once('getActions:ready', function (res) {
                djinnObj.removeAllListeners('getActions:fail');
                deferred.resolve(res);
            });

            djinnObj.once('getActions:fail', function (res) {
                djinnObj.removeAllListeners('getActions:ready');
                deferred.reject(res);
            });

            djinnObj.getActions(encoreFilter);

            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnService#doAction
         * @methodOf encore.svcs.djinn.DjinnService
         * @param {string} actionId  The Id of the action you wish to process
         * @param {object} bundleMsgData (optional) Data to send to the binary for processing
         * @description
         * Calls the doAction function of Djinn wrapped
         * in a promise for easy injestion.
         * When returned:
            Status    "Ok",
            Code    0, (not 0 if error)
            Msg    "",
            Details    null,
            Data    {}
         * @returns {object} promise: a promisifed callback
         * @example
         * <pre>
         *  var actionPromise = DjinnService.doAction('a12-23action-ID-333');
         *  var actionPromise = DjinnService.doAction('a12-23action-ID-333', { id: '123456-12345' });
         * </pre>
         */
        var doAction = function (actionId, bmd) {
            var bundledMsgData = (bmd === null || typeof bmd === 'undefined') ? {} : bmd;
            var deferred = $q.defer();

            bundledMsgData.token = currentConfig.headers['x-auth'];

            djinnObj.once('doAction:ready', function (res) {
                djinnObj.removeAllListeners('doAction:fail');
                deferred.resolve(res);
            });

            djinnObj.once('doAction:fail', function (res) {
                djinnObj.removeAllListeners('doAction:ready');
                deferred.reject(res);
            });

            djinnObj.doAction(actionId, bundledMsgData);

            return deferred.promise;
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnService#handleDjinnFailures
         * @methodOf encore.svcs.djinn.DjinnService
         * @description
         * This function wraps a promise around error events emitted by Djinn.
         * This function is meant to be called once per error emitted, and the
         * caller should call this function again if it wants to catch another
         * error emitted in its life cycle. For e.g. if a 'socket:disconnect'
         * is thrown, user may want to call this function again to catch 'socket:fail'
         * or 'peer:disconnect' errors.
         *
         * @returns {object} promise: a promisified callback
         * @example
         * <pre>
            var failurePromise = DjinnService.handleDjinnFailures();
            failurePromise.then(function (res) {
                // handle the result
            }).catch(function (error) {
                // handle any unexpected errors such as undefined error
          });
         * </pre>
         */
        var handleDjinnFailures = function () {
            var deferred = $q.defer();
            var errorTypes = ['socket:disconnect', 'socket:fail', 'peer:disconnect'];
            var removeErrorListeners = function () {
                _.each(errorTypes, function (errorType) {
                    djinnObj.removeAllListeners(errorType);
                });
            };

            _.each(errorTypes, function (errEmitted) {
                djinnObj.once(errEmitted, function (errMsg) {
                    // when we refresh the page, socket:disconnect, msg === 'io client disconnect' is emitted.
                    // we want to avoid catching that error.
                    if (errEmitted === 'socket:disconnect' && errMsg !== 'io client disconnect'){
                        deferred.resolve({ 'Msg': 'Djinn middleware disconnected!' });
                        removeErrorListeners();
                    } else if (errEmitted !== 'socket:disconnect') {
                        deferred.resolve(errMsg);
                        removeErrorListeners();
                    }
                });
            });

            return deferred.promise;
        };

        return {
            doAction: doAction,
            getActions: getActions,
            isRunning: isRunning,
            run: run,
            handleDjinnFailures: handleDjinnFailures
        };
    }]);

angular.module('encore.svcs.djinn')
    /**
     * @ngdoc service
     * @name encore.svcs.djinn.DjinnUtil
     * @description
     * Methods used for interacting with the djinn-browser-lib
     */
    .factory('DjinnUtil', ["$q", "rxLocalStorage", "DJINN_ENABLED", function ($q, rxLocalStorage, DJINN_ENABLED) {
        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnUtil#getEnabled
         * @methodOf encore.svcs.djinn.DjinnUtil
         * @description
         * Determines if djinn is enabled
         *
         * @returns {boolean} enabled: if Djinn is enabled or not
         * @example
         * <pre>
            if (DjinnUtil.getEnabled()) {
                Djinn.run();
            }
         * </pre>
         */
        var getEnabled = function () {
            return rxLocalStorage.getItem(DJINN_ENABLED) === 'true';
        };

        /**
         * @ngdoc method
         * @name encore.svcs.djinn.DjinnUtil#toggleEnabled
         * @methodOf encore.svcs.djinn.DjinnUtil
         * @description
         * Toggles the Enabled State of Djinn
         *
         * @returns {boolean} value: new enabled state of djinn
         * @example
         * <pre>
            var state = DjinnUtil.toggleEnabled();
         * </pre>
         */
        var toggleEnabled = function () {
            var value = rxLocalStorage.getItem(DJINN_ENABLED) === 'true' ? 'false': 'true';
            rxLocalStorage.setItem(DJINN_ENABLED, value);

            return value;
        };

        return {
            getEnabled: getEnabled,
            toggleEnabled: toggleEnabled
        };
    }]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.encore', [
    'ngResource',
    'encore.util.transform'
]);

angular.module('encore.svcs.encore')
    /**
     * @ngdoc service
     * @name encore.svcs.encore.Encore
     * @deprecated This service will be removed in a future release of the code base.
     * @description
     * Service for interacting with the EncoreAPI
     *
     * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
     * @requires $cacheFactory - AngularJS service to control over caching responses
     * @requires encore.svcs.encore:EncoreTransformer - Service to create a data transform, to only
     *                       return data at a specific path, mainly used on the response, or convert
     *                       data returned
     * @requires encore.util.transform.Transform - SupportService generic service with common transforms
     *                                             Used in SupportService calls
     */
    .factory('Encore', ["$resource", "$cacheFactory", "EncoreTransformer", "Transform", function ($resource, $cacheFactory, EncoreTransformer, Transform) {
        /*
        #TODO
        This Resource needs to be split up and conformed with the standards on
        https://github.com/rackerlabs/encore-ui-svcs#resource-factory
        */
        return $resource('/api/encore/:action/:subaction/:id/:method',
            {
                id: '@id',
                action: 'accounts'
            },
            {
                search: {
                    method: 'GET',
                    params: {
                        term: '@id',
                        action: 'search'
                    }
                },
                getAccount: {
                    method: 'GET',
                    transformResponse: EncoreTransformer.customTransformResponse('convertRoles')
                },
                getAccountUsers: {
                    method: 'GET',
                    params: {
                        action: 'accounts',
                        method: 'users'
                    }
                },
                getAccountAdmin: {
                    method: 'GET',
                    cache: true,
                    params: {
                        action: 'accounts',
                        method: 'admin-user'
                    }
                },
                getAccountNotes: {
                    method: 'GET',
                    params: {
                        action: 'accounts',
                        method: 'notes'
                    }
                },
                getUsersContacts: {
                    method: 'GET',
                    params: {
                        action: 'accounts',
                        method: 'users-contacts'
                    },
                },
                getAccountByIdentityUsername: {
                    method: 'GET',
                    params: {
                        action: 'users',
                        method: 'account'
                    },
                    cache: $cacheFactory('encore-account-identity')
                },
                /**
                 * @ngdoc service
                 * @name Encore#getAPIKey
                 * @methodOf encore.svcs.encore.Encore
                 * @description
                 *
                 * Get User API key
                 * @example
                 * ```
                 * // get API Key for particular user
                 * Encore.getAPIKey({ id: 123 });
                 * ```
                 */
                getAPIKey: {
                    method: 'GET',
                    params: {
                        action: 'accounts',
                        method: 'api-key'
                    }
                },
                /**
                 * @ngdoc service
                 * @name Encore#getQuestions
                 * @methodOf encore.svcs.encore.Encore
                 * @param {number} id - account number
                 * @description
                 *
                 * Get all users' secret questions and answers for a particular account
                 * @example
                 * ``
                 * Encore.getQuestions({ id: 323676 });
                 * ``
                 */
                getQuestions: {
                    method: 'GET',
                    params: {
                        method: 'questions'
                    },
                    transformResponse: EncoreTransformer.customTransformResponse('convertQuestions')
                },
                getTeam: {
                    method: 'GET',
                    isArray: false,
                    params: {
                        action: 'teams',
                        method: null
                    },
                    transformResponse: EncoreTransformer.customTransformResponse('convertRoles')
                },
                getAllTeams: {
                    method: 'GET',
                    isArray: true,
                    cache: true,
                    params: { action: 'teams' },
                    transformResponse: Transform.customTransform('teams')
                },
                getTeamAccounts: {
                    method: 'GET',
                    isArray: true,
                    param: {
                        action: 'teams',
                        method: 'accounts'
                    }
                },
                getTeamUsers: {
                    method: 'GET',
                    isArray: true,
                    param: {
                        action: 'teams',
                        method: 'users'
                    }
                },
                getGroups: {
                    method: 'GET',
                    params: {
                        action: 'groups',
                    }
                },
                getIdentityRoles: {
                    method: 'GET',
                    params: {
                        action: 'identity',
                        method: 'roles'
                    }
                },
                getUserSecretQuestion: {
                    method: 'GET',
                    params: {
                        action: 'users',
                        method: 'question'
                    }
                },
                updateUser: {
                    method: 'POST',
                    params: {
                        action: 'users'
                    }
                },
                /**
                 * @ngdoc service
                 * @name Encore#updateUserSecretQuestion
                 * @methodOf encore.svcs.encore.Encore
                 * @description
                 *
                 * Service for updating a user's secret question and/or answer
                 */
                updateUserSecretQuestion: {
                    method: 'PUT',
                    params: {
                        action: 'users',
                        method: 'question'
                    }
                },
                /**
                 * @name Encore#updateEmails
                 * @methodOf encore.svcs.encore.Encore
                 * @description
                 *
                 * updates a user's email address
                 */
                updateEmails: {
                    method: 'PUT',
                    params: {
                        action: 'accounts',
                        subaction: 'contact',
                        method: 'update-emails'
                    }
                },
                /**
                 * @ngdoc service
                 * @name Encore#addUserRole
                 * @methodOf encore.svcs.encore.Encore
                 * @description
                 *
                 * Service for adding a role to users
                 */
                addUserRole: {
                    method: 'PUT',
                    params: {
                        action: undefined,
                        roleId: '@roleId'
                    },
                    url: '/api/encore/users/:id/add-role/:roleId'
                }
            }
        );
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.encore.EncoreTransformer
     * @requires $http
     * @description
     * Service for transforming responses for different type of Encore API calls.
     */
    .factory('EncoreTransformer', ["$http", function ($http) {
        var svc = {};

        svc.customTransformResponse = function (transform) {
            return $http.defaults.transformResponse.concat([svc[transform]]);
        };

        svc.convertQuestions = function (data) {
            var map = {};

            _.each(data.questions, function (question) {
                map[question.userId] = question;
            });

            return map;
        };

        svc.convertRoles = function (data) {
            if (!_.has(data, 'roles') || _.isEmpty(data.roles)) {
                return data;
            }

            var roles = [];
            _.forEach(data.roles, function (obj) {
                var existingRole = _.find(roles, { name: obj.role.name });
                if (!_.isEmpty(existingRole)) {
                    existingRole.users.push(obj.user);
                    return;
                }

                roles.push({
                    name: obj.role.name,
                    users: [ obj.user ]
                });
            });

            data.roles = roles;
            return data;
        };

        return svc;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.encore.AccountStatusGroup
     * @description Given an account status string (Encore.getAccount() -> account.status),
     * this function returns whether or not it's a "warning" status, and "info" status, or
     * returns an empty string if there's nothing important about the status.
     */
    .factory('AccountStatusGroup', function () {
        var warning = ['suspended', 'aup violation', 'delinquent'];
        var info = ['pending approval', 'approval denied', 'unverified', 'pending migration',
                    'teststatus', 'terminated'];

        return function (statusText) {
            if (!statusText) {
                return '';
            }

            var lower = statusText.toLowerCase();
            if (_.includes(warning, lower)) {
                return 'warning';
            } else if (_.includes(info, lower)) {
                return 'info';
            }
            return '';
        };
    });

// TODO: `@ngdoc overview`
angular.module('encore.svcs.encore.identity', [
    'ngResource'
]);

angular.module('encore.svcs.encore.identity')
    /**
     * @ngdoc service
     * @name encore.svcs.encore.identity.EncoreIdentityUserResource
     * @description
     * Service for interacting with the Node API's Identity
     *
     * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
     * @param {string} userId - signifies the user id
     * @example
     * <pre>
     * // get user information
     * EncoreIdentityUserResource.get({ userId: 123 });
     * </pre>
     */
     .factory('EncoreIdentityUserResource', ["$resource", function ($resource) {
        return $resource('/api/encore/identity/users/:userId/:action',
        {
            userId: '@user.id',
        },
        {
            /**
             * @ngdoc service
             * @name EncoreIdentityUserResource#getUserAPIKey
             * @methodOf encore.svcs.encore.identity.EncoreIdentityUserResource
             * @description
             *
             * Get User API key from Identity User API
             * @param {string} userId - signifies the user id
             * @example
             * <pre>
             * // get API Key for particular user
             * EncoreIdentityUserResource.getUserAPIKey({ userId: 123 });
             *
             * var user = EncoreIdentityUserResource.get({ userId: 123 });
             * user.$getUserAPIKey();
             * </pre>
             */
            getUserAPIKey: {
                method: 'GET',
                params: {
                    action: 'api-key'
                }
            }
        });
     }]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.encore.user', [
    'encore.svcs.encore'
]);

angular.module('encore.svcs.encore.user')
    /**
     * @ngdoc service
     * @name encore.svcs.encore.user.EncoreUserService
     * @description
     *     Service object for custom interactions with the EncoreUserResource,
     *     allowing applications only worry about method parameters
     *     rather than API contracts
     */
    .factory('EncoreUserService', ["Encore", function (Encore) {
        return {
             /**
             * @ngdoc method
             * @name EncoreUserService#updatePassword
             * @requires encore.svcs.encore.Encore
             * @methodOf encore.svcs.encore.user.EncoreUserService
             * @description
             *     Creates a wrapper for updating a user's password
             *     using the existing EncoreUserResource.update call
             *
             * @param {number|String} userId - The user's id
             * @param {string} username - The user's username
             * @param {string} password - The new password
             */
            updatePassword: function (userId, username, password) {
                var urlParams = {
                    action: 'users',
                    id: userId
                };
                var requestBody = {
                    'user': {
                        'username': username,
                         'OS-KSADM:password': password
                    }
                };

                return Encore.updateUser(urlParams, requestBody).$promise;
            }
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.feedback
 *
 * @description
 * Collection of services used for interacting with Feedback Directive in encore-ui
 */
angular.module('encore.svcs.feedback', [
   'encore.svcs.util.url'
]);
angular.module('encore.svcs.feedback')
    /**
     * @ngdoc property
     * @name encore.svcs.feedback.constant.DEFAULT_FEEDBACK_URL
     * @description
     *
     * Base default URL for all Feedback Redirects
     */
    .constant('DEFAULT_FEEDBACK_URL', 'https://get.feedback.rackspace.com/forums/297396')
    /**
     * @ngdoc service
     * @name encore.svcs.feedback.FeedbackRedirectService
     * @requires $http
     * @requires $interval
     * @requires $window
     * @requires encore.svcs.feedback.constant.DEFAULT_FEEDBACK_URL
     * @requires encore.svcs.util.url.URLUtil
     * @requires encore.svcs.feedback.FeedbackRoutesService
     * @description
     *
     * Returns a service for managing the state of fetching, opening, or canceling redirected routes
     */
    .factory('FeedbackRedirectService', ["$http", "$interval", "$window", "DEFAULT_FEEDBACK_URL", "URLUtil", "FeedbackRoutesService", function ($http, $interval, $window, DEFAULT_FEEDBACK_URL,
            URLUtil, FeedbackRoutesService) {

        var defaultCategoryPrefix = 'category';
        var timeout = 500;
        var openPromise;

        // Construct the user voice URL along with the proper mapping suffix if needed
        var getMatchedRoute = function getMatchedRoute (mapping) {
            // Grab the base url in case it has changed from CDN
            var url = mapping.base || DEFAULT_FEEDBACK_URL;
            // Override the length of the redirect timeout
            timeout = mapping.timeout || timeout;
            // Check if we have the category ID for the route
            var route = URLUtil.getBase();

            if (_.has(mapping, route)) {
                // if we have a full static URL just use it
                if (_.includes(mapping[route], 'http')) {
                    url = mapping[route];
                } else {
                    url += '/' + (mapping.categoryPrefix || defaultCategoryPrefix) + '/' + mapping[route];
                }
            }
            return url;
        };

        // Open a new window with the defined route
        var openWindow = function (route) {
            // reset the open window promise
            openPromise = $interval(function () {
                $window.open(route, '_blank');
            }, timeout, 1, false);

            // Let's return the route for any other functions to use it
            return route;
        };

        /**
         * @ngdoc method
         * @name FeedbackRedirectService#cancel
         * @methodOf encore.svcs.feedback.FeedbackRedirectService
         * @description
         *
         * Cancels any intervals for opening a window.
         *
         * @example
         * Use anywhere you want to cancel any possible intervals still running
         * <pre>
         * // Append the `$routeChangeSuccess` event to cancel any opening windows
         * scope.$root.$on('$routeChangeSuccess', FeedbackRedirectService.cancel);
         * </pre>
         */
        var cancel = function cancelWindow () {
            if (openPromise) {
                $interval.cancel(openPromise);
            }
            openPromise = undefined;
        };

        /**
         * @ngdoc method
         * @name FeedbackRedirectService#fetch
         * @methodOf encore.svcs.feedback.FeedbackRedirectService
         * @return {promise} Promise from {@link encore.svcs.feedback.FeedbackRoutesService#get
         *  FeedbackRoutesService#get}.  On success will return the mapping for the routes to the feedback site
         * @description
         *
         * Calls {@link encore.svcs.feedback.FeedbackRedirectService#cancel FeedbackRedirectService#cancel} in
         * case any routes are being opened, then calls {@link encore.svcs.feedback.FeedbackRoutesService#get
         * FeedbackRoutesService#get} to retrieve routes.
         *
         * @example
         * Use anywhere you want to retrieve the list of routes for feedback.  Useful for prefetching
         * and caching
         * <pre>
         * // Prefetch routes
         * FeedbackRedirectService.fetch();
         * </pre>
         */
        var fetch = function fetchRoutes () {
            // Let's cancel any attempts to open a window
            // Otherwise this creates an unsavory behavior of changing values and
            // a random window opens
            cancel();

            // Let's prefetch route maps only when the watch has been set up
            // Caching will make sure that the network request only happens once
            return FeedbackRoutesService.get();
        };

        /**
         * @ngdoc method
         * @name FeedbackRedirectService#matchRoute
         * @methodOf encore.svcs.feedback.FeedbackRedirectService
         * @return {promise} On success will return the route a user will be redirected to
         * @description
         *
         * Fetches the routes for the feedback site, matches them against the current application
         * and returns the matched route
         *
         * @example
         * Use anywhere you want to obtain the URL to the feedback site based on the app
         * they are on
         * <pre>
         * FeedbackRedirectService.matchRoute()
         *     .then(function (route) {
         *         // This is to create the link for the template only
         *         scope.route = route;
         *         return route;
         *     });
         * </pre>
         */
        var matchRoute = function matchRoute () {
            return fetch().then(getMatchedRoute);
        };

        /**
         * @ngdoc method
         * @name FeedbackRedirectService#redirect
         * @methodOf encore.svcs.feedback.FeedbackRedirectService
         * @return {promise} On success will return the route a user will be redirected to
         * @description
         *
         * Fetches the routes for the feedback site, matches them against the current application
         * and opens a new window with that route
         *
         * @example
         * Use anywhere you want to forward a user to the feedback site based on the app
         * they are on, in a new window
         * <pre>
         * FeedbackRedirectService.redirect()
         *     .then(function (route) {
         *         // This is to create the link for the template only
         *         scope.route = route;
         *         return route;
         *     });
         * </pre>
         */
        var redirect = function redirectUser () {
            // Get the route mapping, match the current route,
            return matchRoute().then(openWindow);
        };

        return {
            cancel: cancel,
            redirect: redirect,
            matchRoute: matchRoute,
            fetch: fetch
        };
    }]);

angular.module('encore.svcs.feedback')
    /**
     * @ngdoc service
     * @name encore.svcs.feedback.FeedbackRoutesService
     * @requires $http
     * @description
     *
     * Returns a service for managing routes to the feedback site
     */
    .factory('FeedbackRoutesService', ["$http", function ($http) {
        var httpPromise;

        /**
         * @ngdoc method
         * @name FeedbackRoutesService#get
         * @methodOf encore.svcs.feedback.FeedbackRoutesService
         * @return {promise} On success will return the mapping for the routes to the feedback site
         * @description
         *
         * Makes a call to a static proxy in order to retrieve updated list of routes and
         * overrides to the {@link encore.svcs.feedback.FeedbackRedirectService FeedbackRedirectService}
         *
         * @example
         * Use anywhere you want to retrieve a list of routes for feedback in order to
         * match against the base of any angular application
         * <pre>
         * return FeedbackRoutesService.get() // get the route mapping
         *     .then(matchRoute) // match the current route
         *     .then(openWindow); // open window with route
         * </pre>
         */
        var get = function getRoutes () {
            // Make sure we're only fetching once
            if (!httpPromise) {
                // Save the promise to keep using
                httpPromise = $http({
                    url: '/encore/feedback/route-map.json',
                    cache: true
                }).then(function (response) {
                    // We only want the data after this point
                    return response.data;
                }, function () {
                    // Connection failed to CDN? return an empty object
                    return {};
                });
            }
            return httpPromise;
        };

        return {
            get: get
        };
    }]);
angular.module('encore.svcs.feedback')
    /**
     * @ngdoc service
     * @name encore.svcs.feedback.FeedbackService
     * @requires encore.svcs.feedback.FeedbackRedirectService
     * @description
     *
     * Returns an object to interact with feedback functionality
     */
    .factory('FeedbackService', ["FeedbackRedirectService", function (FeedbackRedirectService) {
        // Default feedback types to redirect
        var redirectFeedbackTypes = ['Feature Request'];

        /**
         * @ngdoc method
         * @name FeedbackService#initialize
         * @methodOf encore.svcs.feedback.FeedbackService
         * @param {object} scope Feedback scope to modify
         * @param {object} modal `bootstrap.ui.ModalInstance` to perform actions against the modal
         * @description
         *
         * Overrides methods in the modal scope to enhance it with
         * the {@link encore.svcs.feedback.FeedbackRedirectService FeedbackRedirectService} calls
         * to allow redirection to an external feedback site
         *
         * @example
         * Use in a controller that has a controller instance for rxFeedback
         * <pre>
         * .controller('rxFeedbackController', function ($scope, $modalInstance, $rootScope, $injector) {
         *     $scope.submit = function () {
         *         $modalInstance.close($scope);
         *     };
         *
         *     $scope.cancel = $modalInstance.dismiss;
         *
         *     // cancel out of the modal if the route is changed
         *     $rootScope.$on('$routeChangeSuccess', $modalInstance.dismiss);
         *
         *     // Allow external overrides of the form
         *     if ($injector.has('FeedbackService')) {
         *         $injector.get('FeedbackService').initialize($scope, $modalInstance);
         *     }
         * })
         * </pre>
         */
        var initialize = function (scope, modal) {

            // This is to create the link for the template only
            var saveFinalRoute = function (route) {
                scope.route = route;
                return route;
            };

            // Override submit to always cancel any possible opening windows
            scope.submit = function () {
                FeedbackRedirectService.cancel();
                modal.close(scope);
            };

            // Override cancel to always cancel any possible opening windows
            scope.cancel = function () {
                FeedbackRedirectService.cancel();
                modal.dismiss();
            };

            scope.continue = function () {
                // Call the redirect service
                FeedbackRedirectService.redirect().then(saveFinalRoute);
                modal.dismiss();
            };

            // Prefetch routes
            FeedbackRedirectService.fetch();

            // Append the `$routeChangeSuccess` event to cancel any opening windows
            scope.$root.$on('$routeChangeSuccess', FeedbackRedirectService.cancel);

            // Watch on the form fields to check the type of feedback chosen
            scope.$watch('fields.type', function (type, old, scope) {
                // Cancel any redirection
                FeedbackRedirectService.cancel();
                // We need to set the scope of the modal to editing by default
                scope.setState('editing');

                // Check if we are doing "Feature Requests"
                if (type && _.includes(redirectFeedbackTypes, type.label)) {
                    // Let's show the state of redirect to update the footer
                    scope.setState('redirect');

                    // Get the final URL
                    FeedbackRedirectService.matchRoute().then(saveFinalRoute);
                }
            });
        };

        return {
            initialize: initialize
        };
    }]);
/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch
 *
 * @description
 * Services used for interacting with the global search API
 */
angular.module('encore.svcs.globalSearch', [
    'ngResource',
    'encore.svcs.globalSearch.config',
    'encore.svcs.globalSearch.helpfulNumber',
    'encore.svcs.globalSearch.employee',
    'encore.svcs.globalSearch.coreDevice',
    'encore.svcs.globalSearch.account',
    'encore.svcs.globalSearch.contact',
    'encore.svcs.globalSearch.ticket'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account
 *
 * @description
 * Services used for interacting with Accounts in the global search API
 */
angular.module('encore.svcs.globalSearch.account', [
    'ngResource',
    'encore.svcs.globalSearch.account.config',
    'encore.svcs.globalSearch.account.team',
    'encore.svcs.globalSearch.account.role',
    'encore.svcs.globalSearch.account.instructions',
    'encore.svcs.globalSearch.account.linkedAccount',
    'encore.svcs.util.url',
    'encore.svcs.util.account',
    'encore.svcs.util.encore'
]);

angular.module('encore.svcs.globalSearch.account')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.GSAccountResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.account.config.GSAccountRoute
     * @description
     * `$resource` Service for interaction with Accounts in Global Search
     */
    .factory('GSAccountResource', ["$resource", "GSAccountRoute", "ACCOUNT_INSTRUCTIONS_TITLE", "ACCOUNT_URLS", "ACCOUNT_DISPLAY_TYPE", "URLUtil", function ($resource, GSAccountRoute, ACCOUNT_INSTRUCTIONS_TITLE,
                                            ACCOUNT_URLS, ACCOUNT_DISPLAY_TYPE, URLUtil) {
        /**
         * @ngdoc method
         * @name GSAccountResource#get
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @param {object} params Parameters Object
         * @param {string} params.type Type of account
         *                              * `CLOUD`
         *                              * `MANAGED_HOSTING`
         * @param {number} params.number Account Number
         * @description
         *
         * Get an account details
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSAccountResource.get({ number: 323676, type: 'cloud' });
         * </pre>
         * <pre>
         * {
         *     "number": "323676",
         *     "type": "CLOUD",
         *     "name": "Hub Cap III",
         *     "last_refreshed_at": "2015-09-25 10:15:11 UTC",
         *     "status": "Active"
         * }
         * </pre>
         */
        var account = $resource(GSAccountRoute, {
            number: '@number',
            type: '@type'
        });

        /**
         * @ngdoc method
         * @name GSAccountResource#isCloud
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns whether or not an account is a cloud account
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.isCloud();
         * </pre>
         * <pre>
         * true
         * </pre>
         */
        account.prototype.isCloud = function () {
            return this.getType() === 'cloud';
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#isManagedHosting
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns whether or not an account is a managed hosting account
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.isManagedHosting();
         * </pre>
         * <pre>
         * false
         * </pre>
         */
        account.prototype.isManagedHosting = function () {
            return this.getType() === 'managed_hosting';
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getType
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns lowercase of the type
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getType();
         * </pre>
         * <pre>
         * cloud
         * </pre>
         */
        account.prototype.getType = function () {
            return this.type ? this.type.toLowerCase() : '';
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getDisplayType
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns label for displaying the account type in the UI (Cloud or Dedicated)
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getDisplayType();
         * </pre>
         * <pre>
         * Cloud
         * </pre>
         */
        account.prototype.getDisplayType = function () {
            return ACCOUNT_DISPLAY_TYPE[this.getType()];
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getInstructionsTitle
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the titling for instructions depending on the account type
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getInstructionsTitle();
         * </pre>
         * <pre>
         * Instructions
         * </pre>
         */
        account.prototype.getInstructionsTitle = function () {
            return ACCOUNT_INSTRUCTIONS_TITLE[this.getType()];
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getAccountURL
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the appropriate Encore or CORE account details URL for this account
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getAccountURL();
         * </pre>
         * <pre>
         * /accounts/323676
         * </pre>
         */
        account.prototype.getAccountURL = function () {
            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.account, { accountNumber: this.number });
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getTicketURL
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the appropriate Encore or CORE account details URL for the given ticket for this account
         *
         * @param {String} ticketID  The ID for the ticket
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getTicketURL(12345);
         * </pre>
         * <pre>
         * /ticketing/ticket/12345
         * </pre>
         */
        account.prototype.getTicketURL = function (ticketId) {
            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.ticket, { ticketId: ticketId });
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getAllTicketsURL
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the appropriate Encore or CORE "all tickets" URL for this account
         *
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getAllTicketsURL();
         * </pre>
         * <pre>
         * /ticketing/account/323676
         * </pre>
         */
        account.prototype.getAllTicketsURL = function () {
            var urls = ACCOUNT_URLS[this.getType()];
            return URLUtil.interpolateRoute(urls.allTickets, { accountNumber: this.number });
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getNotificationCenterURL
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the appropriate Notification Center URL for this account
         *
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getNotificationCenterURL();
         * </pre>
         * <pre>
         * /notification-center/cloud:323676
         * </pre>
         * <pre>
         * var account = new GSAccountResource({ number: 323676, type: 'cloud' });
         * account.getNotificationCenterURL('123456789');
         * </pre>
         * <pre>
         * /notification-center/cloud:323676?notification=123456789
         * </pre>

         */
        account.prototype.getNotificationCenterURL = function (notificationId) {
            var accountType = this.getType();
            // notification center uses the term `hybrid` for managed hosting accounts
            if (accountType === 'managed_hosting') {
                accountType = 'hybrid';
            }

            // Note: can't use the URLUtil because of the colon in the URL
            var url = '/notification-center/' + accountType + ':' + this.number;
            if (!_.isEmpty(notificationId)) {
                 url += '?notification=' + notificationId;
            }
            return url;
        };

        /**
         * @ngdoc method
         * @name GSAccountResource#getBillingURL
         * @methodOf encore.svcs.globalSearch.account.GSAccountResource
         * @description
         * Returns the appropriate Billing URL for this account
         *
         * @example
         * <pre>
         * var account = new GSAccountResource({ number: 123456, type: 'managed_hosting' });
         * account.getBillingURL();
         * </pre>
         * <pre>
         * /billing/MANAGED_HOSTING/123456
         * </pre>
         */
        account.prototype.getBillingURL = function () {
            return '/billing/' + this.getType().toUpperCase() + '/' + this.number;
        };

        return account;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account.config
 *
 * @description
 * Collection of configuration values for interacting with accounts in Global Search.
 */
angular.module('encore.svcs.globalSearch.account.config', [
        'encore.svcs.globalSearch.config'
    ])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.config.GSAccountRoute
     * @requires encore.svcs.globalSearch.config.GS_API_URL_BASE
     * @description
     * Returns a string representation of the base path for an Account in Global Search
     */
    .factory('GSAccountRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/accounts/:type/:number';
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account
 *
 * @description
 * Services used for interacting with Account Instructions in the global search API
 */
angular.module('encore.svcs.globalSearch.account.instructions', [
    'ngResource',
    'encore.common.http',
    'encore.svcs.globalSearch.account.config'
]);

angular.module('encore.svcs.globalSearch.account.instructions')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.instructions.GSAccountInstructionsRoute
     * @requires encore.svcs.globalSearch.account.config.GSAccountRoute
     * @description
     * Returns a string representation of the base path for Account Instructions in Global Search
     */
    .factory('GSAccountInstructionsRoute', ["GSAccountRoute", function (GSAccountRoute) {
        return GSAccountRoute + '/instructions';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.instructions.GSAccountInstructionsResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.account.instructions.GSAccountInstructionsRoute
     * @description
     * `$resource` Service for interaction with Account Instructions in Global Search
     */
    .factory('GSAccountInstructionsResource', ["$resource", "GSAccountInstructionsRoute", function ($resource, GSAccountInstructionsRoute) {
        return $resource(GSAccountInstructionsRoute, {
            number: '@number',
            type: '@type'
        }, {
            /**
             * @ngdoc method
             * @name GSAccountInstructionsResource#get
             * @methodOf encore.svcs.globalSearch.account.instructions.GSAccountInstructionsResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * Get instructions for account
             * *default get method from `$resource`*
             * @example
             * <pre>
             * GSAccountInstructionsResource.get({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * {
             *     "_links": {
             *         "account": {
             *             "href": "https://api-n01.dev.ord.globalsearch.encore.rackspace.com/v1/accounts/cloud/323676"
             *         },
             *         "self": {
             *             "href": "https://api-n01.dev...encore.rackspace.com/v1/accounts/cloud/323676/instructions"
             *         }
             *     },
             *     "instructions": "These are the instructions for account 323676."
             * }
             * </pre>
             */
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account
 *
 * @description
 * Services used for interacting with Account Roles in the global search API
 */
angular.module('encore.svcs.globalSearch.account.linkedAccount', [
    'ngResource',
    'encore.common.http',
    'encore.svcs.globalSearch.account.config'
]);

angular.module('encore.svcs.globalSearch.account.linkedAccount')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountRoute
     * @requires encore.svcs.globalSearch.account.config.GSAccountRoute
     * @description
     * Returns a string representation of the base path for Account Linked Accounts in Global Search
     */
    .factory('GSAccountLinkedAccountRoute', ["GSAccountRoute", function (GSAccountRoute) {
        return GSAccountRoute + '/linked_accounts';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountRoute
     * @requires encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountTransform
     * @description
     * `$resource` Service for interaction with Account Linked Accounts in Global Search
     */
    .factory('GSAccountLinkedAccountResource', ["$resource", "GSAccountLinkedAccountRoute", "GSAccountLinkedAccountTransform", "ACCOUNT_DISPLAY_TYPE", function ($resource, GSAccountLinkedAccountRoute,
             GSAccountLinkedAccountTransform, ACCOUNT_DISPLAY_TYPE) {

        var linkedAccount = $resource(GSAccountLinkedAccountRoute, {
            number: '@number',
            type: '@type'
        }, {
            /**
             * @ngdoc method
             * @name GSAccountLinkedAccountResource#get
             * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * Get an account's linked accounts
             * *default get method from `$resource`*
             * @example
             * <pre>
             * GSAccountLinkedAccountResource.get({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * {
             *     "items": [{
             *          "collections_status": "CURRENT",
             *          "name": "Looney Tunes",
             *          "number": "34523452345",
             *          "status": "Active",
             *          "type": "MANAGED_HOSTING",
             *          "last_refreshed_at": "2015-08-28 01:54:21 UTC"
             *      }]
             * }
             * </pre>
             */
            /**
             * @ngdoc method
             * @name GSAccountLinkedAccountResource#list
             * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * List an account's linked accounts
             * @example
             * <pre>
             * GSAccountLinkedAccountResource.list({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * [{
             *     "collections_status": "CURRENT",
             *     "name": "Looney Tunes",
             *     "number": "34523452345",
             *     "status": "Active",
             *     "type": "MANAGED_HOSTING",
             *     "last_refreshed_at": "2015-08-28 01:54:21 UTC"
             * }]
             * </pre>
             */
            list: {
                method: 'GET',
                isArray: true,
                transformResponse: GSAccountLinkedAccountTransform.list
            }
        });

        /**
         * @ngdoc method
         * @name GSAccountLinkedAccountResource#getType
         * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
         * @description
         * Returns lowercase of the type
         * @example
         * <pre>
         * var account = new GSAccountLinkedAccountResource({ number: 323676, type: 'cloud' });
         * account.getType();
         * </pre>
         * <pre>
         * cloud
         * </pre>
         */
        linkedAccount.prototype.getType = function () {
            return this.type ? this.type.toLowerCase() : '';
        };

        /**
         * @ngdoc method
         * @name GSAccountLinkedAccountResource#isCloud
         * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
         * @description
         * Returns whether or not an account is a cloud account
         * @example
         * <pre>
         * var account = new GSAccountLinkedAccountResource({ number: 323676, type: 'cloud' });
         * account.isCloud();
         * </pre>
         * <pre>
         * true
         * </pre>
         */
        linkedAccount.prototype.isCloud = function () {
            return this.getType() === 'cloud';
        };

        /**
         * @ngdoc method
         * @name GSAccountLinkedAccountResource#isManagedHosting
         * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
         * @description
         * Returns whether or not an account is a managed hosting account
         * @example
         * <pre>
         * var account = new GSAccountLinkedAccountResource({ number: 323676, type: 'cloud' });
         * account.isManagedHosting();
         * </pre>
         * <pre>
         * false
         * </pre>
         */
        linkedAccount.prototype.isManagedHosting = function () {
            return this.getType() === 'managed_hosting';
        };

        /**
         * @ngdoc method
         * @name GSAccountLinkedAccountResource#getDisplayType
         * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource
         * @description
         * Returns label for displaying the account type in the UI (Cloud or Dedicated)
         * @example
         * <pre>
         * var account = new GSAccountLinkedAccountResource({ number: 323676, type: 'cloud' });
         * account.getDisplayType();
         * </pre>
         * <pre>
         * Cloud
         * </pre>
         */
        linkedAccount.prototype.getDisplayType = function () {
            return ACCOUNT_DISPLAY_TYPE[this.getType()];
        };

        return linkedAccount;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountTransform
     * @requires encore.svcs.util.http.TransformUtil
     * @description
     * Transforms for {@link
     * encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountResource GSAccountLinkedAccountResource}
     */
    .factory('GSAccountLinkedAccountTransform', ["TransformUtil", function (TransformUtil) {
        /**
         * @ngdoc service
         * @name GSAccountLinkedAccountTransform#list
         * @methodOf encore.svcs.globalSearch.account.linkedAccount.GSAccountLinkedAccountTransform

         * @description
         * Pluck the `items` value to return a list of linked accounts only, otherwise passes back the error
         * @example
         * <pre>
         * var data = {
         *     "items": [{
         *          "collections_status": "CURRENT",
         *          "name": "Looney Tunes",
         *          "number": "34523452345",
         *          "status": "Active",
         *          "type": "MANAGED_HOSTING",
         *          "last_refreshed_at": "2015-08-28 01:54:21 UTC"
         *      }]
         * }
         * GSAccountLinkedAccountTransform.list(data);
         * </pre>
         * <pre>
         * [{
         *     "collections_status": "CURRENT",
         *     "name": "Looney Tunes",
         *     "number": "34523452345",
         *     "status": "Active",
         *     "type": "MANAGED_HOSTING",
         *     "last_refreshed_at": "2015-08-28 01:54:21 UTC"
         * }]
         * </pre>
         */
         // #TODO Convert to use TransformUtil.pluckList
        var list = function (data) {
            if (_.isUndefined(data.items)) {
                return data;
            }
            return data.items;
        };
        return {
            list: TransformUtil.responseChain(list)
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account
 *
 * @description
 * Services used for interacting with Account Roles in the global search API
 */
angular.module('encore.svcs.globalSearch.account.role', [
    'ngResource',
    'encore.common.http',
    'encore.svcs.globalSearch.account.config'
]);

angular.module('encore.svcs.globalSearch.account.role')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.role.GSAccountRoleRoute
     * @requires encore.svcs.globalSearch.account.config.GSAccountRoute
     * @description
     * Returns a string representation of the base path for Account Roles in Global Search
     */
    .factory('GSAccountRoleRoute', ["GSAccountRoute", function (GSAccountRoute) {
        return GSAccountRoute + '/roles';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.role.GSAccountRoleResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.account.role.GSAccountRoleRoute
     * @requires encore.svcs.globalSearch.account.role.GSAccountRoleTransform
     * @description
     * `$resource` Service for interaction with Account Roles in Global Search
     */
    .factory('GSAccountRoleResource', ["$resource", "GSAccountRoleRoute", "GSAccountRoleTransform", function ($resource, GSAccountRoleRoute, GSAccountRoleTransform) {
        return $resource(GSAccountRoleRoute, {
            number: '@number',
            type: '@type'
        }, {
            /**
             * @ngdoc method
             * @name GSAccountRoleResource#get
             * @methodOf encore.svcs.globalSearch.account.role.GSAccountRoleResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * Get an account role details
             * *default get method from `$resource`*
             * @example
             * <pre>
             * GSAccountRoleResource.get({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * {
             *     "_links": {
             *         "account": {
             *             "href": "https://api-n01.dev.ord.globalsearch.encore.rackspace.com/v1/accounts/cloud/323676"
             *         }
             *     },
             *     "items": [{
             *         "employee": {
             *             "employee_type": "Regular",
             *             "sso": "huss6594",
             *             "email": "hussam.dawood@RACKSPACE.COM",
             *         },
             *         "role": "Account Manager"
             *     }]
             * }
             * </pre>
             */
            /**
             * @ngdoc method
             * @name GSAccountRoleResource#list
             * @methodOf encore.svcs.globalSearch.account.role.GSAccountRoleResource
             * @description
             *
             * List an account's roles
             * @example
             * <pre>
             * GSAccountRoleResource.list({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * [{
             *     "employee": {
             *         "employee_type": "Regular",
             *         "sso": "huss6594",
             *         "email": "hussam.dawood@RACKSPACE.COM",
             *     },
             *     "role": "Account Manager"
             * }]
             * </pre>
             */
            list: {
                method: 'GET',
                isArray: true,
                transformResponse: GSAccountRoleTransform.list
            }
        });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.role.GSAccountRoleTransform
     * @requires encore.svcs.util.http.TransformUtil
     * @description
     * Transforms for {@link encore.svcs.globalSearch.account.role.GSAccountRoleResource GSAccountRoleResource}
     */
    .factory('GSAccountRoleTransform', ["TransformUtil", function (TransformUtil) {
        /**
         * @ngdoc service
         * @name GSAccountRoleTransform#list
         * @methodOf encore.svcs.globalSearch.account.role.GSAccountRoleTransform
         * @description
         * Pluck the `items` value to return a list of roles only, otherwise passes back the error
         * @example
         * <pre>
         * var data = {
         *     "items": [{
         *         "employee": {
         *             "employee_type": "Regular",
         *             "sso": "huss6594",
         *             "email": "hussam.dawood@RACKSPACE.COM",
         *         },
         *         "role": "Account Manager"
         *     }]
         * }
         * GSAccountRoleTransform.list(data);
         * </pre>
         * <pre>
         * [{
         *     "employee": {
         *         "employee_type": "Regular",
         *         "sso": "huss6594",
         *         "email": "hussam.dawood@RACKSPACE.COM",
         *     },
         *     "role": "Account Manager"
         * }]
         * </pre>
         */
         // #TODO Convert to use TransformUtil.pluckList
        var list = function (data) {
            if (_.isUndefined(data.items)) {
                return data;
            }
            return data.items;
        };
        return {
            list: TransformUtil.responseChain(list)
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.account.team
 *
 * @description
 * Services used for interacting with Account Teams in the global search API
 */
angular.module('encore.svcs.globalSearch.account.team', [
    'ngResource',
    'encore.common.http',
    'encore.svcs.globalSearch.account.config'
]);

angular.module('encore.svcs.globalSearch.account.team')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.team.GSAccountTeamRoute
     * @requires encore.svcs.globalSearch.account.config.GSAccountRoute
     * @description
     * Returns a string representation of the base path for Account Teams in Global Search
     */
    .factory('GSAccountTeamRoute', ["GSAccountRoute", function (GSAccountRoute) {
        return GSAccountRoute + '/teams';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.team.GSAccountTeamResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.account.team.GSAccountTeamRoute
     * @requires encore.svcs.globalSearch.account.team.GSAccountTeamTransform
     * @description
     * `$resource` Service for interaction with Account Teams in Global Search
     */
    .factory('GSAccountTeamResource', ["$resource", "GSAccountTeamRoute", "GSAccountTeamTransform", function ($resource, GSAccountTeamRoute, GSAccountTeamTransform) {
        return $resource(GSAccountTeamRoute, {
            number: '@number',
            type: '@type'
        }, {
            /**
             * @ngdoc method
             * @name GSAccountTeamResource#get
             * @methodOf encore.svcs.globalSearch.account.team.GSAccountTeamResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * Get an account team details
             * *default get method from `$resource`*
             * @example
             * <pre>
             * GSAccountTeamResource.get({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * {
             *     "_links": {
             *         "account": {
             *             "href": "https://api-n01.dev.ord.globalsearch.encore.rackspace.com/v1/accounts/cloud/323676"
             *         }
             *     },
             *     "items": [{
             *         "name": "Team D3",
             *         "description": "Managed Cloud",
             *         "flags": ["primary"],
             *         "type": "support"
             *     }]
             * }
             * </pre>
             */
            /**
             * @ngdoc method
             * @name GSAccountTeamResource#list
             * @methodOf encore.svcs.globalSearch.account.team.GSAccountTeamResource
             * @param {object} params Parameters Object
             * @param {string} params.type Type of account
             *                              * `CLOUD`
             *                              * `MANAGED_HOSTING`
             * @param {number} params.number Account Number
             * @description
             *
             * List an account's teams
             * @example
             * <pre>
             * GSAccountTeamResource.list({ number: 323676, type: 'cloud' });
             * </pre>
             * <pre>
             * [{
             *     "name": "Team D3",
             *     "description": "Managed Cloud",
             *     "flags": ["primary"],
             *     "type": "support"
             * }]
             * </pre>
             */
            list: {
                method: 'GET',
                isArray: true,
                transformResponse: GSAccountTeamTransform.list
            }
        });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.account.team.GSAccountTeamTransform
     * @requires encore.svcs.util.http.TransformUtil
     * @description
     * Transforms for {@link encore.svcs.globalSearch.account.team.GSAccountTeamResource GSAccountTeamResource}
     */
    .factory('GSAccountTeamTransform', ["TransformUtil", function (TransformUtil) {
        /**
         * @ngdoc service
         * @name GSAccountTeamTransform#list
         * @methodOf encore.svcs.globalSearch.account.team.GSAccountTeamTransform
         * @description
         * Pluck the `items` value to return a list of teams only, otherwise passes back the error
         * @example
         * <pre>
         * var data = {
         *     "items": [{
         *         "name": "Team D3",
         *         "description": "Managed Cloud",
         *         "flags": ["primary"],
         *         "type": "support"
         *     }]
         * }
         * GSAccountTeamTransform.list(data);
         * </pre>
         * <pre>
         * [{
         *     "name": "Team D3",
         *     "description": "Managed Cloud",
         *     "flags": ["primary"],
         *     "type": "support"
         * }]
         * </pre>
         */
         // #TODO Convert to use TransformUtil.pluckList
        var list = function (data) {
            if (_.isUndefined(data.items)) {
                return data;
            }
            return data.items;
        };
        return {
            list: TransformUtil.responseChain(list)
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.config
 *
 * @description
 * Collection of configuration values for interacting with Global Search.
 */
angular.module('encore.svcs.globalSearch.config', [])
    /**
     * @ngdoc property
     * @const GS_API_URL_BASE
     * @name encore.svcs.globalSearch.config.constant:GS_API_URL_BASE
     * @description
     *
     * Constant for the base path of all Global Search calls
     */
    .constant('GS_API_URL_BASE', '/api/global-search');
/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.contact
 *
 * @description
 * Services used for interacting with Contacts in the global search API
 */
angular.module('encore.svcs.globalSearch.contact', [
    'ngResource'
]);

angular.module('encore.svcs.globalSearch.contact')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.Contact.GSContactRoute
    * @description
    *
    * Returns a string representation of the base path for a Contact
    */
    .factory('GSContactRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/contacts/:id';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.Contact.GSContactResource
    * @description
    * Contact Service for interaction with Contact API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.Contact.GSContactRoute
    */
    .factory('GSContactResource', ["$resource", "GSContactRoute", function ($resource, GSContactRoute) {
        /**
         * @ngdoc method
         * @name GSContactResource#get
         * @methodOf encore.svcs.globalSearch.Contact.GSContactResource
         * @description
         *
         * Get an account's contacts
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSContactResource.get({ id: 'RPN-316-123-456' });
         * </pre>
         * <pre>
         * {
         *   "contact_id": "RPN-316-123-456",
         *   "first_name": "Steve",
         *   "last_name": "Austin",
         *   "display_name": "Steve Austin",
         *   "title": "Administrator",
         *   "role": "Customer",
         *   "primary_phone": "1234567890",
         *   "account_contact_number": "1337_36005",
         *   "last_refreshed_at": "2015-08-28 01:54:21 UTC",
         *   "account": {
         *     "name": "Broken Skull Ranch",
         *     "number": "19293384938",
         *     "status": "Active",
         *     "type": "CLOUD",
         *     "last_refreshed_at": "2015-08-28 01:54:21 UTC"
         *   },
         *   "email_addresses": [
         *     {
         *       "address": "stonecoldsaysso@ohhellyeah.com",
         *       "primary": true
         *     }
         *   ],
         *   "_links": {
         *     "self": {
         *       "href": "https://globalsearch.encore.rackspace.com/v1/contacts/RPN-316-123-456"
         *     },
         *     "account": {
         *       "href": "https://globalsearch.encore.rackspace.com/v1/accounts/cloud/19293384938"
         *     }
         *   }
         * }
         * </pre>
         */
        return $resource(GSContactRoute, {
            id: '@id'
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.coreDevice
 *
 * @description
 * Services used for interacting with core device details in the global search API
 */
angular.module('encore.svcs.globalSearch.coreDevice', [
    'ngResource',
    'encore.svcs.globalSearch.coreDevice.guidelines',
    'encore.svcs.globalSearch.coreDevice.ticket',
    'encore.svcs.util.encore',
    'encore.svcs.util.url'
]);

angular.module('encore.svcs.globalSearch.coreDevice')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.coreDevice.GSCoreDeviceRoute
    * @description
    *
    * Returns a string representation of the base path for a core device
    */
    .factory('GSCoreDeviceRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/devices/:device_id';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.coreDevice.GSCoreDeviceResource
    * @description
    * CoreDevice Service for interaction with CoreDevice API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.coreDevice.GSCoreDeviceRoute
    */
    .factory('GSCoreDeviceResource', ["$resource", "GSCoreDeviceRoute", "ACCOUNT_URLS", "URLUtil", function ($resource, GSCoreDeviceRoute, ACCOUNT_URLS, URLUtil) {
        /**
         * @ngdoc method
         * @name GSCoreDeviceResource#get
         * @methodOf encore.svcs.globalSearch.coreDevice.GSCoreDeviceResource
         * @description
         *
         * Get Core Devices
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSCoreDeviceResource.get({ 'device_id': '12345' });
         * </pre>
         * <pre>
         * {
         *     "account": {
         *         "name": "shivuser128",
         *         "number": "5830441",
         *         "status": "Active",
         *         "operational_status": "Open",
         *         "type": "CLOUD"
         *     },
         *     "device_id": "7ecec4ef-c351-4c21-b79e-f001f2a52af3",
         *     "name": "pwnall-fg2ng-test",
         *     "nickname": "null",
         *     "platform_name": "WIN2K",
         *     "location": "ORD",
         *     "status": "BUILD",
         *     "ip_addresses": [ ],
         *     "created_at": "2016-05-10T23:30:52.000Z",
         *     "last_updated": "2016-08-30T05:22:04.000Z"
         *     }
         *   }
         * </pre>
         */
        var device = $resource(GSCoreDeviceRoute, {
            'device_id': '@device_id'
        });

        /**
         * @ngdoc method
         * @name GSCoreDeviceResource#getDeviceURL
         * @methodOf encore.svcs.globalSearch.coreDevice.GSCoreDeviceResource
         * @description
         * Returns the appropriate Encore or CORE device details URL for this device
         * @example
         * <pre>
         * var account = new GSCoreDeviceResource({ 'device_id': 323676 });
         * account.getDeviceURL();
         * </pre>
         * <pre>
         * /device/devices/12345
         * </pre>
         */
        device.prototype.getDeviceURL = function () {
            var url = ACCOUNT_URLS['managed_hosting'];
            return URLUtil.interpolateRoute(url['device'], { deviceId: this['device_id'] });
        };
        return device;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.coreDevice
 *
 * @description
 * Services used for interacting with Core Device Management Guidelines in the global search API
 */
angular.module('encore.svcs.globalSearch.coreDevice.guidelines', [
    'ngResource'
]);

angular.module('encore.svcs.globalSearch.coreDevice.guidelines')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.coreDevice.guidelines.GSCoreDeviceGuidelinesRoute
     * @requires encore.svcs.globalSearch.coreDevice.GSCoreDeviceRoute
     * @description
     * Returns a string representation of the base path for Core Device Management Guidelines in Global Search
     */
    .factory('GSCoreDeviceGuidelinesRoute', ["GSCoreDeviceRoute", function (GSCoreDeviceRoute) {
        return GSCoreDeviceRoute + '/instructions';
    }])

    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.coreDevice.guidelines.GSCoreDeviceGuidelinesResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.coreDevice.guidelines.GSCoreDeviceGuidelinesRoute
     * @description
     * `$resource` Service for interaction with Core Device Management Guidelines in Global Search
     */
    .factory('GSCoreDeviceGuidelinesResource', ["$resource", "GSCoreDeviceGuidelinesRoute", function ($resource, GSCoreDeviceGuidelinesRoute) {
        return $resource(GSCoreDeviceGuidelinesRoute, {
            'device_id': '@device_id'
        }, {
            /**
             * @ngdoc method
             * @name GSCoreDeviceGuidelinesResource#get
             * @methodOf encore.svcs.globalSearch.coreDevice.guidelines.GSCoreDeviceGuidelinesResource
             * @description
             *
             * Get Device Management Guidelines for Core Device
             * *default get method from `$resource`*
             * @example
             * <pre>
             * GSCoreDeviceGuidelinesResource.get({ number: 851234 });
             * </pre>
             * <pre>
             * {
             *     "_links": {
             *         "device": {
             *             "href": "https://api-n01.dev.ord.globalsearch.encore.rackspace.com/v1/devices/123456"
             *         },
             *         "self": {
             *             "href": "https://api-n01.dev...encore.rackspace.com/v1/devices/123456/instructions"
             *         }
             *     },
             *     "instructions": "These are the instructions for device 123456."
             * }
             * </pre>
             */
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.coreDevice
 *
 * @description
 * Services used for interacting with Core Device Tickets in the global search API
 */
angular.module('encore.svcs.globalSearch.coreDevice.ticket', [
    'ngResource',
    'encore.svcs.util.http'
]);

angular.module('encore.svcs.globalSearch.coreDevice.ticket')
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.coreDevice.ticket.GSCoreDeviceTicketRoute
     * @requires encore.svcs.globalSearch.coreDevice.GSCoreDeviceRoute
     * @description
     * Returns a string representation of the base path for Core Device Tickets in Global Search
     */
    .factory('GSCoreDeviceTicketRoute', ["GSCoreDeviceRoute", function (GSCoreDeviceRoute) {
        return GSCoreDeviceRoute + '/tickets';
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.coreDevice.ticket.GSCoreDeviceTicketResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @requires encore.svcs.globalSearch.coreDevice.ticket.GSCoreDeviceTicketRoute
     * @description
     * `$resource` Service for interaction with Core Device Tickets in Global Search
     */
    .factory('GSCoreDeviceTicketResource', ["$resource", "GSCoreDeviceTicketRoute", "TicketTransform", function ($resource, GSCoreDeviceTicketRoute, TicketTransform) {
        return $resource(GSCoreDeviceTicketRoute, {
            'device_id': '@device_id'
        }, {
            /**
             * @ngdoc method
             * @name GSCoreDeviceTicketResource#getAll
             * @methodOf encore.svcs.globalSearch.coreDevice.ticket.GSCoreDeviceTicketResource
             * @param {object} params Parameters Object
             * @description
             *
             * Get Device Tickets for Core Device
             * @example
             * <pre>
             * GSCoreDeviceTicketResource.getAll({ device_id: 851234 });
             * </pre>
             * <pre>
             * [{
             *     "status": "New",
             *     "last_refreshed_at": "2016-11-04T02:31:56.191Z",
             *     "last_updated": "2016-09-20T06:57:14.000Z",
             *     "subject": "[Action Required] - Please Schedule Your Manual Sophos A/V Update",
             *     "device_ids": ["432685"],
             *     "ticket_id": "150817-14640",
             *     "created_at": "2015-08-17T21:23:40.000+0000",
             *     "assignee": {
             *         "name": "Haley Adams",
             *         "sso": "hale4426",
             *         "title": "Account Manager III"
             *     },
             *     "account": {
             *         "type": "MANAGED_HOSTING",
             *         "operational_status": "Open",
             *         "status": "Active",
             *         "name": "Masked Import1464670003558",
             *         "number": "32190"
             *     }
             * }]
             * </pre>
             */
            getAll: {
                method: 'GET',
                isArray: true,
                transformResponse: TicketTransform.getAll
             }
        });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.globalSearch.TicketTransform
     * @description
     * Returns an object containing transformation functionality
     * for HTTP response data
     * @returns {object} Transform functions for Ticket Resource
     */
    .factory('TicketTransform', ["TransformUtil", function (TransformUtil) {
        /**
        * @ngdoc service
        * @name TicketTransform#getAll
        * @methodOf encore.svcs.globalSearch.TicketTransform
        * @param {array} Collection of ticket objects
        * @description
        * Transforms a collection of ticket objects to be usable
        * in the view layer
        * @returns {array} a collection of transformed tickets
        * @example
        * <pre>
        * {
        *     "items": [{
        *         "status": "New",
        *         "last_refreshed_at": "2016-11-04T02:31:56.191Z",
        *         "last_updated": "2016-09-20T06:57:14.000Z",
        *         "subject": "[Action Required] - Please Schedule Your Manual Sophos A/V Update",
        *         "device_ids": ["432685"],
        *         "ticket_id": "150817-14640",
        *         "created_at": "2015-08-17T21:23:40.000+0000",
        *         "assignee": {
        *             "name": "Haley Adams",
        *             "sso": "hale4426",
        *             "title": "Account Manager III"
        *          },
        *         "account": {
        *             "type": "MANAGED_HOSTING",
        *             "operational_status": "Open",
        *             "status": "Active",
        *             "name": "Masked Import1464670003558",
        *             "number": "32190"
        *         }
        *     }, {
        *         "status": "New",
        *         ...
        *     }]
        * }
        * </pre>
        * Converts to:
        * <pre>
        * TicketTransform.getAll(tickets) ->
        * [{
        *     "status": "New",
        *     "last_refreshed_at": "2016-11-04T02:31:56.191Z",
        *     "last_updated": "2016-09-20T06:57:14.000Z",
        *     "subject": "[Action Required] - Please Schedule Your Manual Sophos A/V Update",
        *     "device_ids": ["432685"],
        *     "ticket_id": "150817-14640",
        *     "created_at": "2015-08-17T21:23:40.000+0000",
        *     "assignee": {
        *         "name": "Haley Adams",
        *         "sso": "hale4426",
        *         "title": "Account Manager III"
        *     },
        *     "account": {
        *         "type": "MANAGED_HOSTING",
        *         "operational_status": "Open",
        *         "status": "Active",
        *         "name": "Masked Import1464670003558",
        *         "number": "32190"
        *     }
        * }]
        * </pre>
        */
        return {
            getAll: TransformUtil.pluckList('items')
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.employee
 *
 * @description
 * Services used for interacting with Helpful Numbers in the global search API
 */
angular.module('encore.svcs.globalSearch.employee', [
    'ngResource'
]);

angular.module('encore.svcs.globalSearch.employee')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.employee.GSEmployeeRoute
    * @description
    *
    * Returns a string representation of the base path for a Helpful Number
    */
    .factory('GSEmployeeRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/employees/:sso';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.employee.GSEmployeeResource
    * @description
    * Employee Service for interaction with Employee API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.employee.GSEmployeeRoute
    */
    .factory('GSEmployeeResource', ["$resource", "GSEmployeeRoute", function ($resource, GSEmployeeRoute) {
        /**
         * @ngdoc method
         * @name GSEmployeeResource#get
         * @methodOf encore.svcs.globalSearch.employee.GSEmployeeResource
         * @description
         *
         * Get an account details
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSEmployeeResource.get({ sso: 'fred7307' });
         * </pre>
         * <pre>
         * {
         *     "employee_type": "Regular",
         *     "sso": "fred7307",
         *     "email": "freddy.knuth@RACKSPACE.COM",
         * }
         * </pre>
         * <pre>
         * var employee = new GSEmployeeResource({
         *     "sso": "fred7307",
         *     "display_name": "Freddy Knuth"
         * });
         * employee.$get();
         * </pre>
         * <pre>
         * {
         *     "employee_type": "Regular",
         *     "sso": "fred7307",
         *     "email": "freddy.knuth@RACKSPACE.COM",
         * }
         * </pre>

         */

        var employee = $resource(GSEmployeeRoute, {
            sso: '@sso'
        });

        /**
         * @ngdoc method
         * @name GSEmployeeResource#isTeam
         * @methodOf encore.svcs.globalSearch.employee.GSEmployeeResource
         * @description
         *
         * Return whether or not the Employee is a team
         * @example
         * <pre>
         * var employee = new GSEmployeeResource({
         *     "sso": "fred7307",
         *     "display_name": "Freddy Knuth"
         * })
         * employee.isTeam();
         * </pre>
         * <pre>
         * false
         * </pre>
         */
        employee.prototype.isTeam = function () {
            // ex-employees have a `null` for `title`, so we have to ensure it's
            // actually a string before working with it
            if (_.isString(this.title)) {
                // At this time, the only reasonably confident way we have of
                // determining whether an assignee is a person or a Team is by
                // checking their `title` attribute. We seem to be _fairly_ consistent
                // in also titling the Teams as "Service Account"
                return this.title.toLowerCase().indexOf('service account') === 0;
            }
            return true;
        };

        /**
         * @ngdoc method
         * @name GSEmployeeResource#getDisplayName
         * @methodOf encore.svcs.globalSearch.employee.GSEmployeeResource
         * @description
         *
         * Returns the display name for an employee
         * @example
         * <pre>
         * var employee = new GSEmployeeResource({
         *     "sso": "fred7307",
         *     "display_name": "Freddy Knuth"
         * })
         * employee.getDisplayName();
         * </pre>
         * <pre>
         * Freddy Knuth
         * </pre>
         * <pre>
         * var employee = new GSEmployeeResource({
         *     "sso": "huss2479",
         *     "name": "Hussam Dawood" })
         * employee.getDisplayName();
         * </pre>
         * <pre>
         * Hussam Dawood
         * </pre>
         */
        employee.prototype.getDisplayName = function () {
            if (_.has(this, 'name') && !_.has(this, 'display_name')) {
                return this.name;
            }
            return this['display_name'];
        };

        return employee;
    }]);

angular.module('encore.svcs.globalSearch.employee')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.employee.GSEmployeeRolesRoute
    * @description
    *
    * Returns a string representation of the base path for employee roles
    */
    .factory('GSEmployeeRolesRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/employees/:sso/roles';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.employee.GSEmployeeRolesResource
    * @description
    * Employee Service for interaction with Employee API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.employee.GSEmployeeRolesRoute
    */
    .factory('GSEmployeeRolesResource', ["$resource", "GSEmployeeRolesRoute", function ($resource, GSEmployeeRolesRoute) {
        /**
         * @ngdoc method
         * @name GSEmployeeRolesResource#get
         * @methodOf encore.svcs.globalSearch.employee.GSEmployeeRolesResource
         * @description
         *
         * Get an employee's LDAP roles
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSEmployeeRolesResource.get({ sso: 'fred7307' });
         * </pre>
         * <pre>
         * {
         *     "group_membership": [{
         *         "ou": "Groups",
         *         "o": "rackspace",
         *         "cn": "af_sat6"
         *     }, {
         *         "ou": "Groups",
         *         "o": "rackspace",
         *         "cn": "fs_GDCI_auto"
         *     }],
         *     "security_equals": [{
         *         "ou": "Groups",
         *         "o": "rackspace",
         *         "cn": "af_sat6"
         *     }, {
         *         "ou": "Groups",
         *         "o": "rackspace",
         *         "cn": "fs_GDCI_auto"
         *     }]
         * }
         * </pre>
         */
        return $resource(GSEmployeeRolesRoute, {
            sso: '@sso'
        });

    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.helpfulNumber
 *
 * @description
 * Services used for interacting with Helpful Numbers in the global search API
 */
angular.module('encore.svcs.globalSearch.helpfulNumber', [
    'ngResource'
]);

angular.module('encore.svcs.globalSearch.helpfulNumber')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.helpfulNumber.GSHelpfulNumberRoute
    * @description
    *
    * Returns a string representation of the base path for a Helpful Number
    */
    .factory('GSHelpfulNumberRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/helpful_numbers/:id';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.helpfulNumber.GSHelpfulNumberResource
    * @description
    * HelpfulNumber Service for interaction with HelpfulNumber API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.helpfulNumber.GSHelpfulNumberRoute
    */
    .factory('GSHelpfulNumberResource', ["$resource", "GSHelpfulNumberRoute", function ($resource, GSHelpfulNumberRoute) {
        /**
         * @ngdoc method
         * @name GSHelpfulNumberResource#get
         * @methodOf encore.svcs.globalSearch.helpfulNumber.GSHelpfulNumberResource
         * @description
         *
         * Get Helpful Numbers
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSHelpfulNumberResource.get({ id: '12345' });
         * </pre>
         * <pre>
         * {
         *     "name": "DCOPS Security DFW",
         *     "phone_numbers": {
         *         "internal": {
         *             "number": "5046162",
         *             "mask": "###-####"
         *         }
         *     },
         *     "id": "751607df9b87712ee6a4ea9c6d9adca0cea02061",
         *     "tags": [
         *         "dcops",
         *         "security"
         *     ]
         * }
         * </pre>
         */
        return $resource(GSHelpfulNumberRoute, {
            id: '@id'
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.globalSearch.ticket
 *
 * @description
 * Services used for interacting with Tickets in the global search API
 */
angular.module('encore.svcs.globalSearch.ticket', [
    'ngResource'
]);

angular.module('encore.svcs.globalSearch.ticket')
    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.ticket.GSTicketRoute
    * @description
    *
    * Returns a string representation of the base path for a Ticket
    */
    .factory('GSTicketRoute', ["GS_API_URL_BASE", function (GS_API_URL_BASE) {
        return GS_API_URL_BASE + '/tickets/:id';
    }])

    /**
    * @ngdoc service
    * @name encore.svcs.globalSearch.ticket.GSTicketResource
    * @description
    * Ticket Service for interaction with Ticket API
    * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
    * @requires encore.svcs.globalSearch.ticket.GSTicketRoute
    */
    .factory('GSTicketResource', ["$resource", "GSTicketRoute", function ($resource, GSTicketRoute) {
        /**
         * @ngdoc method
         * @name GSTicketResource#get
         * @methodOf encore.svcs.globalSearch.ticket.GSTicketResource
         * @description
         *
         * Get an Ticket details
         * *default get method from `$resource`*
         * @example
         * <pre>
         * GSTicketResource.get({ id: '150729-ord-0003228' });
         * </pre>
         * <pre>
         * {
         *   "ticket_id": "150729-ord-0003228",
         *   "account": {
         *     "type": "CLOUD",
         *     "number": "318885"
         *   },
         *   "last_updated": "2015-07-29T23:36:08.385+0000",
         *   "assignee": "john.doe",
         *   "subject": "HSD Emergency Server Maintenance",
         *   "last_refreshed_at": "2015-10-02 12:15:13 UTC",
         *   "status": "Pending Customer",
         *   "_links": {
         *     "self": {
         *       "href": "https://globalsearch.encore.rackspace.com/v1/tickets/150729-ord-0003228"
         *     },
         *     "account": {
         *       "href": "https://globalsearch.encore.rackspace.com/v1/accounts/cloud/318885"
         *     }
         *   }
         * }
         * </pre>
         */
        return $resource(GSTicketRoute, {
            id: '@id'
        });
    }]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.impersonation', [
    'ngResource'
]);

angular.module('encore.svcs.impersonation')

/**
* @ngdoc service
* @name encore.svcs.impersonation.ImpersonationRoute
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
* @description
*
* Returns a string representation of the base path for Impersonation Token
*/
.factory('ImpersonationRoute', ["CLOUD_API_URL_BASE", function (CLOUD_API_URL_BASE) {
    return CLOUD_API_URL_BASE + '/:username/impersonation_info';
}])

/**
* @ngdoc service
* @name encore.svcs.impersonation.ImpersonationResource
* @description
* Impersonation Service for interaction with Impersonation API
* @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
* @requires encore.svcs.cloud.config.constant:CLOUD_API_URL_BASE
*/
.factory('ImpersonationResource', ["$resource", "ImpersonationRoute", function ($resource, ImpersonationRoute) {
    return function (user) {
        return $resource(ImpersonationRoute, {
            username: user
        });
    };
}]);
/**
 * @ngdoc overview
 * @name encore.svcs.interactions
 *
 * @description
 * Services used for interacting with the interactions API
 */
angular.module('encore.svcs.interactions', [
    'ngResource'
]);

(function () {
    /**
     * @ngdoc service
     * @name encore.svcs.interactions.InteractionFiltersResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @description
     * `$resource` Service for interaction with Interactions API filters
     */
    angular
        .module('encore.svcs.interactions')
        .factory('InteractionFiltersResource',

    ["$resource", "TransformUtil", "Pluck", function ($resource, TransformUtil, Pluck) {
        var interactionsUrl = '/api/interactions/filters/:actionId';

        return $resource(interactionsUrl, {
            actionId: '@actionId',
            q: '@q'
        }, {
            /**
             * @ngdoc method
             * @name InteractionFiltersResource#tickets
             * @methodOf encore.svcs.interactions.InteractionFiltersResource
             * @description
             * Returns a filtered list of tickets
             * @example
             * <pre>
             * var tickets = InteractionFiltersResource.tickets({
             *     'account_id': 323676,
             *     'account_type': 'cloud',
             *     'ticket_id': '120'
             * });
             * </pre>
             * <pre>
             * [
             *     '120327-0018956',
             *     '120420-0019674',
             *     '160304-ord-0000120'
             * ]
             * </pre>
             */
            tickets: {
                method: 'GET',
                params: {
                    actionId: 'tickets'
                },
                isArray: true,
                transformResponse: TransformUtil.responseChain(Pluck('tickets'))
            },
            /**
             * @ngdoc method
             * @name InteractionFiltersResource#transfers
             * @methodOf encore.svcs.interactions.InteractionFiltersResource
             * @description
             * Returns a filtered list of rackers and/or groups to transfer a call to
             * @example
             * <pre>
             * var transfers = InteractionFiltersResource.transfers({ 'q': 'mari' });
             * </pre>
             * <pre>
             * [{
             *     'type': 'employee',
             *     'name': 'Marisol Segura',
             *     'first_name': 'Marisol',
             *     'last_name': 'Segura',
             *     'phone_numbers': {
             *         'internal': {
             *             'number': '5011234',
             *             'mask': '###-####'
             *         },
             *         'office': {
             *             'number': '12103121234',
             *             'mask': '+# (###) ###-####'
             *         },
             *         'mobile': {
             *             'number': ''
             *         }
             *     },
             *     'sso': 'mari1234'
             * }]
             * </pre>
             */
            transfers: {
                method: 'GET',
                params: {
                    actionId: 'transfers',
                    q: '@q'
                },
                isArray: true,
                transformResponse: TransformUtil.responseChain(Pluck('transfers'))
            },
            /**
             * @ngdoc method
             * @name InteractionFiltersResource#referenceNumbers
             * @methodOf encore.svcs.interactions.InteractionFiltersResource
             * @description
             * Returns a filtered list of nofitication ids and/or ticket numbers
             * @example
             * <pre>
             * var referenceNumberes = InteractionFiltersResource.transfers({
             *     'reference_number': '1608',
             *     'account_id': 323676,
             *     'account_type': 'cloud'
             * });
             * </pre>
             * <pre>
             * [{
             *     'reference_id': '160815-00074',
             *     'reference_type': 'ticket'
             * }, {
             *     'reference_id': '160812-01472',
             *     'reference_type': 'ticket'
             * }, {
             *     'reference_id': '16080564-1000-9678-347372467-779445009',
             *     'reference_type': 'notification'
             * }]
             * </pre>
             */
            referenceNumbers: {
                method: 'GET',
                params: {
                    actionId: 'reference_numbers'
                },
                isArray: true,
                transformResponse: TransformUtil.responseChain(Pluck('references'))
            }
        });
    }]);
}());

(function () {
    /**
     * @ngdoc service
     * @name encore.svcs.interactions.InteractionResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @description
     * `$resource` Service for interaction with Interactions API
     */
    angular
        .module('encore.svcs.interactions')
        .factory('InteractionResource',

    ["$resource", function ($resource) {
        var interactionsUrl = '/api/interactions/interactions';

        /**
         * @ngdoc method
         * @name InteractionResource#save
         * @methodOf encore.svcs.interactions.InteractionResource
         * @description
         * Creates an interaction
         * @example
         * <pre>
         * InteractionResource.save({
         *     'template_id': 'unsupported-caller',
         *     'template_version': 3,
         *     'call_type': 'AUP'
         * });
         * </pre>
         */
        return $resource(interactionsUrl);
    }]);
}());

(function () {
    /**
     * @ngdoc service
     * @name encore.svcs.interactions.InteractionTemplateResource
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to Restful API's.
     * @description
     * `$resource` Service for interaction with Interactions API templates
     */
    angular
        .module('encore.svcs.interactions')
        .factory('InteractionTemplateResource',

    ["$resource", function ($resource) {
        var interactionsUrl = '/api/interactions/templates/:templateId';

        /**
         * @ngdoc method
         * @name InteractionTemplateResource#get
         * @methodOf encore.svcs.interactions.InteractionTemplateResource
         * @description
         * Returns the specified template
         * @example
         * <pre>
         * var template = InteractionTemplateResource.get({ templateId: 'unsupported-caller' });
         * </pre>
         * <pre>
         * {
         *     'templateId': 'unsupported-caller',
         *     'schema': {
         *         'type': 'object',
         *         'properties': {
         *             'template_version': {
         *             'type': 'integer',
         *             'default': 3
         *         },
         *         'template_id': {
         *             'type': 'string',
         *             'default': 'unsupported-caller'
         *         },
         *         'call_type': {
         *             'type': 'string',
         *             'title': 'Call Type',
         *             'enum': [
         *                 'Cloud Office',
         *                 'End User',
         *                 'Internal Customer',
         *                 'Racker',
         *                 'Other'
         *             ]}
         *         }
         *     },
         *     'templateVersion': 3,
         *     'options': {
         *         'fields': [{
         *             'key': 'template_version',
         *             'type': 'hidden'
         *         }, {
         *             'key': 'template_id',
         *             'type': 'hidden'
         *         }, {
         *             'key': 'call_type',
         *             'label': 'Call Type',
         *             'type': 'select'
         *         }]
         *     }
         * }
         * </pre>
         */
        return $resource(interactionsUrl, { templateId: '@templateId' });
    }]);
}());

/**
 * @ngdoc overview
 * @name encore.svcs.invoice
 * @requires ngResource
 * @requires encore.svcs.invoice.config
 * @requires encore.svcs.util
 * @requires encore.svcs.util.http
 * @description
 * Collection of services and filters for interacting with
 * elastic invoice APIs
 * 
 * ##Children##
 * * {@link encore.svcs.invoice.config Invoice Configuration}
 * * {@link encore.svcs.invoice.InvoiceRoute Invoice Route}
 * * {@link encore.svcs.invoice.InvoiceResource Invoice Resource}
 *
 * ##API Information##
 * For a full set of documentation pertaining to elastic invoice
 * please visit {@link https://pages.github.rackspace.com/ReachBillingStack/ElasticInvoice_API/ Elastic Invoice}
 */
angular.module('encore.svcs.invoice', [
    'ngResource',
    'encore.svcs.invoice.config',
    'encore.svcs.util',
    'encore.svcs.util.http'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.invoice.config
 *
 * @description
 * Configuration objects specific to elastic invoice
 *
 * ##Children##
 * * {@link encore.svcs.invoice.config.constant:INVOICE_BASE_URL INVOICE_BASE_URL}
 */
angular.module('encore.svcs.invoice.config', [])
/**
 * @ngdoc property
 * @const INVOICE_BASE_URL
 * @name encore.svcs.invoice.config.constant:INVOICE_BASE_URL
 * @description
 * Constant for the base path of all invoice API calls
 * @returns {string} '/api/ivoice/cloud'
 */
.constant('INVOICE_BASE_URL', '/api/invoice/cloud');

angular.module('encore.svcs.invoice')
/**
 * @ngdoc service
 * @name encore.svcs.invoice.InvoiceRoute
 * @requires encore.svcs.invoice.config.constant:INVOICE_BASE_URL
 * @description
 * Combines the base URL with the specific InvoiceRoute URL
 * @returns {string} Full URL for InvoiceRoute
 */
.factory('InvoiceRoute', ["INVOICE_BASE_URL", function (INVOICE_BASE_URL) {
    return INVOICE_BASE_URL + '/accounts/:accountNumber/bills/:billNumber';
}])
/**
 * @ngdoc service
 * @name encore.svcs.invoice.InvoiceResource
 * @requires $resource
 * @requires encore.svcs.invoice.InvoiceRoute
 * @description
 * A service for retrieving information for a customer invoice.
 */
.factory('InvoiceResource', ["$resource", "InvoiceRoute", function (
    $resource,
    InvoiceRoute
) {
    return $resource(InvoiceRoute, {
        accountNumber: '@accountNumber',
        billNumber: '@billNumber'
    }, {
        /**
         * @ngdoc method
         * @name InvoiceResource#fetchLocationUrl
         * @methodOf encore.svcs.invoice.InvoiceResource
         * @param {object} params Parameters object
         * @param {string} params.accountNumber Customer Account Number
         * @param {string} params.billNumber Identifying number for a bill period
         * @description
         * Returns a relative URL so that the user can be redirected to Elastic Invoice
         * @static
         * @example
         * <pre>
         * InvoiceResource.fetchLocationUrl({ accountNumber: 1234, billNumber: 'P-1234' })
         * </pre>
         *
         * *Response object below after response transform:
         * {@link encore.svcs.invoice.InvoiceResource#methods_fetchLocationUrl InvoiceResource.fetchLocationUrl}*
         * <pre>
         * {
         *  location: "/accounts/406060/bills/B1-14373788?uuid=da9edfad-bfcb-4ed0-a27b-b3a1f2e8c32d"
         * }
         * </pre>
         * 
         * For full API documentation see {@link
         * https://pages.github.rackspace.com/ReachBillingStack/ElasticInvoice_API/#accounts__accountNumber__bills__billNumber__get
         * Invoice Contract}
         */
        fetchLocationUrl: {
            method: 'POST'
        }
    });
}]);

/**
 * @ngdoc overview
 * @name encore.svcs.payment
 * @description
 * Collection of services and filters for interacting with and displaying payments
 */
angular.module('encore.svcs.payment', [
    'ngResource',
    'encore.svcs.payment.config',
    'encore.svcs.payment.filter'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.payment.config
 *
 */
angular.module('encore.svcs.payment.config', [])
/**
 * @ngdoc object
 * @name encore.svcs.payment.config:PAYMENT_NUMBER_MASK
 * @description
 * Object containing constants for Credit Card and Bank Account number masking
 *
 * ## DEFAULT_CHAR
 * the mask character to use when no custom mask character is specified
 *
 * ## CREDIT_CARD_FORMAT
 * the mask/space pattern for credit cards
 *
 * ## BANK_ACCOUNT_FORMAT
 * the mask/space pattern for bank accounts
 */
.constant('PAYMENT_NUMBER_MASK', {
    DEFAULT_CHAR: '*',
    CREDIT_CARD_FORMAT: '**** **** **** ',
    BANK_ACCOUNT_FORMAT: '*** **** '
})
/**
 * @ngdoc object
 * @name encore.svcs.payment.config.PAYMENT_FORM_URI
 * @description
 * Constant containing the URL's for the PSL form redirection
 * @example
 * <pre>
 * // passing in environment parameter
 * PAYMENT_FORM_URI['prod'];
 * </pre>
 * <pre>
 * // will return the associated url
 * https://forms.payment.api.rackspacecloud.com/v1/forms/method_capture?sessionId=
 * </pre>
 */
.constant('PAYMENT_FORM_URI', {
    'prod': 'https://forms.payment.api.rackspacecloud.com/v1/forms/method_capture?sessionId=',
    'preprod': 'https://forms.payment.api.rackspacecloud.com/v1/forms/method_capture?sessionId=',
    'unified-preprod': 'https://staging.forms.payment.api.rackspacecloud.com/v1/forms/method_capture?sessionId=',
    'local': 'https://staging.forms.payment.pipeline2.api.rackspacecloud.com/v1/forms/method_capture?sessionId='
});

/**
 * @ngdoc overview
 * @name encore.svcs.payment.filter
 *
 * @description
 * Filters for displaying payment information
 */
angular.module('encore.svcs.payment.filter', [
    'encore.svcs.payment.config'
]);

angular.module('encore.svcs.payment.filter')
/**
* @ngdoc filter
* @name encore.svcs.payment.filter:BankAccountNumberFilter
* @param {Object} PAYMENT_NUMBER_MASK - Object containing constants for number masking
* @returns {String} a masked bank account number
* @description
* Filter for masking and formatting a bank account number
*
* @param {String} accountNumber - bank account number to format and mask
* @param {String} maskChar - [optional] custom mask character
*
* @example:
* ### Use the default mask character (*)
* <pre>
* {{ ach.electronicCheck.accountNumber | BankAccountNumberFilter }}
* </pre>
* <pre>
* 01234561234 -> *** **** 1234
* </pre>
* ### Use a custom mask character (#)
* <pre>
* {{ ach.electronicCheck.accountNumber | BankAccountNumberFilter:'#' }}
* </pre>
* <pre>
* 01234561234 -> ### #### 1234
* </pre>
*
*/
.filter('BankAccountNumberFilter', ["PAYMENT_NUMBER_MASK", function (PAYMENT_NUMBER_MASK) {
    return function (accountNumber, maskChar) {
        accountNumber = PAYMENT_NUMBER_MASK.BANK_ACCOUNT_FORMAT + accountNumber.substr(-4);
        maskChar = maskChar || PAYMENT_NUMBER_MASK.DEFAULT_CHAR;
        return accountNumber.replace(/\*/g, maskChar);
    };
}]);

angular.module('encore.svcs.payment.filter')
/**
* @ngdoc filter
* @name encore.svcs.payment.filter:BankAccountTypeFilter
* @returns {String} a prettified bank account type
* @description
* Convert a bank account type from uppercase/lowercase separated by
* underscores or spaces to Title Case separated by spaces
*
* @param {String} accountType - bank account type to format
*
* @example:
* ### Example 1
* <pre>
* {{ ach.electronicCheck.accountType | BankAccountTypeFilter }}
* </pre>
* <pre>
* BUSINESS_CHECKING -> Business Checking
* </pre>
* ### Example 2
* <pre>
* {{ ach.electronicCheck.accountType | BankAccountTypeFilter }}
* </pre>
* <pre>
* consumer checking -> Consumer Checking
* </pre>
*
*/
.filter('BankAccountTypeFilter', function () {
    return function (accountType) {
        var underscoreOrSpace = /_|\s/g;
        var words = accountType.split(underscoreOrSpace);

        // _.capitalize available on lodash upgrade
        var capitalize = function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        };

        return words.map(capitalize).join(' ');
    };
});

angular.module('encore.svcs.payment.filter')
/**
* @ngdoc filter
* @name encore.svcs.payment.filter:CreditCardNumberFilter
* @param {Object} PAYMENT_NUMBER_MASK - Object containing constants for number masking
* @returns {String} a masked credit card number
* @description
* Filter for masking and formatting a credit card number
*
* @param {String} cardNumber - credit card number to format and mask
* @param {String} maskChar - [optional] custom mask character
*
* @example:
* ### Use the default mask character (*)
* <pre>
* {{ card.paymentCard.cardNumber | CreditCardNumberFilter }}
* </pre>
* <pre>
* XXXXXXXXXXXX1234 -> **** **** **** 1234
* </pre>
* ### Use a custom mask character (#)
* <pre>
* {{ card.paymentCard.cardNumber | CreditCardNumberFilter:'#' }}
* </pre>
* <pre>
* XXXXXXXXXXXX1234 -> #### #### #### 1234
* </pre>
* ### Receive only four digits as input
* The filter may also be used in cases where an API returns
* only the last four digits of a credit card number.
* <pre>
* {{ card.paymentCard.ccLast4 | CreditCardNumberFilter }}
* </pre>
* <pre>
* 1234 -> **** **** **** 1234
* </pre>
*
*/
.filter('CreditCardNumberFilter', ["PAYMENT_NUMBER_MASK", function (PAYMENT_NUMBER_MASK) {
    return function (cardNumber, maskChar) {
        cardNumber = PAYMENT_NUMBER_MASK.CREDIT_CARD_FORMAT + cardNumber.substr(-4);
        maskChar = maskChar || PAYMENT_NUMBER_MASK.DEFAULT_CHAR;
        return cardNumber.replace(/\*/g, maskChar);
    };
}]);

angular.module('encore.svcs.payment.filter')
/**
* @ngdoc filter
* @name encore.svcs.payment.filter:LastFourFilter
* @returns {String} the last four characters of a payment method number
* @description
* Filter for displaying only the last four characters of a payment method number
*
* @param {String} paymentMethodNumber - number to be formatted
*
* @example:
* <pre>
* {{ card.paymentCard.cardNumber | LastFourFilter }}
* </pre>
* <pre>
* XXXXXXXXXXXX1234 -> 1234
* </pre>
*
*/
.filter('LastFourFilter', function () {
    return function (paymentMethodNumber) {
        return paymentMethodNumber.substr(-4);
    };
});

angular.module('encore.svcs.payment')
/**
 * @ngdoc service
 * @name encore.svcs.payment.PaymentMethodResource
 * @description
 * Service for interaction with payment methods from PSL
 *
 * @requires $resource
 * @requires encore.svcs.payment.PaymentMethodTransform
 */
    .factory('PaymentMethodResource', ["$resource", "PaymentMethodTransform", function ($resource, PaymentMethodTransform) {
        return $resource('/api/payment/accounts/:accountNumber/methods/:methodId',
            {
                accountNumber: '@accountNumber'
            },
            {
                list: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: PaymentMethodTransform.list
                },
                get: {
                    method: 'GET',
                    url: '/api/payment/methods/:methodId',
                    transformResponse: PaymentMethodTransform.transformMethod
                },
                disable: { method: 'DELETE' }
            }
        );
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.payment.PaymentMethodTransform
     * @requires encore.svcs.util.http.TransformUtil
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.payment.PaymentUtil
     * @description
     * Transforms for {@link encore.svcs.payment.PaymentMethodResource PaymentMethodResource}
     */
    .factory('PaymentMethodTransform', ["TransformUtil", "Pluck", "PaymentUtil", function (TransformUtil, Pluck, PaymentUtil) {
        /**
        * @ngdoc service
        * @name PaymentMethodTransform#paymentMethodPluck
        * @methodOf encore.svcs.payment.PaymentMethodTransform
        * @description
        * Pluck the 'methods.method' if successful or the 'notFound.details'
        * if nothing was found
        */
        var paymentMethodPluck = Pluck('methods.method', 'notFound.details');

        /**
        * @ngdoc service
        * @name PaymentMethodTransform#transformMethod
        * @methodOf encore.svcs.payment.PaymentMethodTransform
        * @description
        * Pluck the 'method' node from the object of paymentMethod information
        */
        var transformMethod = Pluck('method');

        /**
         * @ngdoc service
         * @name PaymentMethodTransform#addLastUpdatedProperty
         * @methodOf encore.svcs.payment.PaymentMethodTransform
         * @description
         * Add the property `lastUpdated` to a payment method so that we can more easily display
         *
         * _"Date Added/Edited"_
         *
         * If it has been modified, use its `modifiedDate`.  Else, use its `creationDate`.
         */
        var addLastUpdatedProperty = function (paymentMethod) {
            paymentMethod.lastUpdated = paymentMethod.modifiedDate || paymentMethod.creationDate;
            return paymentMethod;
        };

        /**
         * @ngdoc service
         * @name PaymentMethodTransform#addPaymentTypeProperty
         * @methodOf encore.svcs.payment.PaymentMethodTransform
         * @description
         * The PaymentMethodResource returns an array of paymentMethod objects which must be one of four payment types:
         *     ACH, Credit Card, SEPA, or Direct Debit
         * The payment type only exists in these objects as an attribute key for the payment value. The only way to
         * determine which payment type a given paymentMethod is would be to test for each individual key. Ideally, the
         * payment method object would also include a 'paymentType' attribute for easiy reference. This call adds This
         * property to each paymentMethod object in the array returned by the resource.
         *
         * @returns {object} paymentMethod original paymentMethod modified to include payment types
         * @example
         * <pre>
         * var paymentMethodsPrime = PaymentMethodTransform.addPaymentTypeProperty({
         *     "id": "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479",
         *     "isDefault": "false",
         *     "status": "ACTIVE",
         *     "ran": "020-6154246",
         *     "creationDate": "2012-09-25T13:13:48.018Z",
         *     "modifiedDate": "2012-12-12T10:00:30.018Z",
         *     "paymentCard": {
         *         "cardHolderName": "Card Rich",
         *         "cardExpirationDate": "11/2014",
         *         "cardNumber": "XXXXXXXXXXXX3456",
         *         "cardType": "VISA",
         *         "level3Eligible": true
         *     }
         * });
         *
         * assert(paymentMethodsPrime.paymentType.key === 'paymentCard');      // True
         * assert(paymentMethodsPrime.paymentType.label === ''Credit Card'');  // True
         * </pre>
         */
        var addPaymentTypeProperty = function (paymentMethod) {
            // PaymentUtil.methodTypeMap includes all valid paymentMethod types and their display label.
            // Intersecting all its keys with all the keys from the paymentMethod should result in a single key which
            // represents the paymentMethod type
            var key = _.intersection(_.keys(PaymentUtil.methodTypeMap), _.keys(paymentMethod))[0];

            // If for some reason, no key was found, the paymentMethod is returned unmodified
            if (!key) {
                return paymentMethod;
            }

            // Since a key was found, add a new derived attribute for easy reference
            paymentMethod.paymentType = {
                key: key,
                label: PaymentUtil.methodTypeMap[key] || ''
            };
            return paymentMethod;
        };

        var paymentLastUpdateMapper = TransformUtil.mapList(addLastUpdatedProperty);
        var paymentPaymentTypeMapper = TransformUtil.mapList(addPaymentTypeProperty);

        return {
            list: TransformUtil.responseChain([paymentMethodPluck, paymentLastUpdateMapper, paymentPaymentTypeMapper]),
            transformMethod: transformMethod
        };
    }]);

angular.module('encore.svcs.payment')
/**
 * @ngdoc service
 * @name encore.svcs.payment.PaymentUtil
 * @description
 * Service containing utility methods for handling payments
 *
 */
.factory('PaymentUtil', function () {
    var methodTypeMap = {
        electronicCheck: 'ACH',
        paymentCard: 'Credit Card',
        sepa: 'SEPA',
        ukDirectDebit: 'Direct Debit'
    };

    // Each payment method must be one of 4 types and will include its type as a key
    // Compare keys against list of types and group by types
    function groupPaymentMethods(methods) {
        // An array with the same keys as methodTypeMap but with empty array values
        // ex.
        // paymentMethods = {
        //     electronicCheck: [],
        //     paymentCard: [],
        //     sepa: [],
        //     ukDirectDebit: []
        // };
        var paymentMethods = _.mapValues(methodTypeMap, _.constant([]));

        // paymentMethods do not natively include a paymentType as an attribute, but rather, stores the entire attribute
        // keyed by the name of the paymentType. Though, the EUS implementation of the resource adds this property via
        // a transform. The key is derived by comparing the keys of the dictionary of valid payment types keys against
        // each attribute key in the paymentMethod. Even though it would be easy to use the transformed paymentType
        // here, instead it is re-derived via intersection in order to support untransformed paymentMethods
        function groupingKey(item) {
            return _.intersection(_.keys(methodTypeMap), _.keys(item))[0];
        }

        return _(methods)
            .groupBy(groupingKey)
            .defaults(paymentMethods)
            .value();
    }

    // Iterate through each payment method and set the default based on the supplied id
    function setPrimaryMethod(methods, paymentInfo) {
        _.forEach(methods, function (method) {
            method.isDefault = (method.id === paymentInfo.paymentDetail);
        });

        return _.find(methods, { isDefault: true });
    }

    // DEPRECATED - Update local PSL methods with default method from BSL
    function syncMethods(bslMethod, pslMethods) {
        var primary;
        _.forEach(pslMethods, function (pslMethod) {
            if (bslMethod.paymentDetail === pslMethod.id) {
                pslMethod.isDefault = true;
                primary = _.defaults({}, bslMethod, pslMethod);
            } else {
                pslMethod.isDefault = false;
            }
        });

        return {
            primary: primary,
            methods: pslMethods
        };
    }

    return {
        // constants
        methodTypeMap: methodTypeMap,

        // methods
        groupPaymentMethods: groupPaymentMethods,
        setPrimaryMethod: setPrimaryMethod,
        syncMethods: syncMethods
    };
});

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with the Encore Support Service API
 */
angular.module('encore.svcs.supportService', [
    'ngResource',
    'encore.util.transform',
    'encore.svcs.supportService.account',
    'encore.svcs.supportService.team',
    'encore.svcs.supportService.role',
    'encore.svcs.supportService.group',
    'encore.svcs.supportService.user',
    'encore.svcs.supportService.badge',
    'encore.svcs.supportService.chatLink',
    'encore.svcs.supportService.phoneList',
    'encore.svcs.supportService.noteCategory',
    'encore.svcs.supportService.util'
]);

// TODO: `@ngdoc overview`
angular.module('encore.svcs.supportService.account', [
    'ngResource'
]);

angular.module('encore.svcs.supportService.account')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.account.SupportAccountNoteResource
     * @description
     * Service for interacting with the Support Service API Notes
     *
     * @requires $resource - AngularJS service to extend the $http and wrap Async calls to API's.
     * @example
     * <pre>
     * var accountNote = new SupportAccountNoteResource();
     *
     * // get all account notes for account #123
     * accountNote.$get({ accountNumber: 123 });
     *
     * // create new account note
     * accountNote.$save({ accountNumber: 123 }, { text: 'hello', 'category_ids': ['8'] });
     * </pre>
     */
    .factory('SupportAccountNoteResource', ["$resource", function ($resource) {
        return $resource('/api/support/support-accounts/:accountNumber/notes',
        {
            accountNumber: '@accountNumber'
        });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Badges in Encore Support Service API
 */
angular.module('encore.svcs.supportService.badge', [
    'ngResource',
    'encore.svcs.billing',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.badge')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.badge.ESSBadgeResource
     * @description
     * Badge Service for interaction with Support Service API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.svcs.billing:StringToNumericTransform
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('ESSBadgeResource', ["$resource", "StringToNumericTransform", "ESSUtil", "TransformUtil", function ($resource, StringToNumericTransform,
                                           ESSUtil, TransformUtil) {
        var chatLinks = $resource('/api/support/badges/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSBadgeResource#getPaginated
                 * @methodOf encore.svcs.supportService.badge.ESSBadgeResource
                 * @param {object} params Parameters object
                 * @param {number} params.page Page of results
                 * @param {number} params.pageSize Number of results
                 * @param {string} params.sortBy Column to sort results by
                 * @param {string} params.sortOrder Direction of sort (asc, desc)
                 * @description
                 * Returns a paginated list of Badge objects
                 * @example
                 * <pre>
                 * ESSBadgeResource.getPaginated({ page: 2 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.badge.ESSBadgeResource#methods_getPaginated
                 * ESSBadgeResource.getPaginated}*
                 * <pre>
                 * {
                 *     "totalNumberOfItems": 2,
                 *     "next_page": null,
                 *     "prev_page": null,
                 *     "items": [
                 *         {
                 *             "description": "Test Managed Badge for Cloud Control",
                 *             "url": "/managed_cloud.png",
                 *             "tag": null,
                 *             "_links": {
                 *                 "self": {
                 *                     "href": "/api/badges/132",
                 *                     "id": "132"
                 *                 }
                 *             },
                 *             "auto_assign": false,
                 *             "id": "132",
                 *             "transformedId": 132,
                 *             "name": "Test Managed Badge"
                 *         },
                 *         {
                 *             "description": "Developer+ Customer - US",
                 *             "url": "/lovelace.png",
                 *             "tag": null,
                 *             "_links": {
                 *                 "self": {
                 *                     "href": "/api/badges/172",
                 *                     "id": "172"
                 *                 }
                 *             },
                 *             "auto_assign": false,
                 *             "id": "172",
                 *             "transformedId": 172,
                 *             "name": "Developer+ Customer - US"
                 *         }
                 *     ],
                 *     "total_pages": 1,
                 *     "pageNumber": 1
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#badges_get
                 * Get Badges}
                 */
                getPaginated: {
                    method: 'GET',
                    params: {
                        page: '@page',
                        'page-size': '@pageSize',
                        'sort-by': '@sortBy',
                        'sort-order': '@sortOrder'
                    },
                    transformResponse: TransformUtil.responseChain([
                        ESSUtil.paginatedTransform,
                        StringToNumericTransform([{ path: 'id', arrayPath: 'items' }])
                    ])
                },
            });

        return chatLinks;
    }]);

angular.module('encore.svcs.supportService.badge')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.badge.ESSBadgeService
     * @description
     * Extends Badge functionality from $resource provided by ESSBadgeResource
     *
     * @requires encore.svcs.supportService.badge.ESSBadgeResource
     * @requires encore.svcs.supportService.util.ESSUtil
     */

    .factory('ESSBadgeService', ["ESSBadgeResource", "ESSUtil", function (ESSBadgeResource, ESSUtil) {

        var badges = {};

        /**
         * @ngdoc method
         * @name ESSBadgeService#getAll
         * @methodOf encore.svcs.supportService.badge.ESSBadgeService
         * @description
         * Returns all Badge objects by fetching each page of results
         * @example
         * <pre>
         * ESSBadgeService.getAll()
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.badge.ESSBadgeService#methods_getAll ESSBadgeService.getAll}*
         * <pre>
         * [
         *     {
         *         "description": "Test Managed Badge for Cloud Control",
         *         "url": "/managed_cloud.png",
         *         "tag": null,
         *         "_links": {
         *             "self": {
         *                 "href": "/api/badges/132",
         *                 "id": "132"
         *             }
         *         },
         *         "auto_assign": false,
         *         "id": "132",
         *         "transformedId": 132,
         *         "name": "Test Managed Badge"
         *     },
         *     {
         *         "description": "Developer+ Customer - US",
         *         "url": "/lovelace.png",
         *         "tag": null,
         *         "_links": {
         *             "self": {
         *                 "href": "/api/badges/172",
         *                 "id": "172"
         *             }
         *         },
         *         "auto_assign": false,
         *         "id": "172",
         *         "transformedId": 172,
         *         "name": "Developer+ Customer - US"
         *     }
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#badges_get
         * Get Badges}
         */
        badges.getAll = function () {
            return ESSUtil.getAllPages(ESSBadgeResource.getPaginated);
        };

        return badges;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Chat Links (aka chat teams) in
 * Encore Support Service API
 */
angular.module('encore.svcs.supportService.chatLink', [
    'ngResource',
    'encore.svcs.billing',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.chatLink')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.chatLink.ESSChatLinkResource
     * @description
     * Chat Link Service for interaction with Support Service Chat Teams API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.svcs.billing:StringToNumericTransform
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('ESSChatLinkResource', ["$resource", "StringToNumericTransform", "ESSUtil", "TransformUtil", function ($resource, StringToNumericTransform,
                                              ESSUtil, TransformUtil) {
        var chatLinks = $resource('/api/support/chat-teams/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSChatLinkResource#getPaginated
                 * @methodOf encore.svcs.supportService.chatLink.ESSChatLinkResource
                 * @param {object} params Parameters object
                 * @param {number} params.page Page of results
                 * @param {number} params.pageSize Number of results
                 * @param {string} params.sortBy Column to sort results by
                 * @param {string} params.sortOrder Direction of sort (asc, desc)
                 * @description
                 * Returns a paginated list of Chat Link objects
                 * @example
                 * <pre>
                 * ESSChatLinkResource.getPaginated({ page: 2 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.chatLink.ESSChatLinkResource#methods_getPaginated
                 * ESSChatLinkResource.getPaginated}*
                 * <pre>
                 * {
                 *      "totalNumberOfItems": 2,
                 *      "next_page": null,
                 *      "prev_page": null,
                 *      "items": [
                 *          {
                 *              "_links": {
                 *                  "chat-departments": {
                 *                      "href": "/api/chat-teams/1/chat-departments"
                 *                  },
                 *                  "self": {
                 *                      "href": "/api/chat-teams/1",
                 *                      "id": "1"
                 *                  }
                 *              },
                 *              "survey": "US CORE/Managed",
                 *              "id": "1",
                 *              "transformedId": 1,
                 *              "chat_departments": [
                 *                  {
                 *                      "is_default": false,
                 *                      "url": "/liveagent?Portal=Cloud&rdid=57350000000PBI9",
                 *                      "id": 1,
                 *                      "name": "c726e639"
                 *                  }
                 *              ],
                 *              "name": "US CORE/Managed"
                 *          },
                 *          {
                 *              "_links": {
                 *                  "chat-departments": {
                 *                      "href": "/api/chat-teams/3/chat-departments"
                 *                  },
                 *                  "self": {
                 *                      "href": "/api/chat-teams/3",
                 *                      "id": "3"
                 *                  }
                 *              },
                 *              "survey": "US CORE/Managed",
                 *              "id": "3",
                 *              "transformedId": 3,
                 *              "chat_departments": [
                 *                  {
                 *                      "is_default": true,
                 *                      "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIb",
                 *                      "id": 5,
                 *                      "name": "US Managed Cloud Linux (Default)"
                 *                  },
                 *                  {
                 *                      "is_default": false,
                 *                      "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIg",
                 *                      "id": 6,
                 *                      "name": "US Managed Cloud Windows"
                 *                  },
                 *                  {
                 *                      "is_default": false,
                 *                      "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIw",
                 *                      "id": 7,
                 *                      "name": "Managed Cloud Account Managers"
                 *                  },
                 *                  {
                 *                      "is_default": false,
                 *                      "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIz",
                 *                      "id": 8,
                 *                      "name": "Managed Cloud Advisors"
                 *                  }
                 *              ],
                 *              "name": "Prod // US Support Managed"
                 *          }
                 *      ],
                 *      "total_pages": 1,
                 *      "pageNumber": 1
                 *  }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#chat_teams_get
                 * Get Chat Teams}
                 */
                getPaginated: {
                    method: 'GET',
                    params: {
                        page: '@page',
                        'page-size': '@pageSize',
                        'sort-by': '@sortBy',
                        'sort-order': '@sortOrder'
                    },
                    transformResponse: TransformUtil.responseChain([
                        ESSUtil.paginatedTransform,
                        StringToNumericTransform([{ path: 'id', arrayPath: 'items' }])
                    ])
                },
            });

        return chatLinks;
    }]);

angular.module('encore.svcs.supportService.chatLink')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.chatLink.ESSChatLinkService
     * @description
     * Extends Chat Link functionality from $resource provided by ESSChatLinkResource
     *
     * @requires encore.svcs.supportService.chatLink.ESSChatLinkResource
     * @requires encore.svcs.supportService.util.ESSUtil
     */

    .factory('ESSChatLinkService', ["ESSChatLinkResource", "ESSUtil", function (ESSChatLinkResource, ESSUtil) {

        var chatLinks = {};

        /**
         * @ngdoc method
         * @name ESSChatLinkService#getAll
         * @methodOf encore.svcs.supportService.chatLink.ESSChatLinkService
         * @description
         * Returns all Chat Link objects by fetching each page of results
         * @example
         * <pre>
         * ESSChatLinkService.getAll()
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.chatLink.ESSChatLinkService#methods_getAll ESSChatLinkService.getAll}*
         * <pre>
         * [
         *     {
         *         "_links": {
         *             "chat-departments": {
         *                 "href": "/api/chat-teams/1/chat-departments"
         *             },
         *             "self": {
         *                 "href": "/api/chat-teams/1",
         *                 "id": "1"
         *             }
         *         },
         *         "survey": "US CORE/Managed",
         *         "id": "1",
         *         "transformedId": 1,
         *         "chat_departments": [
         *             {
         *                 "is_default": false,
         *                 "url": "/liveagent?Portal=Cloud&rdid=57350000000PBI9",
         *                 "id": 1,
         *                 "name": "c726e639"
         *             }
         *         ],
         *         "name": "US CORE/Managed"
         *     },
         *     {
         *         "_links": {
         *             "chat-departments": {
         *                 "href": "/api/chat-teams/3/chat-departments"
         *             },
         *             "self": {
         *                 "href": "/api/chat-teams/3",
         *                 "id": "3"
         *             }
         *         },
         *         "survey": "US CORE/Managed",
         *         "id": "3",
         *         "transformedId": 3,
         *         "chat_departments": [
         *             {
         *                 "is_default": true,
         *                 "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIb",
         *                 "id": 5,
         *                 "name": "US Managed Cloud Linux (Default)"
         *             },
         *             {
         *                 "is_default": false,
         *                 "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIg",
         *                 "id": 6,
         *                 "name": "US Managed Cloud Windows"
         *             },
         *             {
         *                 "is_default": false,
         *                 "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIw",
         *                 "id": 7,
         *                 "name": "Managed Cloud Account Managers"
         *             },
         *             {
         *                 "is_default": false,
         *                 "url": "/liveagent?Portal=Cloud&rdid=57350000000PBIz",
         *                 "id": 8,
         *                 "name": "Managed Cloud Advisors"
         *             }
         *         ],
         *         "name": "Prod // US Support Managed"
         *     }
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#chat_teams_get
         * Get Chat Teams}
         */
        chatLinks.getAll = function () {
            return ESSUtil.getAllPages(ESSChatLinkResource.getPaginated);
        };

        return chatLinks;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Groups in Encore Support Service API
 */
angular.module('encore.svcs.supportService.group', [
    'ngResource',
    'encore.svcs.billing',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.group')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.group.ESSGroupResource
     * @description
     * Groups Service for interaction with Support Service Groups API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.billing:StringToNumericTransform
     */
    .factory('ESSGroupResource', ["$resource", "Pluck", "StringToNumericTransform", function ($resource, Pluck, StringToNumericTransform) {
        var transform = Pluck('items', '');
        var groups = $resource('/api/support/groups/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSGroupResource#getAll
                 * @methodOf encore.svcs.supportService.group.ESSGroupResource
                 * @description
                 * Returns a list of Group objects
                 * @example
                 * <pre>
                 * ESSGroupResource.getAll()
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.group.ESSGroupResource#methods_getAll ESSGroupResource.getAll}*
                 * <pre>
                 * [
                 *     {
                 *         "_links": {
                 *             "self": {
                 *                 "href": "http://localhost:8080/api/groups/2",
                 *                 "id": "2"
                 *             },
                 *             "users": {
                 *                 "href": "http://localhost:8080/api/groups/2/users"
                 *             }
                 *         },
                 *         "id": "2",
                 *         "name": "QA - (Does Not Exist In Production)"
                 *     },
                 *     {
                 *         "_links": {
                 *             "self": {
                 *                 "href": "http://localhost:8080/api/groups/3",
                 *                 "id": "3"
                 *             },
                 *             "users": {
                 *                 "href": "http://localhost:8080/api/groups/3/users"
                 *             }
                 *         },
                 *         "id": "3",
                 *         "transformedId": 3,
                 *         "name": "Core Services_updated"
                 *     },
                 *     ...
                 * ]
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#groups_get
                 * Get Groups}
                 */
                getAll: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: [
                        transform,
                        StringToNumericTransform([
                            { path: 'id', arrayPath: '' }
                        ])
                    ]
                },
                /**
                 * @ngdoc method
                 * @name ESSGroupResource#update
                 * @methodOf encore.svcs.supportService.group.ESSGroupResource
                 * @param {number} id Group ID
                 * @param {string} name New Group name
                 * @description
                 * Updates a Group resource
                 * @example
                 * <pre>
                 * ESSGroupResource.update({ id: 8, name: "Foobar" })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.group.ESSGroupResource#methods_update ESSGroupResource.update}*
                 * <pre>
                 * {
                 *     "_links": {
                 *         "self": {
                 *             "href": "http://localhost:8080/api/groups/8",
                 *             "id": "8"
                 *         },
                 *         "users": {
                 *             "href": "http://localhost:8080/api/groups/8/users"
                 *         }
                 *     },
                 *     "id": "8",
                 *     "name": "Foobar"
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__put
                 * Update Group}
                 */
                update: {
                    method: 'PUT'
                }
            });

        return groups;
    }]);

angular.module('encore.svcs.supportService.group')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.group.ESSGroupUserResource
     * @description
     * Service for interacting with Groups in the Encore Support Service API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('ESSGroupUserResource', ["$resource", "Pluck", "ESSUtil", "TransformUtil", function ($resource, Pluck, ESSUtil, TransformUtil) {
        var transform = Pluck('items', '');
        var groupUsers = $resource('/api/support/groups/:id/users',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSGroupUserResource#get
                 * @methodOf encore.svcs.supportService.group.ESSGroupUserResource
                 * @param {object} params Parameters object
                 * @param {number} params.id Group ID
                 * @param {number} params.page Page of results
                 * @param {number} params.pageSize Number of results
                 * @param {string} params.sortBy Column to sort results by
                 * @param {string} params.sortOrder Direction of sort (asc, desc)
                 * @description
                 * Returns a paginated list of User objects belonging to a Group
                 * @example
                 * <pre>
                 * ESSGroupUserResource.get({ id: 8 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.group.ESSGroupUserResource#methods_get ESSGroupUserResource.get}*
                 * <pre>
                 * {
                 *     "totalNumberOfItems": 1,
                 *     "pageNumber": 1,
                 *     "items": [
                 *         {
                 *             "sso": "eamonn.comerford",
                 *             "_links": {
                 *                 "self": {
                 *                     "href": "/api/users/eamonn.comerford",
                 *                     "id": "eamonn.comerford"
                 *                 },
                 *                 "team_roles": {
                 *                     "href": "/api/users/eamonn.comerford/team-roles"
                 *                 },
                 *                 "groups": {
                 *                     "href": "/api/users/eamonn.comerford/groups"
                 *                 },
                 *                 "account_roles": {
                 *                     "href": "/api/users/eamonn.comerford/account-roles"
                 *                 }
                 *             },
                 *             "name": "Eamonn Comerford",
                 *             "tags": [
                 *                 "foobar"
                 *             ],
                 *             "id": "4218",
                 *             "email": "eamonn.comerford@RACKSPACE.COM"
                 *         }
                 *     ],
                 *     "total_pages": 1,
                 *     "next_page": null,
                 *     "prev_page": null
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__users_get
                 * Get Users in Group}
                 */
                get: {
                    method: 'GET',
                    params: {
                        page: '@page',
                        'page-size': '@pageSize',
                        'sort-by': '@sortBy',
                        'sort-order': '@sortOrder'
                    },
                    transformResponse: TransformUtil.responseChain(ESSUtil.paginatedTransform)
                },
                /**
                 * @ngdoc method
                 * @name ESSGroupUserResource#add
                 * @methodOf encore.svcs.supportService.group.ESSGroupUserResource
                 * @param {number} id Group ID
                 * @param {string[]} users List of user SSOs
                 * @description
                 * Add multiple Users to a Group
                 * @example
                 * <pre>
                 * ESSGroupUserResource.add({ id: 8, users: ["eamonn.comerford", "salm0028"] })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.group.ESSGroupUserResource#methods_remove
                 *     ESSGroupUserResource.remove}*
                 * <pre>
                 * [
                 *     {
                 *         "sso": "eamonn.comerford",
                 *         "message": null,
                 *         "success": true
                 *     },
                 *     {
                 *         "sso": "salm0028",
                 *         "message": null,
                 *         "success": true
                 *     }
                 * ]
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__users_post
                 * Add Users to Group}
                 */
                add: {
                    method: 'POST',
                    isArray: true,
                    transformResponse: transform
                },
                /**
                 * @ngdoc method
                 * @name ESSGroupUserResource#copy
                 * @methodOf encore.svcs.supportService.group.ESSGroupUserResource
                 * @param {number} id Group ID
                 * @param {number} source_group_id Group ID
                 * @description
                 * Add all users from Source Group to Destination Group
                 * @example
                 * <pre>
                 * ESSGroupUserResource.copy({ id: 8, source_group_id: 2 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.group.ESSGroupUserResource#methods_copy ESSGroupUserResource.copy}*
                 * <pre>
                 * {
                 *     "_links": {
                 *         "self": {
                 *             "href": "/api/groups/8",
                 *             "id": "8"
                 *         },
                 *         "users": {
                 *             "href": "/api/groups/8/users"
                 *         }
                 *     },
                 *     "id": "8",
                 *     "name": "Foobar"
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__copy_users_post
                 * Copy Group Users}
                 */
                copy: {
                    method: 'POST',
                    url: '/api/support/groups/:id/copy-users',
                }
            });

        return groupUsers;
    }]);

angular.module('encore.svcs.supportService.group')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.group.ESSGroupUserService
     * @description
     * Extends Group User functionality from $resource provided by ESSGroupUserResource
     *
     * @requires encore.svcs.supportService.group.ESSGroupUserResource
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires $http
     */

    .factory('ESSGroupUserService', ["ESSGroupUserResource", "ESSUtil", "$http", function (ESSGroupUserResource, ESSUtil, $http) {

        var groupUsers = {};

        /**
         * @ngdoc method
         * @name ESSGroupUserService#getAll
         * @methodOf encore.svcs.supportService.group.ESSGroupUserService
         * @param {object} params Parameters object
         * @param {number} params.id ID of Group in ESS API
         * @description
         * Returns all User objects belonging to a Group by fetching each page of results
         * @example
         * <pre>
         * ESSGroupUserService.getAll({ id: 1234 })
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.group.ESSGroupUserService#methods_get ESSGroupUserService.get}*
         * <pre>
         * [
         *     {
         *         "sso": "eamonn.comerford",
         *         "_links": {
         *             "self": {
         *                 "href": "/api/users/eamonn.comerford",
         *                 "id": "eamonn.comerford"
         *             },
         *             "team_roles": {
         *                 "href": "/api/users/eamonn.comerford/team-roles"
         *             },
         *             "groups": {
         *                 "href": "/api/users/eamonn.comerford/groups"
         *             },
         *             "account_roles": {
         *                 "href": "/api/users/eamonn.comerford/account-roles"
         *             }
         *         },
         *         "name": "Eamonn Comerford",
         *         "tags": [
         *             "foobar"
         *         ],
         *         "id": "4218",
         *         "email": "eamonn.comerford@RACKSPACE.COM"
         *     },
         *     {
         *         "sso": "bob1234",
         *         "_links": {
         *             "self": {
         *                 "href": "/api/users/bob1234",
         *                 "id": "bob1234"
         *             },
         *             "team_roles": {
         *                 "href": "/api/users/bob1234/team-roles"
         *             },
         *             "groups": {
         *                 "href": "/api/users/bob1234/groups"
         *             },
         *             "account_roles": {
         *                 "href": "/api/users/bob1234/account-roles"
         *             }
         *         },
         *         "name": "Bob Dole",
         *         "tags": [
         *             "bob dole"
         *         ],
         *         "id": "1234",
         *         "email": "bob1234@RACKSPACE.COM"
         *     },
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__users_get
         * Get Users in Group}
         */
        groupUsers.getAll = function (args) {
            return ESSUtil.getAllPages(ESSGroupUserResource.get, args);
        };

        /**
         * @ngdoc method
         * @name ESSGroupUserService#remove
         * @methodOf encore.svcs.supportService.group.ESSGroupUserService
         * @param {object} params Parameters object
         * @param {number} params.id ID of Group in ESS API
         * @param {string[]} params.users List of User SSOs to be removed from the group
         * @description
         * Removes users from a group
         * @example
         * <pre>
         * ESSGroupUserService.remove({ id: 1234 , users: ['bob.dobbs', 'connie.dobs']})
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.group.ESSGroupUserService#methods_get ESSGroupUserService.get}*
         * <pre>
         * [
         *     {
         *         "sso": "bob.dobbs",
         *         "message": null,
         *         "success": true
         *     },
         *     {
         *         "sso": "connie.dobs",
         *         "message": "Cannot find the user: connie.dobs",
         *         "success": false
         *     },
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#groups__group_id__users_get
         * Users}
         */
        groupUsers.remove = function (params) {
            return $http({
                method: 'DELETE',
                url: '/api/support/groups/' + params.id + '/users',
                data: { users: params.users },
                headers: { 'Content-Type': 'application/json;charset=utf-8' }
            });
        };

        return groupUsers;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Note Categories in
 * Encore Support Service API
 */
angular.module('encore.svcs.supportService.noteCategory', [
    'ngResource',
    'encore.svcs.billing'
]);

angular.module('encore.svcs.supportService.noteCategory')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.noteCategory.ESSNoteCategoryResource
     * @description
     * Note Category Service for interaction with Support Service API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.billing:StringToNumericTransform
     */
    .factory('ESSNoteCategoryResource', ["$resource", "Pluck", "StringToNumericTransform", function ($resource, Pluck, StringToNumericTransform) {
        var transform = Pluck('items', '');
        var noteCategories = $resource('/api/support/note-categories/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSNoteCategoryResource#getAll
                 * @methodOf encore.svcs.supportService.noteCategory.ESSNoteCategoryResource
                 * @description
                 * Returns a list of Note Category objects
                 * @example
                 * <pre>
                 * ESSNoteCategoryResource.getAll()
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.noteCategory.ESSNoteCategoryResource#methods_getAll
                 * ESSNoteCategoryResource.getAll}*
                 * <pre>
                 * [
                 *      {
                 *          "_links": {
                 *              "self": {
                 *                  "href": "/api/note-categories/8",
                 *                  "id": "8"
                 *              }
                 *          },
                 *          "id": "8",
                 *          "transformedId": 8,
                 *          "name": "account"
                 *      },
                 *      {
                 *          "_links": {
                 *              "self": {
                 *                  "href": "/api/note-categories/457",
                 *                  "id": "457"
                 *              }
                 *          },
                 *          "id": "457",
                 *          "transformedId": 457,
                 *          "name": "HMDB Account Notes"
                 *      },
                 *      {
                 *          "_links": {
                 *              "self": {
                 *                  "href": "/api/note-categories/563",
                 *                  "id": "563"
                 *              }
                 *          },
                 *          "id": "563",
                 *          "transformedId": 563,
                 *          "name": "Billing"
                 *      }
                 * ]
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#note-categories_get
                 * Get Note Categories}
                 */
                getAll: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: [
                        transform,
                        StringToNumericTransform([
                            { path: 'id', arrayPath: 'items' }
                        ])
                    ]
                },
            });

        return noteCategories;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Phone Lists (aka phone teams) in
 * Encore Support Service API
 */
angular.module('encore.svcs.supportService.phoneList', [
    'ngResource',
    'encore.svcs.billing',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.phoneList')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.phoneList.ESSPhoneListResource
     * @description
     * Phone List Service for interaction with Support Service API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.svcs.billing:StringToNumericTransform
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('ESSPhoneListResource', ["$resource", "StringToNumericTransform", "ESSUtil", "TransformUtil", function ($resource, StringToNumericTransform,
                                               ESSUtil, TransformUtil) {
        var chatLinks = $resource('/api/support/phone-teams/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSPhoneListResource#getPaginated
                 * @methodOf encore.svcs.supportService.phoneList.ESSPhoneListResource
                 * @param {object} params Parameters object
                 * @param {number} params.page Page of results
                 * @param {number} params.pageSize Number of results
                 * @param {string} params.sortBy Column to sort results by
                 * @param {string} params.sortOrder Direction of sort (asc, desc)
                 * @description
                 * Returns a paginated list of Phone List objects
                 * @example
                 * <pre>
                 * ESSPhoneListResource.getPaginated({ page: 2 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.phoneList.ESSPhoneListResource#methods_getPaginated
                 * ESSPhoneListResource.getPaginated}*
                 * <pre>
                 * {
                 *     "totalNumberOfItems": 2,
                 *     "next_page": null,
                 *     "prev_page": null,
                 *     "items": [
                 *         {
                 *             "phone_numbers": [
                 *                 {
                 *                     "phone_number": "633e7ffe",
                 *                     "is_primary": false,
                 *                     "flag": "cda98f0f",
                 *                     "id": 1,
                 *                     "country_code": "08"
                 *                 }
                 *             ],
                 *             "_links": {
                 *                 "self": {
                 *                     "href": "/api/phone-teams/1",
                 *                     "id": "1"
                 *                 }
                 *             },
                 *             "id": "1",
                 *             "transformedId": 1,
                 *             "name": "US_UNMANAGED_SUPPORT"
                 *         },
                 *         {
                 *             "phone_numbers": [
                 *                 {
                 *                     "phone_number": "867-5309",
                 *                     "is_primary": false,
                 *                     "flag": "us-flag",
                 *                     "id": 5,
                 *                     "country_code": "+1"
                 *                 },
                 *                 {
                 *                     "phone_number": "1800-555-555",
                 *                     "is_primary": false,
                 *                     "flag": "au-flag",
                 *                     "id": 6,
                 *                     "country_code": "+61"
                 *                 }
                 *             ],
                 *             "_links": {
                 *                 "self": {
                 *                     "href": "/api/phone-teams/2",
                 *                     "id": "2"
                 *                 }
                 *             },
                 *             "id": "2",
                 *             "transformedId": 2,
                 *             "name": "US_MANAGED_SUPPORT"
                 *         }
                 *     ],
                 *     "total_pages": 1,
                 *     "pageNumber": 1
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#phone_teams_get
                 * Get Phone Teams}
                 */
                getPaginated: {
                    method: 'GET',
                    params: {
                        page: '@page',
                        'page-size': '@pageSize',
                        'sort-by': '@sortBy',
                        'sort-order': '@sortOrder'
                    },
                    transformResponse: TransformUtil.responseChain([
                        ESSUtil.paginatedTransform,
                        StringToNumericTransform([{ path: 'id', arrayPath: 'items' }])
                    ])
                },
            });

        return chatLinks;
    }]);

angular.module('encore.svcs.supportService.phoneList')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.phoneList.ESSPhoneListService
     * @description
     * Extends Chat Link functionality from $resource provided by ESSPhoneListResource
     *
     * @requires encore.svcs.supportService.phoneList.ESSPhoneListResource
     * @requires encore.svcs.supportService.util.ESSUtil
     */

    .factory('ESSPhoneListService', ["ESSPhoneListResource", "ESSUtil", function (ESSPhoneListResource, ESSUtil) {

        var phoneLists = {};

        /**
         * @ngdoc method
         * @name ESSPhoneListService#getAll
         * @methodOf encore.svcs.supportService.phoneList.ESSPhoneListService
         * @description
         * Returns all Phone List objects by fetching each page of results
         * @example
         * <pre>
         * ESSPhoneListService.getAll()
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.phoneList.ESSPhoneListService#methods_getAll ESSPhoneListService.getAll}*
         * <pre>
         * [
         *     {
         *         "phone_numbers": [
         *             {
         *                 "phone_number": "633e7ffe",
         *                 "is_primary": false,
         *                 "flag": "cda98f0f",
         *                 "id": 1,
         *                 "country_code": "08"
         *             }
         *         ],
         *         "_links": {
         *             "self": {
         *                 "href": "/api/phone-teams/1",
         *                 "id": "1"
         *             }
         *         },
         *         "id": "1",
         *         "transformedId": 1,
         *         "name": "US_UNMANAGED_SUPPORT"
         *     },
         *     {
         *         "phone_numbers": [
         *             {
         *                 "phone_number": "867-5309",
         *                 "is_primary": false,
         *                 "flag": "us-flag",
         *                 "id": 5,
         *                 "country_code": "+1"
         *             },
         *             {
         *                 "phone_number": "1800-555-5555",
         *                 "is_primary": false,
         *                 "flag": "au-flag",
         *                 "id": 6,
         *                 "country_code": "+61"
         *             }
         *         ],
         *         "_links": {
         *             "self": {
         *                 "href": "/api/phone-teams/2",
         *                 "id": "2"
         *             }
         *         },
         *         "id": "2",
         *         "transformedId": 2,
         *         "name": "US_MANAGED_SUPPORT"
         *     }
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#phone_teams_get
         * Get Phone Teams}
         */
        phoneLists.getAll = function () {
            return ESSUtil.getAllPages(ESSPhoneListResource.getPaginated);
        };

        return phoneLists;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Roles in Encore Support Service API
 */
angular.module('encore.svcs.supportService.role', [
    'ngResource',
    'encore.svcs.billing'
]);

angular.module('encore.svcs.supportService.role')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.role.ESSRoleResource
     * @description
     * Role Service for interaction with Support Service API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.util.transform.Pluck
     * @requires encore.svcs.billing:StringToNumericTransform
     */
    .factory('ESSRoleResource', ["$resource", "Pluck", "StringToNumericTransform", function ($resource, Pluck, StringToNumericTransform) {
        var transform = Pluck('items', '');
        var roles = $resource('/api/support/roles/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSRoleResource#getAll
                 * @methodOf encore.svcs.supportService.role.ESSRoleResource
                 * @description
                 * Returns a list of Role objects
                 * @example
                 * <pre>
                 * ESSRoleResource.getAll()
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.role.ESSRoleResource#methods_getAll
                 * ESSRoleResource.getAll}*
                 * <pre>
                 * [
                 *     {
                 *         "_links": {
                 *             "self": {
                 *                 "href": "/api/roles/1",
                 *                 "id": "1"
                 *             }
                 *         },
                 *         "id": "1",
                 *         "transformedId": 1,
                 *         "name": "Team Owner"
                 *     },
                 *     {
                 *         "_links": {
                 *             "self": {
                 *                 "href": "/api/roles/2",
                 *                 "id": "2"
                 *             }
                 *         },
                 *         "id": "2",
                 *         "transformedId": 2,
                 *         "name": "Account Manager"
                 *     }
                 * ]
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#roles_get
                 * Get Roles}
                 */
                getAll: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: [
                        transform,
                        StringToNumericTransform([
                            { path: 'id', arrayPath: 'items' }
                        ])
                    ]
                },
            });

        return roles;
    }]);

// TODO: split into multiple files per https://github.com/rackerlabs/encore-ui-svcs#naming-conventions
angular.module('encore.svcs.supportService')
    /**
     * @ngdoc filter
     * @name encore.svcs.supportSvcs.filter:RoleName
     * @description
     * Filter a list of account roles by a specific name.
     *
     * @param {Array} roles - collection of Contacts to be filtered.
     * @param {String} name - Key to filter by
     */
    .filter('RoleName', function () {
        return function (roles, name) {
            return _.filter(roles, { role: { name: name }});
        };
    })
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.SupportAccount
     * @description
     * SupportAccount Service for interaction with Support Service Account Details API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('SupportAccount', ["$resource", "$q", "Q", "Pluck", "RoleNameFilter", function ($resource, $q, Q, Pluck, RoleNameFilter) {
        var transform = Pluck('items', '');
        var account = $resource('/api/support/support-accounts/:accountNumber/:relation',
            {
                accountNumber: '@accountNumber'
            },
            {
                getRoles: {
                    method: 'GET',
                    params: { relation: 'roles' },
                    isArray: true,
                    transformResponse: transform
                },
                getTeams: {
                    method: 'GET',
                    params: { relation: 'teams' },
                    isArray: true,
                    transformResponse: transform
                },
                update: {
                    method: 'PUT',
                },
                getNotes: {
                    method: 'GET',
                    params: { relation: 'notes' },
                    isArray: true,
                    transformResponse: transform
                },
                getBadges: {
                    method: 'GET',
                    params: { relation: 'badges' },
                    isArray: true,
                    transformResponse: transform
                },
                removeUser: {
                    method: 'DELETE',
                    params: {
                        'user_sso': '@sso',
                        'role_id': '@roleId',
                        relation: 'roles'
                    }
                }
            });

        account.getRoleByName = function (accountNumber, name) {
            var deferred = $q.defer();
            account.getRoles(
                { accountNumber: accountNumber },
                function (roles) {
                    var result = _.head(RoleNameFilter(roles, name));
                    if (!_.isEmpty(result)) {
                        return deferred.resolve(result.user);
                    }
                    deferred.resolve(undefined);
                },
                function (err) {
                    deferred.reject(err.data);
                });
            return deferred.promise;
        };

        account.addTeams = function (accountNumber, teamIds, type) {
            var errors = {
                others: [],
                invalidTeams: [],
            };
            var promises = [];

            _.forEach(teamIds, function (id) {
                var resource = account.update(
                    {
                        accountNumber: accountNumber,
                        relation: 'teams'
                    },
                    {
                        team: {
                            number: id.toString(),
                            type: type
                        }
                    },
                    function () {
                        return '';
                    },
                    function (err) {
                        if (err.data.description.match(/does not exist/)) {
                            return errors.invalidTeams.push(err.config.data.team.number);
                        }
                        $q.reject(err.data.description);
                    }
                );

                promises.push(resource.$promise);
            });

            return Q.allSettled(promises)
            .then(null, function (err) {
                errors.others.push(err.data.description);
            })
            .finally(function () {
                return $q.reject(errors);
            });
        };

        return account;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Roles
     * @description
     * SupportRoles Service for interaction with Support Service Roles API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('Roles', ["$resource", "Transform", function ($resource, Transform) {
        return $resource('/api/support/roles/:id',
            null,
            {
                query: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: Transform.customTransform('roles')
                }
            });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Teams
     * @description
     * Teams Service for interaction with Support Service Teams API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires $q - AngularJS promise library for interacting with Search API
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('Teams', ["$resource", "$q", "Transform", function ($resource, $q, Transform) {
        var svc = $resource('/api/support/teams/:id/:relation',
            null,
            {
                query: {
                    method: 'GET',
                    transformResponse: Transform.customTransform('teams')
                },
                accounts: {
                    method: 'GET',
                    params: { relation: 'accounts' },
                    isArray: true,
                    transformResponse: Transform.customTransform('accounts')
                },
                badges: {
                    method: 'GET',
                    params: { relation: 'badges' },
                    isArray: true,
                    transformResponse: Transform.customTransform('badges')
                },
                addUser: {
                    method: 'PUT',
                    params: { relation: 'roles' }
                },
                removeUser: {
                    method: 'DELETE',
                    params: {
                        'user_sso': '@sso',
                        'role_id': '@roleId',
                        relation: 'roles'
                    },
                },
                addAccounts: {
                    method: 'POST',
                    params: { relation: 'accounts' },
                    transformResponse: Transform.customTransform('bulkResponse')
                },
            });

        svc.search = function (args) {
            var result = [];
            var deferred = $q.defer();
            var callback = function (teams) {
                result = result.concat(teams.items);
                if (!teams.nextPage) {
                    // Convert team number to integer for proper sorting
                    _.forEach(result, function (obj) {
                        obj.number = Transform.stringToInt(obj.number);
                    });
                    return deferred.resolve(result);
                }

                window.url.setUrl(teams.nextPage);
                args.page = window.url.page;
                svc.query(args).$promise.then(callback);
            };

            svc.query(args).$promise.then(callback);
            return deferred.promise;
        };

        return svc;
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Users
     * @description
     * Users Service for interaction with Support Service Users API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     * @requires TransformRequest - Service used to transform UI requests send to the API.
     */
    .factory('Users', ["$resource", "Transform", "TransformRequest", function ($resource, Transform, TransformRequest) {
        return $resource('/api/support/users/:sso/:relation',
            null,
            {
                addAccounts: {
                    method: 'POST',
                    params: { relation: 'account-roles' },
                    transformRequest: TransformRequest.addUserAccounts,
                    transformResponse: Transform.customTransform('bulkResponse')
                },
                getGroups: {
                    method: 'GET',
                    params: { relation: 'groups' },
                    transformResponse: Transform.customTransform('groups')
                },
                updateGroups: {
                    method: 'PUT',
                    params: { relation: 'groups' },
                    transformRequest: TransformRequest.updateUserGroups
                }
            });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Groups
     * @description
     * Groups Service for interaction with Support Service Groups API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('Groups', ["$resource", "Transform", function ($resource, Transform) {
        return $resource('/api/support/groups/:id',
            null,
            {
                search: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: Transform.customTransform('groups')
                }
            });
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Badges
     * @description
     * Badges Service for interaction with Support Service Badges API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     */
    .factory('Badges', ["$resource", function ($resource) {
        return $resource('/api/support/badges/:id');
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Categories
     * @description
     * Categories Service for interaction with Support Service Categories API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('Categories', ["$resource", "Transform", function ($resource, Transform) {
        return $resource('/api/support/note-categories/:id',
            null,
            {
                query: {
                    method: 'GET',
                    cache: true,
                    transformResponse: Transform.customTransform('categories'),
                    isArray: true
                },
                update: {
                    method: 'PUT'
                }
            }
        );
    }])
    /**
     * @ngdoc service
     * @name encore.svcs.supportSvcs.Notes
     * @description
     * Notes Service for interaction with Support Service Roles API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('Notes', ["$resource", "Transform", function ($resource, Transform) {
        return $resource('/api/support/support-accounts/:accountNumber/notes',
            {
                accountNumber: '@accountNumber'
            },
            {
                save: { method: 'POST', transformResponse: Transform.customTransform('note') }
            });
    }])
    // TODO convert this to an addon of for $q
    .service('Q', ["$q", function ($q) {
        // Because $q does not have an 'allSettled' function, we need to recreate the functionality
        // so, we'll manually check if all the promises have been resolved, and respond accordingly

        /*
         * Creates a new promise that resolves only when all promises have completed
         * @param {Array} promises - The promises that we're going to wait for
         * @returns {Object} Promise tied to promises passed in
         */
        var allSettled = function (promises) {
            var deferred = $q.defer();
            var promisesCount = promises.length;
            var promisesComplete = 0;

            /*
             * increments the number of resolved promises, checks if they've all resolved,
             * and resolves parent promise accordingly
             */
            var resolvePromise = function (data, hasPromiseFailed) {
                promisesComplete++;
                if (promisesComplete === promisesCount) {
                    (hasPromiseFailed) ? deferred.reject(data) : deferred.resolve(data);
                }
            };

            var rejectPromise = function (data) {
                resolvePromise(data, true);
            };

            _.each(promises, function (promise) {
                promise.then(resolvePromise, rejectPromise);
            });

            return deferred.promise;
        };

        return {
            allSettled: allSettled
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Teams in Encore Support Service API
 */
angular.module('encore.svcs.supportService.team', [
    'ngResource',
    'encore.svcs.billing',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.team')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.team.ESSTeamResource
     * @description
     * Team Service for interaction with Support Service API via $resource
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to APIs.
     * @requires encore.svcs.billing:StringToNumericTransform
     * @requires encore.svcs.supportService.util.ESSUtil
     * @requires encore.svcs.util.http.TransformUtil
     */
    .factory('ESSTeamResource', ["$resource", "StringToNumericTransform", "ESSUtil", "TransformUtil", function ($resource, StringToNumericTransform,
                                          ESSUtil, TransformUtil) {
        var chatLinks = $resource('/api/support/teams/:id',
            { id: '@id' },
            {
                /**
                 * @ngdoc method
                 * @name ESSTeamResource#getPaginated
                 * @methodOf encore.svcs.supportService.team.ESSTeamResource
                 * @param {object} params Parameters object
                 * @param {number} params.page Page of results
                 * @param {number} params.pageSize Number of results
                 * @param {string} params.sortBy Column to sort results by
                 * @param {string} params.sortOrder Direction of sort (asc, desc)
                 * @description
                 * Returns a paginated list of Team objects
                 * @example
                 * <pre>
                 * ESSTeamResource.getPaginated({ page: 2 })
                 * </pre>
                 *
                 * *Response object below:
                 * {@link encore.svcs.supportService.team.ESSTeamResource#methods_getPaginated
                 * ESSTeamResource.getPaginated}*
                 * <pre>
                 * {
                 *     "totalNumberOfItems": 1,
                 *     "pageNumber": 1,
                 *     "items": [
                 *         {
                 *             "description": "AtRackspace",
                 *             "tags": [
                 *                 "support-drawer",
                 *                 "cloud_us",
                 *                 "atrackspace"
                 *             ],
                 *             "internal_emails": [],
                 *             "number": "510",
                 *             "transformedNumber": 510,
                 *             "subregion": "US",
                 *             "segment": "Cloud Office",
                 *             "id": "510",
                 *             "name": "AtRackspace",
                 *             "parent_team_number": null,
                 *             "country": "US",
                 *             "region": "US",
                 *             "internal_phone_numbers": [
                 *                 {
                 *                     "phone_number": "700-2255",
                 *                     "country_code": "1"
                 *                 }
                 *             ],
                 *             "business_unit": "Americas",
                 *             "_links": {
                 *                 "phone_teams": {
                 *                     "href": "/api/teams/510/phone-teams"
                 *                 },
                 *                 "parent": {
                 *                     "href": null
                 *                 },
                 *                 "roles": {
                 *                     "href": "/api/teams/510/roles"
                 *                 },
                 *                 "self": {
                 *                     "href": "/api/teams/510",
                 *                     "id": "510"
                 *                 },
                 *                 "chat_teams": {
                 *                     "href": "/api/teams/510/chat-teams"
                 *                 },
                 *                 "badges": {
                 *                     "href": "/api/teams/510/badges"
                 *                 }
                 *             },
                 *             "subsegment": "SharePoint Services",
                 *             "super_region": "US"
                 *         }
                 *     ],
                 *     "next_page": null,
                 *     "total_pages": 1,
                 *     "prev_page": null
                 * }
                 * </pre>
                 *
                 * Full API documentation available at {@link
                 * https://pages.github.rackspace.com/support-service/support-service/prod/#teams_get
                 * Get Teams}
                 */
                getPaginated: {
                    method: 'GET',
                    params: {
                        page: '@page',
                        'page-size': '@pageSize',
                        'sort-by': '@sortBy',
                        'sort-order': '@sortOrder'
                    },
                    transformResponse: TransformUtil.responseChain([
                        ESSUtil.paginatedTransform,
                        StringToNumericTransform([{ path: 'number', arrayPath: 'items' }])
                    ])
                },
            });

        return chatLinks;
    }]);

angular.module('encore.svcs.supportService.team')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.team.ESSTeamService
     * @description
     * Extends Team functionality from $resource provided by ESSTeamResource
     *
     * @requires encore.svcs.supportService.team.ESSTeamResource
     * @requires encore.svcs.supportService.util.ESSUtil
     */

    .factory('ESSTeamService', ["ESSTeamResource", "ESSUtil", function (ESSTeamResource, ESSUtil) {

        var badges = {};

        /**
         * @ngdoc method
         * @name ESSTeamService#getAll
         * @methodOf encore.svcs.supportService.team.ESSTeamService
         * @description
         * Returns all Team objects by fetching each page of results
         * @example
         * <pre>
         * ESSTeamService.getAll()
         * </pre>
         *
         * *Response object below:
         * {@link encore.svcs.supportService.team.ESSTeamService#methods_getAll ESSTeamService.getAll}*
         * <pre>
         * [
         *     {
         *         'description': 'AtRackspace',
         *         'tags': [
         *             'support-drawer',
         *             'cloud_us',
         *             'atrackspace'
         *         ],
         *         'internal_emails': [],
         *         'number': '510',
         *         'transformedNumber': 510,
         *         'subregion': 'US',
         *         'segment': 'Cloud Office',
         *         'id': '510',
         *         'name': 'AtRackspace',
         *         'parent_team_number': null,
         *         'country': 'US',
         *         'region': 'US',
         *         'internal_phone_numbers': [
         *             {
         *                 'phone_number': '700-2255',
         *                 'country_code': '1'
         *             }
         *         ],
         *         'business_unit': 'Americas',
         *         '_links': {
         *             'phone_teams': {
         *                 'href': '/api/teams/510/phone-teams'
         *             },
         *             'parent': {
         *                 'href': null
         *             },
         *             'roles': {
         *                 'href': '/api/teams/510/roles'
         *             },
         *             'self': {
         *                 'href': '/api/teams/510',
         *                 'id': '510'
         *             },
         *             'chat_teams': {
         *                 'href': '/api/teams/510/chat-teams'
         *             },
         *             'badges': {
         *                 'href': '/api/teams/510/badges'
         *             }
         *         },
         *         'subsegment': 'SharePoint Services',
         *         'super_region': 'US'
         *     },
         *     {
         *         'description': 'Sydney',
         *         'tags': [
         *             'intl_smb_anz',
         *             'support-drawer',
         *             'cloud_uk',
         *             'au_cloud_shared'
         *         ],
         *         'internal_emails': [],
         *         'number': '907',
         *         'transformedNumber': 907,
         *         'subregion': 'ANZ',
         *         'segment': 'Cloud',
         *         'id': '907',
         *         'name': 'AU Cloud Shared',
         *         'parent_team_number': null,
         *         'country': 'AU',
         *         'region': 'APAC',
         *         'internal_phone_numbers': [],
         *         'business_unit': 'SMB',
         *         '_links': {
         *             'phone_teams': {
         *                 'href': '/api/teams/907/phone-teams'
         *             },
         *             'parent': {
         *                 'href': null
         *             },
         *             'roles': {
         *                 'href': '/api/teams/907/roles'
         *             },
         *             'self': {
         *                 'href': '/api/teams/907',
         *                 'id': '907'
         *             },
         *             'chat_teams': {
         *                 'href': '/api/teams/907/chat-teams'
         *             },
         *             'badges': {
         *                 'href': '/api/teams/907/badges'
         *             }
         *         },
         *         'subsegment': 'Cloud',
         *         'super_region': 'INTL'
         *     }
         * ]
         * </pre>
         *
         * Full API documentation available at {@link
         * https://pages.github.rackspace.com/support-service/support-service/prod/#teams_get
         * Get Teams}
         */
        badges.getAll = function () {
            return ESSUtil.getAllPages(ESSTeamResource.getPaginated);
        };

        return badges;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of services for interacting with Users in Encore Support Service API
 */
angular.module('encore.svcs.supportService.user', [
    'ngResource',
    'encore.util.transform'
]);

angular.module('encore.svcs.supportService.user')
    /**
     * @ngdoc service
     * @name encore.svcs.supportService.user.ESSUserResource
     * @description
     * Groups Service for interaction with Support Service Users API
     *
     * @requires $resource - AngularJS service to extend the $http and wrap AJAX calls to API's.
     * @requires Transform - Service used to transform JSON response from the API.
     */
    .factory('ESSUserResource', ["$resource", function ($resource) {
        return $resource('/api/support/users/:sso', { sso: '@sso' });
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.supportService
 * @description
 * Collection of utilities for use in the ESS services
 */
angular.module('encore.svcs.supportService.util', []);

angular.module('encore.svcs.supportService.util')
/**
 * @ngdoc object
 * @name encore.svcs.supportService.util.ESSUtil
 * @description
 * Utility library for Encore Support Service
 */
.factory('ESSUtil', function () {
    /**
     * @ngdoc method
     * @name encore.svcs.supportService.util.ESSUtil#paginatedTransform
     * @methodOf encore.svcs.supportService.util.ESSUtil
     * @param {Object} data paginated response from ESS API
     * @description
     * Transforms a paginated response from ESS API into a form consumable by
     * rx-paginate for API-paginated responses
     *
     * @returns {Object} Transformed response
     * @example
     * Original response:
     * <pre>
     * {
     *     "total_items": 1,
     *     "page_number": 1,
     *     "next_page": null,
     *     "prev_page": null,
     *     "total_pages": 1,
     *     "items": [
     *         {
     *             "sso": "eamonn.comerford",
     *             "_links": {
     *                 "self": {
     *                     "href": "/api/users/eamonn.comerford",
     *                     "id": "eamonn.comerford"
     *                 },
     *                 "team_roles": {
     *                     "href": "/api/users/eamonn.comerford/team-roles"
     *                 },
     *                 "groups": {
     *                     "href": "/api/users/eamonn.comerford/groups"
     *                 },
     *                 "account_roles": {
     *                     "href": "/api/users/eamonn.comerford/account-roles"
     *                 }
     *             },
     *             "name": "Eamonn Comerford",
     *             "tags": [
     *                 "foobar"
     *             ],
     *             "id": "4218",
     *             "email": "eamonn.comerford@RACKSPACE.COM"
     *         }
     *     ],
     * }
     * </pre>
     *
     * Transformed response:
     * <pre>
     * {
     *     "totalNumberOfItems": 1,
     *     "pageNumber": 1,
     *     "next_page": null,
     *     "prev_page": null,
     *     "total_pages": 1,
     *     "items": [
     *         {
     *             "sso": "eamonn.comerford",
     *             "_links": {
     *                 "self": {
     *                     "href": "/api/users/eamonn.comerford",
     *                     "id": "eamonn.comerford"
     *                 },
     *                 "team_roles": {
     *                     "href": "/api/users/eamonn.comerford/team-roles"
     *                 },
     *                 "groups": {
     *                     "href": "/api/users/eamonn.comerford/groups"
     *                 },
     *                 "account_roles": {
     *                     "href": "/api/users/eamonn.comerford/account-roles"
     *                 }
     *             },
     *             "name": "Eamonn Comerford",
     *             "tags": [
     *                 "foobar"
     *             ],
     *             "id": "4218",
     *             "email": "eamonn.comerford@RACKSPACE.COM"
     *         }
     *     ],
     * }
     * </pre>
     */
    var paginatedTransform = function (data) {
        data.totalNumberOfItems = data['total_items'];
        data.pageNumber = data['page_number'];
        delete data['total_items'];
        delete data['page_number'];
        return data;
    };

    /**
     * @ngdoc method
     * @name encore.svcs.supportService.util.ESSUtil#getAllPages
     * @methodOf encore.svcs.supportService.util.ESSUtil
     * @param {object} method ESS $resource method to fetch a single page
     * @param {object} args Arguments to pass to method
     * @description
     * Serially fetches all pages of a paginated resource in ESS
     * @example
     * <pre>
     * ESSUtil.getAllPages(ESSGroupUserResource.get, { id: 1234 })
     * </pre>
     *
     * *Response object below:
     * {@link encore.svcs.supportService.group.ESSGroupUserService#methods_get ESSGroupUserService.get}*
     * <pre>
     * [
     *     {
     *         "sso": "eamonn.comerford",
     *         "_links": {
     *             "self": {
     *                 "href": "http://localhost:8080/api/users/eamonn.comerford",
     *                 "id": "eamonn.comerford"
     *             },
     *             "team_roles": {
     *                 "href": "http://localhost:8080/api/users/eamonn.comerford/team-roles"
     *             },
     *             "groups": {
     *                 "href": "http://localhost:8080/api/users/eamonn.comerford/groups"
     *             },
     *             "account_roles": {
     *                 "href": "http://localhost:8080/api/users/eamonn.comerford/account-roles"
     *             }
     *         },
     *         "name": "Eamonn Comerford",
     *         "tags": [
     *             "foobar"
     *         ],
     *         "id": "4218",
     *         "email": "eamonn.comerford@RACKSPACE.COM"
     *     },
     *     {
     *         "sso": "bob1234",
     *         "_links": {
     *             "self": {
     *                 "href": "http://localhost:8080/api/users/bob1234",
     *                 "id": "eamonn.comerford"
     *             },
     *             "team_roles": {
     *                 "href": "http://localhost:8080/api/users/bob1234/team-roles"
     *             },
     *             "groups": {
     *                 "href": "http://localhost:8080/api/users/bob1234/groups"
     *             },
     *             "account_roles": {
     *                 "href": "http://localhost:8080/api/users/bob1234/account-roles"
     *             }
     *         },
     *         "name": "Bob Dole",
     *         "tags": [
     *             "bob dole"
     *         ],
     *         "id": "1234",
     *         "email": "bob1234@RACKSPACE.COM"
     *     },
     * ]
     * </pre>
     */
    var getAllPages = function (method, args) {
        if (_.isUndefined(args)) {
            args = {};
        }
        var innerArgs = _.clone(args);
        var result = [];
        var callback = function (page) {
            result = result.concat(page.items);
            if (!page['next_page']) {
                return result;
            }
            innerArgs.page = parseInt(page.pageNumber) + 1;
            return method(innerArgs).$promise.then(callback);
        };
        return method(innerArgs).$promise.then(callback);
    };

    var service = {
        paginatedTransform: paginatedTransform,
        getAllPages: getAllPages
    };

    return service;
});

/**
 * @ngdoc overview
 * @name encore.util.transform
 * @description
 * Module for `$http` transform services
 */
angular.module('encore.util.transform', [])
   /**
    * @ngdoc service
    * @name encore.util.transform.Pluck
    * @description
    * Transform a response given a (xpath like) path to where the expected data exists
    *
    * @example
    * <pre>
    * var data = { key: { nested: { value: 1000 } } }
    *
    * Pluck('key.nested.value')(data);
    * // 1000
    *
    * Pluck('key.nested')(data);
    * // Object( { value: 1000 } )
    *
    * Pluck('badkey.nested')(data);
    * // false
    * </pre>
    */
    .factory('Pluck', function () {
        var fromPath = function (obj, path) {
            obj = _.reduce(path, function (val, key) {
                return _.has(val, key) ? val[key] : false;
            }, obj);
            return obj;
        };
        return function (path, msgPath) {
            // Pre parse the path into an array
            // Set path to empty string if not given
            var splitPath = _.isEmpty(path) ? [] : path.split('.'),
            msgSplitPath = _.isEmpty(msgPath) ? [] : msgPath.split('.');
            return function (data) {
                data = data || {};
                var json = angular.fromJson(data),
                errorMsg = fromPath(json, msgSplitPath);
                return errorMsg && !_.isEqual(errorMsg, json) ? errorMsg : fromPath(json, splitPath);
            };
        };
    })
    /**
     * @ngdoc service
     * @name encore.util.transform.TransformRequest
     * @description
     * SupportService generic service with common transforms
     * Used in requests to SupportService calls
     */
    .service('TransformRequest', ["$http", function ($http) {
        var svc = {
            customTransform: function (transform) {
                return [svc[transform]].concat($http.defaults.transformRequest);
            },
            updateUserGroups: function (data) {
                return JSON.stringify({
                    'group_ids': _.map(data, function (num) { return num.toString(); })
                });
            },
            addUserAccounts: function (data) {
                return JSON.stringify({
                    'role_id': data.roleId,
                    'account_numbers': data.accounts
                });
            }
        };

        return svc;
    }])
    .service('Transform', ["$http", "Pluck", function ($http, Pluck) {
        var toCamelCase = function (string) {
            return string.replace(/[ _](\w)/g, function (_, $1) {
                return $1.toUpperCase();
            });
        };

        var camelCase = function (data) {
            if (_.isArray(data)) {
                _.forEach(data, function (item) {
                    camelCase(item);
                });
            } else if (_.isObject(data)) {
                _.forEach(_.keys(data), function (oldKey) {
                    var newKey = toCamelCase(oldKey);
                    if (newKey !== oldKey) {
                        data[newKey] = _.cloneDeep(data[oldKey]);
                        delete(data[oldKey]);
                    }

                    if (_.isObject(data[newKey])) {
                        camelCase(data[newKey]);
                    }
                });
            }

            return data;
        };

        var stringToInt = function (num) {
            var val = parseInt(num);
            if (!_.isNaN(val)) {
                return val;
            }
            return num;
        };

        var transformList = function (data) {
            var result = [];
            if (!_.has(data, 'items')) { return result; }

            _.forEach(data.items, function (item) {
                result.push({
                    id: _.has(item, '_links') ? stringToInt(item['_links'].self.id) : -1,
                    name: item.name
                });
            });

            return result;
        };

        var removeLinks = function (data) {
            if (_.isArray(data)) {
                _.forEach(data, function (obj) {
                    _.omit(obj, '_links');
                });
            } else if (_.isObject(data)) {
                _.omit(data, '_links');
            }

            return data;
        };

        var svc = {
            stringToInt: stringToInt,
            customTransform: function (transform) {
                return $http.defaults.transformResponse.concat([svc[transform], removeLinks, camelCase]);
            },
            accountRoles: function (data) {
                var map = {};
                _.forEach(data.users, function (user) {
                    if (!map[user.teamId]) {
                        map[user.teamId] = [];
                    }

                    map[user.teamId].push(user);
                });

                return map;
            },
            group: function (data) {
                data.id = Pluck('_links.self.id')(data);
                return data;
            },
            groups: function (data) {
                data = _.map(data.items, function (i) {
                    i = svc.group(i);
                    return i;
                });

                // Convert ID to integer so groups are sortable by ID
                _.forEach(data, function (obj) {
                    obj.id = stringToInt(obj.id);
                });

                return data;
            },
            user: function (data) {
                var transformRole = function (roleType, data) {
                    if (_.has(data, roleType)) {
                        var roles = [];
                        _.forEach(data[roleType], function (item) {
                            var existingRole = _.find(roles, { name: item.role.name });
                            if (!_.isEmpty(existingRole)) {
                                existingRole.items.push(item);
                                return;
                            }

                            roles.push({
                                name: item.role.name,
                                items: [ item ]
                            });
                        });

                        return roles;
                    }
                };

                data['teamRolesGrouped'] = transformRole('teamRoles', data);
                data['accountRolesGrouped'] = transformRole('accountRoles', data);

                return data;
            },
            note: function (data) {
                _.forEach(data.categories, function (cat) {
                    cat.id = cat['_links'].self.id;
                });
                return data;
            },
            teams: function (data) {
                // Can't return just items here as we need
                // the entire object to figure out pagination
                return data;
            },
            accounts: function (data) {
                return data.items;
            },
            badges: function (data) {
                return data.items;
            },
            roles: function (data) {
                return transformList(data);
            },
            categories: function (data) {
                return transformList(data);
            },
            bulkResponse: function (data) {
                var result = { success: [] };
                if (!_.has(data, 'items')) { return result; }

                _.forEach(data.items, function (item) {
                    var accountNumber = item['account_number'];
                    if (!item.success) {
                        if (_.has(result, item.message)) {
                            result[item.message].push(accountNumber);
                        } else {
                            result[item.message] = [ accountNumber ];
                        }
                    } else {
                        result.success.push(accountNumber);
                    }
                });

                return result;
            },
            cloudControlSearch: function (data) {
                var results = [];

                if (!_.has(data, 'hits') || _.isEmpty(data)) {
                    return results;
                }

                _.uniqBy(data.hits, function (rec) {
                    //convert account_id to string since some accounts are stored as integers
                    return (rec['_source']['account_id']).toString();
                }).forEach(function (hit) {
                    results.push({
                        score: hit['_score'],
                        type: hit['_type'],
                        id: hit['_source']['account_id'],
                        name: hit['_source']['account_name'] || hit['_source']['name'],
                        status: hit['_source']['account_status'] || hit['_source']['state']
                    });
                });

                return results;
            }
        };

        return svc;
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.util
 *
 * @description
 * Collection of toolboxes to aide development of components and services
 */
angular.module('encore.svcs.util', [
    'encore.svcs.util.account',
    'encore.svcs.util.encore',
    'encore.svcs.util.http',
    'encore.svcs.util.string',
    'encore.svcs.util.url',
    'encore.svcs.util.version'
]);

/**
 * @ngdoc overview
 * @name encore.svcs.util.account
 *
 * @description
 * Collection of configuration values for interacting with accounts
 */
angular.module('encore.svcs.util.account', [
    ])
    /**
     * @ngdoc property
     * @const ACCOUNT_INSTRUCTIONS_TITLE
     * @name encore.svcs.util.account.constant:ACCOUNT_INSTRUCTIONS_TITLE
     * @description
     *
     * Constant for titles used for account instructions
     */
    .constant('ACCOUNT_INSTRUCTIONS_TITLE', {
        'cloud': 'Instructions',
        'managed_hosting': 'Account Management Guidelines'
    })

    /**
     * @ngdoc property
     * @const ACCOUNT_DISPLAY_TYPE
     * @name encore.svcs.util.account.constant:ACCOUNT_DISPLAY_TYPE
     * @description
     *
     * Constant for displaying account types in the UI
     */
    .constant('ACCOUNT_DISPLAY_TYPE', {
        'cloud': 'Cloud',
        'managed_hosting': 'Dedicated'
    });

/**
 * @ngdoc overview
 * @name encore.svcs.util.encore
 *
 * @description
 * Collection of configuration values for interacting with encore
 */
angular.module('encore.svcs.util.encore', [
    ])
    /**
     * @ngdoc property
     * @const ACCOUNT_URLS
     * @name encore.svcs.util.encore.constant:ACCOUNT_URLS
     * @description
     *
     * Redirect URLs for account properties
     */
    .constant('ACCOUNT_URLS', {
        'cloud': {
            'ticket': '/ticketing/ticket/:ticketId',
            'allTickets': '/ticketing/account/:accountNumber',
            'account': '/accounts/:accountNumber'
        },
        'managed_hosting': {
            'ticket': '/dedicated/ticket/:ticketId',
            'allTickets': '/dedicated/account/:accountNumber/tickets',
            'account': '/dedicated/account/:accountNumber',
            'device': '/dedicated/py/core/#/device/:deviceId'
        }
    });

/**
 * @ngdoc overview
 * @name encore.svcs.util.http
 *
 * @description
 * Collection of services used for `$http` utilities
 */
angular.module('encore.svcs.util.http', [
   'encore.util.transform'
]);
/**
 * @typedef TransformFunction
 * @ngdoc overview
 * @name encore.svcs.util.http
 * @description
 * Module for `$http` transform services
 *
 */
angular.module('encore.svcs.util.http')
    /**
     * @ngdoc object
     * @name encore.svcs.util.http.TransformUtil
     * @requires $http
     * @requires encore.util.transform.Pluck
     * @description
     * Collection of Utility functions for building/generating `$http` Transforms
     */
    .factory('TransformUtil', ["$http", "Pluck", function ($http, Pluck) {
        /**
         * @ngdoc method
         * @name encore.svcs.util.http.TransformUtil#responseChain
         * @methodOf encore.svcs.util.http.TransformUtil
         * @param {TransformFunction} transform A function that will process the response data in a chain of transforms
         * @returns {Array.<TransformFunction>} Array of Response Transform Functions including
         * `$http.defaults.transformResponse`
         * @description
         * Append a transform (or list of transform functions) to the
         * Default list of response transforms of `$http`
         *
         * @example
         * <pre>
         * TransformUtil.responseChain(function (data) {
         *     return data.key;
         * });
         * </pre>
         * <pre>
         * [function, function (data) { return data.key }]
         * </pre>
         */
         var responseChain = function (transform) {
            if (_.isFunction(transform)) {
                transform = [transform];
            }
            return $http.defaults.transformResponse.concat(transform);
        };

        /**
         * @ngdoc method
         * @name encore.svcs.util.http.TransformUtil#requestChain
         * @methodOf encore.svcs.util.http.TransformUtil
         * @param {TransformFunction} transform A function that will process the request data in a chain of transforms
         * @returns {Array.<TransformFunction>} Array of Request Transform Functions including
         * `$http.defaults.transformRequests`
         * @description
         * Prepend a transform (or list of transform functions) to the
         * Default list of request transforms of `$http`
         *
         * @example
         * <pre>
         * TransformUtil.requestChain(function (data) {
         *     data.somekey = true;
         *     return data;
         * });
         * </pre>
         * <pre>
         * [function (data) { data.somekey = true; return data }, function]
         * </pre>
         */
        var requestChain = function (transform) {
            if (_.isFunction(transform)) {
                transform = [transform];
            }
            return transform.concat($http.defaults.transformRequest);
        };

        /**
         * @ngdoc method
         * @name encore.svcs.util.http.TransformUtil#pluckList
         * @methodOf encore.svcs.util.http.TransformUtil
         * @param {String} property Property path to obtain the array from a response
         * @returns {TransformFunction} a transform function to pluck a value or check for errors
         * @description
         *
         * Plucks a property from a response, to return an array, this is strictly for `isArray: true` actions.
         *
         * To be used in conjunction with
         * {@link encore.svcs.util.http.TransformUtil#responseChain responseChain}
         *
         * If there's an error object, and it has an error code, if it is not 404, return it in an array
         * otherwise return an empty array whether the property exists or not
         *
         * Error objects are expected in the following format.  This is prescribed for now but will be modifiable
         * in later versions
         * <pre>
         * {
         *     error: {
         *         code: 404,
         *         message: 'Not Found'
         *     }
         * }
         * </pre>
         * If the error object contains a `404` error code.  It will transform the final state of the list
         * as an empty list
         * <pre>
         * []
         * </pre>
         * If the error object contains anything but a `404` error code.  It will transform the final state
         * of the list as a list with the error object
         * <pre>
         * [{
         *     error: {
         *         code: 400,
         *         message: 'error message'
         *     }
         * }]
         * </pre>
         *
         * @example
         * <pre>
         * var actionListPropertyTransform = TransformUtil.pluckList('records');
         * var resource = $resource('url', {}, {
         *     action: {
         *         method: 'GET',
         *         transformResponse: TransformUtil.responseChain(actionListPropertyTransform)
         *     }
         * });
         * </pre>
         * ### Successful Response
         * <pre>
         * {
         *     records: [
         *         { ttl: '3600', id: '123', data: 'test'},
         *         { ttl: '3600', id: '124', data: 'test'},
         *         { ttl: '3600', id: '125', data: 'test'}
         *     ]
         * }
         * </pre>
         * <pre>
         * [
         *     { ttl: '3600', id: '123', data: 'test'},
         *     { ttl: '3600', id: '124', data: 'test'},
         *     { ttl: '3600', id: '125', data: 'test'}
         * ]
         * </pre>
         * ### 404 Response
         * <pre>
         * {
         *     error: {
         *         code: 404,
         *         message: 'Not Found'
         *     }
         * }
         * </pre>
         * <pre>
         * []
         * </pre>
         * ### 400 Response
         * <pre>
         * {
         *     error: {
         *         code: 400,
         *         message: 'error message'
         *     }
         * }
         * </pre>
         * <pre>
         * [{
         *     error: {
         *         code: 400,
         *         message: 'error message'
         *     }
         * }]
         * </pre>
         */
        var pluckList = function (property) {
            var pluckValue  = Pluck(property);
            return function (data) {
                var returnValue = [];
                // In the event that an error occurs we will have no context of the HTTP status code
                // this can be problematic because the resource action that implements this uses isArray: true
                // This is strict in design and will fail if we are not always returning an array
                if (_.has(data, 'error')) {
                    // if the error is not a 404 (IE: 500) then return the data object as an array
                    // this way we do not loose the predictable error object
                    // which contains a useful .message property.
                    // else if an error is detected and its 404 return an empty array
                    // meaning we don't have any actual message to return
                    if (_.has(data.error, 'code') && data.error.code !== 404) {
                        returnValue = [data];
                    }
                }
                // Let's pluck the value from the data
                var pluckedValue = pluckValue(data);
                // If it is an array, carry on with it
                if (_.isArray(pluckedValue)) {
                    returnValue = pluckedValue;
                }
                return returnValue;
            };
        };

        /**
         * @ngdoc method
         * @name encore.svcs.util.http.TransformUtil#mapList
         * @methodOf encore.svcs.util.http.TransformUtil
         * @param {Function} mapper Function to map each of the items of the list
         * @returns {TransformFunction} a transform function to map values of a list
         * @description
         *
         * Iterates over a list of items in the chain of transforms and allows for their modification.
         *
         * *IMPORTANT*: If this function is used in combination with {@link
         * encore.svcs.util.http.TransformUtil#pluckList pluckList} be aware that if there is an error
         * the mapper function should check for the values it plans on modifying
         *
         * *IMPORTANT*: This function utilizes `_.map` for lodash, read the documentation for it:
         * https://github.com/lodash/lodash/blob/2.4.1/doc/README.md#_mapcollection-callbackidentity-thisarg
         *
         * To be used in conjunction with
         * {@link encore.svcs.util.http.TransformUtil#responseChain responseChain}
         *
         * @example
         * <pre>
         * var mapper = function (item) {
         *    item.newValue = item.value * 3
         *    return item;
         * }
         * var multiplyValues = TransformUtil.mapList(mapper);
         * var pluckList = TransformUtil.pluckList('records');
         * var resource = $resource('url', {}, {
         *     action: {
         *         method: 'GET',
         *         transformResponse: TransformUtil.responseChain([pluckList, multiplyValues])
         *     }
         * });
         * </pre>
         * <pre>
         * {
         *     records: [
         *         { value: 123 },
         *         { value: 124 },
         *         { value: 125 }
         *     ]
         * }
         * </pre>
         * <pre>
         * [
         *     { value: 123, newValue: 246 },
         *     { value: 124, newValue: 248 },
         *     { value: 125, newValue: 250 }
         * ]
         * </pre>
         */
        var mapList = function (mapper, instance) {
            return function (data) {
                return _.map(data, _.bind(mapper, instance));
            };
        };

        return {
            mapList: mapList,
            pluckList: pluckList,
            responseChain: responseChain,
            requestChain: requestChain
        };
    }]);

/**
 * @ngdoc overview
 * @name encore.svcs.util.string
 * @description
 * A collection of utility functions for string mutation
 */
angular.module('encore.svcs.util.string', []);

angular.module('encore.svcs.util.string')
/**
 * @ngdoc service
 * @name encore.svcs.util.string.StringUtil
 * @description 
 * Various utility functions to help manage and mutate strings 
 * @returns {object} Functionality to mutate strings
 */
.factory('StringUtil', function () {
   /**
    * @ngdoc method
    * @name StringUtil#startCase
    * @methodOf encore.svcs.util.string.StringUtil
    * @description 
    * Converts a camelCasedString or PascalCasedString to a Title Cased String
    * @param {string} text CamelCasedString to be converted
    * @returns {sting} Title Cased String
    * @example:
    * <pre>
    * StringUtil.startCase('thisIsAnExample')
    * </pre>
    * 
    * *returns*
    *
    * <pre>
    * This Is An Example
    * </pre>
    */
   var startCase =  function (text) {
        // insert spaces before capital letters
        text = text.replace(/([A-Z])/g, ' $1');

        // capitalize the first letter
        text = text.charAt(0).toUpperCase() + text.slice(1);

        // trim so that an input string beginning with a capital letter
        // does not get returned with a leading space
        return text.trim();
    };

    return {
        startCase: startCase
    };
});

/**
 * @ngdoc overview
 * @name encore.svcs.cloud
 *
 * @description
 * Collection of services used for interacting with URLs
 */
angular.module('encore.svcs.util.url', [
]);
angular.module('encore.svcs.util.url')
    /**
     * @ngdoc service
     * @name encore.svcs.util.url.URLUtil
     * @requires $location
     * @description
     *
     * Returns an object with different methods for interacting with URLs
     */
    .factory('URLUtil', ["$location", function ($location) {

        /**
         * @ngdoc method
         * @name URLUtil#getBase
         * @methodOf encore.svcs.util.url.URLUtil
         * @description
         *
         * Gets a calculated value of the `<base href="...">` tag based on the current
         * absolute URL and the current url in $location.  Angular by default takes off the base
         * off of all routes
         *
         * @example
         * Use in a service where you would like to get the base path
         * <pre>
         * // Check if we have the a base app route
         * var route = URLUtil.getBase();
         *
         * if (_.has(mapping, route)) {
         * // ...
         * }
         * </pre>
         */
        var getBase = function () {
            // Get the full URL
            var route = $location.absUrl();
            // Remove proto://domain:port portion of the URI
            route = '/' + route.split('/').slice(3).join('/');
            // Remove the URL that angular recognizes
            route = route.slice(0, route.length - $location.url().length);

            return route === '' ? '/' : route;
        };

        var paramRegex = /(\w+)([^?]*)([?]?)/;
        /**
         * @ngdoc method
         * @name URLUtil#interpolateRoute
         * @methodOf encore.svcs.util.url.URLUtil
         * @description
         * Takes a route in the format passed to `routeProvider.when()`, and a set of parameters,
         * and interpolates them to generate a full URL.
         *
         * This function is taken directly from AngularJS, it lives in src/ngRoute/route.js. At this
         * time they don't expose an API to use it ourselves. Replace this if they ever expose it
         *
         * @param {String} route  The routeProvider-style route to interpolate
         * @param {Object} params  The parameters to use for interpolation.
         *
         * @example
         * <pre>
         * var route = '/hello/:foo';
         * var params = { foo: 'world' }
         * URLUtil.interpolateRoute(route, params) // Returns '/hello/world'
         * </pre>
         */
        var interpolateRoute = function (route, params) {
            var newParams = _.extend({}, params);
            var result = [];
            angular.forEach((route||'').split(':'), function (segment, i) {
                if (i === 0) {
                    result.push(segment);
                } else {
                    var segmentMatch = segment.match(paramRegex);
                    var key = segmentMatch[1];
                    // the third grouping detects whether or not the optional flag is there
                    var optional = segmentMatch[3] === '?';
                    // If optional and the parameter is not there, check the last segment and remove any trailing /
                    if (optional === true && !newParams.hasOwnProperty(key)) {
                        var lastSegment = result.pop();
                        if (_.last(lastSegment) === '/') {
                            lastSegment = lastSegment.substr(0, lastSegment.length - 1);
                        }
                        result.push(lastSegment);
                    } else { // Proceed as normal
                        result.push(newParams[key]);
                        result.push(segmentMatch[2] || '');
                    }
                    delete newParams[key];
                }
            });
            return result.join('');
        };

        return {
            getBase: getBase,
            interpolateRoute: interpolateRoute
        };
    }]);

angular.module('encore.svcs.util.version', []);

angular.module('encore.svcs.util.version')
/**
 * @ngdoc property
 * @const VERSION
 * @name encore.svcs.util.version.constant:VERSION
 * @description
 *
 * Automatically updated constant that simply stores
 * the current version of the library
 */
.constant('ENCORE_UI_SVCS_VERSION', 'Version: 3.8.3');

angular.module('encore.svcs.util')
/**
 * @ngdoc service
 * @name encore.svcs.util.Lodash
 * @description
 * Local, Angular DI-able version of Lodash
 * @returns {object} Lodash library
 */
.factory('Lodash', ["$window", function ($window) {

    // Grunt will populate this with the contents of lodash.min.js
    // Create new lodash which will eventually become local only
    /**
 * @license
 * lodash lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 */
;(function(){function n(n,t){return n.set(t[0],t[1]),n}function t(n,t){return n.add(t),n}function r(n,t,r){switch(r.length){case 0:return n.call(t);case 1:return n.call(t,r[0]);case 2:return n.call(t,r[0],r[1]);case 3:return n.call(t,r[0],r[1],r[2])}return n.apply(t,r)}function e(n,t,r,e){for(var u=-1,i=null==n?0:n.length;++u<i;){var o=n[u];t(e,o,r(o),n)}return e}function u(n,t){for(var r=-1,e=null==n?0:n.length;++r<e&&false!==t(n[r],r,n););return n}function i(n,t){for(var r=null==n?0:n.length;r--&&false!==t(n[r],r,n););
return n}function o(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(!t(n[r],r,n))return false;return true}function f(n,t){for(var r=-1,e=null==n?0:n.length,u=0,i=[];++r<e;){var o=n[r];t(o,r,n)&&(i[u++]=o)}return i}function c(n,t){return!(null==n||!n.length)&&-1<d(n,t,0)}function a(n,t,r){for(var e=-1,u=null==n?0:n.length;++e<u;)if(r(t,n[e]))return true;return false}function l(n,t){for(var r=-1,e=null==n?0:n.length,u=Array(e);++r<e;)u[r]=t(n[r],r,n);return u}function s(n,t){for(var r=-1,e=t.length,u=n.length;++r<e;)n[u+r]=t[r];
return n}function h(n,t,r,e){var u=-1,i=null==n?0:n.length;for(e&&i&&(r=n[++u]);++u<i;)r=t(r,n[u],u,n);return r}function p(n,t,r,e){var u=null==n?0:n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);return r}function _(n,t){for(var r=-1,e=null==n?0:n.length;++r<e;)if(t(n[r],r,n))return true;return false}function v(n,t,r){var e;return r(n,function(n,r,u){if(t(n,r,u))return e=r,false}),e}function g(n,t,r,e){var u=n.length;for(r+=e?1:-1;e?r--:++r<u;)if(t(n[r],r,n))return r;return-1}function d(n,t,r){if(t===t)n:{
--r;for(var e=n.length;++r<e;)if(n[r]===t){n=r;break n}n=-1}else n=g(n,b,r);return n}function y(n,t,r,e){--r;for(var u=n.length;++r<u;)if(e(n[r],t))return r;return-1}function b(n){return n!==n}function x(n,t){var r=null==n?0:n.length;return r?k(n,t)/r:P}function j(n){return function(t){return null==t?F:t[n]}}function w(n){return function(t){return null==n?F:n[t]}}function m(n,t,r,e,u){return u(n,function(n,u,i){r=e?(e=false,n):t(r,n,u,i)}),r}function A(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;
return n}function k(n,t){for(var r,e=-1,u=n.length;++e<u;){var i=t(n[e]);i!==F&&(r=r===F?i:r+i)}return r}function E(n,t){for(var r=-1,e=Array(n);++r<n;)e[r]=t(r);return e}function O(n,t){return l(t,function(t){return[t,n[t]]})}function S(n){return function(t){return n(t)}}function I(n,t){return l(t,function(t){return n[t]})}function R(n,t){return n.has(t)}function z(n,t){for(var r=-1,e=n.length;++r<e&&-1<d(t,n[r],0););return r}function W(n,t){for(var r=n.length;r--&&-1<d(t,n[r],0););return r}function B(n){
return"\\"+Tn[n]}function L(n){var t=-1,r=Array(n.size);return n.forEach(function(n,e){r[++t]=[e,n]}),r}function U(n,t){return function(r){return n(t(r))}}function C(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r];o!==t&&"__lodash_placeholder__"!==o||(n[r]="__lodash_placeholder__",i[u++]=r)}return i}function D(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=n}),r}function M(n){var t=-1,r=Array(n.size);return n.forEach(function(n){r[++t]=[n,n]}),r}function T(n){if(Bn.test(n)){
for(var t=zn.lastIndex=0;zn.test(n);)++t;n=t}else n=tt(n);return n}function $(n){return Bn.test(n)?n.match(zn)||[]:n.split("")}var F,N=1/0,P=NaN,Z=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",32],["partialRight",64],["rearg",256]],q=/\b__p\+='';/g,V=/\b(__p\+=)''\+/g,K=/(__e\(.*?\)|\b__t\))\+'';/g,G=/&(?:amp|lt|gt|quot|#39);/g,H=/[&<>"']/g,J=RegExp(G.source),Y=RegExp(H.source),Q=/<%-([\s\S]+?)%>/g,X=/<%([\s\S]+?)%>/g,nn=/<%=([\s\S]+?)%>/g,tn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,rn=/^\w*$/,en=/^\./,un=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,on=/[\\^$.*+?()[\]{}|]/g,fn=RegExp(on.source),cn=/^\s+|\s+$/g,an=/^\s+/,ln=/\s+$/,sn=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,hn=/\{\n\/\* \[wrapped with (.+)\] \*/,pn=/,? & /,_n=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,vn=/\\(\\)?/g,gn=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,dn=/\w*$/,yn=/^[-+]0x[0-9a-f]+$/i,bn=/^0b[01]+$/i,xn=/^\[object .+?Constructor\]$/,jn=/^0o[0-7]+$/i,wn=/^(?:0|[1-9]\d*)$/,mn=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,An=/($^)/,kn=/['\n\r\u2028\u2029\\]/g,En="[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|\\ud83c[\\udffb-\\udfff])?)*",On="(?:[\\u2700-\\u27bf]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])"+En,Sn="(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]?|[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",In=RegExp("['\u2019]","g"),Rn=RegExp("[\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0]","g"),zn=RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|"+Sn+En,"g"),Wn=RegExp(["[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+(?:['\u2019](?:d|ll|m|re|s|t|ve))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde]|$)|(?:[A-Z\\xc0-\\xd6\\xd8-\\xde]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?(?=[\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000]|[A-Z\\xc0-\\xd6\\xd8-\\xde](?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])|$)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?(?:[a-z\\xdf-\\xf6\\xf8-\\xff]|[^\\ud800-\\udfff\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000\\d+\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde])+(?:['\u2019](?:d|ll|m|re|s|t|ve))?|[A-Z\\xc0-\\xd6\\xd8-\\xde]+(?:['\u2019](?:D|LL|M|RE|S|T|VE))?|\\d*(?:(?:1ST|2ND|3RD|(?![123])\\dTH)\\b)|\\d*(?:(?:1st|2nd|3rd|(?![123])\\dth)\\b)|\\d+",On].join("|"),"g"),Bn=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe23\\u20d0-\\u20f0\\ufe0e\\ufe0f]"),Ln=/[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,Un="Array Buffer DataView Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Map Math Object Promise RegExp Set String Symbol TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap _ clearTimeout isFinite parseInt setTimeout".split(" "),Cn={};
Cn["[object Float32Array]"]=Cn["[object Float64Array]"]=Cn["[object Int8Array]"]=Cn["[object Int16Array]"]=Cn["[object Int32Array]"]=Cn["[object Uint8Array]"]=Cn["[object Uint8ClampedArray]"]=Cn["[object Uint16Array]"]=Cn["[object Uint32Array]"]=true,Cn["[object Arguments]"]=Cn["[object Array]"]=Cn["[object ArrayBuffer]"]=Cn["[object Boolean]"]=Cn["[object DataView]"]=Cn["[object Date]"]=Cn["[object Error]"]=Cn["[object Function]"]=Cn["[object Map]"]=Cn["[object Number]"]=Cn["[object Object]"]=Cn["[object RegExp]"]=Cn["[object Set]"]=Cn["[object String]"]=Cn["[object WeakMap]"]=false;
var Dn={};Dn["[object Arguments]"]=Dn["[object Array]"]=Dn["[object ArrayBuffer]"]=Dn["[object DataView]"]=Dn["[object Boolean]"]=Dn["[object Date]"]=Dn["[object Float32Array]"]=Dn["[object Float64Array]"]=Dn["[object Int8Array]"]=Dn["[object Int16Array]"]=Dn["[object Int32Array]"]=Dn["[object Map]"]=Dn["[object Number]"]=Dn["[object Object]"]=Dn["[object RegExp]"]=Dn["[object Set]"]=Dn["[object String]"]=Dn["[object Symbol]"]=Dn["[object Uint8Array]"]=Dn["[object Uint8ClampedArray]"]=Dn["[object Uint16Array]"]=Dn["[object Uint32Array]"]=true,
Dn["[object Error]"]=Dn["[object Function]"]=Dn["[object WeakMap]"]=false;var Mn,Tn={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},$n=parseFloat,Fn=parseInt,Nn=typeof global=="object"&&global&&global.Object===Object&&global,Pn=typeof self=="object"&&self&&self.Object===Object&&self,Zn=Nn||Pn||Function("return this")(),qn=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Vn=qn&&typeof module=="object"&&module&&!module.nodeType&&module,Kn=Vn&&Vn.exports===qn,Gn=Kn&&Nn.h;
n:{try{Mn=Gn&&Gn.g("util");break n}catch(n){}Mn=void 0}var Hn=Mn&&Mn.isArrayBuffer,Jn=Mn&&Mn.isDate,Yn=Mn&&Mn.isMap,Qn=Mn&&Mn.isRegExp,Xn=Mn&&Mn.isSet,nt=Mn&&Mn.isTypedArray,tt=j("length"),rt=w({"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I",
"\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss","\u0100":"A","\u0102":"A","\u0104":"A","\u0101":"a","\u0103":"a","\u0105":"a","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C",
"\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c","\u010e":"D","\u0110":"D","\u010f":"d","\u0111":"d","\u0112":"E","\u0114":"E","\u0116":"E","\u0118":"E","\u011a":"E","\u0113":"e","\u0115":"e","\u0117":"e","\u0119":"e","\u011b":"e","\u011c":"G","\u011e":"G","\u0120":"G","\u0122":"G","\u011d":"g","\u011f":"g","\u0121":"g","\u0123":"g","\u0124":"H","\u0126":"H","\u0125":"h","\u0127":"h","\u0128":"I","\u012a":"I","\u012c":"I","\u012e":"I","\u0130":"I","\u0129":"i","\u012b":"i","\u012d":"i","\u012f":"i",
"\u0131":"i","\u0134":"J","\u0135":"j","\u0136":"K","\u0137":"k","\u0138":"k","\u0139":"L","\u013b":"L","\u013d":"L","\u013f":"L","\u0141":"L","\u013a":"l","\u013c":"l","\u013e":"l","\u0140":"l","\u0142":"l","\u0143":"N","\u0145":"N","\u0147":"N","\u014a":"N","\u0144":"n","\u0146":"n","\u0148":"n","\u014b":"n","\u014c":"O","\u014e":"O","\u0150":"O","\u014d":"o","\u014f":"o","\u0151":"o","\u0154":"R","\u0156":"R","\u0158":"R","\u0155":"r","\u0157":"r","\u0159":"r","\u015a":"S","\u015c":"S","\u015e":"S",
"\u0160":"S","\u015b":"s","\u015d":"s","\u015f":"s","\u0161":"s","\u0162":"T","\u0164":"T","\u0166":"T","\u0163":"t","\u0165":"t","\u0167":"t","\u0168":"U","\u016a":"U","\u016c":"U","\u016e":"U","\u0170":"U","\u0172":"U","\u0169":"u","\u016b":"u","\u016d":"u","\u016f":"u","\u0171":"u","\u0173":"u","\u0174":"W","\u0175":"w","\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017b":"Z","\u017d":"Z","\u017a":"z","\u017c":"z","\u017e":"z","\u0132":"IJ","\u0133":"ij","\u0152":"Oe","\u0153":"oe","\u0149":"'n",
"\u017f":"s"}),et=w({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}),ut=w({"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'"}),it=function w(En){function On(n){if(gu(n)&&!uf(n)&&!(n instanceof Mn)){if(n instanceof zn)return n;if(ui.call(n,"__wrapped__"))return Te(n)}return new zn(n)}function Sn(){}function zn(n,t){this.__wrapped__=n,this.__actions__=[],this.__chain__=!!t,this.__index__=0,this.__values__=F}function Mn(n){this.__wrapped__=n,this.__actions__=[],this.__dir__=1,this.__filtered__=false,
this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[]}function Tn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Nn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function Pn(n){var t=-1,r=null==n?0:n.length;for(this.clear();++t<r;){var e=n[t];this.set(e[0],e[1])}}function qn(n){var t=-1,r=null==n?0:n.length;for(this.__data__=new Pn;++t<r;)this.add(n[t])}function Vn(n){this.size=(this.__data__=new Nn(n)).size;
}function Gn(n,t){var r,e=uf(n),u=!e&&ef(n),i=!e&&!u&&ff(n),o=!e&&!u&&!i&&hf(n),u=(e=e||u||i||o)?E(n.length,Qu):[],f=u.length;for(r in n)!t&&!ui.call(n,r)||e&&("length"==r||i&&("offset"==r||"parent"==r)||o&&("buffer"==r||"byteLength"==r||"byteOffset"==r)||Ae(r,f))||u.push(r);return u}function tt(n){var t=n.length;return t?n[cr(0,t-1)]:F}function ot(n,t){return Ue(Dr(n),gt(t,0,n.length))}function ft(n){return Ue(Dr(n))}function ct(n,t,r,e){return n===F||cu(n,ti[r])&&!ui.call(e,r)?t:n}function at(n,t,r){
(r===F||cu(n[t],r))&&(r!==F||t in n)||_t(n,t,r)}function lt(n,t,r){var e=n[t];ui.call(n,t)&&cu(e,r)&&(r!==F||t in n)||_t(n,t,r)}function st(n,t){for(var r=n.length;r--;)if(cu(n[r][0],t))return r;return-1}function ht(n,t,r,e){return ro(n,function(n,u,i){t(e,n,r(n),i)}),e}function pt(n,t){return n&&Mr(t,Ru(t),n)}function _t(n,t,r){"__proto__"==t&&wi?wi(n,t,{configurable:true,enumerable:true,value:r,writable:true}):n[t]=r}function vt(n,t){for(var r=-1,e=t.length,u=qu(e),i=null==n;++r<e;)u[r]=i?F:Su(n,t[r]);
return u}function gt(n,t,r){return n===n&&(r!==F&&(n=n<=r?n:r),t!==F&&(n=n>=t?n:t)),n}function dt(n,t,r,e,i,o,f){var c;if(e&&(c=o?e(n,i,o,f):e(n)),c!==F)return c;if(!vu(n))return n;if(i=uf(n)){if(c=xe(n),!t)return Dr(n,c)}else{var a=po(n),l="[object Function]"==a||"[object GeneratorFunction]"==a;if(ff(n))return zr(n,t);if("[object Object]"==a||"[object Arguments]"==a||l&&!o){if(c=je(l?{}:n),!t)return Tr(n,pt(c,n))}else{if(!Dn[a])return o?n:{};c=we(n,a,dt,t)}}if(f||(f=new Vn),o=f.get(n))return o;f.set(n,c);
var s=i?F:(r?he:Ru)(n);return u(s||n,function(u,i){s&&(i=u,u=n[i]),lt(c,i,dt(u,t,r,e,i,n,f))}),c}function yt(n){var t=Ru(n);return function(r){return bt(r,n,t)}}function bt(n,t,r){var e=r.length;if(null==n)return!e;for(n=Ju(n);e--;){var u=r[e],i=t[u],o=n[u];if(o===F&&!(u in n)||!i(o))return false}return true}function xt(n,t,r){if(typeof n!="function")throw new Xu("Expected a function");return go(function(){n.apply(F,r)},t)}function jt(n,t,r,e){var u=-1,i=c,o=true,f=n.length,s=[],h=t.length;if(!f)return s;r&&(t=l(t,S(r))),
e?(i=a,o=false):200<=t.length&&(i=R,o=false,t=new qn(t));n:for(;++u<f;){var p=n[u],_=null==r?p:r(p),p=e||0!==p?p:0;if(o&&_===_){for(var v=h;v--;)if(t[v]===_)continue n;s.push(p)}else i(t,_,e)||s.push(p)}return s}function wt(n,t){var r=true;return ro(n,function(n,e,u){return r=!!t(n,e,u)}),r}function mt(n,t,r){for(var e=-1,u=n.length;++e<u;){var i=n[e],o=t(i);if(null!=o&&(f===F?o===o&&!xu(o):r(o,f)))var f=o,c=i}return c}function At(n,t){var r=[];return ro(n,function(n,e,u){t(n,e,u)&&r.push(n)}),r}function kt(n,t,r,e,u){
var i=-1,o=n.length;for(r||(r=me),u||(u=[]);++i<o;){var f=n[i];0<t&&r(f)?1<t?kt(f,t-1,r,e,u):s(u,f):e||(u[u.length]=f)}return u}function Et(n,t){return n&&uo(n,t,Ru)}function Ot(n,t){return n&&io(n,t,Ru)}function St(n,t){return f(t,function(t){return hu(n[t])})}function It(n,t){t=Ee(t,n)?[t]:Ir(t);for(var r=0,e=t.length;null!=n&&r<e;)n=n[Ce(t[r++])];return r&&r==e?n:F}function Rt(n,t,r){return t=t(n),uf(n)?t:s(t,r(n))}function zt(n){if(null==n)return n===F?"[object Undefined]":"[object Null]";n=Ju(n);
var t;if(ji&&ji in n){var r=ui.call(n,ji),e=n[ji];try{n[ji]=F,t=true}catch(n){}var u=fi.call(n);t&&(r?n[ji]=e:delete n[ji]),t=u}else t=fi.call(n);return t}function Wt(n,t){return n>t}function Bt(n,t){return null!=n&&ui.call(n,t)}function Lt(n,t){return null!=n&&t in Ju(n)}function Ut(n,t,r){for(var e=r?a:c,u=n[0].length,i=n.length,o=i,f=qu(i),s=1/0,h=[];o--;){var p=n[o];o&&t&&(p=l(p,S(t))),s=Li(p.length,s),f[o]=!r&&(t||120<=u&&120<=p.length)?new qn(o&&p):F}var p=n[0],_=-1,v=f[0];n:for(;++_<u&&h.length<s;){
var g=p[_],d=t?t(g):g,g=r||0!==g?g:0;if(v?!R(v,d):!e(h,d,r)){for(o=i;--o;){var y=f[o];if(y?!R(y,d):!e(n[o],d,r))continue n}v&&v.push(d),h.push(g)}}return h}function Ct(n,t,r){var e={};return Et(n,function(n,u,i){t(e,r(n),u,i)}),e}function Dt(n,t,e){return Ee(t,n)||(t=Ir(t),n=We(n,t),t=Ze(t)),t=null==n?n:n[Ce(t)],null==t?F:r(t,n,e)}function Mt(n){return gu(n)&&"[object Arguments]"==zt(n)}function Tt(n){return gu(n)&&"[object ArrayBuffer]"==zt(n)}function $t(n){return gu(n)&&"[object Date]"==zt(n)}
function Ft(n,t,r,e,u){if(n===t)t=true;else if(null==n||null==t||!vu(n)&&!gu(t))t=n!==n&&t!==t;else n:{var i=uf(n),o=uf(t),f="[object Array]",c="[object Array]";i||(f=po(n),f="[object Arguments]"==f?"[object Object]":f),o||(c=po(t),c="[object Arguments]"==c?"[object Object]":c);var a="[object Object]"==f,o="[object Object]"==c;if((c=f==c)&&ff(n)){if(!ff(t)){t=false;break n}i=true,a=false}if(c&&!a)u||(u=new Vn),t=i||hf(n)?ae(n,t,Ft,r,e,u):le(n,t,f,Ft,r,e,u);else{if(!(2&e)&&(i=a&&ui.call(n,"__wrapped__"),f=o&&ui.call(t,"__wrapped__"),
i||f)){n=i?n.value():n,t=f?t.value():t,u||(u=new Vn),t=Ft(n,t,r,e,u);break n}if(c)t:if(u||(u=new Vn),i=2&e,f=Ru(n),o=f.length,c=Ru(t).length,o==c||i){for(a=o;a--;){var l=f[a];if(!(i?l in t:ui.call(t,l))){t=false;break t}}if((c=u.get(n))&&u.get(t))t=c==t;else{c=true,u.set(n,t),u.set(t,n);for(var s=i;++a<o;){var l=f[a],h=n[l],p=t[l];if(r)var _=i?r(p,h,l,t,n,u):r(h,p,l,n,t,u);if(_===F?h!==p&&!Ft(h,p,r,e,u):!_){c=false;break}s||(s="constructor"==l)}c&&!s&&(r=n.constructor,e=t.constructor,r!=e&&"constructor"in n&&"constructor"in t&&!(typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)&&(c=false)),
u.delete(n),u.delete(t),t=c}}else t=false;else t=false}}return t}function Nt(n){return gu(n)&&"[object Map]"==po(n)}function Pt(n,t,r,e){var u=r.length,i=u,o=!e;if(null==n)return!i;for(n=Ju(n);u--;){var f=r[u];if(o&&f[2]?f[1]!==n[f[0]]:!(f[0]in n))return false}for(;++u<i;){var f=r[u],c=f[0],a=n[c],l=f[1];if(o&&f[2]){if(a===F&&!(c in n))return false}else{if(f=new Vn,e)var s=e(a,l,c,n,t,f);if(s===F?!Ft(l,a,e,3,f):!s)return false}}return true}function Zt(n){return!(!vu(n)||oi&&oi in n)&&(hu(n)?li:xn).test(De(n))}function qt(n){
return gu(n)&&"[object RegExp]"==zt(n)}function Vt(n){return gu(n)&&"[object Set]"==po(n)}function Kt(n){return gu(n)&&_u(n.length)&&!!Cn[zt(n)]}function Gt(n){return typeof n=="function"?n:null==n?Mu:typeof n=="object"?uf(n)?Xt(n[0],n[1]):Qt(n):Nu(n)}function Ht(n){if(!Se(n))return Wi(n);var t,r=[];for(t in Ju(n))ui.call(n,t)&&"constructor"!=t&&r.push(t);return r}function Jt(n,t){return n<t}function Yt(n,t){var r=-1,e=au(n)?qu(n.length):[];return ro(n,function(n,u,i){e[++r]=t(n,u,i)}),e}function Qt(n){
var t=de(n);return 1==t.length&&t[0][2]?Ie(t[0][0],t[0][1]):function(r){return r===n||Pt(r,n,t)}}function Xt(n,t){return Ee(n)&&t===t&&!vu(t)?Ie(Ce(n),t):function(r){var e=Su(r,n);return e===F&&e===t?Iu(r,n):Ft(t,e,F,3)}}function nr(n,t,r,e,u){n!==t&&uo(t,function(i,o){if(vu(i)){u||(u=new Vn);var f=u,c=n[o],a=t[o],l=f.get(a);if(l)at(n,o,l);else{var l=e?e(c,a,o+"",n,t,f):F,s=l===F;if(s){var h=uf(a),p=!h&&ff(a),_=!h&&!p&&hf(a),l=a;h||p||_?uf(c)?l=c:lu(c)?l=Dr(c):p?(s=false,l=zr(a,true)):_?(s=false,l=Br(a,true)):l=[]:yu(a)||ef(a)?(l=c,
ef(c)?l=Eu(c):(!vu(c)||r&&hu(c))&&(l=je(a))):s=false}s&&(f.set(a,l),nr(l,a,r,e,f),f.delete(a)),at(n,o,l)}}else f=e?e(n[o],i,o+"",n,t,u):F,f===F&&(f=i),at(n,o,f)},zu)}function tr(n,t){var r=n.length;if(r)return t+=0>t?r:0,Ae(t,r)?n[t]:F}function rr(n,t,r){var e=-1;return t=l(t.length?t:[Mu],S(ve())),n=Yt(n,function(n){return{a:l(t,function(t){return t(n)}),b:++e,c:n}}),A(n,function(n,t){var e;n:{e=-1;for(var u=n.a,i=t.a,o=u.length,f=r.length;++e<o;){var c=Lr(u[e],i[e]);if(c){e=e>=f?c:c*("desc"==r[e]?-1:1);
break n}}e=n.b-t.b}return e})}function er(n,t){return n=Ju(n),ur(n,t,function(t,r){return r in n})}function ur(n,t,r){for(var e=-1,u=t.length,i={};++e<u;){var o=t[e],f=n[o];r(f,o)&&_t(i,o,f)}return i}function ir(n){return function(t){return It(t,n)}}function or(n,t,r,e){var u=e?y:d,i=-1,o=t.length,f=n;for(n===t&&(t=Dr(t)),r&&(f=l(n,S(r)));++i<o;)for(var c=0,a=t[i],a=r?r(a):a;-1<(c=u(f,a,c,e));)f!==n&&yi.call(f,c,1),yi.call(n,c,1);return n}function fr(n,t){for(var r=n?t.length:0,e=r-1;r--;){var u=t[r];
if(r==e||u!==i){var i=u;if(Ae(u))yi.call(n,u,1);else if(Ee(u,n))delete n[Ce(u)];else{var u=Ir(u),o=We(n,u);null!=o&&delete o[Ce(Ze(u))]}}}}function cr(n,t){return n+Oi(Di()*(t-n+1))}function ar(n,t){var r="";if(!n||1>t||9007199254740991<t)return r;do t%2&&(r+=n),(t=Oi(t/2))&&(n+=n);while(t);return r}function lr(n,t){return yo(ze(n,t,Mu),n+"")}function sr(n){return tt(Bu(n))}function hr(n,t){var r=Bu(n);return Ue(r,gt(t,0,r.length))}function pr(n,t,r,e){if(!vu(n))return n;t=Ee(t,n)?[t]:Ir(t);for(var u=-1,i=t.length,o=i-1,f=n;null!=f&&++u<i;){
var c=Ce(t[u]),a=r;if(u!=o){var l=f[c],a=e?e(l,c,f):F;a===F&&(a=vu(l)?l:Ae(t[u+1])?[]:{})}lt(f,c,a),f=f[c]}return n}function _r(n){return Ue(Bu(n))}function vr(n,t,r){var e=-1,u=n.length;for(0>t&&(t=-t>u?0:u+t),r=r>u?u:r,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=qu(u);++e<u;)r[e]=n[e+t];return r}function gr(n,t){var r;return ro(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function dr(n,t,r){var e=0,u=null==n?e:n.length;if(typeof t=="number"&&t===t&&2147483647>=u){for(;e<u;){var i=e+u>>>1,o=n[i];null!==o&&!xu(o)&&(r?o<=t:o<t)?e=i+1:u=i;
}return u}return yr(n,t,Mu,r)}function yr(n,t,r,e){t=r(t);for(var u=0,i=null==n?0:n.length,o=t!==t,f=null===t,c=xu(t),a=t===F;u<i;){var l=Oi((u+i)/2),s=r(n[l]),h=s!==F,p=null===s,_=s===s,v=xu(s);(o?e||_:a?_&&(e||h):f?_&&h&&(e||!p):c?_&&h&&!p&&(e||!v):p||v?0:e?s<=t:s<t)?u=l+1:i=l}return Li(i,4294967294)}function br(n,t){for(var r=-1,e=n.length,u=0,i=[];++r<e;){var o=n[r],f=t?t(o):o;if(!r||!cu(f,c)){var c=f;i[u++]=0===o?0:o}}return i}function xr(n){return typeof n=="number"?n:xu(n)?P:+n}function jr(n){
if(typeof n=="string")return n;if(uf(n))return l(n,jr)+"";if(xu(n))return no?no.call(n):"";var t=n+"";return"0"==t&&1/n==-N?"-0":t}function wr(n,t,r){var e=-1,u=c,i=n.length,o=true,f=[],l=f;if(r)o=false,u=a;else if(200<=i){if(u=t?null:ao(n))return D(u);o=false,u=R,l=new qn}else l=t?[]:f;n:for(;++e<i;){var s=n[e],h=t?t(s):s,s=r||0!==s?s:0;if(o&&h===h){for(var p=l.length;p--;)if(l[p]===h)continue n;t&&l.push(h),f.push(s)}else u(l,h,r)||(l!==f&&l.push(h),f.push(s))}return f}function mr(n,t,r,e){for(var u=n.length,i=e?u:-1;(e?i--:++i<u)&&t(n[i],i,n););
return r?vr(n,e?0:i,e?i+1:u):vr(n,e?i+1:0,e?u:i)}function Ar(n,t){var r=n;return r instanceof Mn&&(r=r.value()),h(t,function(n,t){return t.func.apply(t.thisArg,s([n],t.args))},r)}function kr(n,t,r){var e=n.length;if(2>e)return e?wr(n[0]):[];for(var u=-1,i=qu(e);++u<e;)for(var o=n[u],f=-1;++f<e;)f!=u&&(i[u]=jt(i[u]||o,n[f],t,r));return wr(kt(i,1),t,r)}function Er(n,t,r){for(var e=-1,u=n.length,i=t.length,o={};++e<u;)r(o,n[e],e<i?t[e]:F);return o}function Or(n){return lu(n)?n:[]}function Sr(n){return typeof n=="function"?n:Mu;
}function Ir(n){return uf(n)?n:bo(n)}function Rr(n,t,r){var e=n.length;return r=r===F?e:r,!t&&r>=e?n:vr(n,t,r)}function zr(n,t){if(t)return n.slice();var r=n.length,r=_i?_i(r):new n.constructor(r);return n.copy(r),r}function Wr(n){var t=new n.constructor(n.byteLength);return new pi(t).set(new pi(n)),t}function Br(n,t){return new n.constructor(t?Wr(n.buffer):n.buffer,n.byteOffset,n.length)}function Lr(n,t){if(n!==t){var r=n!==F,e=null===n,u=n===n,i=xu(n),o=t!==F,f=null===t,c=t===t,a=xu(t);if(!f&&!a&&!i&&n>t||i&&o&&c&&!f&&!a||e&&o&&c||!r&&c||!u)return 1;
if(!e&&!i&&!a&&n<t||a&&r&&u&&!e&&!i||f&&r&&u||!o&&u||!c)return-1}return 0}function Ur(n,t,r,e){var u=-1,i=n.length,o=r.length,f=-1,c=t.length,a=Bi(i-o,0),l=qu(c+a);for(e=!e;++f<c;)l[f]=t[f];for(;++u<o;)(e||u<i)&&(l[r[u]]=n[u]);for(;a--;)l[f++]=n[u++];return l}function Cr(n,t,r,e){var u=-1,i=n.length,o=-1,f=r.length,c=-1,a=t.length,l=Bi(i-f,0),s=qu(l+a);for(e=!e;++u<l;)s[u]=n[u];for(l=u;++c<a;)s[l+c]=t[c];for(;++o<f;)(e||u<i)&&(s[l+r[o]]=n[u++]);return s}function Dr(n,t){var r=-1,e=n.length;for(t||(t=qu(e));++r<e;)t[r]=n[r];
return t}function Mr(n,t,r,e){var u=!r;r||(r={});for(var i=-1,o=t.length;++i<o;){var f=t[i],c=e?e(r[f],n[f],f,r,n):F;c===F&&(c=n[f]),u?_t(r,f,c):lt(r,f,c)}return r}function Tr(n,t){return Mr(n,so(n),t)}function $r(n,t){return function(r,u){var i=uf(r)?e:ht,o=t?t():{};return i(r,n,ve(u,2),o)}}function Fr(n){return lr(function(t,r){var e=-1,u=r.length,i=1<u?r[u-1]:F,o=2<u?r[2]:F,i=3<n.length&&typeof i=="function"?(u--,i):F;for(o&&ke(r[0],r[1],o)&&(i=3>u?F:i,u=1),t=Ju(t);++e<u;)(o=r[e])&&n(t,o,e,i);return t;
})}function Nr(n,t){return function(r,e){if(null==r)return r;if(!au(r))return n(r,e);for(var u=r.length,i=t?u:-1,o=Ju(r);(t?i--:++i<u)&&false!==e(o[i],i,o););return r}}function Pr(n){return function(t,r,e){var u=-1,i=Ju(t);e=e(t);for(var o=e.length;o--;){var f=e[n?o:++u];if(false===r(i[f],f,i))break}return t}}function Zr(n,t,r){function e(){return(this&&this!==Zn&&this instanceof e?i:n).apply(u?r:this,arguments)}var u=1&t,i=Kr(n);return e}function qr(n){return function(t){t=Ou(t);var r=Bn.test(t)?$(t):F,e=r?r[0]:t.charAt(0);
return t=r?Rr(r,1).join(""):t.slice(1),e[n]()+t}}function Vr(n){return function(t){return h(Cu(Uu(t).replace(In,"")),n,"")}}function Kr(n){return function(){var t=arguments;switch(t.length){case 0:return new n;case 1:return new n(t[0]);case 2:return new n(t[0],t[1]);case 3:return new n(t[0],t[1],t[2]);case 4:return new n(t[0],t[1],t[2],t[3]);case 5:return new n(t[0],t[1],t[2],t[3],t[4]);case 6:return new n(t[0],t[1],t[2],t[3],t[4],t[5]);case 7:return new n(t[0],t[1],t[2],t[3],t[4],t[5],t[6])}var r=to(n.prototype),t=n.apply(r,t);
return vu(t)?t:r}}function Gr(n,t,e){function u(){for(var o=arguments.length,f=qu(o),c=o,a=_e(u);c--;)f[c]=arguments[c];return c=3>o&&f[0]!==a&&f[o-1]!==a?[]:C(f,a),o-=c.length,o<e?ie(n,t,Yr,u.placeholder,F,f,c,F,F,e-o):r(this&&this!==Zn&&this instanceof u?i:n,this,f)}var i=Kr(n);return u}function Hr(n){return function(t,r,e){var u=Ju(t);if(!au(t)){var i=ve(r,3);t=Ru(t),r=function(n){return i(u[n],n,u)}}return r=n(t,r,e),-1<r?u[i?t[r]:r]:F}}function Jr(n){return se(function(t){var r=t.length,e=r,u=zn.prototype.thru;
for(n&&t.reverse();e--;){var i=t[e];if(typeof i!="function")throw new Xu("Expected a function");if(u&&!o&&"wrapper"==pe(i))var o=new zn([],true)}for(e=o?e:r;++e<r;)var i=t[e],u=pe(i),f="wrapper"==u?lo(i):F,o=f&&Oe(f[0])&&424==f[1]&&!f[4].length&&1==f[9]?o[pe(f[0])].apply(o,f[3]):1==i.length&&Oe(i)?o[u]():o.thru(i);return function(){var n=arguments,e=n[0];if(o&&1==n.length&&uf(e)&&200<=e.length)return o.plant(e).value();for(var u=0,n=r?t[u].apply(this,n):e;++u<r;)n=t[u].call(this,n);return n}})}function Yr(n,t,r,e,u,i,o,f,c,a){
function l(){for(var d=arguments.length,y=qu(d),b=d;b--;)y[b]=arguments[b];if(_){var x,j=_e(l),b=y.length;for(x=0;b--;)y[b]===j&&++x}if(e&&(y=Ur(y,e,u,_)),i&&(y=Cr(y,i,o,_)),d-=x,_&&d<a)return j=C(y,j),ie(n,t,Yr,l.placeholder,r,y,j,f,c,a-d);if(j=h?r:this,b=p?j[n]:n,d=y.length,f){x=y.length;for(var w=Li(f.length,x),m=Dr(y);w--;){var A=f[w];y[w]=Ae(A,x)?m[A]:F}}else v&&1<d&&y.reverse();return s&&c<d&&(y.length=c),this&&this!==Zn&&this instanceof l&&(b=g||Kr(b)),b.apply(j,y)}var s=128&t,h=1&t,p=2&t,_=24&t,v=512&t,g=p?F:Kr(n);
return l}function Qr(n,t){return function(r,e){return Ct(r,n,t(e))}}function Xr(n,t){return function(r,e){var u;if(r===F&&e===F)return t;if(r!==F&&(u=r),e!==F){if(u===F)return e;typeof r=="string"||typeof e=="string"?(r=jr(r),e=jr(e)):(r=xr(r),e=xr(e)),u=n(r,e)}return u}}function ne(n){return se(function(t){return t=l(t,S(ve())),lr(function(e){var u=this;return n(t,function(n){return r(n,u,e)})})})}function te(n,t){t=t===F?" ":jr(t);var r=t.length;return 2>r?r?ar(t,n):t:(r=ar(t,Ei(n/T(t))),Bn.test(t)?Rr($(r),0,n).join(""):r.slice(0,n));
}function re(n,t,e,u){function i(){for(var t=-1,c=arguments.length,a=-1,l=u.length,s=qu(l+c),h=this&&this!==Zn&&this instanceof i?f:n;++a<l;)s[a]=u[a];for(;c--;)s[a++]=arguments[++t];return r(h,o?e:this,s)}var o=1&t,f=Kr(n);return i}function ee(n){return function(t,r,e){e&&typeof e!="number"&&ke(t,r,e)&&(r=e=F),t=wu(t),r===F?(r=t,t=0):r=wu(r),e=e===F?t<r?1:-1:wu(e);var u=-1;r=Bi(Ei((r-t)/(e||1)),0);for(var i=qu(r);r--;)i[n?r:++u]=t,t+=e;return i}}function ue(n){return function(t,r){return typeof t=="string"&&typeof r=="string"||(t=ku(t),
r=ku(r)),n(t,r)}}function ie(n,t,r,e,u,i,o,f,c,a){var l=8&t,s=l?o:F;o=l?F:o;var h=l?i:F;return i=l?F:i,t=(t|(l?32:64))&~(l?64:32),4&t||(t&=-4),u=[n,t,u,h,s,i,o,f,c,a],r=r.apply(F,u),Oe(n)&&vo(r,u),r.placeholder=e,Be(r,n,t)}function oe(n){var t=Hu[n];return function(n,r){if(n=ku(n),r=Li(mu(r),292)){var e=(Ou(n)+"e").split("e"),e=t(e[0]+"e"+(+e[1]+r)),e=(Ou(e)+"e").split("e");return+(e[0]+"e"+(+e[1]-r))}return t(n)}}function fe(n){return function(t){var r=po(t);return"[object Map]"==r?L(t):"[object Set]"==r?M(t):O(t,n(t));
}}function ce(n,t,r,e,u,i,o,f){var c=2&t;if(!c&&typeof n!="function")throw new Xu("Expected a function");var a=e?e.length:0;if(a||(t&=-97,e=u=F),o=o===F?o:Bi(mu(o),0),f=f===F?f:mu(f),a-=u?u.length:0,64&t){var l=e,s=u;e=u=F}var h=c?F:lo(n);return i=[n,t,r,e,u,l,s,i,o,f],h&&(r=i[1],n=h[1],t=r|n,e=128==n&&8==r||128==n&&256==r&&i[7].length<=h[8]||384==n&&h[7].length<=h[8]&&8==r,131>t||e)&&(1&n&&(i[2]=h[2],t|=1&r?0:4),(r=h[3])&&(e=i[3],i[3]=e?Ur(e,r,h[4]):r,i[4]=e?C(i[3],"__lodash_placeholder__"):h[4]),
(r=h[5])&&(e=i[5],i[5]=e?Cr(e,r,h[6]):r,i[6]=e?C(i[5],"__lodash_placeholder__"):h[6]),(r=h[7])&&(i[7]=r),128&n&&(i[8]=null==i[8]?h[8]:Li(i[8],h[8])),null==i[9]&&(i[9]=h[9]),i[0]=h[0],i[1]=t),n=i[0],t=i[1],r=i[2],e=i[3],u=i[4],f=i[9]=null==i[9]?c?0:n.length:Bi(i[9]-a,0),!f&&24&t&&(t&=-25),Be((h?oo:vo)(t&&1!=t?8==t||16==t?Gr(n,t,f):32!=t&&33!=t||u.length?Yr.apply(F,i):re(n,t,r,e):Zr(n,t,r),i),n,t)}function ae(n,t,r,e,u,i){var o=2&u,f=n.length,c=t.length;if(f!=c&&!(o&&c>f))return false;if((c=i.get(n))&&i.get(t))return c==t;
var c=-1,a=true,l=1&u?new qn:F;for(i.set(n,t),i.set(t,n);++c<f;){var s=n[c],h=t[c];if(e)var p=o?e(h,s,c,t,n,i):e(s,h,c,n,t,i);if(p!==F){if(p)continue;a=false;break}if(l){if(!_(t,function(n,t){if(!R(l,t)&&(s===n||r(s,n,e,u,i)))return l.push(t)})){a=false;break}}else if(s!==h&&!r(s,h,e,u,i)){a=false;break}}return i.delete(n),i.delete(t),a}function le(n,t,r,e,u,i,o){switch(r){case"[object DataView]":if(n.byteLength!=t.byteLength||n.byteOffset!=t.byteOffset)break;n=n.buffer,t=t.buffer;case"[object ArrayBuffer]":
if(n.byteLength!=t.byteLength||!e(new pi(n),new pi(t)))break;return true;case"[object Boolean]":case"[object Date]":case"[object Number]":return cu(+n,+t);case"[object Error]":return n.name==t.name&&n.message==t.message;case"[object RegExp]":case"[object String]":return n==t+"";case"[object Map]":var f=L;case"[object Set]":if(f||(f=D),n.size!=t.size&&!(2&i))break;return(r=o.get(n))?r==t:(i|=1,o.set(n,t),t=ae(f(n),f(t),e,u,i,o),o.delete(n),t);case"[object Symbol]":if(Xi)return Xi.call(n)==Xi.call(t)}
return false}function se(n){return yo(ze(n,F,Ne),n+"")}function he(n){return Rt(n,Ru,so)}function pe(n){for(var t=n.name+"",r=Vi[t],e=ui.call(Vi,t)?r.length:0;e--;){var u=r[e],i=u.func;if(null==i||i==n)return u.name}return t}function _e(n){return(ui.call(On,"placeholder")?On:n).placeholder}function ve(){var n=On.iteratee||Tu,n=n===Tu?Gt:n;return arguments.length?n(arguments[0],arguments[1]):n}function ge(n,t){var r=n.__data__,e=typeof t;return("string"==e||"number"==e||"symbol"==e||"boolean"==e?"__proto__"!==t:null===t)?r[typeof t=="string"?"string":"hash"]:r.map;
}function de(n){for(var t=Ru(n),r=t.length;r--;){var e=t[r],u=n[e];t[r]=[e,u,u===u&&!vu(u)]}return t}function ye(n,t){var r=null==n?F:n[t];return Zt(r)?r:F}function be(n,t,r){t=Ee(t,n)?[t]:Ir(t);for(var e=-1,u=t.length,i=false;++e<u;){var o=Ce(t[e]);if(!(i=null!=n&&r(n,o)))break;n=n[o]}return i||++e!=u?i:(u=null==n?0:n.length,!!u&&_u(u)&&Ae(o,u)&&(uf(n)||ef(n)))}function xe(n){var t=n.length,r=n.constructor(t);return t&&"string"==typeof n[0]&&ui.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function je(n){
return typeof n.constructor!="function"||Se(n)?{}:to(vi(n))}function we(r,e,u,i){var o=r.constructor;switch(e){case"[object ArrayBuffer]":return Wr(r);case"[object Boolean]":case"[object Date]":return new o(+r);case"[object DataView]":return e=i?Wr(r.buffer):r.buffer,new r.constructor(e,r.byteOffset,r.byteLength);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":
case"[object Uint16Array]":case"[object Uint32Array]":return Br(r,i);case"[object Map]":return e=i?u(L(r),true):L(r),h(e,n,new r.constructor);case"[object Number]":case"[object String]":return new o(r);case"[object RegExp]":return e=new r.constructor(r.source,dn.exec(r)),e.lastIndex=r.lastIndex,e;case"[object Set]":return e=i?u(D(r),true):D(r),h(e,t,new r.constructor);case"[object Symbol]":return Xi?Ju(Xi.call(r)):{}}}function me(n){return uf(n)||ef(n)||!!(bi&&n&&n[bi])}function Ae(n,t){return t=null==t?9007199254740991:t,
!!t&&(typeof n=="number"||wn.test(n))&&-1<n&&0==n%1&&n<t}function ke(n,t,r){if(!vu(r))return false;var e=typeof t;return!!("number"==e?au(r)&&Ae(t,r.length):"string"==e&&t in r)&&cu(r[t],n)}function Ee(n,t){if(uf(n))return false;var r=typeof n;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=n&&!xu(n))||(rn.test(n)||!tn.test(n)||null!=t&&n in Ju(t))}function Oe(n){var t=pe(n),r=On[t];return typeof r=="function"&&t in Mn.prototype&&(n===r||(t=lo(r),!!t&&n===t[0]))}function Se(n){var t=n&&n.constructor;
return n===(typeof t=="function"&&t.prototype||ti)}function Ie(n,t){return function(r){return null!=r&&(r[n]===t&&(t!==F||n in Ju(r)))}}function Re(n,t,r,e,u,i){return vu(n)&&vu(t)&&(i.set(t,n),nr(n,t,F,Re,i),i.delete(t)),n}function ze(n,t,e){return t=Bi(t===F?n.length-1:t,0),function(){for(var u=arguments,i=-1,o=Bi(u.length-t,0),f=qu(o);++i<o;)f[i]=u[t+i];for(i=-1,o=qu(t+1);++i<t;)o[i]=u[i];return o[t]=e(f),r(n,this,o)}}function We(n,t){return 1==t.length?n:It(n,vr(t,0,-1))}function Be(n,t,r){var e=t+"";
t=yo;var u,i=Me;return u=(u=e.match(hn))?u[1].split(pn):[],r=i(u,r),(i=r.length)&&(u=i-1,r[u]=(1<i?"& ":"")+r[u],r=r.join(2<i?", ":" "),e=e.replace(sn,"{\n/* [wrapped with "+r+"] */\n")),t(n,e)}function Le(n){var t=0,r=0;return function(){var e=Ui(),u=16-(e-r);if(r=e,0<u){if(800<=++t)return arguments[0]}else t=0;return n.apply(F,arguments)}}function Ue(n,t){var r=-1,e=n.length,u=e-1;for(t=t===F?e:t;++r<t;){var e=cr(r,u),i=n[e];n[e]=n[r],n[r]=i}return n.length=t,n}function Ce(n){if(typeof n=="string"||xu(n))return n;
var t=n+"";return"0"==t&&1/n==-N?"-0":t}function De(n){if(null!=n){try{return ei.call(n)}catch(n){}return n+""}return""}function Me(n,t){return u(Z,function(r){var e="_."+r[0];t&r[1]&&!c(n,e)&&n.push(e)}),n.sort()}function Te(n){if(n instanceof Mn)return n.clone();var t=new zn(n.__wrapped__,n.__chain__);return t.__actions__=Dr(n.__actions__),t.__index__=n.__index__,t.__values__=n.__values__,t}function $e(n,t,r){var e=null==n?0:n.length;return e?(r=null==r?0:mu(r),0>r&&(r=Bi(e+r,0)),g(n,ve(t,3),r)):-1;
}function Fe(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e-1;return r!==F&&(u=mu(r),u=0>r?Bi(e+u,0):Li(u,e-1)),g(n,ve(t,3),u,true)}function Ne(n){return(null==n?0:n.length)?kt(n,1):[]}function Pe(n){return n&&n.length?n[0]:F}function Ze(n){var t=null==n?0:n.length;return t?n[t-1]:F}function qe(n,t){return n&&n.length&&t&&t.length?or(n,t):n}function Ve(n){return null==n?n:Mi.call(n)}function Ke(n){if(!n||!n.length)return[];var t=0;return n=f(n,function(n){if(lu(n))return t=Bi(n.length,t),true;
}),E(t,function(t){return l(n,j(t))})}function Ge(n,t){if(!n||!n.length)return[];var e=Ke(n);return null==t?e:l(e,function(n){return r(t,F,n)})}function He(n){return n=On(n),n.__chain__=true,n}function Je(n,t){return t(n)}function Ye(){return this}function Qe(n,t){return(uf(n)?u:ro)(n,ve(t,3))}function Xe(n,t){return(uf(n)?i:eo)(n,ve(t,3))}function nu(n,t){return(uf(n)?l:Yt)(n,ve(t,3))}function tu(n,t,r){return t=r?F:t,t=n&&null==t?n.length:t,ce(n,128,F,F,F,F,t)}function ru(n,t){var r;if(typeof t!="function")throw new Xu("Expected a function");
return n=mu(n),function(){return 0<--n&&(r=t.apply(this,arguments)),1>=n&&(t=F),r}}function eu(n,t,r){return t=r?F:t,n=ce(n,8,F,F,F,F,F,t),n.placeholder=eu.placeholder,n}function uu(n,t,r){return t=r?F:t,n=ce(n,16,F,F,F,F,F,t),n.placeholder=uu.placeholder,n}function iu(n,t,r){function e(t){var r=c,e=a;return c=a=F,_=t,s=n.apply(e,r)}function u(n){var r=n-p;return n-=_,p===F||r>=t||0>r||g&&n>=l}function i(){var n=Vo();if(u(n))return o(n);var r,e=go;r=n-_,n=t-(n-p),r=g?Li(n,l-r):n,h=e(i,r)}function o(n){
return h=F,d&&c?e(n):(c=a=F,s)}function f(){var n=Vo(),r=u(n);if(c=arguments,a=this,p=n,r){if(h===F)return _=n=p,h=go(i,t),v?e(n):s;if(g)return h=go(i,t),e(p)}return h===F&&(h=go(i,t)),s}var c,a,l,s,h,p,_=0,v=false,g=false,d=true;if(typeof n!="function")throw new Xu("Expected a function");return t=ku(t)||0,vu(r)&&(v=!!r.leading,l=(g="maxWait"in r)?Bi(ku(r.maxWait)||0,t):l,d="trailing"in r?!!r.trailing:d),f.cancel=function(){h!==F&&co(h),_=0,c=p=a=h=F},f.flush=function(){return h===F?s:o(Vo())},f}function ou(n,t){
function r(){var e=arguments,u=t?t.apply(this,e):e[0],i=r.cache;return i.has(u)?i.get(u):(e=n.apply(this,e),r.cache=i.set(u,e)||i,e)}if(typeof n!="function"||null!=t&&typeof t!="function")throw new Xu("Expected a function");return r.cache=new(ou.Cache||Pn),r}function fu(n){if(typeof n!="function")throw new Xu("Expected a function");return function(){var t=arguments;switch(t.length){case 0:return!n.call(this);case 1:return!n.call(this,t[0]);case 2:return!n.call(this,t[0],t[1]);case 3:return!n.call(this,t[0],t[1],t[2]);
}return!n.apply(this,t)}}function cu(n,t){return n===t||n!==n&&t!==t}function au(n){return null!=n&&_u(n.length)&&!hu(n)}function lu(n){return gu(n)&&au(n)}function su(n){if(!gu(n))return false;var t=zt(n);return"[object Error]"==t||"[object DOMException]"==t||typeof n.message=="string"&&typeof n.name=="string"&&!yu(n)}function hu(n){return!!vu(n)&&(n=zt(n),"[object Function]"==n||"[object GeneratorFunction]"==n||"[object AsyncFunction]"==n||"[object Proxy]"==n)}function pu(n){return typeof n=="number"&&n==mu(n);
}function _u(n){return typeof n=="number"&&-1<n&&0==n%1&&9007199254740991>=n}function vu(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}function gu(n){return null!=n&&typeof n=="object"}function du(n){return typeof n=="number"||gu(n)&&"[object Number]"==zt(n)}function yu(n){return!(!gu(n)||"[object Object]"!=zt(n))&&(n=vi(n),null===n||(n=ui.call(n,"constructor")&&n.constructor,typeof n=="function"&&n instanceof n&&ei.call(n)==ci))}function bu(n){return typeof n=="string"||!uf(n)&&gu(n)&&"[object String]"==zt(n);
}function xu(n){return typeof n=="symbol"||gu(n)&&"[object Symbol]"==zt(n)}function ju(n){if(!n)return[];if(au(n))return bu(n)?$(n):Dr(n);if(xi&&n[xi]){n=n[xi]();for(var t,r=[];!(t=n.next()).done;)r.push(t.value);return r}return t=po(n),("[object Map]"==t?L:"[object Set]"==t?D:Bu)(n)}function wu(n){return n?(n=ku(n),n===N||n===-N?1.7976931348623157e308*(0>n?-1:1):n===n?n:0):0===n?n:0}function mu(n){n=wu(n);var t=n%1;return n===n?t?n-t:n:0}function Au(n){return n?gt(mu(n),0,4294967295):0}function ku(n){
if(typeof n=="number")return n;if(xu(n))return P;if(vu(n)&&(n=typeof n.valueOf=="function"?n.valueOf():n,n=vu(n)?n+"":n),typeof n!="string")return 0===n?n:+n;n=n.replace(cn,"");var t=bn.test(n);return t||jn.test(n)?Fn(n.slice(2),t?2:8):yn.test(n)?P:+n}function Eu(n){return Mr(n,zu(n))}function Ou(n){return null==n?"":jr(n)}function Su(n,t,r){return n=null==n?F:It(n,t),n===F?r:n}function Iu(n,t){return null!=n&&be(n,t,Lt)}function Ru(n){return au(n)?Gn(n):Ht(n)}function zu(n){if(au(n))n=Gn(n,true);else if(vu(n)){
var t,r=Se(n),e=[];for(t in n)("constructor"!=t||!r&&ui.call(n,t))&&e.push(t);n=e}else{if(t=[],null!=n)for(r in Ju(n))t.push(r);n=t}return n}function Wu(n,t){return null==n?{}:ur(n,Rt(n,zu,ho),ve(t))}function Bu(n){return null==n?[]:I(n,Ru(n))}function Lu(n){return Mf(Ou(n).toLowerCase())}function Uu(n){return(n=Ou(n))&&n.replace(mn,rt).replace(Rn,"")}function Cu(n,t,r){return n=Ou(n),t=r?F:t,t===F?Ln.test(n)?n.match(Wn)||[]:n.match(_n)||[]:n.match(t)||[]}function Du(n){return function(){return n;
}}function Mu(n){return n}function Tu(n){return Gt(typeof n=="function"?n:dt(n,true))}function $u(n,t,r){var e=Ru(t),i=St(t,e);null!=r||vu(t)&&(i.length||!e.length)||(r=t,t=n,n=this,i=St(t,Ru(t)));var o=!(vu(r)&&"chain"in r&&!r.chain),f=hu(n);return u(i,function(r){var e=t[r];n[r]=e,f&&(n.prototype[r]=function(){var t=this.__chain__;if(o||t){var r=n(this.__wrapped__);return(r.__actions__=Dr(this.__actions__)).push({func:e,args:arguments,thisArg:n}),r.__chain__=t,r}return e.apply(n,s([this.value()],arguments));
})}),n}function Fu(){}function Nu(n){return Ee(n)?j(Ce(n)):ir(n)}function Pu(){return[]}function Zu(){return false}En=null==En?Zn:it.defaults(Zn.Object(),En,it.pick(Zn,Un));var qu=En.Array,Vu=En.Date,Ku=En.Error,Gu=En.Function,Hu=En.Math,Ju=En.Object,Yu=En.RegExp,Qu=En.String,Xu=En.TypeError,ni=qu.prototype,ti=Ju.prototype,ri=En["__core-js_shared__"],ei=Gu.prototype.toString,ui=ti.hasOwnProperty,ii=0,oi=function(){var n=/[^.]+$/.exec(ri&&ri.keys&&ri.keys.IE_PROTO||"");return n?"Symbol(src)_1."+n:""}(),fi=ti.toString,ci=ei.call(Ju),ai=Zn._,li=Yu("^"+ei.call(ui).replace(on,"\\%lodash/lodash.min.js%").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"lodash/lodash.min.js.*?")+"$"),si=Kn?En.Buffer:F,hi=En.Symbol,pi=En.Uint8Array,_i=si?si.f:F,vi=U(Ju.getPrototypeOf,Ju),gi=Ju.create,di=ti.propertyIsEnumerable,yi=ni.splice,bi=hi?hi.isConcatSpreadable:F,xi=hi?hi.iterator:F,ji=hi?hi.toStringTag:F,wi=function(){
try{var n=ye(Ju,"defineProperty");return n({},"",{}),n}catch(n){}}(),mi=En.clearTimeout!==Zn.clearTimeout&&En.clearTimeout,Ai=Vu&&Vu.now!==Zn.Date.now&&Vu.now,ki=En.setTimeout!==Zn.setTimeout&&En.setTimeout,Ei=Hu.ceil,Oi=Hu.floor,Si=Ju.getOwnPropertySymbols,Ii=si?si.isBuffer:F,Ri=En.isFinite,zi=ni.join,Wi=U(Ju.keys,Ju),Bi=Hu.max,Li=Hu.min,Ui=Vu.now,Ci=En.parseInt,Di=Hu.random,Mi=ni.reverse,Ti=ye(En,"DataView"),$i=ye(En,"Map"),Fi=ye(En,"Promise"),Ni=ye(En,"Set"),Pi=ye(En,"WeakMap"),Zi=ye(Ju,"create"),qi=Pi&&new Pi,Vi={},Ki=De(Ti),Gi=De($i),Hi=De(Fi),Ji=De(Ni),Yi=De(Pi),Qi=hi?hi.prototype:F,Xi=Qi?Qi.valueOf:F,no=Qi?Qi.toString:F,to=function(){
function n(){}return function(t){return vu(t)?gi?gi(t):(n.prototype=t,t=new n,n.prototype=F,t):{}}}();On.templateSettings={escape:Q,evaluate:X,interpolate:nn,variable:"",imports:{_:On}},On.prototype=Sn.prototype,On.prototype.constructor=On,zn.prototype=to(Sn.prototype),zn.prototype.constructor=zn,Mn.prototype=to(Sn.prototype),Mn.prototype.constructor=Mn,Tn.prototype.clear=function(){this.__data__=Zi?Zi(null):{},this.size=0},Tn.prototype.delete=function(n){return n=this.has(n)&&delete this.__data__[n],
this.size-=n?1:0,n},Tn.prototype.get=function(n){var t=this.__data__;return Zi?(n=t[n],"__lodash_hash_undefined__"===n?F:n):ui.call(t,n)?t[n]:F},Tn.prototype.has=function(n){var t=this.__data__;return Zi?t[n]!==F:ui.call(t,n)},Tn.prototype.set=function(n,t){var r=this.__data__;return this.size+=this.has(n)?0:1,r[n]=Zi&&t===F?"__lodash_hash_undefined__":t,this},Nn.prototype.clear=function(){this.__data__=[],this.size=0},Nn.prototype.delete=function(n){var t=this.__data__;return n=st(t,n),!(0>n)&&(n==t.length-1?t.pop():yi.call(t,n,1),
--this.size,true)},Nn.prototype.get=function(n){var t=this.__data__;return n=st(t,n),0>n?F:t[n][1]},Nn.prototype.has=function(n){return-1<st(this.__data__,n)},Nn.prototype.set=function(n,t){var r=this.__data__,e=st(r,n);return 0>e?(++this.size,r.push([n,t])):r[e][1]=t,this},Pn.prototype.clear=function(){this.size=0,this.__data__={hash:new Tn,map:new($i||Nn),string:new Tn}},Pn.prototype.delete=function(n){return n=ge(this,n).delete(n),this.size-=n?1:0,n},Pn.prototype.get=function(n){return ge(this,n).get(n);
},Pn.prototype.has=function(n){return ge(this,n).has(n)},Pn.prototype.set=function(n,t){var r=ge(this,n),e=r.size;return r.set(n,t),this.size+=r.size==e?0:1,this},qn.prototype.add=qn.prototype.push=function(n){return this.__data__.set(n,"__lodash_hash_undefined__"),this},qn.prototype.has=function(n){return this.__data__.has(n)},Vn.prototype.clear=function(){this.__data__=new Nn,this.size=0},Vn.prototype.delete=function(n){var t=this.__data__;return n=t.delete(n),this.size=t.size,n},Vn.prototype.get=function(n){
return this.__data__.get(n)},Vn.prototype.has=function(n){return this.__data__.has(n)},Vn.prototype.set=function(n,t){var r=this.__data__;if(r instanceof Nn){var e=r.__data__;if(!$i||199>e.length)return e.push([n,t]),this.size=++r.size,this;r=this.__data__=new Pn(e)}return r.set(n,t),this.size=r.size,this};var ro=Nr(Et),eo=Nr(Ot,true),uo=Pr(),io=Pr(true),oo=qi?function(n,t){return qi.set(n,t),n}:Mu,fo=wi?function(n,t){return wi(n,"toString",{configurable:true,enumerable:false,value:Du(t),writable:true})}:Mu,co=mi||function(n){
return Zn.clearTimeout(n)},ao=Ni&&1/D(new Ni([,-0]))[1]==N?function(n){return new Ni(n)}:Fu,lo=qi?function(n){return qi.get(n)}:Fu,so=Si?U(Si,Ju):Pu,ho=Si?function(n){for(var t=[];n;)s(t,so(n)),n=vi(n);return t}:Pu,po=zt;(Ti&&"[object DataView]"!=po(new Ti(new ArrayBuffer(1)))||$i&&"[object Map]"!=po(new $i)||Fi&&"[object Promise]"!=po(Fi.resolve())||Ni&&"[object Set]"!=po(new Ni)||Pi&&"[object WeakMap]"!=po(new Pi))&&(po=function(n){var t=zt(n);if(n=(n="[object Object]"==t?n.constructor:F)?De(n):"")switch(n){
case Ki:return"[object DataView]";case Gi:return"[object Map]";case Hi:return"[object Promise]";case Ji:return"[object Set]";case Yi:return"[object WeakMap]"}return t});var _o=ri?hu:Zu,vo=Le(oo),go=ki||function(n,t){return Zn.setTimeout(n,t)},yo=Le(fo),bo=function(n){n=ou(n,function(n){return 500===t.size&&t.clear(),n});var t=n.cache;return n}(function(n){n=Ou(n);var t=[];return en.test(n)&&t.push(""),n.replace(un,function(n,r,e,u){t.push(e?u.replace(vn,"lodash/lodash.min.js"):r||n)}),t}),xo=lr(function(n,t){return lu(n)?jt(n,kt(t,1,lu,true)):[];
}),jo=lr(function(n,t){var r=Ze(t);return lu(r)&&(r=F),lu(n)?jt(n,kt(t,1,lu,true),ve(r,2)):[]}),wo=lr(function(n,t){var r=Ze(t);return lu(r)&&(r=F),lu(n)?jt(n,kt(t,1,lu,true),F,r):[]}),mo=lr(function(n){var t=l(n,Or);return t.length&&t[0]===n[0]?Ut(t):[]}),Ao=lr(function(n){var t=Ze(n),r=l(n,Or);return t===Ze(r)?t=F:r.pop(),r.length&&r[0]===n[0]?Ut(r,ve(t,2)):[]}),ko=lr(function(n){var t=Ze(n),r=l(n,Or);return(t=typeof t=="function"?t:F)&&r.pop(),r.length&&r[0]===n[0]?Ut(r,F,t):[]}),Eo=lr(qe),Oo=se(function(n,t){
var r=null==n?0:n.length,e=vt(n,t);return fr(n,l(t,function(n){return Ae(n,r)?+n:n}).sort(Lr)),e}),So=lr(function(n){return wr(kt(n,1,lu,true))}),Io=lr(function(n){var t=Ze(n);return lu(t)&&(t=F),wr(kt(n,1,lu,true),ve(t,2))}),Ro=lr(function(n){var t=Ze(n),t=typeof t=="function"?t:F;return wr(kt(n,1,lu,true),F,t)}),zo=lr(function(n,t){return lu(n)?jt(n,t):[]}),Wo=lr(function(n){return kr(f(n,lu))}),Bo=lr(function(n){var t=Ze(n);return lu(t)&&(t=F),kr(f(n,lu),ve(t,2))}),Lo=lr(function(n){var t=Ze(n),t=typeof t=="function"?t:F;
return kr(f(n,lu),F,t)}),Uo=lr(Ke),Co=lr(function(n){var t=n.length,t=1<t?n[t-1]:F,t=typeof t=="function"?(n.pop(),t):F;return Ge(n,t)}),Do=se(function(n){function t(t){return vt(t,n)}var r=n.length,e=r?n[0]:0,u=this.__wrapped__;return!(1<r||this.__actions__.length)&&u instanceof Mn&&Ae(e)?(u=u.slice(e,+e+(r?1:0)),u.__actions__.push({func:Je,args:[t],thisArg:F}),new zn(u,this.__chain__).thru(function(n){return r&&!n.length&&n.push(F),n})):this.thru(t)}),Mo=$r(function(n,t,r){ui.call(n,r)?++n[r]:_t(n,r,1);
}),To=Hr($e),$o=Hr(Fe),Fo=$r(function(n,t,r){ui.call(n,r)?n[r].push(t):_t(n,r,[t])}),No=lr(function(n,t,e){var u=-1,i=typeof t=="function",o=Ee(t),f=au(n)?qu(n.length):[];return ro(n,function(n){var c=i?t:o&&null!=n?n[t]:F;f[++u]=c?r(c,n,e):Dt(n,t,e)}),f}),Po=$r(function(n,t,r){_t(n,r,t)}),Zo=$r(function(n,t,r){n[r?0:1].push(t)},function(){return[[],[]]}),qo=lr(function(n,t){if(null==n)return[];var r=t.length;return 1<r&&ke(n,t[0],t[1])?t=[]:2<r&&ke(t[0],t[1],t[2])&&(t=[t[0]]),rr(n,kt(t,1),[])}),Vo=Ai||function(){
return Zn.Date.now()},Ko=lr(function(n,t,r){var e=1;if(r.length)var u=C(r,_e(Ko)),e=32|e;return ce(n,e,t,r,u)}),Go=lr(function(n,t,r){var e=3;if(r.length)var u=C(r,_e(Go)),e=32|e;return ce(t,e,n,r,u)}),Ho=lr(function(n,t){return xt(n,1,t)}),Jo=lr(function(n,t,r){return xt(n,ku(t)||0,r)});ou.Cache=Pn;var Yo=lr(function(n,t){t=1==t.length&&uf(t[0])?l(t[0],S(ve())):l(kt(t,1),S(ve()));var e=t.length;return lr(function(u){for(var i=-1,o=Li(u.length,e);++i<o;)u[i]=t[i].call(this,u[i]);return r(n,this,u);
})}),Qo=lr(function(n,t){return ce(n,32,F,t,C(t,_e(Qo)))}),Xo=lr(function(n,t){return ce(n,64,F,t,C(t,_e(Xo)))}),nf=se(function(n,t){return ce(n,256,F,F,F,t)}),tf=ue(Wt),rf=ue(function(n,t){return n>=t}),ef=Mt(function(){return arguments}())?Mt:function(n){return gu(n)&&ui.call(n,"callee")&&!di.call(n,"callee")},uf=qu.isArray,of=Hn?S(Hn):Tt,ff=Ii||Zu,cf=Jn?S(Jn):$t,af=Yn?S(Yn):Nt,lf=Qn?S(Qn):qt,sf=Xn?S(Xn):Vt,hf=nt?S(nt):Kt,pf=ue(Jt),_f=ue(function(n,t){return n<=t}),vf=Fr(function(n,t){if(Se(t)||au(t))Mr(t,Ru(t),n);else for(var r in t)ui.call(t,r)&&lt(n,r,t[r]);
}),gf=Fr(function(n,t){Mr(t,zu(t),n)}),df=Fr(function(n,t,r,e){Mr(t,zu(t),n,e)}),yf=Fr(function(n,t,r,e){Mr(t,Ru(t),n,e)}),bf=se(vt),xf=lr(function(n){return n.push(F,ct),r(df,F,n)}),jf=lr(function(n){return n.push(F,Re),r(Ef,F,n)}),wf=Qr(function(n,t,r){n[t]=r},Du(Mu)),mf=Qr(function(n,t,r){ui.call(n,t)?n[t].push(r):n[t]=[r]},ve),Af=lr(Dt),kf=Fr(function(n,t,r){nr(n,t,r)}),Ef=Fr(function(n,t,r,e){nr(n,t,r,e)}),Of=se(function(n,t){return null==n?{}:(t=l(t,Ce),er(n,jt(Rt(n,zu,ho),t)))}),Sf=se(function(n,t){
return null==n?{}:er(n,l(t,Ce))}),If=fe(Ru),Rf=fe(zu),zf=Vr(function(n,t,r){return t=t.toLowerCase(),n+(r?Lu(t):t)}),Wf=Vr(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()}),Bf=Vr(function(n,t,r){return n+(r?" ":"")+t.toLowerCase()}),Lf=qr("toLowerCase"),Uf=Vr(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),Cf=Vr(function(n,t,r){return n+(r?" ":"")+Mf(t)}),Df=Vr(function(n,t,r){return n+(r?" ":"")+t.toUpperCase()}),Mf=qr("toUpperCase"),Tf=lr(function(n,t){try{return r(n,F,t)}catch(n){return su(n)?n:new Ku(n);
}}),$f=se(function(n,t){return u(t,function(t){t=Ce(t),_t(n,t,Ko(n[t],n))}),n}),Ff=Jr(),Nf=Jr(true),Pf=lr(function(n,t){return function(r){return Dt(r,n,t)}}),Zf=lr(function(n,t){return function(r){return Dt(n,r,t)}}),qf=ne(l),Vf=ne(o),Kf=ne(_),Gf=ee(),Hf=ee(true),Jf=Xr(function(n,t){return n+t},0),Yf=oe("ceil"),Qf=Xr(function(n,t){return n/t},1),Xf=oe("floor"),nc=Xr(function(n,t){return n*t},1),tc=oe("round"),rc=Xr(function(n,t){return n-t},0);return On.after=function(n,t){if(typeof t!="function")throw new Xu("Expected a function");
return n=mu(n),function(){if(1>--n)return t.apply(this,arguments)}},On.ary=tu,On.assign=vf,On.assignIn=gf,On.assignInWith=df,On.assignWith=yf,On.at=bf,On.before=ru,On.bind=Ko,On.bindAll=$f,On.bindKey=Go,On.castArray=function(){if(!arguments.length)return[];var n=arguments[0];return uf(n)?n:[n]},On.chain=He,On.chunk=function(n,t,r){if(t=(r?ke(n,t,r):t===F)?1:Bi(mu(t),0),r=null==n?0:n.length,!r||1>t)return[];for(var e=0,u=0,i=qu(Ei(r/t));e<r;)i[u++]=vr(n,e,e+=t);return i},On.compact=function(n){for(var t=-1,r=null==n?0:n.length,e=0,u=[];++t<r;){
var i=n[t];i&&(u[e++]=i)}return u},On.concat=function(){var n=arguments.length;if(!n)return[];for(var t=qu(n-1),r=arguments[0];n--;)t[n-1]=arguments[n];return s(uf(r)?Dr(r):[r],kt(t,1))},On.cond=function(n){var t=null==n?0:n.length,e=ve();return n=t?l(n,function(n){if("function"!=typeof n[1])throw new Xu("Expected a function");return[e(n[0]),n[1]]}):[],lr(function(e){for(var u=-1;++u<t;){var i=n[u];if(r(i[0],this,e))return r(i[1],this,e)}})},On.conforms=function(n){return yt(dt(n,true))},On.constant=Du,
On.countBy=Mo,On.create=function(n,t){var r=to(n);return null==t?r:pt(r,t)},On.curry=eu,On.curryRight=uu,On.debounce=iu,On.defaults=xf,On.defaultsDeep=jf,On.defer=Ho,On.delay=Jo,On.difference=xo,On.differenceBy=jo,On.differenceWith=wo,On.drop=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),vr(n,0>t?0:t,e)):[]},On.dropRight=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),t=e-t,vr(n,0,0>t?0:t)):[]},On.dropRightWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),true,true):[];
},On.dropWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),true):[]},On.fill=function(n,t,r,e){var u=null==n?0:n.length;if(!u)return[];for(r&&typeof r!="number"&&ke(n,t,r)&&(r=0,e=u),u=n.length,r=mu(r),0>r&&(r=-r>u?0:u+r),e=e===F||e>u?u:mu(e),0>e&&(e+=u),e=r>e?0:Au(e);r<e;)n[r++]=t;return n},On.filter=function(n,t){return(uf(n)?f:At)(n,ve(t,3))},On.flatMap=function(n,t){return kt(nu(n,t),1)},On.flatMapDeep=function(n,t){return kt(nu(n,t),N)},On.flatMapDepth=function(n,t,r){return r=r===F?1:mu(r),
kt(nu(n,t),r)},On.flatten=Ne,On.flattenDeep=function(n){return(null==n?0:n.length)?kt(n,N):[]},On.flattenDepth=function(n,t){return null!=n&&n.length?(t=t===F?1:mu(t),kt(n,t)):[]},On.flip=function(n){return ce(n,512)},On.flow=Ff,On.flowRight=Nf,On.fromPairs=function(n){for(var t=-1,r=null==n?0:n.length,e={};++t<r;){var u=n[t];e[u[0]]=u[1]}return e},On.functions=function(n){return null==n?[]:St(n,Ru(n))},On.functionsIn=function(n){return null==n?[]:St(n,zu(n))},On.groupBy=Fo,On.initial=function(n){
return(null==n?0:n.length)?vr(n,0,-1):[]},On.intersection=mo,On.intersectionBy=Ao,On.intersectionWith=ko,On.invert=wf,On.invertBy=mf,On.invokeMap=No,On.iteratee=Tu,On.keyBy=Po,On.keys=Ru,On.keysIn=zu,On.map=nu,On.mapKeys=function(n,t){var r={};return t=ve(t,3),Et(n,function(n,e,u){_t(r,t(n,e,u),n)}),r},On.mapValues=function(n,t){var r={};return t=ve(t,3),Et(n,function(n,e,u){_t(r,e,t(n,e,u))}),r},On.matches=function(n){return Qt(dt(n,true))},On.matchesProperty=function(n,t){return Xt(n,dt(t,true))},On.memoize=ou,
On.merge=kf,On.mergeWith=Ef,On.method=Pf,On.methodOf=Zf,On.mixin=$u,On.negate=fu,On.nthArg=function(n){return n=mu(n),lr(function(t){return tr(t,n)})},On.omit=Of,On.omitBy=function(n,t){return Wu(n,fu(ve(t)))},On.once=function(n){return ru(2,n)},On.orderBy=function(n,t,r,e){return null==n?[]:(uf(t)||(t=null==t?[]:[t]),r=e?F:r,uf(r)||(r=null==r?[]:[r]),rr(n,t,r))},On.over=qf,On.overArgs=Yo,On.overEvery=Vf,On.overSome=Kf,On.partial=Qo,On.partialRight=Xo,On.partition=Zo,On.pick=Sf,On.pickBy=Wu,On.property=Nu,
On.propertyOf=function(n){return function(t){return null==n?F:It(n,t)}},On.pull=Eo,On.pullAll=qe,On.pullAllBy=function(n,t,r){return n&&n.length&&t&&t.length?or(n,t,ve(r,2)):n},On.pullAllWith=function(n,t,r){return n&&n.length&&t&&t.length?or(n,t,F,r):n},On.pullAt=Oo,On.range=Gf,On.rangeRight=Hf,On.rearg=nf,On.reject=function(n,t){return(uf(n)?f:At)(n,fu(ve(t,3)))},On.remove=function(n,t){var r=[];if(!n||!n.length)return r;var e=-1,u=[],i=n.length;for(t=ve(t,3);++e<i;){var o=n[e];t(o,e,n)&&(r.push(o),
u.push(e))}return fr(n,u),r},On.rest=function(n,t){if(typeof n!="function")throw new Xu("Expected a function");return t=t===F?t:mu(t),lr(n,t)},On.reverse=Ve,On.sampleSize=function(n,t,r){return t=(r?ke(n,t,r):t===F)?1:mu(t),(uf(n)?ot:hr)(n,t)},On.set=function(n,t,r){return null==n?n:pr(n,t,r)},On.setWith=function(n,t,r,e){return e=typeof e=="function"?e:F,null==n?n:pr(n,t,r,e)},On.shuffle=function(n){return(uf(n)?ft:_r)(n)},On.slice=function(n,t,r){var e=null==n?0:n.length;return e?(r&&typeof r!="number"&&ke(n,t,r)?(t=0,
r=e):(t=null==t?0:mu(t),r=r===F?e:mu(r)),vr(n,t,r)):[]},On.sortBy=qo,On.sortedUniq=function(n){return n&&n.length?br(n):[]},On.sortedUniqBy=function(n,t){return n&&n.length?br(n,ve(t,2)):[]},On.split=function(n,t,r){return r&&typeof r!="number"&&ke(n,t,r)&&(t=r=F),r=r===F?4294967295:r>>>0,r?(n=Ou(n))&&(typeof t=="string"||null!=t&&!lf(t))&&(t=jr(t),!t&&Bn.test(n))?Rr($(n),0,r):n.split(t,r):[]},On.spread=function(n,t){if(typeof n!="function")throw new Xu("Expected a function");return t=t===F?0:Bi(mu(t),0),
lr(function(e){var u=e[t];return e=Rr(e,0,t),u&&s(e,u),r(n,this,e)})},On.tail=function(n){var t=null==n?0:n.length;return t?vr(n,1,t):[]},On.take=function(n,t,r){return n&&n.length?(t=r||t===F?1:mu(t),vr(n,0,0>t?0:t)):[]},On.takeRight=function(n,t,r){var e=null==n?0:n.length;return e?(t=r||t===F?1:mu(t),t=e-t,vr(n,0>t?0:t,e)):[]},On.takeRightWhile=function(n,t){return n&&n.length?mr(n,ve(t,3),false,true):[]},On.takeWhile=function(n,t){return n&&n.length?mr(n,ve(t,3)):[]},On.tap=function(n,t){return t(n),
n},On.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new Xu("Expected a function");return vu(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),iu(n,t,{leading:e,maxWait:t,trailing:u})},On.thru=Je,On.toArray=ju,On.toPairs=If,On.toPairsIn=Rf,On.toPath=function(n){return uf(n)?l(n,Ce):xu(n)?[n]:Dr(bo(n))},On.toPlainObject=Eu,On.transform=function(n,t,r){var e=uf(n),i=e||ff(n)||hf(n);if(t=ve(t,4),null==r){var o=n&&n.constructor;r=i?e?new o:[]:vu(n)&&hu(o)?to(vi(n)):{};
}return(i?u:Et)(n,function(n,e,u){return t(r,n,e,u)}),r},On.unary=function(n){return tu(n,1)},On.union=So,On.unionBy=Io,On.unionWith=Ro,On.uniq=function(n){return n&&n.length?wr(n):[]},On.uniqBy=function(n,t){return n&&n.length?wr(n,ve(t,2)):[]},On.uniqWith=function(n,t){return t=typeof t=="function"?t:F,n&&n.length?wr(n,F,t):[]},On.unset=function(n,t){var r;if(null==n)r=true;else{r=n;var e=t,e=Ee(e,r)?[e]:Ir(e);r=We(r,e),e=Ce(Ze(e)),r=!(null!=r&&ui.call(r,e))||delete r[e]}return r},On.unzip=Ke,On.unzipWith=Ge,
On.update=function(n,t,r){return null==n?n:pr(n,t,Sr(r)(It(n,t)),void 0)},On.updateWith=function(n,t,r,e){return e=typeof e=="function"?e:F,null!=n&&(n=pr(n,t,Sr(r)(It(n,t)),e)),n},On.values=Bu,On.valuesIn=function(n){return null==n?[]:I(n,zu(n))},On.without=zo,On.words=Cu,On.wrap=function(n,t){return Qo(Sr(t),n)},On.xor=Wo,On.xorBy=Bo,On.xorWith=Lo,On.zip=Uo,On.zipObject=function(n,t){return Er(n||[],t||[],lt)},On.zipObjectDeep=function(n,t){return Er(n||[],t||[],pr)},On.zipWith=Co,On.entries=If,
On.entriesIn=Rf,On.extend=gf,On.extendWith=df,$u(On,On),On.add=Jf,On.attempt=Tf,On.camelCase=zf,On.capitalize=Lu,On.ceil=Yf,On.clamp=function(n,t,r){return r===F&&(r=t,t=F),r!==F&&(r=ku(r),r=r===r?r:0),t!==F&&(t=ku(t),t=t===t?t:0),gt(ku(n),t,r)},On.clone=function(n){return dt(n,false,true)},On.cloneDeep=function(n){return dt(n,true,true)},On.cloneDeepWith=function(n,t){return t=typeof t=="function"?t:F,dt(n,true,true,t)},On.cloneWith=function(n,t){return t=typeof t=="function"?t:F,dt(n,false,true,t)},On.conformsTo=function(n,t){
return null==t||bt(n,t,Ru(t))},On.deburr=Uu,On.defaultTo=function(n,t){return null==n||n!==n?t:n},On.divide=Qf,On.endsWith=function(n,t,r){n=Ou(n),t=jr(t);var e=n.length,e=r=r===F?e:gt(mu(r),0,e);return r-=t.length,0<=r&&n.slice(r,e)==t},On.eq=cu,On.escape=function(n){return(n=Ou(n))&&Y.test(n)?n.replace(H,et):n},On.escapeRegExp=function(n){return(n=Ou(n))&&fn.test(n)?n.replace(on,"\\%lodash/lodash.min.js%"):n},On.every=function(n,t,r){var e=uf(n)?o:wt;return r&&ke(n,t,r)&&(t=F),e(n,ve(t,3))},On.find=To,On.findIndex=$e,
On.findKey=function(n,t){return v(n,ve(t,3),Et)},On.findLast=$o,On.findLastIndex=Fe,On.findLastKey=function(n,t){return v(n,ve(t,3),Ot)},On.floor=Xf,On.forEach=Qe,On.forEachRight=Xe,On.forIn=function(n,t){return null==n?n:uo(n,ve(t,3),zu)},On.forInRight=function(n,t){return null==n?n:io(n,ve(t,3),zu)},On.forOwn=function(n,t){return n&&Et(n,ve(t,3))},On.forOwnRight=function(n,t){return n&&Ot(n,ve(t,3))},On.get=Su,On.gt=tf,On.gte=rf,On.has=function(n,t){return null!=n&&be(n,t,Bt)},On.hasIn=Iu,On.head=Pe,
On.identity=Mu,On.includes=function(n,t,r,e){return n=au(n)?n:Bu(n),r=r&&!e?mu(r):0,e=n.length,0>r&&(r=Bi(e+r,0)),bu(n)?r<=e&&-1<n.indexOf(t,r):!!e&&-1<d(n,t,r)},On.indexOf=function(n,t,r){var e=null==n?0:n.length;return e?(r=null==r?0:mu(r),0>r&&(r=Bi(e+r,0)),d(n,t,r)):-1},On.inRange=function(n,t,r){return t=wu(t),r===F?(r=t,t=0):r=wu(r),n=ku(n),n>=Li(t,r)&&n<Bi(t,r)},On.invoke=Af,On.isArguments=ef,On.isArray=uf,On.isArrayBuffer=of,On.isArrayLike=au,On.isArrayLikeObject=lu,On.isBoolean=function(n){
return true===n||false===n||gu(n)&&"[object Boolean]"==zt(n)},On.isBuffer=ff,On.isDate=cf,On.isElement=function(n){return gu(n)&&1===n.nodeType&&!yu(n)},On.isEmpty=function(n){if(null==n)return true;if(au(n)&&(uf(n)||typeof n=="string"||typeof n.splice=="function"||ff(n)||hf(n)||ef(n)))return!n.length;var t=po(n);if("[object Map]"==t||"[object Set]"==t)return!n.size;if(Se(n))return!Ht(n).length;for(var r in n)if(ui.call(n,r))return false;return true},On.isEqual=function(n,t){return Ft(n,t)},On.isEqualWith=function(n,t,r){
var e=(r=typeof r=="function"?r:F)?r(n,t):F;return e===F?Ft(n,t,r):!!e},On.isError=su,On.isFinite=function(n){return typeof n=="number"&&Ri(n)},On.isFunction=hu,On.isInteger=pu,On.isLength=_u,On.isMap=af,On.isMatch=function(n,t){return n===t||Pt(n,t,de(t))},On.isMatchWith=function(n,t,r){return r=typeof r=="function"?r:F,Pt(n,t,de(t),r)},On.isNaN=function(n){return du(n)&&n!=+n},On.isNative=function(n){if(_o(n))throw new Ku("Unsupported core-js use. Try https://github.com/es-shims.");return Zt(n)},
On.isNil=function(n){return null==n},On.isNull=function(n){return null===n},On.isNumber=du,On.isObject=vu,On.isObjectLike=gu,On.isPlainObject=yu,On.isRegExp=lf,On.isSafeInteger=function(n){return pu(n)&&-9007199254740991<=n&&9007199254740991>=n},On.isSet=sf,On.isString=bu,On.isSymbol=xu,On.isTypedArray=hf,On.isUndefined=function(n){return n===F},On.isWeakMap=function(n){return gu(n)&&"[object WeakMap]"==po(n)},On.isWeakSet=function(n){return gu(n)&&"[object WeakSet]"==zt(n)},On.join=function(n,t){
return null==n?"":zi.call(n,t)},On.kebabCase=Wf,On.last=Ze,On.lastIndexOf=function(n,t,r){var e=null==n?0:n.length;if(!e)return-1;var u=e;if(r!==F&&(u=mu(r),u=0>u?Bi(e+u,0):Li(u,e-1)),t===t){for(r=u+1;r--&&n[r]!==t;);n=r}else n=g(n,b,u,true);return n},On.lowerCase=Bf,On.lowerFirst=Lf,On.lt=pf,On.lte=_f,On.max=function(n){return n&&n.length?mt(n,Mu,Wt):F},On.maxBy=function(n,t){return n&&n.length?mt(n,ve(t,2),Wt):F},On.mean=function(n){return x(n,Mu)},On.meanBy=function(n,t){return x(n,ve(t,2))},On.min=function(n){
return n&&n.length?mt(n,Mu,Jt):F},On.minBy=function(n,t){return n&&n.length?mt(n,ve(t,2),Jt):F},On.stubArray=Pu,On.stubFalse=Zu,On.stubObject=function(){return{}},On.stubString=function(){return""},On.stubTrue=function(){return true},On.multiply=nc,On.nth=function(n,t){return n&&n.length?tr(n,mu(t)):F},On.noConflict=function(){return Zn._===this&&(Zn._=ai),this},On.noop=Fu,On.now=Vo,On.pad=function(n,t,r){n=Ou(n);var e=(t=mu(t))?T(n):0;return!t||e>=t?n:(t=(t-e)/2,te(Oi(t),r)+n+te(Ei(t),r))},On.padEnd=function(n,t,r){
n=Ou(n);var e=(t=mu(t))?T(n):0;return t&&e<t?n+te(t-e,r):n},On.padStart=function(n,t,r){n=Ou(n);var e=(t=mu(t))?T(n):0;return t&&e<t?te(t-e,r)+n:n},On.parseInt=function(n,t,r){return r||null==t?t=0:t&&(t=+t),Ci(Ou(n).replace(an,""),t||0)},On.random=function(n,t,r){if(r&&typeof r!="boolean"&&ke(n,t,r)&&(t=r=F),r===F&&(typeof t=="boolean"?(r=t,t=F):typeof n=="boolean"&&(r=n,n=F)),n===F&&t===F?(n=0,t=1):(n=wu(n),t===F?(t=n,n=0):t=wu(t)),n>t){var e=n;n=t,t=e}return r||n%1||t%1?(r=Di(),Li(n+r*(t-n+$n("1e-"+((r+"").length-1))),t)):cr(n,t);
},On.reduce=function(n,t,r){var e=uf(n)?h:m,u=3>arguments.length;return e(n,ve(t,4),r,u,ro)},On.reduceRight=function(n,t,r){var e=uf(n)?p:m,u=3>arguments.length;return e(n,ve(t,4),r,u,eo)},On.repeat=function(n,t,r){return t=(r?ke(n,t,r):t===F)?1:mu(t),ar(Ou(n),t)},On.replace=function(){var n=arguments,t=Ou(n[0]);return 3>n.length?t:t.replace(n[1],n[2])},On.result=function(n,t,r){t=Ee(t,n)?[t]:Ir(t);var e=-1,u=t.length;for(u||(n=F,u=1);++e<u;){var i=null==n?F:n[Ce(t[e])];i===F&&(e=u,i=r),n=hu(i)?i.call(n):i;
}return n},On.round=tc,On.runInContext=w,On.sample=function(n){return(uf(n)?tt:sr)(n)},On.size=function(n){if(null==n)return 0;if(au(n))return bu(n)?T(n):n.length;var t=po(n);return"[object Map]"==t||"[object Set]"==t?n.size:Ht(n).length},On.snakeCase=Uf,On.some=function(n,t,r){var e=uf(n)?_:gr;return r&&ke(n,t,r)&&(t=F),e(n,ve(t,3))},On.sortedIndex=function(n,t){return dr(n,t)},On.sortedIndexBy=function(n,t,r){return yr(n,t,ve(r,2))},On.sortedIndexOf=function(n,t){var r=null==n?0:n.length;if(r){
var e=dr(n,t);if(e<r&&cu(n[e],t))return e}return-1},On.sortedLastIndex=function(n,t){return dr(n,t,true)},On.sortedLastIndexBy=function(n,t,r){return yr(n,t,ve(r,2),true)},On.sortedLastIndexOf=function(n,t){if(null==n?0:n.length){var r=dr(n,t,true)-1;if(cu(n[r],t))return r}return-1},On.startCase=Cf,On.startsWith=function(n,t,r){return n=Ou(n),r=gt(mu(r),0,n.length),t=jr(t),n.slice(r,r+t.length)==t},On.subtract=rc,On.sum=function(n){return n&&n.length?k(n,Mu):0},On.sumBy=function(n,t){return n&&n.length?k(n,ve(t,2)):0;
},On.template=function(n,t,r){var e=On.templateSettings;r&&ke(n,t,r)&&(t=F),n=Ou(n),t=df({},t,e,ct),r=df({},t.imports,e.imports,ct);var u,i,o=Ru(r),f=I(r,o),c=0;r=t.interpolate||An;var a="__p+='";r=Yu((t.escape||An).source+"|"+r.source+"|"+(r===nn?gn:An).source+"|"+(t.evaluate||An).source+"|$","g");var l="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";if(n.replace(r,function(t,r,e,o,f,l){return e||(e=o),a+=n.slice(c,l).replace(kn,B),r&&(u=true,a+="'+__e("+r+")+'"),f&&(i=true,a+="';"+f+";\n__p+='"),
e&&(a+="'+((__t=("+e+"))==null?'':__t)+'"),c=l+t.length,t}),a+="';",(t=t.variable)||(a="with(obj){"+a+"}"),a=(i?a.replace(q,""):a).replace(V,"lodash/lodash.min.js").replace(K,"lodash/lodash.min.js;"),a="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(u?",__e=_.escape":"")+(i?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+a+"return __p}",t=Tf(function(){return Gu(o,l+"return "+a).apply(F,f)}),t.source=a,su(t))throw t;return t},On.times=function(n,t){if(n=mu(n),1>n||9007199254740991<n)return[];
var r=4294967295,e=Li(n,4294967295);for(t=ve(t),n-=4294967295,e=E(e,t);++r<n;)t(r);return e},On.toFinite=wu,On.toInteger=mu,On.toLength=Au,On.toLower=function(n){return Ou(n).toLowerCase()},On.toNumber=ku,On.toSafeInteger=function(n){return gt(mu(n),-9007199254740991,9007199254740991)},On.toString=Ou,On.toUpper=function(n){return Ou(n).toUpperCase()},On.trim=function(n,t,r){return(n=Ou(n))&&(r||t===F)?n.replace(cn,""):n&&(t=jr(t))?(n=$(n),r=$(t),t=z(n,r),r=W(n,r)+1,Rr(n,t,r).join("")):n},On.trimEnd=function(n,t,r){
return(n=Ou(n))&&(r||t===F)?n.replace(ln,""):n&&(t=jr(t))?(n=$(n),t=W(n,$(t))+1,Rr(n,0,t).join("")):n},On.trimStart=function(n,t,r){return(n=Ou(n))&&(r||t===F)?n.replace(an,""):n&&(t=jr(t))?(n=$(n),t=z(n,$(t)),Rr(n,t).join("")):n},On.truncate=function(n,t){var r=30,e="...";if(vu(t))var u="separator"in t?t.separator:u,r="length"in t?mu(t.length):r,e="omission"in t?jr(t.omission):e;n=Ou(n);var i=n.length;if(Bn.test(n))var o=$(n),i=o.length;if(r>=i)return n;if(i=r-T(e),1>i)return e;if(r=o?Rr(o,0,i).join(""):n.slice(0,i),
u===F)return r+e;if(o&&(i+=r.length-i),lf(u)){if(n.slice(i).search(u)){var f=r;for(u.global||(u=Yu(u.source,Ou(dn.exec(u))+"g")),u.lastIndex=0;o=u.exec(f);)var c=o.index;r=r.slice(0,c===F?i:c)}}else n.indexOf(jr(u),i)!=i&&(u=r.lastIndexOf(u),-1<u&&(r=r.slice(0,u)));return r+e},On.unescape=function(n){return(n=Ou(n))&&J.test(n)?n.replace(G,ut):n},On.uniqueId=function(n){var t=++ii;return Ou(n)+t},On.upperCase=Df,On.upperFirst=Mf,On.each=Qe,On.eachRight=Xe,On.first=Pe,$u(On,function(){var n={};return Et(On,function(t,r){
ui.call(On.prototype,r)||(n[r]=t)}),n}(),{chain:false}),On.VERSION="4.16.6",u("bind bindKey curry curryRight partial partialRight".split(" "),function(n){On[n].placeholder=On}),u(["drop","take"],function(n,t){Mn.prototype[n]=function(r){var e=this.__filtered__;if(e&&!t)return new Mn(this);r=r===F?1:Bi(mu(r),0);var u=this.clone();return e?u.__takeCount__=Li(r,u.__takeCount__):u.__views__.push({size:Li(r,4294967295),type:n+(0>u.__dir__?"Right":"")}),u},Mn.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse();
}}),u(["filter","map","takeWhile"],function(n,t){var r=t+1,e=1==r||3==r;Mn.prototype[n]=function(n){var t=this.clone();return t.__iteratees__.push({iteratee:ve(n,3),type:r}),t.__filtered__=t.__filtered__||e,t}}),u(["head","last"],function(n,t){var r="take"+(t?"Right":"");Mn.prototype[n]=function(){return this[r](1).value()[0]}}),u(["initial","tail"],function(n,t){var r="drop"+(t?"":"Right");Mn.prototype[n]=function(){return this.__filtered__?new Mn(this):this[r](1)}}),Mn.prototype.compact=function(){
return this.filter(Mu)},Mn.prototype.find=function(n){return this.filter(n).head()},Mn.prototype.findLast=function(n){return this.reverse().find(n)},Mn.prototype.invokeMap=lr(function(n,t){return typeof n=="function"?new Mn(this):this.map(function(r){return Dt(r,n,t)})}),Mn.prototype.reject=function(n){return this.filter(fu(ve(n)))},Mn.prototype.slice=function(n,t){n=mu(n);var r=this;return r.__filtered__&&(0<n||0>t)?new Mn(r):(0>n?r=r.takeRight(-n):n&&(r=r.drop(n)),t!==F&&(t=mu(t),r=0>t?r.dropRight(-t):r.take(t-n)),
r)},Mn.prototype.takeRightWhile=function(n){return this.reverse().takeWhile(n).reverse()},Mn.prototype.toArray=function(){return this.take(4294967295)},Et(Mn.prototype,function(n,t){var r=/^(?:filter|find|map|reject)|While$/.test(t),e=/^(?:head|last)$/.test(t),u=On[e?"take"+("last"==t?"Right":""):t],i=e||/^find/.test(t);u&&(On.prototype[t]=function(){function t(n){return n=u.apply(On,s([n],f)),e&&h?n[0]:n}var o=this.__wrapped__,f=e?[1]:arguments,c=o instanceof Mn,a=f[0],l=c||uf(o);l&&r&&typeof a=="function"&&1!=a.length&&(c=l=false);
var h=this.__chain__,p=!!this.__actions__.length,a=i&&!h,c=c&&!p;return!i&&l?(o=c?o:new Mn(this),o=n.apply(o,f),o.__actions__.push({func:Je,args:[t],thisArg:F}),new zn(o,h)):a&&c?n.apply(this,f):(o=this.thru(t),a?e?o.value()[0]:o.value():o)})}),u("pop push shift sort splice unshift".split(" "),function(n){var t=ni[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:pop|shift)$/.test(n);On.prototype[n]=function(){var n=arguments;if(e&&!this.__chain__){var u=this.value();return t.apply(uf(u)?u:[],n);
}return this[r](function(r){return t.apply(uf(r)?r:[],n)})}}),Et(Mn.prototype,function(n,t){var r=On[t];if(r){var e=r.name+"";(Vi[e]||(Vi[e]=[])).push({name:t,func:r})}}),Vi[Yr(F,2).name]=[{name:"wrapper",func:F}],Mn.prototype.clone=function(){var n=new Mn(this.__wrapped__);return n.__actions__=Dr(this.__actions__),n.__dir__=this.__dir__,n.__filtered__=this.__filtered__,n.__iteratees__=Dr(this.__iteratees__),n.__takeCount__=this.__takeCount__,n.__views__=Dr(this.__views__),n},Mn.prototype.reverse=function(){
if(this.__filtered__){var n=new Mn(this);n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},Mn.prototype.value=function(){var n,t=this.__wrapped__.value(),r=this.__dir__,e=uf(t),u=0>r,i=e?t.length:0;n=i;for(var o=this.__views__,f=0,c=-1,a=o.length;++c<a;){var l=o[c],s=l.size;switch(l.type){case"drop":f+=s;break;case"dropRight":n-=s;break;case"take":n=Li(n,f+s);break;case"takeRight":f=Bi(f,n-s)}}if(n={start:f,end:n},o=n.start,f=n.end,n=f-o,u=u?f:o-1,o=this.__iteratees__,f=o.length,
c=0,a=Li(n,this.__takeCount__),!e||200>i||i==n&&a==n)return Ar(t,this.__actions__);e=[];n:for(;n--&&c<a;){for(u+=r,i=-1,l=t[u];++i<f;){var h=o[i],s=h.type,h=(0,h.iteratee)(l);if(2==s)l=h;else if(!h){if(1==s)continue n;break n}}e[c++]=l}return e},On.prototype.at=Do,On.prototype.chain=function(){return He(this)},On.prototype.commit=function(){return new zn(this.value(),this.__chain__)},On.prototype.next=function(){this.__values__===F&&(this.__values__=ju(this.value()));var n=this.__index__>=this.__values__.length;
return{done:n,value:n?F:this.__values__[this.__index__++]}},On.prototype.plant=function(n){for(var t,r=this;r instanceof Sn;){var e=Te(r);e.__index__=0,e.__values__=F,t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},On.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof Mn?(this.__actions__.length&&(n=new Mn(this)),n=n.reverse(),n.__actions__.push({func:Je,args:[Ve],thisArg:F}),new zn(n,this.__chain__)):this.thru(Ve)},On.prototype.toJSON=On.prototype.valueOf=On.prototype.value=function(){
return Ar(this.__wrapped__,this.__actions__)},On.prototype.first=On.prototype.head,xi&&(On.prototype[xi]=Ye),On}();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(Zn._=it, define(function(){return it})):Vn?((Vn.exports=it)._=it,qn._=it):Zn._=it}).call(this);

    // Return the new version of lodash and restore the previous value
    return $window._.noConflict()
}])
