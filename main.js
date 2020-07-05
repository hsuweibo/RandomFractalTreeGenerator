const canvas = document.getElementById("cv");
const generateBtn = document.querySelector(".generate-tree-btn");
const generateBtnMiddleY = parseFloat(window.getComputedStyle(generateBtn).bottom) + parseFloat(window.getComputedStyle(generateBtn).height)/2;
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const BRANCH_COLOR = 'darkseagreen';
const LEAVES_COLOR = 'blue';
const HORIZONTAL_VARIANCE = 50;
const ANGLE_VARIANCE = 20;

function toRadian(degree){
    return (degree * Math.PI / 180);
}

function drawTree(startX, startY, branchWidth, len, splitAngle, branchColor, leafColor, shadowColor){
    let leaves = [];
    function drawTreeHelper(startX, startY, branchWidth, len, baseDegree){
        if (len > 10 && branchWidth > 2){
            const degree = baseDegree + (Math.random() * ANGLE_VARIANCE - ANGLE_VARIANCE/2);
            const destX = startX + Math.cos(toRadian(90 - degree)) * len;
            const destY = startY - Math.sin(toRadian(90 - degree)) * len;
            ctx.save();
            ctx.translate(startX, startY);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.rotate(toRadian(degree));
            
            const cp1x = Math.random()* HORIZONTAL_VARIANCE - HORIZONTAL_VARIANCE/2;
            const cp2x = Math.random()* HORIZONTAL_VARIANCE - HORIZONTAL_VARIANCE/2;
            const cp1y = (Math.random()* 0.5 + 0.25) * (-len);
            const cp2y = (Math.random()* 0.5 + 0.25) * (-len);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, 0, -len);
            
            ctx.lineWidth = branchWidth;
            ctx.strokeStyle = branchColor;
            ctx.shadowBlur = 5;
            ctx.shadowColor = shadowColor;
            ctx.stroke();
            ctx.restore();
    
            drawTreeHelper(destX, destY, branchWidth*0.75, len*0.8, degree + splitAngle);
            drawTreeHelper(destX, destY, branchWidth*0.75, len*0.8, degree - splitAngle);
        }else{
            leaves.push({x: startX, y: startY});
        }
    }

    drawTreeHelper(startX, startY, branchWidth, len, 0);
    
    for (let l of leaves){
        ctx.beginPath()
        ctx.arc(l.x, l.y, 1, 0, 2* Math.PI);
        ctx.closePath();
        ctx.fillStyle = leafColor;
        ctx.fill();
    }
}


function drawRandomTree(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let branchColor = getRandomColor();
    let leafColor = getRandomColor();
    let shadowColor = getRandomColor();
    let branchWidth = 50 + (Math.random() * 20 - 10);
    let splitAngle = 25+ Math.random() * 20 - 10;
    let len = 180 + (Math.random() * 40 - 20);
    const startY = canvas.height - generateBtnMiddleY; 
    drawTree(canvas.width/2, startY, branchWidth, len, splitAngle, branchColor, leafColor, shadowColor);
    
    generateBtn.style.backgroundColor = branchColor;
}

function getRandomColor(){
    return 'rgb('  + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random()*255 + ')';
}

drawRandomTree();

generateBtn.addEventListener('click', drawRandomTree);

