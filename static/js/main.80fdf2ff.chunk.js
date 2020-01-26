(this.webpackJsonpchess=this.webpackJsonpchess||[]).push([[0],{28:function(e,t,n){var a=n(58),i=["calculateMove","newGame"];e.exports=function(){var e=new Worker(n.p+"2092e2b7e6472f10d653.worker.js",{name:"[hash].worker.js"});return a(e,i),e}},33:function(e,t,n){e.exports=n.p+"static/media/white_pawn.41da1b5b.svg"},34:function(e,t,n){e.exports=n.p+"static/media/black_pawn.3cab4671.svg"},35:function(e,t,n){e.exports=n.p+"static/media/white_knight.3ece5029.svg"},36:function(e,t,n){e.exports=n.p+"static/media/black_knight.88ad52be.svg"},37:function(e,t,n){e.exports=n.p+"static/media/white_bishop.36a96cf8.svg"},38:function(e,t,n){e.exports=n.p+"static/media/black_bishop.341337f4.svg"},39:function(e,t,n){e.exports=n.p+"static/media/white_rook.007b43f5.svg"},40:function(e,t,n){e.exports=n.p+"static/media/black_rook.e7f61dec.svg"},41:function(e,t,n){e.exports=n.p+"static/media/white_queen.51d538db.svg"},42:function(e,t,n){e.exports=n.p+"static/media/black_queen.87612c77.svg"},43:function(e,t,n){e.exports=n.p+"static/media/white_king.9e716b1e.svg"},44:function(e,t,n){e.exports=n.p+"static/media/black_king.12ae1430.svg"},51:function(e,t,n){e.exports=n(67)},57:function(e,t,n){},67:function(e,t,n){"use strict";n.r(t);var a=n(7),i=n.n(a),r=n(0),o=n.n(r),c=n(27),l=n.n(c),s=(n(57),n(4)),d=n(3),u=n(28),m=n.n(u),f=n(70),v=d.a.div.withConfig({displayName:"Field__FieldDiv",componentId:"l5smif-0"})(["position:relative;background-color:",";@media (min-aspect-ratio:99/100){width:12.5vh;height:12.5vh;}@media (max-aspect-ratio:100/99){width:12.5vw;height:12.5vw;}&.move-mark:before{position:absolute;top:4%;left:4%;bottom:4%;right:4%;content:'';display:block;border:0.5vh solid ",";border-radius:50%;}"],(function(e){return e.isEven?"#fdf6e3":"#eee8d5"}),(function(e){return e.markColor})),p=function(e){var t=e.boardIndex,n=e.children,a=e.movePiece,i=e.isEven,r=e.isStart,c=e.isEnd,l=e.isPossibleTarget,d=Object(f.a)({accept:"PIECE",drop:function(e,n){a(e.pieceId,e.boardIndex,t)}}),u=Object(s.a)(d,2)[1],m=r||c||l?"move-mark":"",p=l?"rgba(169,189,0,0.69)":r?"#dc322f9f":c?"#dc322faf":"white";return o.a.createElement(v,{ref:u,isEven:i,style:{position:"relative"},isStart:r,markColor:p,className:m},n)},h=n(71),g=n(33),b=n.n(g),y=n(34),w=n.n(y),k=n(35),E=n.n(k),_=n(36),x=n.n(_),M=n(37),j=n.n(M),I=n(38),C=n.n(I),O=n(39),P=n.n(O),A=n(40),S=n.n(A),D=n(41),N=n.n(D),R=n(42),G=n.n(R),B=n(43),T=n.n(B),L=n(44),z=n.n(L),F=[b.a,E.a,j.a,P.a,N.a,T.a],K=[w.a,x.a,C.a,S.a,G.a,z.a],Q=["Pawn","Knight","Bishop","Rook","Queen","King"],U=d.a.img.withConfig({displayName:"Piece__PieceImage",componentId:"xjorig-0"})(["display:block;margin:13%;height:74%;width:74%;&.dragging{visibility:hidden;}-webkit-transform:rotateZ(0deg);"]),Y="undefined"!==typeof InstallTrigger,q=function(e){var t=e.boardIndex,n=e.color,a=e.piece,i=e.onPickup,r=e.onDrop,c=Math.abs(a),l="black"===n?K[c-1]:F[c-1],d=Object(h.a)({item:{type:"PIECE",pieceId:c,boardIndex:t},begin:function(e){return i(t)},end:function(e){return r(t)},collect:function(e){return{isDragging:!!e.isDragging()}}}),u=Object(s.a)(d,2),m=u[0].isDragging,f=u[1],v=o.a.createElement(U,{ref:f,src:l,alt:Q[c-1],className:m?"dragging":""});return Y?o.a.createElement("div",{ref:f},v):v},J=d.a.div.withConfig({displayName:"Board__BoardGrid",componentId:"sc-1rho0e0-0"})(["display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);box-shadow:3px 3px 3px #586e75;"]),V=function(e){var t=e.board,n=e.isRotated,a=e.lastMove,i=e.currentPieceMoves,r=e.handlePlayerMove,c=e.updatePossibleMoves,l=e.clearPossibleMoves;return o.a.createElement(J,{isRotated:n},t.slice(0,64).map((function(e,s){var d=n?63-s:s,u=t[d];return o.a.createElement(p,{key:d,boardIndex:d,movePiece:r,isEven:(d+(d>>3))%2===0,isStart:d===a.start,isEnd:d===a.end,isPossibleTarget:i.has(d)},0!==u&&o.a.createElement(q,{boardIndex:d,color:u<0?"black":"white",piece:u,onPickup:c,onDrop:l}))})))},W=d.a.div.withConfig({displayName:"AnimatedSpinner",componentId:"sc-1x64dsd-0"})(['color:#073642;display:inline-block;position:relative;width:80px;height:80px;margin-top:1rem;margin-right:0.5rem;margin-left:1.5rem;div{transform-origin:40px 40px;animation:lds-spinner 1.2s linear infinite;}div:after{content:" ";display:block;position:absolute;top:3px;left:37px;width:6px;height:18px;border-radius:20%;background:#073642;}div:nth-child(1){transform:rotate(0deg);animation-delay:-1.1s;}div:nth-child(2){transform:rotate(30deg);animation-delay:-1s;}div:nth-child(3){transform:rotate(60deg);animation-delay:-0.9s;}div:nth-child(4){transform:rotate(90deg);animation-delay:-0.8s;}div:nth-child(5){transform:rotate(120deg);animation-delay:-0.7s;}div:nth-child(6){transform:rotate(150deg);animation-delay:-0.6s;}div:nth-child(7){transform:rotate(180deg);animation-delay:-0.5s;}div:nth-child(8){transform:rotate(210deg);animation-delay:-0.4s;}div:nth-child(9){transform:rotate(240deg);animation-delay:-0.3s;}div:nth-child(10){transform:rotate(270deg);animation-delay:-0.2s;}div:nth-child(11){transform:rotate(300deg);animation-delay:-0.1s;}div:nth-child(12){transform:rotate(330deg);animation-delay:0s;}@keyframes lds-spinner{0%{opacity:1;}100%{opacity:0;}}']),Z=function(){return o.a.createElement(W,null,o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null),o.a.createElement("div",null))},H=n(6),X=n(9),$=d.a.div.withConfig({displayName:"GameMenu__MenuBar",componentId:"sc-1evhkun-0"})(["display:flex;flex-direction:column;margin-top:1rem;margin-left:1.5rem;text-align:center;@media (max-aspect-ratio:100/99){margin-left:auto;margin-right:auto;flex-flow:column-reverse;}"]),ee=d.a.div.withConfig({displayName:"GameMenu__MenuItem",componentId:"sc-1evhkun-1"})(["position:relative;display:",";padding-bottom:0.5rem;flex-direction:column;@media (max-aspect-ratio:100/99){flex-direction:row;align-self:center;}"],(function(e){return e.hidden?"none":"flex"})),te=d.a.button.withConfig({displayName:"GameMenu__GameButton",componentId:"sc-1evhkun-2"})(["background:white;color:#073642;border:1px solid #073642;border-radius:0.3rem;font-size:1rem;font-weight:bold;padding:0.5rem 0.4rem;width:2.5rem;margin:0.3rem;box-shadow:1px 1px 1px #073642;&[disabled]{display:none;}&:hover{background:#073642;color:white;cursor:pointer;}"]),ne=Object(d.a)(ee).withConfig({displayName:"GameMenu__GameResult",componentId:"sc-1evhkun-3"})(["margin-top:0.3rem;font-weight:bold;font-size:1.5rem;color:#073642;width:100%;align-items:center;svg{margin-left:1rem;margin-right:1rem;}"]),ae=d.a.input.withConfig({displayName:"GameMenu__IconRadioInput",componentId:"sc-1evhkun-4"})(["display:none;&:checked + label{opacity:1;}"]),ie=d.a.label.withConfig({displayName:"GameMenu__IconRadioLabel",componentId:"sc-1evhkun-5"})(["color:#073642;margin:0.2rem;opacity:0.2;&:hover{opacity:0.5;cursor:pointer;}"]),re=function(e,t){return e?e===t?H.h:H.k:H.a},oe=function(e){var t=e.currentValue,n=e.name,a=e.options,i=e.onChange;return o.a.createElement(o.a.Fragment,null,a.map((function(e){var a=e.value,r=e.description,c=e.icon;return o.a.createElement(o.a.Fragment,{key:"".concat(n,"-").concat(a)},o.a.createElement(ae,{type:"radio",id:"".concat(n,"-").concat(a),name:n,value:a,defaultChecked:t===a,onChange:function(e){return i(e.target.value)}}),o.a.createElement(ie,{htmlFor:"".concat(n,"-").concat(a)},o.a.createElement(X.a,{icon:c,title:r,size:"2x"})))})))},ce=function(e){var t=e.isAiThinking,n=e.firstMovePlayed,a=e.humanPlayerColor,i=e.gameEnded,r=e.winningPlayerColor,c=e.startNewGame,l=e.switchSides,s=e.rotateBoard,d=e.difficultyLevel,u=e.setDifficultyLevel,m=e.canUndoMove,f=e.undoMove;return o.a.createElement($,null,i&&o.a.createElement(ne,null,o.a.createElement(X.a,{icon:re(r,a),size:"2x"}),r?(1===r?"White":"Black")+" wins!":"Draw!"),o.a.createElement(ee,{hidden:t},o.a.createElement(te,{disabled:!n,onClick:c},o.a.createElement(X.a,{icon:H.i,title:"Start new game"})),o.a.createElement(te,{disabled:i||n,onClick:l},o.a.createElement(X.a,{icon:H.g,title:"Switch sides"})),o.a.createElement(te,{disabled:!m||i,onClick:f},o.a.createElement(X.a,{icon:H.l,title:"Undo move"})),o.a.createElement(te,{disabled:i||!n,onClick:s},o.a.createElement(X.a,{icon:H.j,title:"Rotate board"}))),o.a.createElement(ee,{hidden:t||i},o.a.createElement(oe,{currentValue:d,name:"difficulty-level",onChange:u,options:[{value:1,description:"Difficulty level 1 (easy)",icon:H.d},{value:2,description:"Difficulty level 2",icon:H.f},{value:3,description:"Difficulty level 3",icon:H.e},{value:4,description:"Difficulty level 4",icon:H.c},{value:5,description:"Difficulty level 5 (hard)",icon:H.b}]})),t&&o.a.createElement(Z,null))},le=n(22),se=n(23),de=n(45),ue=function(){function e(){Object(le.a)(this,e)}return Object(se.a)(e,[{key:"init",value:function(){return i.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.engine){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,i.a.awrap(Object(de.instantiate)(fetch("./as-api.wasm")));case 4:this.engine=e.sent,console.log("Engine initialized");case 6:case"end":return e.stop()}}),null,this)}},{key:"newGame",value:function(){this.engine.newGame()}},{key:"calculateMove",value:function(e,t,n){console.log("Start calculation of move ...");var a=this.engine.__allocArray(this.engine.INT32ARRAY_ID,e),i=this.engine.__retain(a),r=this.engine.calculateMove(i,t,n),o=me.fromEncodedMove(r);return this.engine.__release(i),console.log("Calculation finished"),o}},{key:"performMove",value:function(e,t){var n=this.engine.__allocArray(this.engine.INT32ARRAY_ID,e),a=this.engine.__retain(n),i=this.engine.performMove(a,t.encodedMove),r=this.engine.__getArray(i);return this.engine.__release(a),this.engine.__release(i),r}},{key:"generateMoves",value:function(e,t){var n=this.engine.__allocArray(this.engine.INT32ARRAY_ID,e),a=this.engine.__retain(n),i=this.engine.generatePlayerMoves(a,t),r=this.engine.__getArray(i);return this.engine.__release(i),this.engine.__release(a),r.map(me.fromEncodedMove)}},{key:"isCheckMate",value:function(e,t){var n=this.engine.__allocArray(this.engine.INT32ARRAY_ID,e),a=this.engine.__retain(n),i=this.engine.isCheckMate(a,t);return this.engine.__release(a),i}}]),e}(),me=function(){function e(t,n,a){Object(le.a)(this,e),this.piece=t,this.start=n,this.end=a,this.encodedMove=t|n<<3|a<<10}return Object(se.a)(e,null,[{key:"fromEncodedMove",value:function(t){return new e(7&t,t>>3&127,t>>10&127)}}]),e}(),fe=new ue,ve=m()(),pe=[-4,-2,-3,-5,-6,-3,-2,-4,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,4,2,3,5,6,3,2,4,0,0,0],he=d.a.div.withConfig({displayName:"Game__GameArea",componentId:"qivay-0"})(["display:flex;flex-wrap:wrap;"]),ge=function(){var e=Object(r.useState)(!1),t=Object(s.a)(e,2),n=t[0],a=t[1],i=Object(r.useState)(1),c=Object(s.a)(i,2),l=c[0],d=c[1],u=Object(r.useState)(1),m=Object(s.a)(u,2),f=m[0],v=m[1],p=Object(r.useState)(!1),h=Object(s.a)(p,2),g=h[0],b=h[1],y=Object(r.useState)(pe),w=Object(s.a)(y,2),k=w[0],E=w[1],_=Object(r.useState)(!1),x=Object(s.a)(_,2),M=x[0],j=x[1],I=Object(r.useState)({start:-1,end:-1}),C=Object(s.a)(I,2),O=C[0],P=C[1],A=Object(r.useState)(fe.generateMoves(k,l)),S=Object(s.a)(A,2),D=S[0],N=S[1],R=Object(r.useState)(new Set),G=Object(s.a)(R,2),B=G[0],T=G[1],L=Object(r.useState)(),z=Object(s.a)(L,2),F=z[0],K=z[1],Q=Object(r.useState)(3),U=Object(s.a)(Q,2),Y=U[0],q=U[1],J=Object(r.useState)(),W=Object(s.a)(J,2),Z=W[0],H=W[1],X=function(e,t,n){b(!1),P(t);var a=fe.performMove(e,t);if(E(a),fe.isCheckMate(a,-n))return j(!0),void K(n);var i=fe.generateMoves(a,-n);(N(i),0!==i.length)?d(-n):j(!0)};return o.a.createElement(he,null,o.a.createElement(V,{board:k,isRotated:n,lastMove:O,currentPieceMoves:B,handlePlayerMove:function(e,t,n){var a=Math.abs(e);if(!M&&!g&&function(e,t){return D.some((function(n){return n.start===e&&n.end===t}))}(t,n)){if(H({previousBoard:k,previousLastMove:O,previousActivePlayer:l,previousAvailableMoves:D}),P({start:t,end:n}),1===a&&(1===l&&n<8||-1===l&&n>=56))switch(prompt("Choose promotion (Q, R, B, K)","Q").toUpperCase()){case"R":a=4;break;case"B":a=3;break;case"K":a=6;break;case"Q":default:a=5}var i=fe.performMove(k,new me(a,t,n));if(E(i),fe.isCheckMate(i,-l))return j(!0),void K(l);0!==fe.generateMoves(i,-l).length?(b(!0),N([]),ve.calculateMove(i,-l,Y).then((function(e){return X(i,e,-l)})),d(-l)):j(!0)}},updatePossibleMoves:function(e){var t=D.filter((function(t){return t.start===e})).map((function(e){return e.end}));T(new Set(t))},clearPossibleMoves:function(){T(new Set)}}),o.a.createElement(ce,{isAiThinking:g,firstMovePlayed:-1!==O.start,humanPlayerColor:f,gameEnded:M,winningPlayerColor:F,startNewGame:function(){ve.newGame().then((function(){a(!1),H(void 0),E(pe),d(1),v(1),j(!1),P({start:-1,end:-1}),K(void 0),N(fe.generateMoves(pe,1)),T(new Set)}))},switchSides:function(){a(!0),b(!0),v(-f),ve.calculateMove(k,l,Y).then((function(e){return X(k,e,l)}))},rotateBoard:function(){return a(!n)},difficultyLevel:Y,setDifficultyLevel:q,canUndoMove:!!Z,undoMove:function(){var e=Z.previousBoard,t=Z.previousLastMove,n=Z.previousActivePlayer,a=Z.previousAvailableMoves;E(e),P(t),d(n),N(a),H(void 0)}}))},be=n(69),ye=n(46),we=n(47),ke=function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){var n=t.map((function(t){return t(e)}));return{setup:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.setup.apply(e,t)}))},teardown:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.teardown.apply(e,t)}))},connectDropTarget:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDropTarget.apply(e,t)}))},connectDragPreview:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDragPreview.apply(e,t)}))},connectDragSource:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return n.forEach((function(e){return e.connectDragSource.apply(e,t)}))}}}};var Ee=function(){return o.a.createElement("main",null,o.a.createElement(be.a,{backend:ke(ye.a,we.a)},o.a.createElement(ge,null)))};i.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.a.awrap(fe.init());case 2:l.a.render(o.a.createElement(Ee,null),document.getElementById("root"));case 3:case"end":return e.stop()}}))}},[[51,1,2]]]);
//# sourceMappingURL=main.80fdf2ff.chunk.js.map