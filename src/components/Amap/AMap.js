export default function MapLoader () {  
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap)
    } else {
      var script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=91a6dd05aaa68c6bd45bd8dda82efef3'
      script.onerror = reject
      var uiscript = document.createElement('script')
      uiscript.type = 'text/javascript'
      uiscript.async = true
      uiscript.onerror = reject
      uiscript.src='http://webapi.amap.com/ui/1.0/main.js?v=1.0.11'
      document.head.appendChild(script)
      document.head.appendChild(uiscript)
    }
    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}