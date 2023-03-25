const COLOR = {
    '#000000': 'Black',
    '#ff0000': 'Red',
    '#0000ff': 'Blue',
    '#00ff00': 'Green',
    '#ff007f': 'Pink',
    '#ffff00': 'Yellow',
    '#ffffff': 'White'
}


const input = document.querySelector("#fileInput");
const inputGroup = document.querySelector("#getInput")
const result = document.querySelector("#result");
const show = document.querySelector("#show");
const buttonGroup = document.querySelector("#button-group");
const exportFileJson = document.querySelector("#export-json");
const newSubmit = document.querySelector("#new-submit");
// Give the file input button an action listener. As the user inputs an SVG File, the handleFile function executes. 
input.addEventListener("change", handleFile);
const folderInput = document.querySelector("#folderInput");
// Give the folder input button an action listener. As the user inputs an SVG File, the handleFile function executes. 
folderInput.addEventListener("change", handleFolder);


// This function will trigger when the user inputs a single SVG file. 
function handleFile() {
    let pathNum = 1;
    const reader = new FileReader();
    const fileName = this.files[0].name.replace(/\.[^/.]+$/, "");
    // When the reader reads the SVG file successfully, this function will trigger. 
    reader.onload = (e) => {
        inputGroup.style.visibility = "hidden";
        buttonGroup.style.visibility = "visible";
        exportFileJson.addEventListener('click', () => { exportJson(JSON.stringify(svgObject, null, 4), fileName, 'text/plain') });
        newSubmit.addEventListener('click', () => (window.location.reload()));

        let svgData = e.target.result;
        let parser = new DOMParser();
        let doc = parser.parseFromString(svgData, "image/svg+xml");
        const svg = doc.querySelector("svg");
        const svgObject = new SVG_File(fileName, svg.getAttribute('width'), svg.getAttribute('height'));
        show.appendChild(svg);
        const paths = document.querySelectorAll("path");

        for (let path of paths) {
            const path_object = parsePath(path, pathNum);

            const bboxObject = path.getBBox();
            const { x, y, height, width } = bboxObject;
            path_object.bounding_box = new PATH_BBOX(x, y, height, width);

            let command = path.attributes.d.textContent;
            let parsedCommandArray = sliceCommandsToArray(command);

            let button = document.createElement("button");
            button.setAttribute("class", "btn btn-primary mb-2 mr-2");
            button.setAttribute("type", "button");
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", `#pathNo${pathNum}`);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", "");
            button.innerText = `Click to see Path No.${pathNum}:`

            result.appendChild(button);

            let displayPath = document.createElement("div");
            displayPath.setAttribute("class", "collapse");
            displayPath.setAttribute("id", `pathNo${pathNum}`);

            let cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card card-body");


            let pathTopic = document.createElement("h4");
            pathTopic.append(`Path No.${pathNum}:`);
            cardBody.append(pathTopic);


            const styleDiv = document.createElement("div");
            styleDiv.style.marginBottom = '0.3rem';
            const styleLabel = document.createElement("p");
            styleLabel.innerHTML = "<b> Styles: </b>";
            styleLabel.style.marginBottom = "0px";
            let style = path.attributes.style.textContent;

            styleDiv.append(styleLabel);
            styleDiv.append(style);
            cardBody.append(styleDiv);

            const pathDiv = document.createElement("div");
            pathDiv.style.marginBottom = '0.3rem';
            const pathLabel = document.createElement("p");
            pathLabel.style.marginBottom = "0px";
            pathLabel.innerHTML = "<b> Commands: </b>";
            pathDiv.append(pathLabel);
            for (let oneCommand of parsedCommandArray) {
                let p = document.createElement("div");
                p.append(oneCommand);
                pathDiv.append(p);
                const command_object = parseCommand(oneCommand);
                path_object.operations.push(command_object);
            }
            cardBody.appendChild(pathDiv);



            const path_Json = JSON.stringify(path_object, null, 4);
            svgObject.paths.push(path_object);

            let newBBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            newBBox.setAttribute("x", x);
            newBBox.setAttribute("y", y);
            newBBox.setAttribute("height", height);
            newBBox.setAttribute("width", width);
            newBBox.setAttribute("style", "fill: none; stroke: #ffa500; stroke-width: 0.5");


            const bboxDiv = document.createElement("div");
            bboxDiv.style.marginBottom = "0.3rem";
            const bboxlabel = document.createElement("p");
            bboxlabel.style.marginBottom = '0px';
            bboxlabel.innerHTML = "<b> Path Bounding Box: </b>";
            bboxDiv.append(bboxlabel);
            cardBody.append(bboxlabel);
            bboxDiv.append(`x: ${x}, y: ${y}, height: ${height}, width: ${width}`);
            cardBody.append(bboxDiv);

            const checkBoxInput = document.createElement("input");
            checkBoxInput.setAttribute("type", "checkbox");
            checkBoxInput.setAttribute("id", `boundingbox${pathNum}`);
            const checkBoxLabel = document.createElement("label");
            checkBoxLabel.setAttribute("for", `boundingbox${pathNum}`);
            checkBoxLabel.innerHTML = "<b>Show Bounding Box</b>";
            checkBoxInput.addEventListener("change", (e) => {
                if (e.currentTarget.checked) {
                    svg.appendChild(newBBox);

                } else {
                    newBBox.remove();
                }
            })
            cardBody.append(checkBoxLabel);
            cardBody.append(checkBoxInput);

            let newHighlight = document.createElementNS("http://www.w3.org/2000/svg", "path");

            newHighlight.setAttribute("d", path.attributes.d.textContent);
            newHighlight.setAttribute("style", "fill: none; stroke: #e151af; stroke-width: 1.5");

            const highlightBoxInput = document.createElement("input");
            highlightBoxInput.setAttribute("type", "checkbox");
            highlightBoxInput.setAttribute("id", `hightlight${pathNum}`);
            const highlightBoxLabel = document.createElement("label");
            highlightBoxLabel.setAttribute("for", `hightlight${pathNum}`);
            highlightBoxLabel.innerHTML = "<b>Highlight this path</b>";
            highlightBoxInput.addEventListener("change", (e) => {
                if (e.currentTarget.checked) {
                    svg.appendChild(newHighlight);
                } else {
                    newHighlight.remove();
                }
            })
            cardBody.appendChild(highlightBoxLabel);
            cardBody.appendChild(highlightBoxInput);
            const pathJsonButton = document.createElement("button");
            pathJsonButton.setAttribute("type", "button");
            pathJsonButton.setAttribute("class", "btn btn-success btn-sm mt-2 mb-2 ml-2 mr-2");
            pathJsonButton.innerText = "Export JSON File for this Path";
            pathJsonButton.addEventListener("click", () => (exportJson(path_Json, `Path_${path_object.id}`, "text/plain")));
            cardBody.appendChild(pathJsonButton);
            displayPath.appendChild(cardBody);
            result.appendChild(displayPath);
            pathNum++;
        }
        reader.onerror = (err) => {
            alert("An Error Occured", err);
        }
    }
    reader.readAsText(this.files[0]);
}

// This function will trigger when the user inputs a folder of SVG files
async function handleFolder(event) {
    // JSZip is an external package helping us generate the zip file and add files inside. 
    let fileNum = 1;
    let zip = new JSZip();
    const folderName = event.target.files[0].webkitRelativePath.split("/")[0];
    let fileArray = Array.from(event.target.files);
    // For each file inside the input folder, the function inside Array.map() will execute. 
    const folderPromises = fileArray.map((aFile) => {
        //This is asynchronous JavaScript. Because processing all the SVG files takes time, 
        //we have to wait until all the file processing is done so that the zip file can be downloaded, or it will be an empty zip file. 
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            const fileName = aFile.name.replace(/\.[^/.]+$/, "");
            reader.onload = e => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(e.target.result, "image/svg+xml");
                const svg = doc.querySelector("svg");
                const svgObject = new SVG_File(fileName, svg.getAttribute('width'), svg.getAttribute('height'));
                show.appendChild(svg);
                const paths = document.querySelectorAll("path");
                let pathNum = 1;
                for (let path of paths) {
                    const path_object = parsePath(path, pathNum);
                    const bboxObject = path.getBBox();
                    const { x, y, height, width } = bboxObject;
                    path_object.bounding_box = new PATH_BBOX(x, y, height, width);
                    let command = path.attributes.d.textContent;
                    let parsedCommandArray = sliceCommandsToArray(command);
                    for (let oneCommand of parsedCommandArray) {
                        const command_object = parseCommand(oneCommand);
                        path_object.operations.push(command_object);
                    }
                    svgObject.paths.push(path_object);
                    pathNum++;
                }
                let objectJson = JSON.stringify(svgObject, null, 4);

                zip.file(`${fileName}.txt`, objectJson);
                console.log(`${fileName} processed`);
                console.log(fileNum);
                fileNum++;
                show.removeChild(svg);
                resolve("success");
            }
            reader.onerror = (err) => {
                reject(err);
            }
            reader.readAsText(aFile);
        })
    })
    //Wait for the previous processing to be done; after the "await" returns, the next piece of code will then execute. 
    await Promise.all(folderPromises);
    // Save the generated zip file to the user's device. 
    zip.generateAsync({ type: 'blob' })
        .then(blob => {
            saveAs(blob, `${folderName}.zip`);
            window.location.reload();
        })
        .catch(e => {
            console.log("error", e);
        })
}

// This function takes the command string (from the d attribute) and slices all the commands into an array. Each array element represents a command. 

function sliceCommandsToArray(command) {
    for (let i = 0; i < command.length; i++) {
        if (command[i] == "z") {
            command = command.slice(0, i + 1) + ' ' + command.slice(i + 1);
        }
    }
    const parsedCommandArray = command.split("  ");
    if (!parsedCommandArray[parsedCommandArray.length - 1]) {
        parsedCommandArray.pop();
    }
    return parsedCommandArray;
}



/*
This path takes an SVG Path element(returned using document.querySelector/document.getElementById) and its id as arguments. 
Return an SVG_PATH object with the id and color field set. 
*/
const parsePath = (path, pathNum) => {
    const style = path.getAttribute('style');
    const styleArray = style.split("; ");
    let color = null;
    for (let el of styleArray) {
        const subArray = el.split(': ');
        if ((subArray[0] === 'fill' && subArray[1] != 'none') || subArray[0] === 'stroke') {
            //console.log(subArray[1]);
            color = COLOR[subArray[1]];
        }
    }
    const path_object = new SVG_PATH(pathNum, color);
    return path_object;
}

// This function will take an SVG command(operation) of a path, parse it, and return a command object. 
const parseCommand = (command) => {
    const commandArray = command.split(' ');
    let command_object = new Unknown();
    switch (commandArray[0]) {
        case "m":
        case "M":
            command_object = new Move_To(commandArray[1], commandArray[2]);
            break;
        case "l":
        case "L":
            command_object = new Line_To(commandArray[1], commandArray[2]);
            break;
        case 'q':
        case 'Q':
            command_object = new Quad_Bezier(commandArray[1], commandArray[2], commandArray[3], commandArray[4]);
            break;
        case 'c':
        case 'C':
            command_object = new Cubic_Bezier(commandArray[1], commandArray[2], commandArray[3], commandArray[4], commandArray[5], commandArray[6]);
            break;
        case 'z':
        case 'Z':
            command_object = new Close_path();
            break;
    }
    return command_object;
}


/*
This function is the callback function for downloading files. 
This function takes three arguments. As string as export file content, an export file content name, and an export file type. 
*/
const exportJson = (data, fileName, exportType) => {
    const a = document.createElement("a");
    const jsonFile = new Blob([data], { type: exportType })
    a.href = URL.createObjectURL(jsonFile);
    a.download = fileName;
    a.click();
}


//////////                Classes              //////////////////////////

// The whole SVG file class
class SVG_File {
    constructor(fileName, width, height) {
        this.filename = fileName;
        this.width = width;
        this.height = height;
        this.paths = [];
    }
}

//The bounding box class. x, y are the bottom-left corner (x,y) coordinate. 
//   --------------------
// h |                  |
// e |                  |
// i |                  |
// g |                  |
// h |                  |
// t |                  |
//   |                  |
//   |------------------|
//  (x, y)    width
class PATH_BBOX {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}


/*
The path class. Id is the number of the path inside the file. 
Color is one of the colors {black, red, blue, green, pink, yellow, white}. 
Operation is an array of operation objects, and bounding_box is the bounding box object. 
*/
class SVG_PATH {
    constructor(id, color) {
        this.id = id;
        this.color = color;
        this.operations = [];
        this.bounding_box = null;
    }
}

class Move_To {
    constructor(x, y) {
        this.name = 'Move To';
        this.x = x;
        this.y = y;
    }
}

/////////// Operation Classes //////////////////

class Line_To {
    constructor(x, y) {
        this.name = 'Line To';
        this.x = x;
        this.y = y;
    }
}

class Quad_Bezier {
    constructor(cx, cy, x, y) {
        this.name = 'Quadratic Bezier';
        this.cx = cx;
        this.cy = cy;
        this.x = x;
        this.y = y;
    }
}

class Cubic_Bezier {
    constructor(cx1, cy1, cx2, cy2, x, y) {
        this.name = 'Cubic Bezier';
        this.cx1 = cx1;
        this.cy1 = cy1;
        this.cx2 = cx2;
        this.cy2 = cy2;
        this.x = x;
        this.y = y;
    }
}

class Close_path {
    constructor() {
        this.name = 'Close Path';
    }

}

class Unknown {
    constructor() {
        this.name = 'UNKNOWN';
    }
}