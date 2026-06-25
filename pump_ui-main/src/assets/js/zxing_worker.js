importScripts("zxing_reader.js")
var zxingInstance;
var mallocFlag = true;
var zxingLoaded = false;
var buffer;
var count = 20;

ZXing().then((instance) => {
    zxingInstance = instance;
    zxingLoaded = true;
});


self.addEventListener("message", function (e) {
    // console.log(e.data);
    // console.log("detectSymbolWorkerInitialize")
    // let temp = Date.now();
    try {

        if(!zxingLoaded){
            self.postMessage([]);
        }

        if (e.data && e.data.event == 'LOAD') {            
            console.log("worker loaded");
            if(e.data.count){
                count = Number(e.data.count);
                console.log("worker loaded with count -: "+count);
            }
        }

        if (e.data && e.data.event == 'UN-LOAD') {
            if (buffer) {
                zxingInstance._free(buffer);
                mallocFlag = true;
            }
            console.log("worker un-loaded");
        }

        if (e.data && e.data.event == 'SCAN') {
            if (mallocFlag) {
                buffer = zxingInstance._malloc(e.data.fileData.length);
                mallocFlag = false;
            }

            if (buffer) {
                zxingInstance.HEAPU8.set(e.data.fileData, buffer);
            }

            var result = zxingInstance.readBarcodeFromPixmap(buffer, e.data.width, e.data.height, /** this.countFlag++ % 6 == 0 */ true, e.data.scanFormatId, count);
            // self.postMessage(JSON.stringify(result)); //your code here   
            if (result.size() == 0) {
                self.postMessage([]); //your code here   
            }
            else {
                let res = [];
                for (let index = 0; index < result.size(); index++) {
                    res.push(result.get(index));

                }
                self.postMessage(res); //your code here   
            }
        }
    } catch (error) {
        self.postMessage([]); //your code here   
        console.error(error)
    }
    // console.log(Date.now() - temp);


    // self.postMessage('Example post from Worker'); //your code here  
});
