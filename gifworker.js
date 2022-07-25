(()=>{var t={5958:(t,e)=>{var r=Object.defineProperty;r(e,"__esModule",{value:!0}),((t,e)=>{for(var n in e)r(t,n,{get:e[n],enumerable:!0})})(e,{GIFEncoder:()=>x,applyPalette:()=>g,default:()=>C,nearestColor:()=>M,nearestColorIndex:()=>A,nearestColorIndexWithDistance:()=>v,prequantize:()=>b,quantize:()=>u,snapColorsToPalette:()=>B});function n(t=256){let e=0,r=new Uint8Array(t);return{get buffer(){return r.buffer},reset(){e=0},bytesView:()=>r.subarray(0,e),bytes:()=>r.slice(0,e),writeByte(t){n(e+1),r[e]=t,e++},writeBytes(t,a=0,o=t.length){n(e+o);for(let n=0;n<o;n++)r[e++]=t[n+a]},writeBytesView(t,a=0,o=t.byteLength){n(e+o),r.set(t.subarray(a,a+o),e),e+=o}};function n(t){var n=r.length;if(n>=t)return;t=Math.max(t,n*(n<1048576?2:1.125)>>>0),0!=n&&(t=Math.max(t,256));const a=r;r=new Uint8Array(t),e>0&&r.set(a.subarray(0,e),0)}}var a=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function o(t,e,r){return t<<8&63488|e<<2&992|r>>3}function i(t,e,r,n){return t>>4|240&e|(240&r)<<4|(240&n)<<8}function c(t,e,r){return t>>4<<8|240&e|r>>4}function l(t,e,r){return t<e?e:t>r?r:t}function f(t){return t*t}function s(t,e,r){var n=0,a=1e100;const o=t[e],i=o.cnt,c=o.ac,l=o.rc,s=o.gc,u=o.bc;for(var w=o.fw;0!=w;w=t[w].fw){const e=t[w],o=e.cnt,h=i*o/(i+o);if(!(h>=a)){var y=0;r&&(y+=h*f(e.ac-c))>=a||(y+=h*f(e.rc-l))>=a||(y+=h*f(e.gc-s))>=a||(y+=h*f(e.bc-u))>=a||(a=y,n=w)}}o.err=a,o.nn=n}function u(t,e,r={}){const{format:n="rgb565",clearAlpha:a=!0,clearAlphaColor:u=0,clearAlphaThreshold:y=0,oneBitAlpha:h=!1}=r;if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array||t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");const b=new Uint32Array(t.buffer);let g=!1!==r.useSqrt;const d="rgba4444"===n,p=function(t,e){const r=new Array("rgb444"===e?4096:65536),n=t.length;if("rgba4444"===e)for(let e=0;e<n;++e){const n=t[e],a=n>>24&255,o=n>>16&255,c=n>>8&255,l=255&n,f=i(l,c,o,a);let s=f in r?r[f]:r[f]={ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0};s.rc+=l,s.gc+=c,s.bc+=o,s.ac+=a,s.cnt++}else if("rgb444"===e)for(let e=0;e<n;++e){const n=t[e],a=n>>16&255,o=n>>8&255,i=255&n,l=c(i,o,a);let f=l in r?r[l]:r[l]={ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0};f.rc+=i,f.gc+=o,f.bc+=a,f.cnt++}else for(let e=0;e<n;++e){const n=t[e],a=n>>16&255,i=n>>8&255,c=255&n,l=o(c,i,a);let f=l in r?r[l]:r[l]={ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0};f.rc+=c,f.gc+=i,f.bc+=a,f.cnt++}return r}(b,n),B=p.length,m=B-1,A=new Uint32Array(B+1);for(var v=0,M=0;M<B;++M){const t=p[M];if(null!=t){var x=1/t.cnt;d&&(t.ac*=x),t.rc*=x,t.gc*=x,t.bc*=x,p[v++]=t}}var U,k,E;for(f(e)/v<.022&&(g=!1),M=0;M<v-1;++M)p[M].fw=M+1,p[M+1].bk=M,g&&(p[M].cnt=Math.sqrt(p[M].cnt));for(g&&(p[M].cnt=Math.sqrt(p[M].cnt)),M=0;M<v;++M){s(p,M,!1);var q=p[M].err;for(k=++A[0];k>1&&!(p[U=A[E=k>>1]].err<=q);k=E)A[k]=U;A[k]=M}var C=v-e;for(M=0;M<C;){for(var I;;){var F=A[1];if((I=p[F]).tm>=I.mtm&&p[I.nn].mtm<=I.tm)break;for(I.mtm==m?F=A[1]=A[A[0]--]:(s(p,F,!1),I.tm=M),q=p[F].err,k=1;(E=k+k)<=A[0]&&(E<A[0]&&p[A[E]].err>p[A[E+1]].err&&E++,!(q<=p[U=A[E]].err));k=E)A[k]=U;A[k]=F}var G=p[I.nn],P=I.cnt,V=G.cnt;x=1/(P+V),d&&(I.ac=x*(P*I.ac+V*G.ac)),I.rc=x*(P*I.rc+V*G.rc),I.gc=x*(P*I.gc+V*G.gc),I.bc=x*(P*I.bc+V*G.bc),I.cnt+=G.cnt,I.mtm=++M,p[G.bk].fw=G.fw,p[G.fw].bk=G.bk,G.mtm=m}let z=[];var R=0;for(M=0;;++R){let t=l(Math.round(p[M].rc),0,255),e=l(Math.round(p[M].gc),0,255),r=l(Math.round(p[M].bc),0,255),n=255;d&&(n=l(Math.round(p[M].ac),0,255),h&&(n=n<=("number"==typeof h?h:127)?0:255),a&&n<=y&&(t=e=r=u,n=0));const o=d?[t,e,r,n]:[t,e,r];if(w(z,o)||z.push(o),0==(M=p[M].fw))break}return z}function w(t,e){for(let r=0;r<t.length;r++){const n=t[r];let a=n[0]===e[0]&&n[1]===e[1]&&n[2]===e[2],o=!(n.length>=4&&e.length>=4)||n[3]===e[3];if(a&&o)return!0}return!1}function y(t,e){var r,n=0;for(r=0;r<t.length;r++){const a=t[r]-e[r];n+=a*a}return n}function h(t,e){return e>1?Math.round(t/e)*e:t}function b(t,{roundRGB:e=5,roundAlpha:r=10,oneBitAlpha:n=null}={}){const a=new Uint32Array(t.buffer);for(let t=0;t<a.length;t++){const o=a[t];let i=o>>24&255,c=o>>16&255,l=o>>8&255,f=255&o;i=h(i,r),n&&(i=i<=("number"==typeof n?n:127)?0:255),f=h(f,e),l=h(l,e),c=h(c,e),a[t]=i<<24|c<<16|l<<8|f<<0}}function g(t,e,r="rgb565"){if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array||t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(e.length>256)throw new Error("applyPalette() only works with 256 colors or less");const n=new Uint32Array(t.buffer),a=n.length,l="rgb444"===r?4096:65536,f=new Uint8Array(a),s=new Array(l);if("rgba4444"===r)for(let t=0;t<a;t++){const r=n[t],a=r>>24&255,o=r>>16&255,c=r>>8&255,l=255&r,u=i(l,c,o,a),w=u in s?s[u]:s[u]=d(l,c,o,a,e);f[t]=w}else{const t="rgb444"===r?c:o;for(let r=0;r<a;r++){const a=n[r],o=a>>16&255,i=a>>8&255,c=255&a,l=t(c,i,o),u=l in s?s[l]:s[l]=p(c,i,o,e);f[r]=u}}return f}function d(t,e,r,n,a){let o=0,i=1e100;for(let c=0;c<a.length;c++){const l=a[c];let f=m(l[3]-n);f>i||(f+=m(l[0]-t),f>i||(f+=m(l[1]-e),f>i||(f+=m(l[2]-r),f>i||(i=f,o=c))))}return o}function p(t,e,r,n){let a=0,o=1e100;for(let i=0;i<n.length;i++){const c=n[i];let l=m(c[0]-t);l>o||(l+=m(c[1]-e),l>o||(l+=m(c[2]-r),l>o||(o=l,a=i)))}return a}function B(t,e,r=5){if(!t.length||!e.length)return;const n=t.map((t=>t.slice(0,3))),a=r*r,o=t[0].length;for(let r=0;r<e.length;r++){let i=e[r];i=i.length<o?[i[0],i[1],i[2],255]:i.length>o?i.slice(0,3):i.slice();const c=v(n,i.slice(0,3),y),l=c[0],f=c[1];f>0&&f<=a&&(t[l]=i)}}function m(t){return t*t}function A(t,e,r=y){let n=1/0,a=-1;for(let o=0;o<t.length;o++){const i=r(e,t[o]);i<n&&(n=i,a=o)}return a}function v(t,e,r=y){let n=1/0,a=-1;for(let o=0;o<t.length;o++){const i=r(e,t[o]);i<n&&(n=i,a=o)}return[a,n]}function M(t,e,r=y){return t[A(t,e,r)]}function x(t={}){const{initialCapacity:e=4096,auto:r=!0}=t,o=n(e),i=new Uint8Array(256),c=new Int32Array(5003),l=new Int32Array(5003);let f=!1;return{reset(){o.reset(),f=!1},finish(){o.writeByte(59)},bytes:()=>o.bytes(),bytesView:()=>o.bytesView(),get buffer(){return o.buffer},get stream(){return o},writeHeader:s,writeFrame(t,e,u,w={}){const{transparent:y=!1,transparentIndex:h=0,delay:b=0,palette:g=null,repeat:d=0,colorDepth:p=8,dispose:B=-1}=w;let m=!1;if(r?f||(m=!0,s(),f=!0):m=Boolean(w.first),e=Math.max(0,Math.floor(e)),u=Math.max(0,Math.floor(u)),m){if(!g)throw new Error("First frame must include a { palette } option");!function(t,e,r,n,a=8){const o=128|a-1<<4|q(n.length)-1;k(t,e),k(t,r),t.writeBytes([o,0,0])}(o,e,u,g,p),U(o,g),d>=0&&function(t,e){t.writeByte(33),t.writeByte(255),t.writeByte(11),E(t,"NETSCAPE2.0"),t.writeByte(3),t.writeByte(1),k(t,e),t.writeByte(0)}(o,d)}const A=Math.round(b/10);!function(t,e,r,n,a){var o,i;t.writeByte(33),t.writeByte(249),t.writeByte(4),a<0&&(a=0,n=!1),n?(o=1,i=2):(o=0,i=0),e>=0&&(i=7&e),i<<=2;t.writeByte(0|i|o),k(t,r),t.writeByte(a||0),t.writeByte(0)}(o,B,A,y,h);const v=Boolean(g)&&!m;!function(t,e,r,n){if(t.writeByte(44),k(t,0),k(t,0),k(t,e),k(t,r),n){const e=0,r=0,a=q(n.length)-1;t.writeByte(128|e|r|0|a)}else t.writeByte(0)}(o,e,u,v?g:null),v&&U(o,g),function(t,e,r,o,i=8,c,l,f){!function(t,e,r,o,i=n(512),c=new Uint8Array(256),l=new Int32Array(5003),f=new Int32Array(5003)){const s=l.length,u=Math.max(2,o);c.fill(0),f.fill(0),l.fill(-1);let w=0,y=0;const h=u+1,b=h;let g=!1,d=b,p=(1<<d)-1;const B=1<<h-1,m=B+1;let A=B+2,v=0,M=r[0],x=0;for(let t=s;t<65536;t*=2)++x;x=8-x,i.writeByte(u),k(B);const U=r.length;for(let t=1;t<U;t++)t:{const e=r[t],n=(e<<12)+M;let a=e<<x^M;if(l[a]===n){M=f[a];break t}const o=0===a?1:s-a;for(;l[a]>=0;)if(a-=o,a<0&&(a+=s),l[a]===n){M=f[a];break t}k(M),M=e,A<4096?(f[a]=A++,l[a]=n):(l.fill(-1),A=B+2,g=!0,k(B))}return k(M),k(m),i.writeByte(0),i.bytesView();function k(t){for(w&=a[y],y>0?w|=t<<y:w=t,y+=d;y>=8;)c[v++]=255&w,v>=254&&(i.writeByte(v),i.writeBytesView(c,0,v),v=0),w>>=8,y-=8;if((A>p||g)&&(g?(d=b,p=(1<<d)-1,g=!1):(++d,p=12===d?1<<d:(1<<d)-1)),t==m){for(;y>0;)c[v++]=255&w,v>=254&&(i.writeByte(v),i.writeBytesView(c,0,v),v=0),w>>=8,y-=8;v>0&&(i.writeByte(v),i.writeBytesView(c,0,v),v=0)}}}(0,0,e,i,t,c,l,f)}(o,t,0,0,p,i,c,l)}};function s(){E(o,"GIF89a")}}function U(t,e){const r=1<<q(e.length);for(let n=0;n<r;n++){let r=[0,0,0];n<e.length&&(r=e[n]),t.writeByte(r[0]),t.writeByte(r[1]),t.writeByte(r[2])}}function k(t,e){t.writeByte(255&e),t.writeByte(e>>8&255)}function E(t,e){for(var r=0;r<e.length;r++)t.writeByte(e.charCodeAt(r))}function q(t){return Math.max(Math.ceil(Math.log2(t)),1)}var C=x}},e={};function r(n){var a=e[n];if(void 0!==a)return a.exports;var o=e[n]={exports:{}};return t[n](o,o.exports,r),o.exports}r.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return r.d(e,{a:e}),e},r.d=(t,e)=>{for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";var t=r(5958);const e=self,n=(0,t.GIFEncoder)();e.addEventListener("message",(r=>{if(r.data.addFrame){const{data:e,transparent:a,width:o,height:i,delay:c}=r.data.addFrame,l=(0,t.quantize)(e,256,{oneBitAlpha:a}),f=(0,t.applyPalette)(e,l);n.writeFrame(f,o,i,{palette:l,delay:c,transparent:a})}else r.data.finish&&(n.finish(),e.postMessage(new Blob([n.bytes()])))}))})()})();
//# sourceMappingURL=gifworker.js.map