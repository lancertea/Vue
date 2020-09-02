/**
 * 主入口
 */

import 'babel-polyfill';
import 'util/rewrite.js';
import './config/global';
import './config/init_ext';
import Vue, {VNode} from 'vue';
import 'util/request';
import 'util/ga_data';
import router from 'framework/router/index';
import store from 'framework/store/index';
import 'components/common/modal/index';
import './config/init';
import 'util/filter';
import VueClipboard from 'vue-clipboard2';

import '@sxf/saas-business-component/lib/theme/default.css';

import { showLowVersionBrowser } from 'util/check_browser.js';
import App from './app.vue';

showLowVersionBrowser();

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

/*eslint-disable*/
Vue.config.devtools = process.env.NODE_ENV !== 'production';
/*eslint-enable*/

new Vue({
    el: '#app',
    router,
    store,
    render: (h): VNode => h(App)
});
