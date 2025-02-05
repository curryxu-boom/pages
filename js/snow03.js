/* 控制下雪 */
function snowFall(snow) {
    console.log('下雪初始化', snow)
    /* 可配置属性 */
    snow = snow || {};
    this.maxFlake = snow.maxFlake || 300;   /* 最多片数 */
    this.flakeSize = snow.flakeSize || 10;  /* 雪花形状 */
    this.fallSpeed = snow.fallSpeed || 1;   /* 坠落速度 */
}

/* 兼容写法 */
requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
        setTimeout(callback, 1000 / 60);
    };

cancelAnimationFrame = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.oCancelAnimationFrame;
/* 开始下雪 */
snowFall.prototype.start = function () {
    /* 创建画布 */
    snowCanvas.apply(this);
    /* 创建雪花形状 */
    createFlakes.apply(this);
    /* 画雪 */
    drawSnow.apply(this)
}

function getClientHeight() {
    var clientHeight = document.body?.clientHeight;
    console.log('---------获取body高度', clientHeight)
    if (clientHeight && clientHeight > 0) {
        return clientHeight
    }
    return getClientHeight()
}

/* 创建画布 */
function snowCanvas() {
    /* 添加Dom结点 */
    var snowcanvas = document.createElement("canvas");
    snowcanvas.id = "snowfall";
    snowcanvas.width = window.innerWidth;
    // snowcanvas.height = document.body.clientHeight;
    snowcanvas.height = getClientHeight();
    snowcanvas.setAttribute("style", "position:absolute; top: 0; left: 0; z-index: 1; pointer-events: none;");
    // snowcanvas.height = window.innerHeight;
    // snowcanvas.setAttribute("style", "position:flex; top: 0; left: 0; z-index: 1; pointer-events: none;");

    document.getElementsByTagName("body")[0].appendChild(snowcanvas);
    this.canvas = snowcanvas;
    this.ctx = snowcanvas.getContext("2d");
    /* 窗口大小改变的处理 */
    window.onresize = function () {
        snowcanvas.width = window.innerWidth;
        /* snowcanvas.height = window.innerHeight */
    }
}

/* 雪运动对象 */
function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
    this.x = Math.floor(Math.random() * canvasWidth);   /* x坐标 */
    this.y = Math.floor(Math.random() * canvasHeight);  /* y坐标 */
    this.size = Math.random() * flakeSize + 2;          /* 形状 */
    this.maxSize = flakeSize;                           /* 最大形状 */
    this.speed = Math.random() * 1 + fallSpeed;         /* 坠落速度 */
    this.fallSpeed = fallSpeed;                         /* 坠落速度 */
    this.velY = this.speed;                             /* Y方向速度 */
    this.velX = 0;                                      /* X方向速度 */
    this.stepSize = Math.random() / 30;                 /* 步长 */
    this.step = 0                                       /* 步数 */
}

flakeMove.prototype.update = function () {
    var x = this.x,
        y = this.y;
    /* 左右摆动(余弦) */
    this.velX *= 0.98;
    if (this.velY <= this.speed) {
        this.velY = this.speed
    }
    this.velX += Math.cos(this.step += .05) * this.stepSize;

    this.y += this.velY;
    this.x += this.velX;
    /* 飞出边界的处理 */
    if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
        this.reset(canvas.width, canvas.height)
    }
};
/* 飞出边界-放置最顶端继续坠落 */
flakeMove.prototype.reset = function (width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = 0;
    this.size = Math.random() * this.maxSize + 2;
    this.speed = Math.random() * 1 + this.fallSpeed;
    this.velY = this.speed;
    this.velX = 0;
};
// 渲染雪花-随机形状（此处可修改雪花颜色！！！）
flakeMove.prototype.render = function (ctx, change01 = false) {
    var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    if (change01) {
        snowFlake.addColorStop(0, "rgba(175, 218, 239, 0.9)");  /* 此处是雪花颜色，默认是白色 */
        snowFlake.addColorStop(.5, "rgba(175, 218, 239, 0.5)"); /* 若要改为其他颜色，请自行查 */
        snowFlake.addColorStop(1, "rgba(175, 218, 239, 0)");    /* 找16进制的RGB 颜色代码。 */
    } else {
        snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");  /* 此处是雪花颜色，默认是白色 */
        snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)"); /* 若要改为其他颜色，请自行查 */
        snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");    /* 找16进制的RGB 颜色代码。 */
    }
    ctx.save();
    ctx.fillStyle = snowFlake;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};

/* 创建雪花-定义形状 */
function createFlakes() {
    var maxFlake = this.maxFlake,
        flakes = this.flakes = [],
        canvas = this.canvas;
    for (var i = 0; i < maxFlake; i++) {
        flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed))
    }
}

/* 画雪 */
function drawSnow() {
    var maxFlake = this.maxFlake,
        flakes = this.flakes;
    ctx = this.ctx, canvas = this.canvas, that = this;
    /* 清空雪花 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxFlake; e++) {
        flakes[e].update();
        flakes[e].render(ctx);
    }
    /*  一帧一帧的画 */
    this.loop = requestAnimationFrame(function () {
        drawSnow.apply(that);
    });
}

// setTimeout(function () {
//     /* 调用及控制方法 */
//     var snow = new snowFall({maxFlake: 500});
//     snow.start();
// }, 5000)


// 清除由setInterval创建的定时器
var intervalId = setInterval(listenForTheBodyHeightEvent, 500);

var initCount = false

function listenForTheBodyHeightEvent() {
    var clientHeight = document.body?.clientHeight;
    console.log('---------获取body高度2-------', clientHeight)
    if (clientHeight && clientHeight > 0) {
        console.log(' document.body', document.body)
        clearInterval(intervalId);
        // 创建一个ResizeObserver实例
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const {height} = entry.contentRect; // 获取变化后的高度
                console.log('Body height changed to:', height);
                // 创建新雪花
                console.log('开始创建新雪花---------------', initCount)
                if (initCount) {
                    return
                }
                initCount = true;
                setTimeout(function () {
                    // 删除已有的雪花 canvas
                    var element = document.getElementById('snowfall');
                    if (!element && initCount) {
                        /* 调用及控制方法 */
                        var snow = new snowFall({maxFlake: 500});
                        snow.start();
                        initCount = false
                        bodyClassListener(snow)
                        return
                    }
                    initCount = false
                    console.log('element', element.height)
                    element.height = height
                }, 1000)
            }
        });

        // 观察body元素
        resizeObserver.observe(document.body);
    }
}

// 监听body class 样式变化
function bodyClassListener(snow) {
    // 选择目标节点
    const targetNode = document.body;

    // 创建观察者对象
    const observer = new MutationObserver(function (mutationsList, observer) {
        // 使用mutationsList中的记录进行相应的操作
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                console.log('body class changed:', targetNode.className);
                var bodyClass = targetNode.className.split(' ');
                console.log('bodyClass---------');
                console.log(bodyClass);
                console.log(snow);
                // 如果不是深色模式，就将雪花的颜色改变
                if (bodyClass[0] !== 'theme-mode-dark') {
                    // 不知道为啥重新创建，速度会变快，还没找到解决方法
                    // var element = document.getElementById('snowfall');
                    // element.remove()
                    // new snowFall({maxFlake: 500, fallSpeed: 0.5}).start();

                    // snowFallChange(snow)
                }
            }
        }
    });

    // 观察器的配置（观察目标节点的哪些属性）
    const config = {attributes: true};

    // 开始观察已配置观察的目标节点
    observer.observe(targetNode, config);

    // 测试代码，可以通过以下代码更改body的class来触发观察器的行为
    // targetNode.className = 'new-class';
}

function snowFallChange(snow) {
    console.log('改变颜色', snow)
    /* 创建雪花形状 */
    createFlakesNew(snow);
    /* 画雪 */
    drawSnowNew2(snow)

    // var canvas = document.getElementById('snowfall');
    // var ctx = canvas.getContext('2d');
    // snow.ctx = ctx
    // snow.canvas = canvas
    //
    // var maxFlake = snow.maxFlake,
    //     flakes = snow.flakes = []
    // for (var i = 0; i < maxFlake; i++) {
    //     flakes.push(new flakeMove(canvas.width, canvas.height, snow.flakeSize, snow.fallSpeed))
    // }
    // snow.flakes = flakes
    // drawSnowNew(snow)

}

function drawSnowNew(snow) {
    console.log('drawSnowNew', snow)
    var maxFlake = snow.maxFlake,
        flakes = snow.flakes;
    ctx = snow.ctx, canvas = snow.canvas, that = snow;
    /* 清空雪花 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxFlake; e++) {
        flakes[e].update();
        flakes[e].render(ctx, true);
    }
    /*  一帧一帧的画 */
    snow.loop = requestAnimationFrame(function () {
        drawSnowNew(snow);
    });
}

/* 创建雪花-定义形状 */
function createFlakesNew(snow) {
    var maxFlake = snow.maxFlake,
        flakes = snow.flakes = [],
        canvas = snow.canvas;
    for (var i = 0; i < maxFlake; i++) {
        flakes.push(new flakeMove(canvas.width, canvas.height, snow.flakeSize, snow.fallSpeed))
    }
}

/* 画雪 */
function drawSnowNew2(snow) {
    var maxFlake = snow.maxFlake,
        flakes = snow.flakes;
    ctx = snow.ctx, canvas = snow.canvas, that = snow;
    /* 清空雪花 */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var e = 0; e < maxFlake; e++) {
        flakes[e].update();
        flakes[e].render(ctx, true);
    }
    /*  一帧一帧的画 */
    snow.loop = requestAnimationFrame(function () {
        drawSnowNew2(snow);
    });
}