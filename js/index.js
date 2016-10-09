$(function(){
	var canvas=document.getElementById('canvas');
    var ctx=canvas.getContext("2d");
    var ROW=15;
    var width=canvas.width;
    var off=width/ROW;
    var flag=true;
    var check={};
    var ai=false;
    var audio=$('audio').get(0);

    var blank={};//空白的坐标
    for (var i = 0; i < ROW; i++) {
    	for (var j = 0; j < ROW; j++) {
    		blank[p2k(i,j)]=true;
    	};
    };
    
    // console.log(blank);
    function makeCircle(x,y){
      ctx.beginPath();
      ctx.moveTo(x*off,y*off);
      ctx.arc(x*off,y*off,3,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    function qipan(){
	    //横竖线条
	    ctx.beginPath();
	    for (var i = 0; i < 15; i++) {
	    	ctx.moveTo(off/2+0.5,off*i+off/2+0.5);
	        ctx.lineTo(width-off/2+0.5,off*i+off/2+0.5);
	    };
	    for (var i = 0; i < 15; i++) {
	    	ctx.moveTo(off*i+off/2+0.5,off/2+0.5);
	        ctx.lineTo(off*i+off/2+0.5,width-off/2+0.5);
	    };
	    ctx.stroke();
	    ctx.closePath();
	    //坐标点
	    makeCircle(3.5,3.5);
	    makeCircle(3.5,11.5);
	    makeCircle(11.5,11.5);
	    makeCircle(11.5,3.5);
	    makeCircle(7.5,7.5);
	}   
    qipan();


    function v2k(position){
    	return position.x+"_"+position.y;
    }
    function p2k(tx,ty){
        return tx+"_"+ty;
    }
    //棋子
    function drawChess(position,color){
      ctx.save();	
      ctx.beginPath();
      ctx.translate(position.x*off+off/2,position.y*off+off/2);
      if (color=="black") {
	      var radgrad = ctx.createRadialGradient(-5,-5,1,0,0,15);
	      radgrad.addColorStop(0, 'white');
	      radgrad.addColorStop(0.5, 'black');
	      radgrad.addColorStop(0.9, 'black');
	      radgrad.addColorStop(1, 'rgba(0,0,0,0)');
	      ctx.fillStyle = radgrad;
	      ctx.fillRect(-25,-25,50,50);
      };
      if (color=="white") {
	      var radgrad = ctx.createRadialGradient(-2,-2,10,0,0,15);
	      radgrad.addColorStop(0,'white');
	      radgrad.addColorStop(0.5, '#ccc');
	      radgrad.addColorStop(1, 'rgba(0,0,0,0)');
	      ctx.fillStyle = radgrad;
	      ctx.fillRect(-25,-25,50,50);
      };
      ctx.closePath();
      ctx.restore();
      //把棋子的坐标保存在check表中；
      check[ v2k(position) ]=color;
      
      delete(blank[v2k(position)]);
      // console.log(blank);
    }
    
    function checks(position,color){
      // console.log(position)
      var table={};
      for (i in check) {
      	if(check[i]==color){
      		table[i]=true;
      	}
      };
      var rownum=1;
      var colnum=1;
      var rightnum=1;
      var leftnum=1;
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx+1,ty)]){
      	rownum++;      	
      	tx++;
      }
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx-1,ty)]){
      	rownum++;      	
      	tx--;
      }
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx,ty+1)]){
      	colnum++;      	
      	ty++;
      }
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx,ty-1)]){
      	colnum++;      	
      	ty--;
      }      
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx+1,ty+1)]){
      	leftnum++; 
      	tx++     	
      	ty++;
      }
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx-1,ty-1)]){
      	leftnum++;
      	tx--;      	
      	ty--;
      }      
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx+1,ty-1)]){
      	rightnum++; 
      	tx++     	
      	ty--;
      }
      var tx=position.x;
      var ty=position.y;
      while(table[p2k(tx-1,ty+1)]){
      	rightnum++;
      	tx--;      	
      	ty++;
      }
     
      return Math.max(rownum,colnum,leftnum,rightnum)
      
    }
    
    function k2o(key){
    	var arr=key.split("_");	
    	return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }
    function drawText(pos,text,color){
    	var pos=k2o(pos);
    	var x=pos["x"];
    	var y=pos["y"];
    	ctx.save();
    	
        ctx.font="15px 微软雅黑"
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if (color=="black") {
        	ctx.fillStyle= "white";        	
        };
        if (color=="white") {
        	ctx.fillStyle= "black";
        };
        ctx.fillText(text,(x+0.5)*off,(y+0.5)*off);
    	ctx.restore();
    }
    //
    function reviw(){
      var index=0;
      for (var i in check) {
      	index++;
      	var color=check[i];
      	var pos=i;
      	drawText(pos,index,color)
      };
    }

    

    function restart(){
    	ctx.clearRect(0,0,600,600);
    	flag=true;
        check={};
        $(canvas).off('click').on('click',handleClick);
        qipan();
    }
    function handleClick(e){
      if (e) {
        var position={x:Math.round( (e.offsetX-off/2)/off ),y:Math.round( (e.offsetY-off/2)/off )};
          
      }else{
        alert(shule)
        x=Math.floor(Math.random()*14);
        y=Math.floor(Math.random()*14);
        var position={x:5,y:5};
      }
        
    	if( check[v2k(position)] )return;
    	if (ai) {
            drawChess(position,"black");
    		if(checks(position,"black")>=5){
    			alert("黑子赢");
    			$(canvas).off("click");
    			if(confirm("是否生成棋谱？")){
    				reviw();
    			}
    		};
    		var po=AI();
    		drawChess(po,"white");
            if(checks(po,"white")>=5){
    			alert("白子赢");
    			$(canvas).off("click");
    			if(confirm("是否生成棋谱？")){
    				reviw();
    			}
    		};
    		// console.log(position);
    		return;
    	};
    	if (flag) {
    		drawChess(position,"black");
    		if(checks(position,"black")>=5){
    			alert("黑子赢");
    			$(canvas).off("click");
    			if(confirm("是否生成棋谱？")){
    				reviw();
    			}
    		};
    	}else{
            drawChess(position,"white");
            if(checks(position,"white")>=5){
    			alert("白子赢");
    			$(canvas).off("click");
    			if(confirm("是否生成棋谱？")){
    				reviw();
    			}
    		};
    	}
    	flag=!flag;
    }

    $(canvas).on("click",handleClick);
    $('.restart').on("click",restart);
    $(".ai").on("click",function(){
    	if (ai) {
        return
      }else if (!ai) {
        ai=true;
        restart();
      };    	
    })
    $('.rr').on("click",function(){
      if (!ai) {
        return
      }else if (ai) {
        ai=false;
        restart();
      };
    });
    $(".music").on("click",function(){
      if(audio.paused){
              audio.play();
          }else{
              audio.pause();
        };
    })
    audio.onended = function(){
      audio.play();
    }
    function AI(){
    	var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for (var i in blank) {
        	var pos=k2o(i);
        	var score1=checks(pos,"black");
        	var score2=checks(pos,"white");
        	if(score1>max1){
        		pos1=pos;
        		max1=score1;
        	}
        	if(score2>max2){
        		pos2=pos;
        		max2=score2;
        	}
        };
        
        if (max2>=max1) {
        	return pos2;
        }else {
        	return pos1;
        };
        
    }
    
    //倒计时
    var fen= 1;
    var miao=0;
    function dao(){
      if (fen==0&miao==0) {
        fen=1;
      // $(canvas).triggerHandler("click");
      handleClick();
      clearInterval(t);
      };
      fen=fen-1;
      if (fen<0) {
        fen=0;
      };
      miao=miao-1;

      if (miao<0) {
        miao=59;
      };      
    }
    //黑棋倒计时
    function rightDao(){
      dao();
      $(".right").text(fen+":"+miao)
    }
    t=setInterval(rightDao,500);
    //白棋倒计时
    function leftDao(){
      dao();
      $(".left").text(fen+":"+miao)
    }
    


})