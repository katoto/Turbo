/**
 * Created by Turbo on 2016/4/25.
 */


var select =
(function(){
//push 能力检测
var push =[].push;
try{
    var div = document.createElement('div');
    div.appendChild(document.createElement('div'));
    var list = div.getElementsByTagName('*');
    push.apply([],list);
}catch(e){
    push={
        apply:function(arr,list){
            var j=arr.length,
                i=0;
            while(arr[j++] = list[i++]){}
            arr.length=j-1;
        }
    };
}finally{
    //回收
    div = list = null;
}
//浏览器能力检测
var support ={};
support.getElementsByClassName = (function(){
    var isExit = !!document.getElementsByClassName;
    if(isExit && typeof(document.getElementsByClassName)==='function'){
        var divNode = document.createElement('div'),
            divNode2 = document.createElement('div');
        divNode2.className ='c';
        divNode.appendChild(divNode2);
        return divNode.getElementsByClassName('c')[0]===divNode2;
    }
    return false;
})();

//  each 方法
var each = function(arr , fn){
  var i;
    for(i=0; i<arr.length;i++){
    //    call 第一个参数将 this 指向传给他的参数
    //    回调函数返回false 用来跳出循环
        if( fn.call(arr[i],i,arr[i] )===false ){
           //跳出循环
            break;
        }
    }
};

// 去空格
var myTrim = function( str ){
  if(String.prototype.trim ){
      return str.trim();
  }else{
      return str.replace(/^\s+|\s+$/g,'');
  }
};

//indexOf 方法
var indexOf = function( list ,elem ){
  var i= 0,len = list.length;
    for(; i<len;i++ ){
        if( list[i]===elem ){
            return i;
        }
    }
    return -1;
};

//id选择器
var getId = function( id, context ,results ){
    context = context || document;
    results = results || [];

    push.call( results ,context.getElementById(id));
    return results;
};
//class 选择器
var getClass = function( className , context ,results ){
    context = context || document;
    results = results || [];
    if( support.getElementsByClassName ){
        push.apply( results ,context.getElementsByClassName(className));
    }else{
        each( getTag('*',context),function(i ,v){
           if((" "+ v.className +' ' ).indexOf(" "+className+' ')!==-1){
               push.call( results ,v );
           }
        });
    }
    return results;
};
//标签选择器
var getTag = function( tag ,context ,results ){
    context = context || document;
    results = results || [];
    push.apply( results ,context.getElementsByTagName( tag ));
    return results;
};
//后代选择器
var get = function( select ,context ,results ){
    results = results || [];
    context = context || document;
    var rquickRegEx = /^(?:#([\w-]+)|\.([\w-]+)|([\w-]+)|(\*))$/,
        m = rquickRegEx.exec(myTrim(select));
    if( m ){
        if( context.nodeType ){
            context = [context];
        }
        if( typeof ( context )=='string' ){
            context = get( context );
        }
        //?
        each( context ,function( i , v){
           if( m[1] ){
               results = getId( m[1] , this , results );
           }else if( m[2] ){
               results = getClass( m[2],this,results );
           }else if( m[3] ){
               results = getTag( m[3] ,this ,results );
           }else if( m[4]  ){
               results = getTag( m[4], this, results );
           }
        });
    }
    return results;
};
//对外开放的函数
var select = function( select ,context ,results ){
    results = results ||[];
    context = context || document;
    var newSelector = select.split(',');
    each( newSelector , function( i , v ){
       var list = v.split(' ');
        var c = context;
        for( var i =0 ;i<list.length;i++ ){
            if( list[i]=='' )continue;
            c= get(list[i],c);
        }
        push.apply(results ,c);
    });
    return results;
};

return select;

})();
