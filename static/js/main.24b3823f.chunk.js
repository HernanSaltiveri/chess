(this["webpackJsonpwasabi-chess"]=this["webpackJsonpwasabi-chess"]||[]).push([[0],{27:function(e,t,n){var a=n(59),r=["init","newGame","calculateMove","performMove","setPosition"];e.exports=function(){var e=new Worker(n.p+"5cfbaf910f6743ac775f.worker.js",{name:"[hash].worker.js"});return a(e,r),e}},34:function(e,t,n){e.exports=n.p+"static/media/white_pawn.41da1b5b.svg"},35:function(e,t,n){e.exports=n.p+"static/media/black_pawn.3cab4671.svg"},36:function(e,t,n){e.exports=n.p+"static/media/white_knight.3ece5029.svg"},37:function(e,t,n){e.exports=n.p+"static/media/black_knight.88ad52be.svg"},38:function(e,t,n){e.exports=n.p+"static/media/white_bishop.36a96cf8.svg"},39:function(e,t,n){e.exports=n.p+"static/media/black_bishop.341337f4.svg"},40:function(e,t,n){e.exports=n.p+"static/media/white_rook.007b43f5.svg"},41:function(e,t,n){e.exports=n.p+"static/media/black_rook.e7f61dec.svg"},42:function(e,t,n){e.exports=n.p+"static/media/white_queen.51d538db.svg"},43:function(e,t,n){e.exports=n.p+"static/media/black_queen.87612c77.svg"},44:function(e,t,n){e.exports=n.p+"static/media/white_king.9e716b1e.svg"},45:function(e,t,n){e.exports=n.p+"static/media/black_king.12ae1430.svg"},52:function(e,t,n){e.exports=n(67)},57:function(e,t,n){},67:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(26),o=n.n(i),c=(n(57),n(5)),s=n.n(c),l=n(8),u=n(48),d=n(4),m=n(3),f=n(27),p=n.n(f),v=m.a.div.withConfig({displayName:"AnimatedSpinner",componentId:"sc-1odzgi2-0"})(['color:#073642;display:inline-block;position:relative;width:80px;height:80px;margin-top:1rem;margin-right:0.5rem;margin-left:1.5rem;div{transform-origin:40px 40px;animation:lds-spinner 1.2s linear infinite;}div:after{content:" ";display:block;position:absolute;top:3px;left:37px;width:6px;height:18px;border-radius:20%;background:#073642;}div:nth-child(1){transform:rotate(0deg);animation-delay:-1.1s;}div:nth-child(2){transform:rotate(30deg);animation-delay:-1s;}div:nth-child(3){transform:rotate(60deg);animation-delay:-0.9s;}div:nth-child(4){transform:rotate(90deg);animation-delay:-0.8s;}div:nth-child(5){transform:rotate(120deg);animation-delay:-0.7s;}div:nth-child(6){transform:rotate(150deg);animation-delay:-0.6s;}div:nth-child(7){transform:rotate(180deg);animation-delay:-0.5s;}div:nth-child(8){transform:rotate(210deg);animation-delay:-0.4s;}div:nth-child(9){transform:rotate(240deg);animation-delay:-0.3s;}div:nth-child(10){transform:rotate(270deg);animation-delay:-0.2s;}div:nth-child(11){transform:rotate(300deg);animation-delay:-0.1s;}div:nth-child(12){transform:rotate(330deg);animation-delay:0s;}@keyframes lds-spinner{0%{opacity:1;}100%{opacity:0;}}']),h=function(){return r.a.createElement(v,null,r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null),r.a.createElement("div",null))},g=n(30),b=n(31),w=function(){function e(t,n,a){Object(g.a)(this,e),this.start=n,this.end=a,this.encodedMove=Math.abs(t)|n<<3|a<<10}return Object(b.a)(e,null,[{key:"fromEncodedMove",value:function(t){return new e(7&t,t>>3&127,t>>10&127)}}]),e}(),y=n(70),x=m.a.div.withConfig({displayName:"Field__FieldDiv",componentId:"sc-43cd1f-0"})(["position:relative;background-color:",";@media (min-aspect-ratio:99/100){width:12.5vh;height:12.5vh;}@media (max-aspect-ratio:100/99){width:12.5vw;height:12.5vw;}&.move-mark:before{position:absolute;top:4%;left:4%;bottom:4%;right:4%;content:'';display:block;border:0.5vh solid ",";border-radius:50%;}"],(function(e){return e.isEven?"#fdf6e3":"#eee8d5"}),(function(e){return e.markColor})),k=function(e){var t=e.boardIndex,n=e.children,a=e.movePiece,i=e.isEven,o=e.isStart,c=e.isEnd,s=e.isPossibleTarget,l=Object(y.a)({accept:"PIECE",drop:function(e,n){a(e.pieceId,e.boardIndex,t)}}),u=Object(d.a)(l,2)[1],m=o||c||s?"move-mark":"",f=s?"rgba(169,189,0,0.69)":o?"#dc322f9f":c?"#dc322faf":"white";return r.a.createElement(x,{ref:u,isEven:i,style:{position:"relative"},isStart:o,markColor:f,className:m},n)},E=n(71),j=n(34),O=n.n(j),P=n(35),C=n.n(P),M=n(36),_=n.n(M),I=n(37),S=n.n(I),D=n(38),N=n.n(D),G=n(39),B=n.n(G),R=n(40),A=n.n(R),T=n(41),z=n.n(T),F=n(42),L=n.n(F),Q=n(43),q=n.n(Q),K=n(44),U=n.n(K),J=n(45),V=n.n(J),W=[O.a,_.a,N.a,A.a,L.a,U.a],Z=[C.a,S.a,B.a,z.a,q.a,V.a],H=["Pawn","Knight","Bishop","Rook","Queen","King"],X=m.a.img.withConfig({displayName:"Piece__PieceImage",componentId:"sc-5fuekr-0"})(["display:block;margin:13%;height:74%;width:74%;&.dragging{visibility:hidden;}-webkit-transform:rotateZ(0deg);"]),Y="undefined"!==typeof InstallTrigger,$=function(e){var t=e.boardIndex,n=e.color,a=e.piece,i=e.onPickup,o=e.onDrop,c=Math.abs(a),s="black"===n?Z[c-1]:W[c-1],l=Object(E.a)({item:{type:"PIECE",pieceId:c,boardIndex:t},begin:function(e){return i(t)},end:function(e){return o(t)},collect:function(e){return{isDragging:!!e.isDragging()}}}),u=Object(d.a)(l,2),m=u[0].isDragging,f=u[1],p=r.a.createElement(X,{ref:f,src:s,alt:H[c-1],className:m?"dragging":""});return Y?r.a.createElement("div",{ref:f},p):p},ee=m.a.div.withConfig({displayName:"Board__BoardGrid",componentId:"r10xh7-0"})(["display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);@media (min-aspect-ratio:99/100){width:100vh;height:100vh;}@media (max-aspect-ratio:100/99){width:100vw;height:100vw;}box-shadow:3px 3px 3px #586e75;"]),te=function(e){var t=e.board,n=e.isRotated,a=e.lastMove,i=e.currentPieceMoves,o=e.handlePlayerMove,c=e.updatePossibleMoves,s=e.clearPossibleMoves;return r.a.createElement(ee,{isRotated:n},t.slice(0,64).map((function(e,l){var u=n?63-l:l,d=t[u];return r.a.createElement(k,{key:u,boardIndex:u,movePiece:o,isEven:(u+(u>>3))%2===0,isStart:u===a.start,isEnd:u===a.end,isPossibleTarget:i.has(u)},0!==d&&r.a.createElement($,{boardIndex:u,color:d<0?"black":"white",piece:d,onPickup:c,onDrop:s}))})))},ne=n(7),ae=n(10),re=m.a.div.withConfig({displayName:"GameMenu__MenuBar",componentId:"sc-1mfgk5w-0"})(["display:flex;flex-direction:column;margin-top:1rem;margin-left:1.5rem;text-align:center;align-items:center;@media (max-aspect-ratio:100/99){margin-left:auto;margin-right:auto;flex-flow:column-reverse;}"]),ie=m.a.div.withConfig({displayName:"GameMenu__MenuItem",componentId:"sc-1mfgk5w-1"})(["position:relative;display:",";padding-bottom:0.5rem;flex-direction:column;@media (max-aspect-ratio:100/99){flex-direction:row;align-self:center;}"],(function(e){return e.hidden?"none":"flex"})),oe=m.a.button.withConfig({displayName:"GameMenu__GameButton",componentId:"sc-1mfgk5w-2"})(["background:white;color:#073642;border:1px solid #073642;border-radius:0.3rem;font-size:1rem;font-weight:bold;padding:0.5rem 0.4rem;width:2.5rem;margin:0.3rem;box-shadow:1px 1px 1px #073642;&[disabled]{display:none;}&:hover{background:#073642;color:white;cursor:pointer;}"]),ce=Object(m.a)(ie).withConfig({displayName:"GameMenu__GameResult",componentId:"sc-1mfgk5w-3"})(["margin-top:0.3rem;font-weight:bold;font-size:1.5rem;color:#073642;width:100%;align-items:center;svg{margin-left:1rem;margin-right:1rem;}"]),se=m.a.input.withConfig({displayName:"GameMenu__IconRadioInput",componentId:"sc-1mfgk5w-4"})(["display:none;&:checked + label{opacity:1;}"]),le=m.a.label.withConfig({displayName:"GameMenu__IconRadioLabel",componentId:"sc-1mfgk5w-5"})(["color:#073642;margin:0.2rem;opacity:0.2;&:hover{opacity:0.5;cursor:pointer;}"]),ue=function(e,t){return e?e===t?ne.h:ne.k:ne.a},de=function(e){var t=e.currentValue,n=e.name,a=e.options,i=e.onChange;return r.a.createElement(r.a.Fragment,null,a.map((function(e){var a=e.value,o=e.description,c=e.icon;return r.a.createElement(r.a.Fragment,{key:"".concat(n,"-").concat(a)},r.a.createElement(se,{type:"radio",id:"".concat(n,"-").concat(a),name:n,value:a,defaultChecked:t===a,onChange:function(e){return i(e.target.value)}}),r.a.createElement(le,{htmlFor:"".concat(n,"-").concat(a)},r.a.createElement(ae.a,{icon:c,title:o,size:"2x"})))})))},me=function(e){var t=e.isAiThinking,n=e.firstMovePlayed,a=e.humanPlayerColor,i=e.gameEnded,o=e.winningPlayerColor,c=e.startNewGame,s=e.switchSides,l=e.rotateBoard,u=e.difficultyLevel,d=e.setDifficultyLevel,m=e.canUndoMove,f=e.undoMove;return r.a.createElement(re,null,i&&r.a.createElement(ce,null,r.a.createElement(ae.a,{icon:ue(o,a),size:"2x"}),o?(1===o?"White":"Black")+" wins!":"Draw!"),r.a.createElement(ie,{hidden:t},r.a.createElement(oe,{disabled:!n,onClick:c},r.a.createElement(ae.a,{icon:ne.i,title:"Start new game"})),r.a.createElement(oe,{disabled:i||n,onClick:s},r.a.createElement(ae.a,{icon:ne.g,title:"Switch sides"})),r.a.createElement(oe,{disabled:!m||i,onClick:f},r.a.createElement(ae.a,{icon:ne.l,title:"Undo move"})),r.a.createElement(oe,{disabled:i||!n,onClick:l},r.a.createElement(ae.a,{icon:ne.j,title:"Rotate board"}))),r.a.createElement(ie,{hidden:t||i},r.a.createElement(de,{currentValue:u,name:"difficulty-level",onChange:d,options:[{value:1,description:"Difficulty level 1 (easy)",icon:ne.d},{value:2,description:"Difficulty level 2",icon:ne.f},{value:3,description:"Difficulty level 3",icon:ne.e},{value:4,description:"Difficulty level 4",icon:ne.c},{value:5,description:"Difficulty level 5 (hard)",icon:ne.b}]})),t&&r.a.createElement(h,null))},fe=p()(),pe=m.a.div.withConfig({displayName:"Game__GameArea",componentId:"sc-19jauhs-0"})(["display:flex;flex-wrap:wrap;"]),ve="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",he=m.a.div.withConfig({displayName:"Game__Centered",componentId:"sc-19jauhs-1"})(["position:absolute;left:calc(50% - 60px);top:calc(50% - 60px);"]),ge=function(){var e=Object(a.useState)(!1),t=Object(d.a)(e,2),n=t[0],i=t[1],o=Object(a.useState)(1),c=Object(d.a)(o,2),m=c[0],f=c[1],p=Object(a.useState)(1),v=Object(d.a)(p,2),g=v[0],b=v[1],y=Object(a.useState)(!1),x=Object(d.a)(y,2),k=x[0],E=x[1],j=Object(a.useState)(),O=Object(d.a)(j,2),P=O[0],C=O[1],M=Object(a.useState)(!1),_=Object(d.a)(M,2),I=_[0],S=_[1],D=Object(a.useState)([]),N=Object(d.a)(D,2),G=N[0],B=N[1],R=Object(a.useState)(new Set),A=Object(d.a)(R,2),T=A[0],z=A[1],F=Object(a.useState)(),L=Object(d.a)(F,2),Q=L[0],q=L[1],K=Object(a.useState)(3),U=Object(d.a)(K,2),J=U[0],V=U[1],W=Object(a.useState)([]),Z=Object(d.a)(W,2),H=Z[0],X=Z[1],Y=H.length>0?H[H.length-1]:{start:-1,end:-1},$=Object(a.useCallback)((function(e){return X([].concat(Object(u.a)(H),[e]))}),[X,H]),ee=Object(a.useCallback)(function(){var e=Object(l.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:C(t.board),B(t.moves),f(t.activePlayer),t.gameEnded&&(S(!0),t.checkMate&&q(-t.activePlayer));case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[]),ne=Object(a.useCallback)(function(){var e=Object(l.a)(s.a.mark((function e(t){var n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fe.performMove(t);case 2:return n=e.sent,E(!1),e.next=6,ee(n);case 6:$(t);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[ee,$]);Object(a.useEffect)((function(){Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fe.init();case 2:return e.next=4,fe.newGame();case 4:return e.next=6,fe.setPosition(ve,[]);case 6:return t=e.sent,e.next=9,ee(t);case 9:case"end":return e.stop()}}),e)})))()}),[ee]);var ae=function(e,t){return G.some((function(n){return n.start===e&&n.end===t}))},re=Object(a.useCallback)(Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return B([]),E(!0),e.next=4,fe.calculateMove(J);case 4:return t=e.sent,e.next=7,ne(t);case 7:case"end":return e.stop()}}),e)}))),[J,ne]);Object(a.useEffect)((function(){g!==m&&re()}),[g,m,re]);var ie=function(){var e=Object(l.a)(s.a.mark((function e(){var t;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return f(1),b(1),e.next=4,fe.newGame();case 4:return e.next=6,fe.setPosition(ve,[]);case 6:return t=e.sent,i(!1),S(!1),X([]),q(void 0),z(new Set),e.next=14,ee(t);case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),oe=Object(a.useCallback)(Object(l.a)(s.a.mark((function e(){var t,n;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=H.slice(0,H.length-2),e.next=3,fe.setPosition(ve,t);case 3:return n=e.sent,X(t),e.next=7,ee(n);case 7:case"end":return e.stop()}}),e)}))),[H,X,ee]),ce=function(){var e=Object(l.a)(s.a.mark((function e(t,n,a){var r,i,o,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=Math.abs(t),!I&&!k){e.next=3;break}return e.abrupt("return");case 3:if(ae(n,a)){e.next=5;break}return e.abrupt("return");case 5:if(z(new Set),1!==r||!(1===m&&a<8||-1===m&&a>=56)){e.next=19;break}i=prompt("Choose promotion (Q, R, B, N)","Q"),e.t0=i.toUpperCase(),e.next="R"===e.t0?11:"B"===e.t0?13:"N"===e.t0?15:(e.t0,17);break;case 11:return r=4,e.abrupt("break",19);case 13:return r=3,e.abrupt("break",19);case 15:return r=2,e.abrupt("break",19);case 17:return r=5,e.abrupt("break",19);case 19:return(o=P.slice())[n]=0,C(o),e.next=24,fe.performMove(new w(r,n,a));case 24:return c=e.sent,$(new w(t,n,a)),e.next=28,ee(c);case 28:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}();return P?r.a.createElement(pe,null,r.a.createElement(te,{board:P,isRotated:n,lastMove:Y,currentPieceMoves:T,handlePlayerMove:ce,updatePossibleMoves:function(e){var t=G.filter((function(t){return t.start===e})).map((function(e){return e.end}));z(new Set(t))},clearPossibleMoves:function(){z(new Set)}}),r.a.createElement(me,{isAiThinking:k,firstMovePlayed:-1!==Y.start,humanPlayerColor:g,gameEnded:I,winningPlayerColor:Q,startNewGame:ie,switchSides:function(){i(!0),b(-g)},rotateBoard:function(){return i(!n)},difficultyLevel:J,setDifficultyLevel:V,canUndoMove:!I&&H.length>1,undoMove:oe})):r.a.createElement(he,null,r.a.createElement(h,null))},be=n(69),we=n(46),ye=n(47),xe=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){var n=t.map((function(t){return t(e)}));return{setup:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.setup.apply(e,t)}))},teardown:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.teardown.apply(e,t)}))},connectDropTarget:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDropTarget.apply(e,t)}))},connectDragPreview:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDragPreview.apply(e,t)}))},connectDragSource:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDragSource.apply(e,t)}))}}}};var ke=function(){return r.a.createElement("main",null,r.a.createElement(be.a,{backend:xe(we.a,ye.a)},r.a.createElement(ge,null)))};o.a.render(r.a.createElement(ke,null),document.getElementById("root"))}},[[52,1,2]]]);
//# sourceMappingURL=main.24b3823f.chunk.js.map