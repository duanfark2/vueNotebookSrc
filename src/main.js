import './style.css'


import hljs from "highlight.js";
import MarkDownIt from "markdown-it"
import {createApp} from "vue";

let md = new MarkDownIt(`default`, {
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                console.log('<pre class="hljs"><code>' + hljs.highlight(str, {
                    language: lang,
                    ignoreIllegals: true
                }).value + '</code></pre>');
                return '<pre class="hljs"><code>' + hljs.highlight(str, {
                    language: lang,
                    ignoreIllegals: true
                }).value + '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

let Files = [];//所有记事本文件存放的数组，其中元素为对象格式

let fileTplate = {
    fileName: "未命名.md",
    createDate: "2022/9/22",
    updateDate: "2022/9/22",
    updateTime: "11:56",
    title: "",
    contents: []
}//单个文件对象模板示例


// let Htmll = md.render(mark1); e.g.How to use Markdown-it

let initNewFile = (filename = "未命名.md") => {
    //新建文件
    //新建文件操作：新建一个file对象，并保存到文件对象数组中
    let newFile = JSON.parse(JSON.stringify(fileTplate));
    let date = new Date();
    newFile.fileName = filename;
    newFile.createDate = date.getFullYear() + '/' + Number(date.getMonth() + 1) + '/' + date.getDate();
    newFile.updateDate = newFile.createDate;
    //三目运算符进行基本格式控制
    newFile.updateTime = (date.getHours() > 10 ? date.getHours() : '0' + date.getHours()) + ':' + (date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes());
    newFile.title = "请输入标题";
    Files.push(newFile);

    nowEditingFile = Files.length - 1;
    nowEditingCube = 0;
    // console.log(Files);
}

let initFileTag = (id, name) => {
    let certainFile = document.createElement('div');
    certainFile.className = 'certainFile';
    certainFile.dataset.fileIndex = id;
    certainFile.innerHTML =
        `<div class="fileID">` + id + `
            </div>
            <div class="fileName">
               ` + name + `
            </div>`;
    certainFile.onclick = changeCuFile;
    return certainFile;
}

let renderTheFileName = () => {
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    fileName.value = Files[nowEditingFile].fileName;
}

let refreshCellID = () => {
    let realCellID = document.getElementById('realCellID');
    realCellID.innerText = nowEditingCube;
    if (nowEditingCube == null) realCellID.innerText = 'NO'
}

window.ClearFileList = () => {
    let certainFiles = document.getElementsByClassName('certainFile');

    while (certainFiles[0]) {
        certainFiles[0].remove();
    }
    // for (let i = 0; i < length; i++) {
    //     console.log(i,certainFiles[i]);
    //     // console.log(certainFiles[i]);
    //     certainFiles[i].remove();
    // }错误方法 由于certainFiles对象会变化
}

let renderTheFileList = () => {
    let filein;
    let leftSideBar = document.getElementById('leftSideBar');
    // leftSideBar.innerHTML = '';
    window.ClearFileList();
    for (let i = 0; i < Files.length; i++) {
        let fileTag = initFileTag(i, Files[i].fileName);
        // console.log(fileTag);
        leftSideBar.appendChild(fileTag);
    }
    renderTheHlFl();
}


let renderTheHlFl = () => {
    let certainFiles = document.getElementsByClassName('certainFile');
    let theFile = certainFiles[nowEditingFile];
    theFile.style.boxShadow = '0 1px 4px 0px rgba(0, 0, 0, 0.4)';
}

let refreshFileInfo = () => {
    //已实现：更新文件名；待实现：更新文件属性与署名
    let certainFiles = document.getElementsByClassName('certainFile');
    let fileName = certainFiles[nowEditingCube].getElementsByClassName('fileName')[0]
    fileName.innerHTML = Files[nowEditingFile].fileName;
}

let showFullList = () => {
    let tTextLSB = document.getElementById('tTextLSB');
    let titleinLSB = document.getElementById('titleinLSB');
    let certainFiles = document.getElementsByClassName('certainFile');
    let fileNames = document.getElementsByClassName('fileName');
    let index;
    tTextLSB.style.display = 'flex';
    titleinLSB.style.width = '200px';
    for (index = 0; index < certainFiles.length; index++) {
        certainFiles[index].style.width = '201px';
        fileNames[index].style.display = 'flex';
    }
}

let changeCuFile = (e) => {
    //在左侧更换文件时的callback
    let target = e.target
    while (target.className != 'certainFile') {
        target = target.parentNode;
    }
    let cuNumber = Number(target.dataset.fileIndex);
    console.log(cuNumber);
    let certainFiles = document.getElementsByClassName('certainFile');
    let theFile = certainFiles[nowEditingFile];
    theFile.style.boxShadow = '';
    saveAllCubes();
    nowEditingFile = cuNumber;
    replaceTextArea();
    renderTheHlFl();
}

let replaceTextArea = () => {
    //把TextArea清空后，把新Files里的内容渲染进去
    let childInTA = document.getElementById('textArea').childNodes;
    let contents = Files[nowEditingFile].contents
    let typeCubes = document.getElementsByClassName('typeCube');
    while (childInTA[0]) {
        childInTA[0].remove();
    }
    for (let cubeID in contents) {
        addTextCube(cubeID);
        typeCubes[cubeID].innerText = contents[cubeID];
    }
}

let hideFileList = () => {
    let tTextLSB = document.getElementById('tTextLSB');
    let titleinLSB = document.getElementById('titleinLSB');
    let certainFiles = document.getElementsByClassName('certainFile');
    let fileNames = document.getElementsByClassName('fileName');
    let index;
    tTextLSB.style.display = 'none';
    titleinLSB.style.width = '30px';
    for (index = 0; index < certainFiles.length; index++) {
        certainFiles[index].style.width = '30px';
        fileNames[index].style.display = 'none';
    }
}

let addAFile = () => {
    //10.10待改bug
    //保存上一文件的所有内容，新建一个文件对象并放进Files数组中，根据文件内容render文件列表、标题、textArea、（右边栏）
    saveAllCubes();
    initNewFile();
    renderTheFileList();
    renderTheFileName();
    Files[nowEditingFile].contents.push('');
    replaceTextArea();
    focusCube(0);
}

let unfocusCube = (cubeSerial) => {
    //unfocus时并不取消该元素的可编辑性
    let textCubes = document.getElementsByClassName('textCube');
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube != null) {
        nowEditingCube = Number(nowEditingCube);
        textCubes[cubeSerial].getElementsByClassName('inlineEditBar')[0].style.display = 'none';
        textCubes[cubeSerial].getElementsByClassName('highLighted')[0].style.display = 'none';
    } else {
        return
    }
}

let focusCube = (cubeSerial) => {
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    // console.log(nowEditingCube)
    // console.log(cubeSerial)
    if (nowEditingCube != cubeSerial) {
        unfocusCube(nowEditingCube);
        let textCubes = document.getElementsByClassName('textCube');
        textCubes[cubeSerial].getElementsByClassName('inlineEditBar')[0].style.display = 'flex';
        textCubes[cubeSerial].getElementsByClassName('highLighted')[0].style.display = 'flex';
        textCubes[cubeSerial].getElementsByClassName('typeCube')[0].focus();
        nowEditingCube = cubeSerial;
    } else {
        let textCubes = document.getElementsByClassName('textCube');
        textCubes[cubeSerial].getElementsByClassName('inlineEditBar')[0].style.display = 'flex';
        textCubes[cubeSerial].getElementsByClassName('highLighted')[0].style.display = 'flex';
        textCubes[cubeSerial].getElementsByClassName('typeCube')[0].focus();
    }
}

let saveToFile = (text) => {
    //保存nowEditingCube的内容
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    Files[nowEditingFile].contents[nowEditingCube] = text;
}

let saveAllCubes = () => {
    let typeCubes = document.getElementsByClassName('typeCube');
    for (let index = 0; index < typeCubes.length; index++) {
        if (typeCubes[index].contentEditable == 'true') {
            Files[nowEditingFile].contents[index] = typeCubes[index].innerText;
        }
    }
}

let changeToMark = (target) => {
    //将html重新转回md源文件
    let cubeId = target.parentNode.dataset.cubeId
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }

    target.innerHTML = '';
    target.innerText = Files[nowEditingFile].contents[cubeId];
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    target.focus()
}

let callFocusCube = (e) => {
    let target = e.target;
    while (target.className != 'typeCube') {
        target = target.parentNode;
    }
    // console.log(target)
    // console.log(target.parentNode)
    let number = target.parentNode.dataset.cubeId;
    // console.log(number)
    // console.log(nowEditingCube)
    let textCubes = document.getElementsByClassName('textCube');
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    if (target.contentEditable == 'false') {
        // console.log('enen');
        focusCube(number);
        e.preventDefault();
        cloc++;
        setTimeout(() => {
            cloc = 0;
        }, 500)
        if (cloc == 2) {
            target.contentEditable = 'true';
            changeToMark(target);
        }
    } else {
        console.log(nowEditingCube)
        if (nowEditingCube != null) {
            if (document.getElementsByClassName('typeCube')[nowEditingCube].contentEditable == 'true')
                console.log('dd')
            saveToFile(document.getElementsByClassName('typeCube')[nowEditingCube].innerText);
            // console.log('yes')
        }
        focusCube(number);
    }
    refreshCellID();
}

let initTextCube = (cubeId, content = '') => {
    //生成一个textnode元素
    let src;
    let textCube = document.createElement('div');
    textCube.className = 'textCube';
    textCube.dataset.cubeId = cubeId;
    let highlight = document.createElement('div');
    highlight.className = 'highLighted';
    textCube.appendChild(highlight);
    let cubeid = document.createElement('div');
    cubeid.className = 'cubeid';
    let txtNode = document.createTextNode('[' + cubeId + ']:');
    cubeid.appendChild(txtNode);
    textCube.appendChild(cubeid);
    let typeCube = document.createElement('div');
    let textNode = document.createTextNode('');
    typeCube.appendChild(textNode);
    typeCube.innerText = content;
    typeCube.className = 'typeCube';
    typeCube.contentEditable = 'true';
    typeCube.addEventListener('click', callFocusCube);
    textCube.appendChild(typeCube);
    let editBar = document.createElement('div');
    editBar.className = 'inlineEditBar';
    for (src in imgsrc) {
        let img = document.createElement('img');
        img.className = 'inlineIcon';
        img.src = imgsrc[src];
        img.addEventListener('click', clickEvents[src]);
        editBar.appendChild(img);
    }
    textCube.appendChild(editBar);
    return textCube;
}

let initSplitArea = (serialNumber) => {
    //生成splitArea元素
    let splitArea = document.createElement('div');
    splitArea.className = 'splitArea';
    splitArea.dataset.splitId = serialNumber;
    let splitLine = document.createElement('div');
    splitLine.className = 'splitLine';
    splitArea.appendChild(splitLine)
    let addCubeBtn = document.createElement('div');
    addCubeBtn.className = 'addCubeBtn';
    addCubeBtn.addEventListener('click', addCubeInLine);
    let textnode = document.createTextNode('+ Markdown标记语言');
    addCubeBtn.appendChild(textnode);
    splitArea.appendChild(addCubeBtn);
    return splitArea;
}

let addTextCube = (serialNumber, content = '') => {
    //增加textcube：在序号位置前增加一个分割线，后增加textcube，检测是否未最后一个textcube，是则增加最后一个(仅负责DOM)
    serialNumber = Number(serialNumber);
    let textArea = document.getElementById('textArea');
    let splitAreas = document.getElementsByClassName('splitArea');
    let textCubes = document.getElementsByClassName('textCube');

    // Files[nowEditingFile].contents.splice(serialNumber, 0, '');对文件的操作交给各上层函数
    // console.log(Files[nowEditingFile].contents);

    if (!textCubes[serialNumber]) {
        // console.log('yes');
        if (!splitAreas[serialNumber]) {
            let splitArea = initSplitArea(serialNumber);
            textArea.appendChild(splitArea);
        }
        //已改问题：检测与按序插入textcube
        let textCube = initTextCube(serialNumber, content);
        textArea.appendChild(textCube);
        let splitArea = initSplitArea(Number(serialNumber) + 1);
        textArea.appendChild(splitArea);
    } else {
        let textCube = initTextCube(serialNumber, content);
        let splitArea = initSplitArea(serialNumber + 1);
        for (let i = serialNumber; i < textCubes.length; i++) {
            // console.log(textCubes[i].dataset.cubeId)
            textCubes[i].dataset.cubeId++;
            let cubeid = textCubes[i].getElementsByClassName('cubeid');
            cubeid[0].innerText = '[' + textCubes[i].dataset.cubeId + ']:';
            splitAreas[i + 1].dataset.splitId++;
        }
        textArea.insertBefore(textCube, textCubes[serialNumber]);
        textArea.insertBefore(splitArea, textCubes[serialNumber + 1]);
    }
}


let addCubeInLine = (e, directe = null) => {
    //点击分割线上的加号的回调函数
    let target = e.target;
    let snumber;
    nowEditingFile = Number(nowEditingFile);

    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    if (target.className == 'addCubeBtn') {
        snumber = target.parentNode.dataset.splitId;
        // console.log(snumber);
    } else if (target.className == 'option') {
        snumber = nowEditingCube + 1;
    }

    Files[nowEditingFile].contents.splice(snumber, 0, '');

    if (snumber <= nowEditingCube && nowEditingCube) {
        nowEditingCube++;
    }

    addTextCube(snumber);
    // console.log(nowEditingCube);
    refreshCellID();
    // console.log(Files[nowEditingFile].contents);
}

let moveUpCube = (e, directe = null) => {
    //点击将单元格上移
    console.log('wdnmd')
    let target;
    let thisTextCube;
    if (directe == null) {
        target = e.target;
        thisTextCube = target.parentNode.parentNode;
    } else {
        thisTextCube = document.getElementsByClassName('textCube')[directe];
    }
    let textCubes = document.getElementsByClassName('textCube');
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    if (thisTextCube.dataset.cubeId == 0) {
        return
    } else {
        let cubeId = thisTextCube.dataset.cubeId;
        let textArea = thisTextCube.parentNode;
        let preTextCube = textCubes[cubeId - 1];
        let splitAreas = document.getElementsByClassName('splitArea');
        console.log(nowEditingCube)
        let temp = Files[nowEditingFile].contents[nowEditingCube - 1]
        Files[nowEditingFile].contents[nowEditingCube - 1] = Files[nowEditingFile].contents[nowEditingCube];
        Files[nowEditingFile].contents[nowEditingCube] = temp;
        thisTextCube.dataset.cubeId--;
        thisTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + thisTextCube.dataset.cubeId + ']:'
        preTextCube.dataset.cubeId++;
        preTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + preTextCube.dataset.cubeId + ']:';
        textArea.insertBefore(thisTextCube, preTextCube);
        textArea.insertBefore(splitAreas[cubeId], preTextCube);
        nowEditingCube--;
    }
    refreshCellID();
    console.log(Files[nowEditingFile].contents);
}

let moveDownCube = (e, directe = null) => {
    //点击将单元格下移
    // console.log('wdnmd')
    let target;
    let thisTextCube;
    if (directe == null) {
        target = e.target;
        thisTextCube = target.parentNode.parentNode;
    } else {
        thisTextCube = document.getElementsByClassName('textCube')[directe];
    }
    let textCubes = document.getElementsByClassName('textCube');
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    if (thisTextCube.dataset.cubeId == textCubes.length - 1) {
        // console.log('last cube')
        return
    } else {
        let cubeId = thisTextCube.dataset.cubeId;
        cubeId = Number(cubeId);
        let textArea = thisTextCube.parentNode;
        let nexTextCube = textCubes[cubeId + 1];
        let splitAreas = document.getElementsByClassName('splitArea');
        let temp = Files[nowEditingFile].contents[Number(nowEditingCube) + 1];
        Files[nowEditingFile].contents[nowEditingCube + 1] = Files[nowEditingFile].contents[nowEditingCube];
        Files[nowEditingFile].contents[nowEditingCube] = temp;
        thisTextCube.dataset.cubeId++;
        thisTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + thisTextCube.dataset.cubeId + ']:'
        nexTextCube.dataset.cubeId--;
        nexTextCube.getElementsByClassName('cubeid')[0].innerText = '[' + nexTextCube.dataset.cubeId + ']:';
        textArea.insertBefore(nexTextCube, thisTextCube);
        textArea.insertBefore(splitAreas[cubeId + 1], thisTextCube);
        nowEditingCube++;
    }
    refreshCellID();
    console.log(Files[nowEditingFile].contents);
}

let copyCube = (e, directe = null) => {
    let target;
    let snumber;
    if (directe == null) {
        target = e.target.parentNode.parentNode;
    } else {
        target = document.getElementsByClassName('textCube')[directe]
    }
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }

    // console.log(nowEditingCube)
    console.log(Files[nowEditingFile].contents);
    Files[nowEditingFile].contents.splice(nowEditingCube + 1, 0, Files[nowEditingFile].contents[nowEditingCube]);

    let textInLast = target.getElementsByClassName('typeCube')[0].innerText;
    snumber = Number(target.dataset.cubeId);
    addTextCube(snumber + 1, textInLast);

    console.log(Files[nowEditingFile].contents);
}

let deleteCube = (e, directe = null) => {
    let target;
    if (e == '' && directe == null) {
        return;
    } else if (directe == null) {
        target = e.target;
        console.log(e);
        target = target.parentNode.parentNode;
    } else {
        target = document.getElementsByClassName('textCube')[directe];
    }
    let cubeId = Number(target.dataset.cubeId);
    let textCubes = document.getElementsByClassName('textCube');
    let splitAreas = document.getElementsByClassName('splitArea');
    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }


    Files[nowEditingFile].contents.splice(nowEditingCube, 1);

    for (let i = cubeId + 1; i < textCubes.length; i++) {
        textCubes[i].dataset.cubeId--;
        let cubeid = textCubes[i].getElementsByClassName('cubeid')[0];
        cubeid.innerText = '[' + textCubes[i].dataset.cubeId + ']:';
        splitAreas[i + 1].dataset.splitId--;
    }
    splitAreas[cubeId + 1].remove();
    target.remove();
    nowEditingCube = null;
    console.log(nowEditingCube)
    console.log(Files[nowEditingFile].contents);
    refreshCellID();
}

let runCode = (e, directe = null) => {

    nowEditingFile = Number(nowEditingFile);
    if (nowEditingCube) {
        nowEditingCube = Number(nowEditingCube);
    }
    let target;
    if (directe == null) {
        target = e.target;
        target = target.parentNode.parentNode;
    } else {
        target = document.getElementsByClassName('textCube')[directe];
    }
    let originText = target.getElementsByClassName('typeCube')[0].innerText;


    if (target.getElementsByClassName('typeCube')[0].contentEditable != 'false') {
        //待改
        Files[nowEditingFile].contents[target.dataset.cubeId] = originText;
        let transText = md.render(originText);
        target.getElementsByClassName('typeCube')[0].innerHTML = transText;
        target.getElementsByClassName('typeCube')[0].contentEditable = 'false';
    }
    console.log(Files[nowEditingFile].contents);
}

window.GetQueryString = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = decodeURIComponent(window.location.search).substring(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

let getSessions = () => {
    if (window.GetQueryString('userID')) {
        UserID = window.GetQueryString('userID')
    }
    if (window.GetQueryString('userName')) {
        UserName = window.GetQueryString('userName')
    }
}

let setProfile = () => {
    let icon = document.getElementById('icon')
    icon.innerText = UserID[0];
    let username = document.getElementById('username')
    username.innerText = UserName;
}

let firstTimeInitialize = () => {
    //第一次打开时需要进行的初始化工作
    //1检查文件对象数组中是否有对象，若有则根据数组进行render（由于没有后端可省略）
    //2没有则新建一个空文件并render
    //3具体render：将文件名填入顶框；将文件列表显示在左侧栏；在中间内容新建一个文本框并focus；更新右边栏序号；
    initNewFile();
    Files[nowEditingFile].contents.push('');
    addTextCube(0);
    renderTheFileName();
    focusCube(0);
    refreshCellID();
    renderTheFileList();
    getSessions();
    setProfile();
}

let fileName = document.getElementById('fileName');
let nowEditingFile = null;//当前正在编辑的文件索引
let nowEditingCube = null;//当前正在编辑的文本框序号
let nowEditing = 0;//已废弃的变量，原指当前正在编辑的文件索引
let haveClickedFileInput = false;//是否点击了文件命名框
let UserID = 'U'
let UserName = '未知用户'
let ifFopOpen = [false, false, false];
let imgsrc = ['img/arrow_up.svg', 'img/arrow_down.svg', 'img/content_copy.svg', 'img/delete.svg', 'img/play_arrow.svg']
let clickEvents = [moveUpCube, moveDownCube, copyCube, deleteCube, runCode]
let cloc = 0;//双击时钟记录
let topEIcon = document.getElementsByClassName('topEdit');
let leftSideBar = document.getElementById('leftSideBar');
let timeStop1, timeStop2;
window.Files = Files;


//==================================⬆变/常量/定义⬇vue组件=========================

const menuBar = {
    data() {
        return {
            firstLevelMenu: {
                "文件": 'file-option',
                "编辑": 'edit-option',
                "设置": 'settings-option'
            },
            secondLevelMenu: [
                [
                    "新建",
                    "保存",
                    "打印"
                ],
                [
                    "在上方新增单元格(bug)",
                    "在下方新增单元格",
                    "上移单元格",
                    "下移单元格",
                    "删除单元格"
                ],
                {
                    "字体大小":[
                        '9px',
                        '14px',
                        '18px',
                        '22px'
                    ],
                    "主题选择":[
                        '白色日间',
                        '深邃夜间'
                    ]
                }
            ],
            secondIndex: [
                [
                    1,
                    2,
                    3
                ],
                [
                    4,
                    5,
                    6,
                    7,
                    8
                ],
                {
                    "字体大小":9,
                    "主题选择":10
                }
            ],
        }
    }
}

const MenuApp = createApp(menuBar);
let menubar = MenuApp.mount('#menu-bar')

//==================================⬆vue组件⬇执行/监听语句=========================

firstTimeInitialize();


// console.log(topEIcon);
topEIcon[0].addEventListener('click', () => {
    clickEvents[0]('', nowEditingCube);
})
topEIcon[1].addEventListener('click', () => {
    clickEvents[1]('', nowEditingCube);
})
topEIcon[2].addEventListener('click', () => {
    clickEvents[2]('', nowEditingCube);
})
topEIcon[3].addEventListener('click', () => {
    clickEvents[3]('', nowEditingCube);
})
topEIcon[4].addEventListener('click', () => {
    clickEvents[4]('', nowEditingCube);
})

document.getElementById('op1').onclick = addAFile;

document.getElementById('op5').onclick = (e) => {
    addCubeInLine(e)
}

document.getElementById('op6').onclick = () => {
    moveUpCube('', nowEditingCube);
}

document.getElementById('op7').onclick = () => {
    moveDownCube('', nowEditingCube);
}

leftSideBar.onmouseover = function (e) {
    let target = document.getElementById('leftSideBar');
    clearInterval(timeStop2);
    timeStop2 = null
    if (!timeStop1) {
        timeStop1 = setInterval(function () {
            target.style.width = target.clientWidth + 5 + 'px';
            if (target.clientWidth >= 240) {
                clearInterval(timeStop1);
                timeStop1 = null;
                target.style.width = 240 + 'px';
                showFullList();
            }
        }, 1)
    }
}

leftSideBar.onmouseleave = function (e) {
    let target = document.getElementById('leftSideBar');
    clearInterval(timeStop1);
    timeStop1 = null;
    if (!timeStop2) {
        hideFileList();
        timeStop2 = setInterval(function () {
            target.style.width = target.clientWidth - 5 + 'px';
            if (target.clientWidth <= 50) {
                clearInterval(timeStop2);
                timeStop2 = null;
                target.style.width = 50 + 'px';
                hideFileList();
            }

        }, 1)
    }
}


document.body.onmousedown = (e) => {
    if (e.target.id != 'fileName') {
        if (haveClickedFileInput) {
            haveClickedFileInput = false;
            Files[nowEditingFile].fileName = fileName.value;//修改记录的文件名
            console.log("已保存标题", Files[nowEditing].fileName);
            refreshFileInfo();//暂定
        }
    } else {
        haveClickedFileInput = true;
    }
    if (e.target.className == 'options') {
        console.log(e.target.id);
        let target = e.target;
        let numOfOption = 0;
        while (target != null) {
            console.log(target)
            target = target.previousSibling;
        numOfOption++;
        //获取当前选项是第几个
    }
    numOfOption = numOfOption -2 ;
    let opall = document.querySelectorAll('.optionAll');
    //二级菜单栏列表
    let ops = document.querySelectorAll('.options');
        //一级菜单列表
        console.log(numOfOption);
        if (ifFopOpen[numOfOption]) {
            //如果点击菜单栏时该菜单栏是开启状态，则关闭所有菜单栏
            ifFopOpen = [false, false, false];
            ifFopOpen[numOfOption] = false;
            for (let i = 0; i < 3; i++) {
                opall[i].style.display = 'none';
                ops[i].style.cssText = '';
            }
            console.log('close')
        } else {
            //如果点击菜单栏时该菜单栏不是打开状态，则关闭其他菜单栏，打开该菜单栏
            ifFopOpen = [false, false, false];
            ifFopOpen[numOfOption] = true;
            for (let i = 0; i < 3; i++) {
                opall[i].style.display = 'none';
                ops[i].style.cssText = '';

            }
            e.target.style.cssText = `
        background-color: white;
        border-radius: 0;
        border: 1px solid #dadada;
        box-shadow: 0px -4px 10px 0px rgba(0,0,0,0.2);
        `
            console.log(e.target.parentNode);
            console.log(numOfOption)
            opall[numOfOption - 1].style.display = 'flex';
            console.log('open')
        }
    }
}