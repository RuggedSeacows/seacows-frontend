"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6648],{30218:function(e,t,n){n.d(t,{Id:function(){return I},t0:function(){return A},zv:function(){return L},uc:function(){return M},jb:function(){return _},zb:function(){return P},AV:function(){return B},Vs:function(){return z}});let r=Symbol(),a=Symbol(),o=(e,t)=>new Proxy(e,t),s=Object.getPrototypeOf,l=new WeakMap,i=e=>e&&(l.has(e)?l.get(e):s(e)===Object.prototype||s(e)===Array.prototype),c=e=>"object"==typeof e&&null!==e,d=new WeakMap,f=e=>e[a]||e,u=(e,t,n)=>{if(!i(e))return e;let l=f(e),c=Object.isFrozen(l)||Object.values(Object.getOwnPropertyDescriptors(l)).some(e=>!e.writable),p=n&&n.get(l);return p&&p[1].f===c||((p=((e,t)=>{let n={f:t},o=!1,s=(t,r)=>{if(!o){let a=n.a.get(e);if(a||(a={},n.a.set(e,a)),"w"===t)a.w=!0;else{let s=a[t];s||(s=new Set,a[t]=s),s.add(r)}}},l={get:(t,r)=>r===a?e:(s("k",r),u(Reflect.get(t,r),n.a,n.c)),has:(t,a)=>a===r?(o=!0,n.a.delete(e),!0):(s("h",a),Reflect.has(t,a)),getOwnPropertyDescriptor:(e,t)=>(s("o",t),Reflect.getOwnPropertyDescriptor(e,t)),ownKeys:e=>(s("w"),Reflect.ownKeys(e))};return t&&(l.set=l.deleteProperty=()=>!1),[l,n]})(l,c))[1].p=o(c?(e=>{let t=d.get(e);if(!t){if(Array.isArray(e))t=Array.from(e);else{let n=Object.getOwnPropertyDescriptors(e);Object.values(n).forEach(e=>{e.configurable=!0}),t=Object.create(s(e),n)}d.set(e,t)}return t})(l):l,p[0]),n&&n.set(l,p)),p[1].a=t,p[1].c=n,p[1].p},p=(e,t,n,r)=>{if(Object.is(e,t))return!1;if(!c(e)||!c(t))return!0;let a=n.get(f(e));if(!a)return!0;if(r){let o=r.get(e);if(o&&o.n===t)return o.g;r.set(e,{n:t,g:!1})}let s=null;try{for(let l of a.h||[])if(s=Reflect.has(e,l)!==Reflect.has(t,l))return s;if(!0===a.w){if(s=((e,t)=>{let n=Reflect.ownKeys(e),r=Reflect.ownKeys(t);return n.length!==r.length||n.some((e,t)=>e!==r[t])})(e,t))return s}else for(let i of a.o||[])if(s=!!Reflect.getOwnPropertyDescriptor(e,i)!=!!Reflect.getOwnPropertyDescriptor(t,i))return s;for(let d of a.k||[])if(s=p(e[d],t[d],n,r))return s;return null===s&&(s=!0),s}finally{r&&r.set(e,{n:t,g:s})}},h=e=>i(e)&&e[a]||null,g=(e,t=!0)=>{l.set(e,t)},w=e=>"object"==typeof e&&null!==e,b=new WeakMap,m=new WeakSet,C=(e=Object.is,t=(e,t)=>new Proxy(e,t),n=e=>w(e)&&!m.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer),r=e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}},a=new WeakMap,o=(e,t,n=r)=>{let o=a.get(e);if((null==o?void 0:o[0])===t)return o[1];let s=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return g(s,!0),a.set(e,[t,s]),Reflect.ownKeys(e).forEach(t=>{let r=Reflect.get(e,t);m.has(r)?(g(r,!1),s[t]=r):r instanceof Promise?Object.defineProperty(s,t,{get:()=>n(r)}):b.has(r)?s[t]=function(e,t){let n=b.get(e);n||console.warn("Please use proxy object");let[r,a,o]=n;return o(r,a(),t)}(r,n):s[t]=r}),Object.freeze(s)},s=new WeakMap,l=[1,1],i=r=>{if(!w(r))throw Error("object required");let a=s.get(r);if(a)return a;let i=l[0],c=new Set,d=(e,t=++l[0])=>{i!==t&&(i=t,c.forEach(n=>n(e,t)))},f=l[1],u=(e=++l[1])=>(f===e||c.size||(f=e,g.forEach(([t])=>{let n=t[1](e);n>i&&(i=n)})),i),p=e=>(t,n)=>{let r=[...t];r[1]=[e,...r[1]],d(r,n)},g=new Map,C=(e,t)=>{if(g.has(e))throw Error("prop listener already exists");if(c.size){let n=t[3](p(e));g.set(e,[t,n])}else g.set(e,[t])},y=e=>{var t;let n=g.get(e);n&&(g.delete(e),null==(t=n[1])||t.call(n))},O=e=>{c.add(e),1===c.size&&g.forEach(([e,t],n)=>{if(t)throw Error("remove already exists");let r=e[3](p(n));g.set(n,[e,r])});let t=()=>{c.delete(e),0===c.size&&g.forEach(([e,t],n)=>{t&&(t(),g.set(n,[e]))})};return t},j=Array.isArray(r)?[]:Object.create(Object.getPrototypeOf(r)),E=t(j,{deleteProperty(e,t){let n=Reflect.get(e,t);y(t);let r=Reflect.deleteProperty(e,t);return r&&d(["delete",[t],n]),r},set(t,r,a,o){var s;let l=Reflect.has(t,r),i=Reflect.get(t,r,o);if(l&&e(i,a))return!0;y(r),w(a)&&(a=h(a)||a);let c=a;if(null==(s=Object.getOwnPropertyDescriptor(t,r))?void 0:s.set);else if(a instanceof Promise)a.then(e=>{a.status="fulfilled",a.value=e,d(["resolve",[r],e])}).catch(e=>{a.status="rejected",a.reason=e,d(["reject",[r],e])});else{!b.has(a)&&n(a)&&(c=v(a));let f=!m.has(c)&&b.get(c);f&&C(r,f)}return Reflect.set(t,r,c,o),d(["set",[r],a,i]),!0}});return s.set(r,E),b.set(E,[j,u,o,O]),Reflect.ownKeys(r).forEach(e=>{let t=Object.getOwnPropertyDescriptor(r,e);t.get||t.set?Object.defineProperty(j,e,t):E[e]=r[e]}),E})=>[i,b,m,e,t,n,r,a,o,s,l],[y]=C();function v(e={}){return y(e)}function O(e,t,n){let r;let a=b.get(e);a||console.warn("Please use proxy object");let o=[],s=a[3],l=!1,i=e=>{if(o.push(e),n){t(o.splice(0));return}r||(r=Promise.resolve().then(()=>{r=void 0,l&&t(o.splice(0))}))},c=s(i);return l=!0,()=>{l=!1,c()}}var j=n(48764);let E=v({selectedChain:void 0,chains:void 0,standaloneChains:void 0,standaloneUri:void 0,address:void 0,profileName:void 0,profileAvatar:void 0,profileLoading:!1,balanceLoading:!1,balance:void 0,isConnected:!1,isStandalone:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1,walletConnectVersion:1}),P={state:E,subscribe:e=>O(E,()=>e(E)),setChains(e){E.chains=e},setStandaloneChains(e){E.standaloneChains=e},setStandaloneUri(e){E.standaloneUri=e},getSelectedChain(){let e=I.client().getNetwork().chain;return e&&(E.selectedChain=e),E.selectedChain},setSelectedChain(e){E.selectedChain=e},setIsStandalone(e){E.isStandalone=e},setIsCustomDesktop(e){E.isCustomDesktop=e},setIsCustomMobile(e){E.isCustomMobile=e},getAccount(){let e=I.client().getAccount();E.address=e.address,E.isConnected=e.isConnected},setAddress(e){E.address=e},setIsConnected(e){E.isConnected=e},setProfileName(e){E.profileName=e},setProfileAvatar(e){E.profileAvatar=e},setProfileLoading(e){E.profileLoading=e},setBalanceLoading(e){E.balanceLoading=e},setBalance(e){E.balance=e},setIsDataLoaded(e){E.isDataLoaded=e},setIsUiLoaded(e){E.isUiLoaded=e},setWalletConnectVersion(e){E.walletConnectVersion=e},resetEnsProfile(){E.profileName=void 0,E.profileAvatar=void 0},resetBalance(){E.balance=void 0},resetAccount(){E.address=void 0,E.isConnected=!1,P.resetEnsProfile(),P.resetBalance()}},W=v({initialized:!1,ethereumClient:void 0}),I={setEthereumClient(e){!W.initialized&&e&&(W.ethereumClient=e,P.setChains(e.chains),W.initialized=!0)},client(){if(W.ethereumClient)return W.ethereumClient;throw Error("ClientCtrl has no client set")}},L={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",isMobile:()=>"u">typeof window&&Boolean(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid:()=>L.isMobile()&&navigator.userAgent.toLowerCase().includes("android"),isEmptyObject:e=>Object.getPrototypeOf(e)===Object.prototype&&0===Object.getOwnPropertyNames(e).length&&0===Object.getOwnPropertySymbols(e).length,isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),formatNativeUrl(e,t,n){if(L.isHttpUrl(e))return this.formatUniversalUrl(e,t,n);let r=e;r.includes("://")||(r=`${r=e.replaceAll("/","").replaceAll(":","")}://`),this.setWalletConnectDeepLink(r,n);let a=encodeURIComponent(t);return`${r}wc?uri=${a}`},formatUniversalUrl(e,t,n){if(!L.isHttpUrl(e))return this.formatNativeUrl(e,t,n);let r=e;e.endsWith("/")&&(r=e.slice(0,-1)),this.setWalletConnectDeepLink(r,n);let a=encodeURIComponent(t);return`${r}/wc?uri=${a}`},wait:async e=>new Promise(t=>{setTimeout(t,e)}),openHref(e,t="_self"){window.open(e,t,"noreferrer noopener")},setWalletConnectDeepLink(e,t){localStorage.setItem(L.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))},setWalletConnectAndroidDeepLink(e){let[t]=e.split("?");localStorage.setItem(L.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))},removeWalletConnectDeepLink(){localStorage.removeItem(L.WALLETCONNECT_DEEPLINK_CHOICE)},isNull:e=>null===e},S=v({projectId:"",themeMode:"u">typeof matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",themeColor:"default",themeBackground:L.isMobile()?"themeColor":"gradient",themeZIndex:89,mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chainImages:void 0,tokenImages:void 0,standaloneChains:void 0,enableStandaloneMode:!1,enableNetworkView:!1,enableAccountView:!0,defaultChain:void 0,explorerAllowList:void 0,explorerDenyList:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),A={state:S,subscribe:e=>O(S,()=>e(S)),setConfig(e){var t,n,r,a;if(P.setStandaloneChains(e.standaloneChains),P.setIsStandalone(Boolean(null==(t=e.standaloneChains)?void 0:t.length)||Boolean(e.enableStandaloneMode)),P.setIsCustomMobile(Boolean(null==(n=e.mobileWallets)?void 0:n.length)),P.setIsCustomDesktop(Boolean(null==(r=e.desktopWallets)?void 0:r.length)),P.setWalletConnectVersion(null!=(a=e.walletConnectVersion)?a:1),e.defaultChain)P.setSelectedChain(e.defaultChain);else if(!P.state.isStandalone){let o=I.client().getDefaultChain();P.setSelectedChain(o)}Object.assign(S,e)},setThemeConfig(e){Object.assign(S,e)}},k="https://explorer-api.walletconnect.com",N={async fetchWallets(e,t){let n=function(e){let t=Object.fromEntries(Object.entries(e).filter(([e,t])=>"u">typeof t&&null!==t&&""!==t).map(([e,t])=>[e,t.toString()]));return new URLSearchParams(t).toString()}(t),r=`${k}/v3/wallets?projectId=${e}&${n}`;return(await fetch(r)).json()},formatImageUrl:(e,t)=>`${k}/v3/logo/lg/${t}?projectId=${e}`},D=v({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},previewWallets:[],recomendedWallets:[]});function U(){let{projectId:e}=A.state;if(!e)throw Error("projectId is required to work with explorer api");return e}let M={state:D,async getPreviewWallets(e){let{listings:t}=await N.fetchWallets(U(),e);return D.previewWallets=Object.values(t),D.previewWallets},async getRecomendedWallets(){let{listings:e}=await N.fetchWallets(U(),{page:1,entries:6});D.recomendedWallets=Object.values(e)},async getPaginatedWallets(e){let{page:t,search:n}=e,{listings:r,total:a}=await N.fetchWallets(U(),e),o=Object.values(r),s=n?"search":"wallets";return D[s]={listings:[...D[s].listings,...o],total:a,page:t??1},{listings:o,total:a}},getImageUrl:e=>N.formatImageUrl(U(),e),resetSearch(){D.search={listings:[],total:0,page:1}}},R=v({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),B={state:R,subscribe:e=>O(R,()=>e(R)),push(e,t){e!==R.view&&(R.view=e,t&&(R.data=t),R.history.push(e))},replace(e){R.view=e,R.history=[e]},goBack(){if(R.history.length>1){R.history.pop();let[e]=R.history.slice(-1);R.view=e}}},T=v({open:!1}),_={state:T,subscribe:e=>O(T,()=>e(T)),open:async e=>new Promise(t=>{let{isConnected:n,isStandalone:r,isUiLoaded:a,isDataLoaded:o}=P.state,{enableNetworkView:s}=A.state;if(r?(P.setStandaloneUri(e?.uri),P.setStandaloneChains(e?.standaloneChains),B.replace("ConnectWallet")):null!=e&&e.route?B.replace(e.route):n?B.replace("Account"):s?B.replace("SelectNetwork"):B.replace("ConnectWallet"),a&&o)T.open=!0,t();else{let l=setInterval(()=>{P.state.isUiLoaded&&P.state.isDataLoaded&&(clearInterval(l),T.open=!0,t())},200)}}),close(){T.open=!1}},x=v({open:!1,message:"",variant:"success"}),z={state:x,subscribe:e=>O(x,()=>e(x)),openToast(e,t){x.open=!0,x.message=e,x.variant=t},closeToast(){x.open=!1}};"u">typeof window&&(window.Buffer||(window.Buffer=j.Buffer),window.global||(window.global=window),window.process||(window.process={env:{}}))},36648:function(e,t,n){n.r(t),n.d(t,{Web3Modal:function(){return d}});var r=n(30218),a=Object.defineProperty,o=Object.getOwnPropertySymbols,s=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,i=(e,t,n)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,c=(e,t)=>{for(var n in t||(t={}))s.call(t,n)&&i(e,n,t[n]);if(o)for(var n of o(t))l.call(t,n)&&i(e,n,t[n]);return e};class d{constructor(e){this.openModal=r.jb.open,this.closeModal=r.jb.close,this.subscribeModal=r.jb.subscribe,this.setTheme=r.t0.setThemeConfig,r.t0.setConfig(c({enableStandaloneMode:!0},e)),this.initUi()}async initUi(){if("u">typeof window){await n.e(144).then(n.bind(n,144));let e=document.createElement("w3m-modal");document.body.insertAdjacentElement("beforeend",e),r.zb.setIsUiLoaded(!0)}}}}}]);