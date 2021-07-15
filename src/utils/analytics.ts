// @ts-nocheck : ga.js does not pass the ts typechecker

/* eslint-disable */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
/* eslint-enable */

declare const ga: (arg1: string, arg2: string, arg3: string, arg4?: string) => void;

ga("create", "UA-121793995-1", "auto");

export default (arg1: string, arg2: string, arg3: string, arg4?: string): void => {
  ga(arg1, arg2, arg3, arg4);
};
