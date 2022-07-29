//Blobs are immutable objects that represent raw data. File is a derivation of Blob that represents data from the file system. 
//Use FileReader to read data from a Blob or File. Blobs allow you to construct file like objects on the client that you can pass to apis that expect urls instead of requiring the server provides the file. 
//For example, you can construct a blob containing the data for an image, use URL.createObjectURL() to generate a url, and pass that url to HTMLImageElement.src to display the image you created without talking to a server.

//This is called from components >> createPostPop>>index.js
export default function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);
  
    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([ia], { type: mimeString });
  }