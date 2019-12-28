'use script';

//コメントは自分で考えたコード
//昨日が複雑だからクラス構文を使うらしい。
//今回はクラスを二つも使った。
//何にがfor文で何がforEach文を使うべきなのかいまいちわからない。
{
  //クラス(設計図)を生成
  class Panel {
    constructor(game) {
      //this.gameを介してGameクラスのプロパティにアクセスできるようになる。
      this.game=game;
      this.li=document.createElement('li');
      this.li.classList.add('pressed');
      this.li.addEventListener('click',()=>{
        this.check();
      });
    }
    getLi() {
      return this.li;
    }
    activate(num) {
      this.li.classList.remove('pressed');
      this.li.textContent=num;
    }
    check() {
      //データ型を揃えるためにparseIntで１０進数で著されたtextContentを１０進数の数値に変換する。
      if(this.game.getCurrentNum()===parseInt(this.li.textContent,10)) {
        this.li.classList.add('pressed');
        this.game.addcurrentNum();
        if(this.game.getCurrentNum()===this.game.getLevel()**2) {
          clearTimeout(this.game.getTimeoutId());
          this.game.resetCurrentNum();
          this.game.showResult();
        }
      }
    }
  }
  
  class Board {
    //new Board(this)のthisをgameで受けている。
    //おそらくthis.game=thisとなると思う。
    constructor(game) {
      //つまりこのgameプロパティにはオブジェクトが代入されている。
      //{board: Board, currentNum: undefined, startTime: undefined, timeoutId: undefined}
      this.game=game;
      this.panels=[];
      for(let i=0;i<this.game.getLevel()**2;i++) {
        //Panelオブジェクトが配列panelsに格納される。
        //Panel {li: li.pressed}
        this.panels.push(new Panel(this.game));
      }
      this.setup();
    }
    setup() {
      const board=document.getElementById('board');
      //もしBoardインスタンスがすでに呼び出されていた場合にはすでにある要素を初期化する。
      while(board.firstChild) {
        board.removeChild(board.firstChild);
      }
      this.panels.forEach(panel=>{
        //直接プロパティにアクセスせずにメソッド経由でアクセスすることを「カプセル化」というらしい。
        board.appendChild(panel.getLi());
      });
    }
    activate() {
      const nums=[];
      for(let i=0;i<this.game.getLevel()**2;i++) {
        nums.push(i);
      }
      this.panels.forEach(panel=>{
        const num=nums.splice(Math.floor(Math.random()*nums.length),1)[0];
        //ここでも部品として呼び出している。
        panel.activate(num);
      });
    }
  }
  
  class Game {
    constructor(level) {
      const btn=document.getElementById('btn');
      const timer=document.getElementById('timer');
      const container=document.getElementById('container');
      const result=document.getElementById('result');
      const cover=document.getElementById('cover');
      const score=document.getElementById('score');
      //BoardクラスにGameクラスのインスタンスを渡すために引数にthisを入れる。
      this.level=level;
      //上のlevelプロパティはBoardインスタンスを生成するのに必要なのでそれより先に定義しておく。
      this.board=new Board(this);
      this.currentNum=undefined;//このプロパティはPanelクラスでも使用する。
      this.startTime=undefined;
      this.timeoutId=undefined;
      this.setup();
      btn.addEventListener('click',()=>{
        this.start();
      });
    }
    setup() {
      const PANEL_WIDTH=50;
      const BOARD_PADDING=10;
      container.style.width=PANEL_WIDTH*this.level+BOARD_PADDING*2+'px';
    }
    start() {
      if(typeof this.timeoutId!=='undefined') {
        //これは一つのsetTimeoutだけを実行するため
        clearTimeout(this.timeoutId);
      }
      //ここでも関数で部品として呼び出している。
      this.board.activate();
      this.startTime=Date.now();
      //ここでも関数で部品として呼び出している。
      this.runTimer();
      this.currentNum=0;
    }
    runTimer() {
      timer.textContent=((Date.now()-this.startTime)/1000).toFixed(2);
      this.timeoutId=setTimeout(()=>{
        this.runTimer();
      },50);
      console.log(this.timeoutId);
    }
    addcurrentNum() {
      this.currentNum++;
    }
    getCurrentNum() {
      return this.currentNum;
    }
    resetCurrentNum() {
      this.currentNum=0;
    }
    getTimeoutId() {
      return this.timeoutId;
    }
    getLevel() {
      return this.level;
    }
    showResult() {
      result.classList.remove('hidden');
      cover.classList.remove('hidden');
      score.textContent='結果'+timer.textContent+'秒!';
    }
  }
  
  function getSelectValue(name) {
    const result=[];
    const opts=document.getElementById(name).options;
    for(let i=0;i<opts.length;i++) {
      const opt=opts.item(i);
      if(opt.selected) {
        result.push(opt.value);
      }
    }
    return result;
  }
  
  //constructor()を呼び出す。
  const levelSetBtn=document.getElementById('levelSetBtn');
  const levelSet=document.getElementById('levelSet');
  const levels=document.getElementById('levels');
  levelSetBtn.addEventListener('click',()=>{
    if(levelSet.classList.contains('inactive')) {
      return;
    }
    //返り値が文字列の可能性があるので数値に直した。
    level=parseInt(getSelectValue('levels'));
    let game=new Game(level);
    levelSet.classList.add('inactive');
    levels.disabled='disabled';
  });
}

