const str = "htt://ww.doubao.com/chat/?channel=mi"
function getSubString(s) {
  return s.indexOf("?")
}
console.log(str.substring(getSubString(str)+1,str.length))