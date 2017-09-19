const pushData = (fromData,toData) =>{
            for(var index in fromData){
                toData.push(fromData[index])
            }
      }
const  stringFormat = () =>{
         if (arguments.length == 0)
             return null;
         var str = arguments[0];
         for (var i = 1; i < arguments.length; i++) {
             var re = new RegExp('\\\\{' + (i - 1) + '\\\\}', 'gm');
             str = str.replace(re, arguments[i]);
         }
         return str;
}
export default {
   pushData,
   stringFormat
}