import * as pdfJsLib from "../../pdfjs-dist-5.1.91/package/build/pdf.mjs";
pdfJsLib.GlobalWorkerOptions.workerSrc = "../pdfjs-dist-5.1.91/package/build/pdf.worker.min.mjs";
let ExtractedValues=[];//An array which will contain our wanted values from the pdf file's string.
let PdfString;//A string which will contain our entire pdf file's text.

/*The function that will read the pdf file and its pages and convert it to text. It uses methods from the pdf.js library,the
main function of the library that grabs the pdf file is the .getDocument. This function reads http urls or array buffers as
parameters,since our user will be uploading the file from a local drive and not from a server,we need to convert the pdf's
url to an array buffer or a typed array.Then the result is used as a parameter on our extractText function.*/

/*function extractText(pdfUrl) {
  var pdf = pdfJsLib.getDocument(pdfUrl);
  return pdf.promise.then(function (pdf) {
    var totalPageCount = pdf.numPages;
    var countPromises = [];
    for (
      var currentPage = 1;
      currentPage <= totalPageCount;
      currentPage++
    ) {
      var page = pdf.getPage(currentPage);
      countPromises.push(
        page.then(function (page) {
          var textContent = page.getTextContent();
          return textContent.then(function (text) {
            return text.items
              .map(function (s) {
                return s.str;
              })
              .join('');This method fucks up our string,ignores new lines (/n,carriage return
and what not)and concatenates the two lines into one thus our coordinate pairs become mixed up. 
Needs to be fixed up
          });
        }),
      );
    }
    return Promise.all(countPromises).then(function (texts) {
      return texts.join('');
    });
  });
}*/

function extractText(pdfUrl) {
  var pdf = pdfJsLib.getDocument(pdfUrl);
  return pdf.promise.then(function (pdf) {
    var totalPageCount = pdf.numPages;
    var countPromises = [];
    for (
      var currentPage = 1;
      currentPage <= totalPageCount;
      currentPage++
    ) {
      var page = pdf.getPage(currentPage);
      countPromises.push(
        page.then(function (page) {
          var textContent = page.getTextContent();
          return textContent.then(function (text) {
            return text.items
              .map(function (s) {
                return s.str;
              })
              .join(' ');
          });
        }),
      );
    }
    return Promise.all(countPromises).then(function (texts) {
      return texts.join('');
    });
  });
}

/*Conversion to Typed Array
Here's the conversion of the url of the pdf file,for example C:\Documents\PDFfilename,to a typed array with the Filereader 
API.*/ 

//Step 1: Get the file from the input element                
document.getElementById("file").onchange = function(event) {
  var file = event.target.files[0];
  if(file){/*If statement exists in case the user tries to load another pdf file but closes the file picker before selecting
anything*/

//Step 2: Read the file using file reader
   var fileReader = new FileReader();

//Step 3:Read the file as ArrayBuffer,as the name of the method implies,it reads the url of the file as an array buffer.
   fileReader.readAsArrayBuffer(file);

   fileReader.onload = function() {
//Step 4:turn array buffer into typed array
    var typedarray = new Uint8Array(this.result);
//Step 5:pdfjs should be able to read this
    extractText(typedarray).then(
	   function (text) {
		  //console.log(text);
      PdfString=text;
      DataExtraction(PdfString);
      console.log(ExtractedValues);
		 },
		 function (reason) {
		  console.error(reason);
		 },
	  );
   };
   };
};
//document.getElementById("submit").addEventListener("click",console.log(ExtractedValues));
/*This function will filter out the wanted information,be it phone numbers,coordinates etc. Using REGEX API we search for
specific patterns in the text and then cache the results and put em in an array which will be then utilized elsewhere. REGEX
syntax can be researched in order to understand it,for example regex101 website can help you out after you have grasped the
basics of REGEX*/
function DataExtraction(string)
{
  const regex=/([0-9]){2}\.([0-9]){1,}\ ([0-9]){2}\.([0-9]){1,}/gm;//Our REGEX filter.
  let match=regex.exec(string);

  while(match)
  {
   ExtractedValues.unshift(match[0]);
   match=regex.exec(string);
  }/*As long as there's a match from our REGEX filter,the while loop will continue to work and add into our array. This code
was based on this https://www.youtube.com/watch?v=909NfO1St0A&ab_channel=freeCodeCamp.org*/
}
//test