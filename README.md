----------- Files introduction:------------------------------------------------------------

- dist: JSZip, an external JavaScript Library. Used to generate and manipulate zip files. 
- FileSaver.js: FileSaver, an external JavaScript Library used to save files on user's device. 
- parser.js: Main script. The logic of the parser is contained inside. 
- page.html: Front End HTML file of the parser. 

----------- Instructions --------------------------------------------------------------

To use the SVG Parser, open the page.html using your browser. You will see two input buttons on the page. The upper button is for single SVG file input, and the bottom button is for folder input. 
For single SVG file input, the Front-End UI will appear for the user to see path information, see the bounding boxes or highlight the path. 
For folder input, a zip file containing all the text files with JSON inside will be automatically downloaded when all the files are processed.

------------ Caution ------------------------------------------

- For the folder input, there should not be any nested directory inside. The SVG files have to be directly inside the input folder. 
- For the folder input, please do not include any non-SVG file inside, or unexpected behavior will occur. 

------------ Limit --------------------------------------------

This parser was built on Client-side HTML, so it uses the browser's local storage to store generated files. If the browser's local storage is full for this session, the parser will time-out. The maximum number of files it can process per folder upload depends on your browser configuration. 

On my machine, it will process the "600" folder in a couple of minutes. For the "5000" folder, it's capable of processing about 1000 SVG files. It really depends on the machine configuration, browser configuration, and SVG file size and complexity. I recommend not having more than 700-900 SVG files inside the upload folder. 
