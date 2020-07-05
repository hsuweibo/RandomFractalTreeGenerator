const canvas = document.getElementById("cv");
const generateBtn = document.querySelector(".generate-tree-btn");
// This holds the middle, verticle Y position of the generate button.
let generateBtnMiddleY = parseFloat(window.getComputedStyle(generateBtn).bottom) + parseFloat(window.getComputedStyle(generateBtn).height)/2;

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;


/** Fixed constants */
const BLUR = 5;
const SPLIT_ANGLE = 25; // determines the angle of the new sub-branch when a branch splits
const ANGLE_VARIANCE = 20; // determines the amount of randomness added to split_angle
const SHRINK_FACTOR = 0.8; //determines how much each sub-branch shrinks in terms of length and width

/** dimension-dependent constants. These will change on window resize, so that the app is somewhat responsive */
let WIGGLE_VARIANCE = canvas.width / 100; //determines how much each branch twists
let BRANCH_LEN_VARIANCE = canvas.height / 50;  //determines the amount of randomness added to each branch's length
let ROOT_BRANCH_LEN = Math.min(canvas.height / 5.5, canvas.width * 0.15);
let ROOT_BRANCH_WIDTH = canvas.width * 0.03;
let BRANCH_WIDTH_VARIANCE = canvas.width * 0.015;  //determines the amount of randomness added to each branch's width
let MIN_BRANCH_WIDTH = canvas.width / 1000; 
let MIN_BRANCH_LEN = canvas.height / 80;


function toRadian(degree){
    return (degree * Math.PI / 180);
}

/**
 * draw a fractal tree, with some added randomness.
 * @param {Number} startX the x position of the root
 * @param {Number} startY the y position of the root
 * @param {Number} branchWidth the width of the root branch
 * @param {Number} len the length of the root branch
 * @param {String} branchColor color of all branches in the tree
 * @param {String} leafColor color of the leaves
 * @param {String} shadowColor color of the branches' shadow
 */
function drawTree(startX, startY, branchWidth, len, branchColor, leafColor, shadowColor){
    // This hold the position of all the leaves.
    let leaves = [];

    /**
     * draws the branches of a sub-tree. baseDegree is the tilting degree of the root branch. the baseDegree starts at 0 from the 12 oclock, and grows in clockwise-direction.
     */
    function drawTreeHelper(startX, startY, branchWidth, len, baseDegree){
        if (len > MIN_BRANCH_LEN && branchWidth > MIN_BRANCH_WIDTH){
            const degree = baseDegree + getRandomNum(-ANGLE_VARIANCE, ANGLE_VARIANCE);
            const destX = startX + Math.cos(toRadian(90 - degree)) * len;
            const destY = startY - Math.sin(toRadian(90 - degree)) * len;
            ctx.save();
            ctx.translate(startX, startY);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.rotate(toRadian(degree));
            
            const cp1x = getRandomNum(-WIGGLE_VARIANCE, WIGGLE_VARIANCE);
            const cp2x = getRandomNum(-WIGGLE_VARIANCE, WIGGLE_VARIANCE);
            const cp1y = getRandomNum(0.25, 0.75) * (-len);
            const cp2y = getRandomNum(0.25, 0.75) * (-len);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, 0, -len);
            
            ctx.lineWidth = branchWidth;
            ctx.strokeStyle = branchColor;
            ctx.shadowBlur = BLUR;
            ctx.shadowColor = shadowColor;
            ctx.stroke();
            ctx.restore();
    
            drawTreeHelper(destX, destY, branchWidth * SHRINK_FACTOR, len * SHRINK_FACTOR, degree + SPLIT_ANGLE);
            drawTreeHelper(destX, destY, branchWidth * SHRINK_FACTOR, len * SHRINK_FACTOR, degree - SPLIT_ANGLE);
        }else{
            leaves.push({x: startX, y: startY});
        }
    }

    drawTreeHelper(startX, startY, branchWidth, len, 0);
    
    for (let l of leaves){
        drawLeaf(l.x, l.y, leafColor);
    }
}

/**
 * draw a leaf stemming from the given x y position. The stemming angle is random.
 * @param {Number} startX 
 * @param {Number} startY 
 * @param {String} leafColor 
 */
function drawLeaf(startX, startY, leafColor){
    const radiusX = getRandomNum(3, 6);
    const radiusY = getRandomNum(1, 3);
    const rotationAngle = getRandomNum(0, 2 * Math.PI);
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(rotationAngle);
    ctx.moveTo(0, 0);
    ctx.beginPath();
    ctx.ellipse(0 + radiusX, 0, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = leafColor
    ctx.fill();
    ctx.restore();
}



function drawRandomTree(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let branchColor = getRandomColor();
    let leafColor = getRandomLeafColor();
    let shadowColor = getRandomColor();
    let branchWidth = ROOT_BRANCH_WIDTH + getRandomNum(-BRANCH_WIDTH_VARIANCE, BRANCH_WIDTH_VARIANCE);
    let len = ROOT_BRANCH_LEN + getRandomNum(-BRANCH_LEN_VARIANCE, BRANCH_LEN_VARIANCE);
    const startY = canvas.height - generateBtnMiddleY; 
    
    drawTree(canvas.width/2, startY, branchWidth, len, branchColor, leafColor, shadowColor);
    
    generateBtn.style.backgroundColor = branchColor;
    generateBtn.style.boxShadow = "0px 0px " + BLUR +"px 0px " + shadowColor;
}



function getRandomColor(){
    return 'rgb('  + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random()*255 + ')';
}

function getRandomLeafColor(){
    return 'rgb('  + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random()*255 + ', 0.7)';
}


/**
 * Get a random number within the specified range.
 */
function getRandomNum(min, max){
    const diff = max - min;
    return Math.random() * diff + min;
}

generateBtn.addEventListener('click', drawRandomTree);


window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateBtnMiddleY = parseFloat(window.getComputedStyle(generateBtn).bottom) + parseFloat(window.getComputedStyle(generateBtn).height)/2;
    
    // update all dimension-dependent constants.
    WIGGLE_VARIANCE = canvas.width / 100;
    BRANCH_LEN_VARIANCE = canvas.height / 50;
    ROOT_BRANCH_LEN = Math.min(canvas.height / 5.5, canvas.width * 0.15);
    ROOT_BRANCH_WIDTH = canvas.width * 0.03;
    BRANCH_WIDTH_VARIANCE = canvas.width * 0.015;
    MIN_BRANCH_WIDTH = canvas.width / 1000;
    MIN_BRANCH_LEN = canvas.height / 80;
});